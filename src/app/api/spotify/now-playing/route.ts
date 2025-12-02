import { NextResponse } from "next/server";

const SPOTIFY_NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

let tokenCache: { token: string; expires: number } | null = null;

const getAccessToken = async () => {
  // Return cached token if still valid
  if (tokenCache && tokenCache.expires > Date.now()) {
    return { access_token: tokenCache.token };
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

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
    cache: "no-store",
  });

  const data = await response.json();

  // Cache token for 55 minutes (tokens expire in 1 hour)
  tokenCache = {
    token: data.access_token,
    expires: Date.now() + 55 * 60 * 1000,
  };

  return data;
};

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  // Try currently playing first
  const nowPlayingResponse = await fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
    // If nothing is currently playing, get recently played
    const recentlyPlayedResponse = await fetch(
      SPOTIFY_RECENTLY_PLAYED_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (recentlyPlayedResponse.status === 200) {
      const data = await recentlyPlayedResponse.json();
      const track = data.items[0]?.track;

      if (track) {
        return {
          isPlaying: false,
          title: track.name,
          artist: track.artists
            .map((artist: { name: string }) => artist.name)
            .join(", "),
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
          trackId: track.id,
          duration: track.duration_ms,
          progress: 0, // Recently played doesn't have progress
          previewUrl: track.preview_url,
        };
      }
    }
    return null;
  }

  const song = await nowPlayingResponse.json();

  if (!song.item) {
    return null;
  }

  return {
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists
      .map((artist: { name: string }) => artist.name)
      .join(", "),
    albumImageUrl: song.item.album.images[0]?.url,
    songUrl: song.item.external_urls.spotify,
    trackId: song.item.id,
    duration: song.item.duration_ms,
    progress: song.progress_ms || 0,
    previewUrl: song.item.preview_url,
  };
};

export async function GET() {
  try {
    const track = await getNowPlaying();

    if (!track) {
      return NextResponse.json({ error: "No track found" }, { status: 404 });
    }

    return NextResponse.json(track, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Spotify API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Spotify data" },
      { status: 500 },
    );
  }
}
