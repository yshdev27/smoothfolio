import { NextRequest, NextResponse } from "next/server";
import { createParser } from "eventsource-parser";
import * as z from "zod";
import { systemPrompt } from "@/config/ChatPrompt";

// ----------------- Rate limiting -----------------

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 60s
const RATE_LIMIT_MAX_REQUESTS = 20;

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z
          .array(z.object({ text: z.string() }))
          .min(1, "Each message must have at least one part"),
      }),
    )
    .optional()
    .default([]),
});

// ----------------- Helpers -----------------

function sanitizeInput(input: string): string {
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system prompt/gi,
    /you are now/gi,
    /act as/gi,
    /pretend to be/gi,
    /ignore all previous/gi,
    /forget everything/gi,
    /new instructions/gi,
    /override/gi,
    /bypass/gi,
    /hack/gi,
    /exploit/gi,
    /inject/gi,
    /prompt injection/gi,
    /system message/gi,
    /role play/gi,
    /character/gi,
    /persona/gi,
    /behave as/gi,
    /respond as/gi,
  ];

  let sanitized = input;

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }

  sanitized = sanitized.trim().replace(/\s+/g, " ");

  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  return sanitized;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return "unknown";
}

function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  rateLimitStore.set(clientIP, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ----------------- POST (main chat endpoint) -----------------

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting ---
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": (Date.now() + RATE_LIMIT_WINDOW).toString(),
          },
        },
      );
    }

    // --- API key ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 },
      );
    }

    // --- Parse & validate body ---
    const body = await request.json();
    const validatedData = chatSchema.parse(body);

    // Optionally cap history length to avoid huge payloads
    const history = validatedData.history.slice(-20);

    // Build contents from history, sanitizing only user messages
    const contents = history.map((msg) => ({
      role: msg.role,
      parts: msg.parts.map((part) => ({
        text: msg.role === "user" ? sanitizeInput(part.text) : part.text,
      })),
    }));

    // Current user message
    contents.push({
      role: "user",
      parts: [{ text: sanitizeInput(validatedData.message) }],
    });

    // --- Gemini request body ---
    const requestBody = {
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    };

    // --- Gemini endpoint (stable model, better for free tier) ---
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:streamGenerateContent?alt=sse";

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    // --- Propagate real Gemini errors instead of hiding them ---
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      // Pass through the actual status so you can see if it's 400/403/429/500
      return NextResponse.json(
        {
          error: "Gemini API error",
          status: response.status,
          details: safeJsonParse(errorText),
        },
        { status: response.status },
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const parser = createParser({
            onEvent: (event) => {
              if (!event.data) return;

              // Sometimes there can be control messages; be defensive
              let data: Record<string, any>;
              try {
                data = JSON.parse(event.data);
              } catch {
                return;
              }

              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (!text) return;

              const sseData = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(sseData));
            },
          });

          if (!response.body) {
            throw new Error("No response body from Gemini");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            parser.feed(decoder.decode(value));
          }

          // Signal completion
          controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          const errorData = `data: ${JSON.stringify({
            error: "Stream error occurred",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ----------------- GET (method guard) -----------------

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
