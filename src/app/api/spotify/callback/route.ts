import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri =
  process.env.NODE_ENV === "production"
    ? `https://yashx.in/api/spotify/callback`
    : "http://127.0.0.1:3000/api/spotify/callback";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    // Return the refresh token prominently
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Authorization Success</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
              color: #1DB954;
              margin-top: 0;
            }
            .token {
              background: #f0f0f0;
              padding: 15px;
              border-radius: 4px;
              font-family: monospace;
              word-break: break-all;
              margin: 20px 0;
            }
            .success {
              color: #1DB954;
              font-weight: bold;
            }
            .instruction {
              background: #e3f2fd;
              padding: 15px;
              border-radius: 4px;
              border-left: 4px solid #2196f3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Authorization Successful!</h1>
            <p class="success">Your Spotify app is now connected.</p>
            
            <div class="instruction">
              <strong>Copy this refresh token to your .env.local file:</strong>
            </div>
            
            <div class="token">
              <strong>SPOTIFY_REFRESH_TOKEN=</strong>${data.refresh_token}
            </div>
            
            <p>Add this line to your <code>.env.local</code> file, then restart your dev server.</p>
            
            <details>
              <summary>Additional token information</summary>
              <p><strong>Access Token:</strong> ${data.access_token}</p>
              <p><strong>Expires in:</strong> ${data.expires_in} seconds</p>
              <p><strong>Token Type:</strong> ${data.token_type}</p>
            </details>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 },
    );
  }
}
