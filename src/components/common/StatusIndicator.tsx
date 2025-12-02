"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface WorkTimeData {
  isOnline: boolean;
  timeWorked: string;
  lastActivity: string;
}

export default function StatusIndicator() {
  const [status, setStatus] = useState<WorkTimeData>({
    isOnline: false,
    timeWorked: "0 mins",
    lastActivity: "Today",
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/wakatime/stats");
        if (response.ok) {
          const data = await response.json();
          setStatus({
            isOnline: data.isOnline,
            timeWorked: data.timeWorked,
            lastActivity: data.lastActivity,
          });
        }
      } catch (error) {
        console.error("Error fetching WakaTime stats:", error);
      }
    };

    fetchStatus();
    // Check status every minute
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <div
            className={`w-2 h-2 rounded-full ${status.isOnline ? "bg-green-500" : "bg-muted-foreground"}`}
          ></div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="px-3 py-2 md:px-4 md:py-3 max-w-[280px] sm:max-w-none"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div
              className={`size-2 sm:size-2.5 rounded-full shrink-0 ${
                status.isOnline
                  ? "bg-green-500"
                  : "bg-gray-400 dark:bg-gray-500"
              }`}
            />
            <span className="text-sm sm:text-base font-medium whitespace-nowrap">
              {status.isOnline ? "Online" : "Offline"} in
            </span>
            <Image
              src="/assets/cursor.png"
              alt="Cursor"
              width={18}
              height={18}
              className="size-4 sm:size-[18px] shrink-0"
            />
            <span className="text-sm sm:text-base font-medium">Cursor</span>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {status.lastActivity} worked {status.timeWorked}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
