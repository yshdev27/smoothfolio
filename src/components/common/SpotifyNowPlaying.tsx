"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
  trackId: string;
  duration: number;
  progress: number;
  previewUrl: string | null;
}

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing", {
          cache: "no-store",
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          setTrack((prevTrack) => {
            // Reset progress if track changed
            if (prevTrack?.trackId !== data.trackId) {
              setCurrentProgress(data.progress);
            }
            return data;
          });
        }
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchNowPlaying();
    // Refresh every 3 seconds for near real-time sync
    const interval = setInterval(fetchNowPlaying, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Real-time progress tracking
  useEffect(() => {
    if (!track || !track.isPlaying) {
      setCurrentProgress(track?.progress || 0);
      return;
    }

    // Set initial progress
    setCurrentProgress(track.progress);

    // Update progress every second when playing
    const progressInterval = setInterval(() => {
      setCurrentProgress((prev) => {
        const next = prev + 1000;
        // Stop at track duration
        return next >= track.duration ? track.duration : next;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [track]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = track
    ? (currentProgress / track.duration) * 100
    : 0;

  if (isLoading || !track) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-border/50 shadow-inner animate-pulse">
          <div className="w-12 h-12 rounded-md bg-muted/50" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted/50 rounded w-3/4" />
            <div className="h-2 bg-muted/50 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-border/50 shadow-inner">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <Image
                alt="Album art"
                width={48}
                height={48}
                className={`rounded-full shadow-inner ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300 ${
                  track.isPlaying ? "animate-spin animation-duration:[9s]" : ""
                }`}
                src={track.albumImageUrl}
                unoptimized
              />
              {track.isPlaying && (
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-green-500/20 to-transparent animate-pulse" />
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-green-500/10 shadow-inner transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Spotify"
                    width="14"
                    height="14"
                    className={`filter drop-shadow-sm ${track.isPlaying ? "animate-[spotify-vibrate_0.6s_ease-in-out_infinite]" : ""}`}
                    src="/assets/spotify.svg"
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {track.isPlaying ? "Now playing" : "Last played"}
                </span>
              </div>
              <div
                className="flex flex-col min-h-10 max-h-10"
                style={{ opacity: 1, transform: "none" }}
              >
                <span className="font-medium truncate text-foreground h-5">
                  {track.title}
                </span>
                <span className="text-xs text-muted-foreground truncate h-4">
                  by {track.artist}
                </span>
              </div>
            </div>
          </div>
          {/* Audio Visualizer - Desktop only */}
          {track.isPlaying && (
            <motion.div
              className="hidden md:flex items-end gap-1 h-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {[...Array(8)].map((_, i) => {
                const heights = [
                  "25%",
                  "90%",
                  "40%",
                  "100%",
                  "35%",
                  "85%",
                  "30%",
                ];
                return (
                  <motion.div
                    key={i}
                    className="w-1 bg-green-500 rounded-full"
                    initial={{ height: "25%" }}
                    animate={{
                      height: heights,
                    }}
                    transition={{
                      duration: 1.98 + i * 0.18,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                      delay: i * 0.18,
                    }}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
        {track.isPlaying && (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentProgress)}
            </span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(track.duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
