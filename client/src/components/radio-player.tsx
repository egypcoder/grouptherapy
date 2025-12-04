import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useRadio } from "@/lib/radio-context";

export function GlobalRadioPlayer() {
  const {
    isPlaying,
    volume,
    currentTrack,
    isLive,
    isExpanded,
    togglePlay,
    setVolume,
    setExpanded,
  } = useRadio();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border transition-all",
          isExpanded ? "h-32" : "h-16"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 h-full">
          {/* Mini Player */}
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "relative w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden",
                  isPlaying && "ring-2 ring-primary"
                )}
              >
                {currentTrack?.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Radio className={cn("h-5 w-5", isPlaying && "text-primary")} />
                )}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate" data-testid="text-radio-title">
                    {currentTrack?.title || "GroupTherapy Radio"}
                  </p>
                  {isLive && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-primary text-primary-foreground rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate" data-testid="text-radio-artist">
                  {currentTrack?.artist || "Stream"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Play/Pause */}
              <Button
                size="icon"
                variant={isPlaying ? "default" : "secondary"}
                onClick={togglePlay}
                className="h-10 w-10"
                data-testid="button-radio-play"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              {/* Volume - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                  data-testid="button-radio-mute"
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  onValueChange={([val]) => setVolume(val / 100)}
                  max={100}
                  step={1}
                  className="w-24"
                  data-testid="slider-radio-volume"
                />
              </div>

              {/* Expand Toggle */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setExpanded(!isExpanded)}
                className="hidden sm:flex"
                data-testid="button-radio-expand"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Expanded View */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border pt-3 pb-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Up Next:</span>{" "}
                      Weekly Mix - DJ Sessions
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:hidden">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                    >
                      {volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[volume * 100]}
                      onValueChange={([val]) => setVolume(val / 100)}
                      max={100}
                      step={1}
                      className="w-20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
