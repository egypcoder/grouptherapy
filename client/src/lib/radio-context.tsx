import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

interface RadioTrack {
  title: string;
  artist: string;
  coverUrl?: string;
  showName?: string;
  hostName?: string;
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
const METADATA_POLL_INTERVAL = 10000; // 10 seconds

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isExpanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listenerCount, setListenerCount] = useState(127);
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>({
    title: "GroupTherapy Radio",
    artist: "Live Stream",
    coverUrl: undefined,
  });
  const [isLive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(DEMO_STREAM_URL);
    audioRef.current.volume = volume;
    
    audioRef.current.addEventListener("timeupdate", () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Poll for live metadata updates
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('/api/radio/metadata');
        if (response.ok) {
          const data = await response.json();
          setCurrentTrack({
            title: data.title || "GroupTherapy Radio",
            artist: data.artist || "Live Stream",
            coverUrl: data.coverUrl,
            showName: data.showName,
            hostName: data.hostName,
          });
          setListenerCount(data.listenerCount || 127);
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };

    if (isLive) {
      fetchMetadata();
      const interval = setInterval(fetchMetadata, METADATA_POLL_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isLive]);

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
