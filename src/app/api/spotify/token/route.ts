import { NextResponse } from "next/server";

const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

export async function GET() {
  try {
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64",
    );

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token!,
      }),
    });

    const data = await response.json();

    return NextResponse.json(
      { access_token: data.access_token },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Error getting access token:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 },
    );
  }
}
