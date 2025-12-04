import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

interface RadioTrack {
  title: string;
  artist: string;
  coverUrl?: string;
  showName?: string;
  hostName?: string;
}

interface RadioAsset {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  durationSeconds: number;
}

interface RadioContextType {
  isPlaying: boolean;
  volume: number;
  currentTrack: RadioTrack | null;
  isLive: boolean;
  isExpanded: boolean;
  progress: number;
  duration: number;
  listenerCount: number;
  isScheduled: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setExpanded: (expanded: boolean) => void;
  setCurrentTrack: (track: RadioTrack) => void;
  seek: (time: number) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

const DEMO_STREAM_URL = "https://stream.zeno.fm/yn65fsaurfhvv";
const METADATA_POLL_INTERVAL = 10000;

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isExpanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listenerCount, setListenerCount] = useState(127);
  const [isScheduled, setIsScheduled] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState(DEMO_STREAM_URL);
  const [currentAsset, setCurrentAsset] = useState<RadioAsset | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>({
    title: "GroupTherapy Radio",
    artist: "Live Stream",
    coverUrl: undefined,
  });
  const [isLive, setIsLive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const sseConnectedRef = useRef(false);

  const initAudio = useCallback((streamUrl: string) => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause();
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    } else {
      audioRef.current = new Audio(streamUrl);
      audioRef.current.volume = volume;
      
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
        }
      });

      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || 0);
        }
      });
    }
  }, [volume]);

  const syncPlaybackPosition = useCallback((positionSeconds: number) => {
    if (audioRef.current && currentAsset && !isLive) {
      const targetPosition = Math.min(positionSeconds, currentAsset.durationSeconds);
      if (Math.abs(audioRef.current.currentTime - targetPosition) > 2) {
        audioRef.current.currentTime = targetPosition;
      }
    }
  }, [currentAsset, isLive]);

  const handleSSEMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === "state" || data.type === "schedule_update") {
        if (data.isScheduled && data.currentAsset) {
          setIsScheduled(true);
          setIsLive(false);
          setCurrentAsset(data.currentAsset);
          setCurrentTrack({
            title: data.currentAsset.title,
            artist: data.currentAsset.artist,
            showName: data.showName,
            hostName: data.hostName,
          });
          setDuration(data.currentAsset.durationSeconds);
          
          if (data.streamUrl !== currentStreamUrl) {
            setCurrentStreamUrl(data.streamUrl);
            initAudio(data.streamUrl);
          }
          
          if (data.startedAt) {
            setStartedAt(new Date(data.startedAt));
          }
          
          if (data.positionSeconds !== undefined) {
            syncPlaybackPosition(data.positionSeconds);
          }
        } else {
          setIsScheduled(false);
          setIsLive(true);
          setCurrentAsset(null);
          setCurrentTrack({
            title: "GroupTherapy Radio",
            artist: "Live Stream",
          });
          
          if (DEMO_STREAM_URL !== currentStreamUrl) {
            setCurrentStreamUrl(DEMO_STREAM_URL);
            initAudio(DEMO_STREAM_URL);
          }
        }
      } else if (data.type === "schedule_deleted") {
        setIsScheduled(false);
        setIsLive(true);
        setCurrentStreamUrl(DEMO_STREAM_URL);
        initAudio(DEMO_STREAM_URL);
      }
    } catch (error) {
      console.error("Error parsing SSE message:", error);
    }
  }, [currentStreamUrl, initAudio, syncPlaybackPosition]);

  useEffect(() => {
    initAudio(DEMO_STREAM_URL);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const connectSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        eventSourceRef.current = new EventSource("/api/radio/stream-state");
        
        eventSourceRef.current.onopen = () => {
          sseConnectedRef.current = true;
        };
        
        eventSourceRef.current.onmessage = handleSSEMessage;
        
        eventSourceRef.current.onerror = () => {
          sseConnectedRef.current = false;
          eventSourceRef.current?.close();
          setTimeout(connectSSE, 5000);
        };
      } catch (error) {
        console.error("Failed to connect to SSE:", error);
        sseConnectedRef.current = false;
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [handleSSEMessage]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (sseConnectedRef.current) return;

      try {
        const response = await fetch("/api/radio/metadata");
        if (response.ok) {
          const data = await response.json();
          
          if (data.isScheduled && data.currentAsset) {
            setIsScheduled(true);
            setIsLive(false);
            setCurrentAsset(data.currentAsset);
            setCurrentTrack({
              title: data.currentAsset.title,
              artist: data.currentAsset.artist,
              showName: data.showName,
              hostName: data.hostName,
            });
            setDuration(data.durationSeconds);
            setListenerCount(data.listenerCount || 127);
            
            if (data.streamUrl !== currentStreamUrl) {
              setCurrentStreamUrl(data.streamUrl);
              initAudio(data.streamUrl);
            }
            
            if (data.positionSeconds !== undefined) {
              syncPlaybackPosition(data.positionSeconds);
            }
          } else {
            setIsScheduled(false);
            setIsLive(true);
            setCurrentTrack({
              title: data.title || "GroupTherapy Radio",
              artist: data.artist || "Live Stream",
              coverUrl: data.coverUrl,
              showName: data.showName,
              hostName: data.hostName,
            });
            setListenerCount(data.listenerCount || 127);
            
            if (DEMO_STREAM_URL !== currentStreamUrl) {
              setCurrentStreamUrl(DEMO_STREAM_URL);
              initAudio(DEMO_STREAM_URL);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, METADATA_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [currentStreamUrl, initAudio, syncPlaybackPosition]);

  useEffect(() => {
    if (!isScheduled || !startedAt || !currentAsset) return;

    const updateProgress = () => {
      const now = Date.now();
      const startTime = new Date(startedAt).getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const pos = Math.min(elapsed, currentAsset.durationSeconds);
      setProgress(pos);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [isScheduled, startedAt, currentAsset]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && !isLive) {
      audioRef.current.currentTime = time;
    }
  }, [isLive]);

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        volume,
        currentTrack,
        isLive,
        isExpanded,
        progress,
        duration,
        listenerCount,
        isScheduled,
        play,
        pause,
        togglePlay,
        setVolume,
        setExpanded,
        setCurrentTrack,
        seek,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("useRadio must be used within a RadioProvider");
  }
  return context;
}
