import { useEffect, useState, useRef, useCallback } from "react";

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (data: unknown) => void) => void;
  removeListener: (event: string, callback?: (data: unknown) => void) => void;
  getCurrentState: () => Promise<unknown>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  _options: {
    getOAuthToken: (callback: (token: string) => void) => void;
    id: string;
  };
}

interface WindowWithSpotify extends Window {
  Spotify?: {
    Player: new (options: Record<string, unknown>) => SpotifyPlayer;
  };
  onSpotifyWebPlaybackSDKReady?: () => void;
}

interface PlayerState {
  position: number;
  duration: number;
  paused: boolean;
  track_window: {
    current_track: {
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        images: Array<{ url: string }>;
      };
      uri: string;
    };
  };
}

export function useSpotifyPlayer() {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<{
    uri: string;
    name: string;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = useCallback(() => {
    if (player && !isPaused) {
      player.getCurrentState().then((state) => {
        const currentState = state as PlayerState | null;
        if (currentState) {
          setPosition(currentState.position);
          setDuration(currentState.duration);
        }
      });
    }
  }, [player, isPaused]);

  useEffect(() => {
    const initializePlayer = () => {
      const windowWithSpotify = window as WindowWithSpotify;

      if (!windowWithSpotify.Spotify) {
        setError("Spotify SDK not loaded");
        return;
      }

      const spotifyPlayer = new windowWithSpotify.Spotify.Player({
        name: "Smoothfolio Web Player",
        getOAuthToken: async (cb: (token: string) => void) => {
          try {
            const response = await fetch("/api/spotify/token");
            const data = await response.json();
            cb(data.access_token);
          } catch (err) {
            console.error("Error getting token:", err);
            setError("Failed to authenticate");
          }
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", (data) => {
        const { device_id } = data as { device_id: string };
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener("not_ready", (data) => {
        const { device_id } = data as { device_id: string };
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      spotifyPlayer.addListener("player_state_changed", (data) => {
        const state = data as PlayerState | null;
        if (!state) {
          setCurrentTrack(null);
          return;
        }

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      const logError = (event: string, data: unknown, fallback?: string) => {
        const { message } = data as { message: string };
        console.error(`${event}:`, message);
        setError(fallback ?? message);
      };

      spotifyPlayer.addListener("initialization_error", (data) =>
        logError("Initialization Error", data),
      );

      spotifyPlayer.addListener("authentication_error", (data) =>
        logError("Authentication Error", data),
      );

      spotifyPlayer.addListener("account_error", (data) =>
        logError("Account Error", data, "Spotify Premium required"),
      );

      spotifyPlayer.addListener("playback_error", (data) =>
        logError("Playback Error", data),
      );

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
      playerRef.current = spotifyPlayer;
    };

    const windowWithSpotify = window as WindowWithSpotify;

    if (windowWithSpotify.Spotify) {
      initializePlayer();
    } else {
      windowWithSpotify.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Update progress every second when playing
  useEffect(() => {
    if (!isPaused) {
      progressInterval.current = setInterval(updateProgress, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPaused, updateProgress]);

  const play = useCallback(
    async (trackUri: string) => {
      if (!deviceId || !isReady) {
        setError("Player not ready");
        return;
      }

      try {
        await fetch("/api/spotify/play", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId,
            trackUri,
          }),
        });
      } catch (err) {
        console.error("Error playing track:", err);
        setError("Failed to play track");
      }
    },
    [deviceId, isReady],
  );

  const togglePlay = useCallback(async () => {
    if (!player) return;

    try {
      await player.togglePlay();
    } catch (err) {
      console.error("Error toggling play:", err);
    }
  }, [player]);

  const pause = useCallback(async () => {
    if (!player) return;

    try {
      await player.pause();
    } catch (err) {
      console.error("Error pausing:", err);
    }
  }, [player]);

  const resume = useCallback(async () => {
    if (!player) return;

    try {
      await player.resume();
    } catch (err) {
      console.error("Error resuming:", err);
    }
  }, [player]);

  const seek = useCallback(
    async (positionMs: number) => {
      if (!player) return;

      try {
        await player.seek(positionMs);
        setPosition(positionMs);
      } catch (err) {
        console.error("Error seeking:", err);
      }
    },
    [player],
  );

  return {
    player,
    deviceId,
    isReady,
    isPaused,
    position,
    duration,
    currentTrack,
    error,
    play,
    togglePlay,
    pause,
    resume,
    seek,
  };
}
