import { NextResponse } from "next/server";

export async function GET() {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!telegramToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramToken}/getUpdates`,
    );
    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        { error: "Failed to get updates from Telegram", details: data },
        { status: 500 },
      );
    }

    // Extract chat IDs from recent messages
    const chatIds = data.result.map((update: any) => ({
      chatId: update.message?.chat?.id || update.message?.from?.id,
      username:
        update.message?.chat?.username || update.message?.from?.username,
      firstName:
        update.message?.chat?.first_name || update.message?.from?.first_name,
      type: update.message?.chat?.type,
    }));

    return NextResponse.json({
      message: "Send a message to your bot on Telegram, then refresh this page",
      updates: data.result,
      chatIds: [...new Set(chatIds.filter((c) => c.chatId))],
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Telegram updates" },
      { status: 500 },
    );
  }
}
