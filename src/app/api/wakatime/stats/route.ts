import { NextResponse } from "next/server";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const WAKATIME_API_BASE = "https://wakatime.com/api/v1";

interface WakaTimeStats {
  data: {
    is_coding_activity_visible: boolean;
    is_other_usage_visible: boolean;
    grand_total: {
      digital: string;
      hours: number;
      minutes: number;
      text: string;
      total_seconds: number;
    };
    human_readable_total: string;
  };
}

export async function GET() {
  try {
    if (!WAKATIME_API_KEY) {
      return NextResponse.json(
        { error: "WakaTime API key not configured" },
        { status: 500 },
      );
    }

    // Encode API key for HTTP Basic Auth
    const encodedKey = Buffer.from(WAKATIME_API_KEY).toString("base64");

    // Fetch summaries for today and yesterday
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const url = `${WAKATIME_API_BASE}/users/current/summaries?start=${yesterday}&end=${today}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${encodedKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WakaTime API error ${response.status}:`, errorText);

      // Return fallback data instead of throwing
      return NextResponse.json({
        isOnline: false,
        timeWorked: "0 mins",
        totalSeconds: 0,
        lastActivity: "Recently",
        error: `API Error: ${response.status}`,
      });
    }

    const data = await response.json();
    const allDays = data.data || [];

    // Try to get today's data first
    const todayData = allDays.find((d: any) => d.range.date === today);
    const yesterdayData = allDays.find((d: any) => d.range.date === yesterday);

    // Use today's data if exists and has activity, otherwise use yesterday
    const activeData =
      todayData?.grand_total?.total_seconds > 0 ? todayData : yesterdayData;

    if (!activeData || activeData.grand_total?.total_seconds === 0) {
      return NextResponse.json({
        isOnline: false,
        timeWorked: "0 mins",
        totalSeconds: 0,
        lastActivity: "Recently",
      });
    }

    const totalSeconds = activeData.grand_total?.total_seconds || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let timeWorked = "";
    if (hours > 0) {
      timeWorked = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      timeWorked = `${minutes}m`;
    } else {
      timeWorked = "0 mins";
    }

    // For now, let's assume online if there's activity today
    const isOnline = activeData.range.date === today && totalSeconds > 0;

    // Determine which day's data we're showing
    const isToday = activeData.range.date === today;
    const lastActivity = isOnline ? "Today" : isToday ? "Today" : "Yesterday";

    return NextResponse.json({
      isOnline,
      timeWorked,
      totalSeconds,
      lastActivity,
    });
  } catch (error) {
    console.error("WakaTime API Error:", error);
    return NextResponse.json({
      isOnline: false,
      timeWorked: "0 mins",
      totalSeconds: 0,
      lastActivity: "Today",
    });
  }
}
