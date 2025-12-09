"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

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

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);

  // Extract dominant colors from album art
  const extractColorsFromImage = useCallback(async (imageUrl: string): Promise<ColorPalette | null> => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Sample pixels from different areas
          const colors: Array<{ r: number; g: number; b: number; count: number }> = [];

          // Sample center area and corners
          const samplePoints = [
            { x: Math.floor(canvas.width * 0.5), y: Math.floor(canvas.height * 0.5) }, // center
            { x: Math.floor(canvas.width * 0.25), y: Math.floor(canvas.height * 0.25) }, // top-left
            { x: Math.floor(canvas.width * 0.75), y: Math.floor(canvas.height * 0.25) }, // top-right
            { x: Math.floor(canvas.width * 0.25), y: Math.floor(canvas.height * 0.75) }, // bottom-left
            { x: Math.floor(canvas.width * 0.75), y: Math.floor(canvas.height * 0.75) }, // bottom-right
          ];

          samplePoints.forEach(({ x, y }) => {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Find similar color or add new one
            const existingColor = colors.find(color =>
              Math.abs(color.r - r) < 30 &&
              Math.abs(color.g - g) < 30 &&
              Math.abs(color.b - b) < 30
            );

            if (existingColor) {
              existingColor.count++;
            } else {
              colors.push({ r, g, b, count: 1 });
            }
          });

          // Sort by frequency and get top colors
          colors.sort((a, b) => b.count - a.count);

          if (colors.length === 0) {
            resolve(null);
            return;
          }

          // Create color palette
          const primary = colors[0];
          const secondary = colors[1] || colors[0];
          const accent = colors[2] || colors[0];

          // Calculate background color (darker/muted version of primary)
          const bgR = Math.max(0, primary.r - 40);
          const bgG = Math.max(0, primary.g - 40);
          const bgB = Math.max(0, primary.b - 40);

          const palette: ColorPalette = {
            primary: `rgb(${primary.r}, ${primary.g}, ${primary.b})`,
            secondary: `rgb(${secondary.r}, ${secondary.g}, ${secondary.b})`,
            accent: `rgb(${accent.r}, ${accent.g}, ${accent.b})`,
            background: `rgb(${bgR}, ${bgG}, ${bgB})`,
          };

          resolve(palette);
        };

        img.onerror = () => resolve(null);
        img.src = imageUrl;
      });
    } catch (error) {
      console.error("Error extracting colors:", error);
      return null;
    }
  }, []);

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
              // Extract colors from new album art
              if (data.albumImageUrl) {
                extractColorsFromImage(data.albumImageUrl).then((palette) => {
                  if (palette && isMounted) {
                    setColorPalette(palette);
                  }
                });
              }
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
    // Refresh every 1 second for real-time sync
    const interval = setInterval(fetchNowPlaying, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Update progress from track data
  useEffect(() => {
    if (track) {
      setCurrentProgress(track.progress);
    }
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
      <div
        className="flex flex-col gap-3 text-sm p-3 rounded-lg shadow-inner transition-all duration-500 ease-in-out"
        style={{
          background: colorPalette
            ? `linear-gradient(135deg, ${colorPalette.background}15, ${colorPalette.secondary}10, ${colorPalette.primary}08)`
            : 'rgb(39 39 42 / 0.3)',
          border: colorPalette
            ? `1px solid ${colorPalette.primary}20`
            : 'rgb(255 255 255 / 0.1)',
          boxShadow: colorPalette
            ? `inset 0 1px 0 ${colorPalette.primary}10, 0 4px 12px ${colorPalette.background}20`
            : 'inset 0 1px 0 rgb(255 255 255 / 0.1), 0 4px 12px rgb(0 0 0 / 0.15)',
        }}
      >
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <Image
                alt="Album art"
                width={48}
                height={48}
                className={`rounded-full shadow-inner ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300 ${
                  track.isPlaying ? "animate-album-rotate" : ""
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
