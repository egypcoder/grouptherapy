import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Radio, Clock, Calendar, Users, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioChat } from "@/components/radio-chat";
import { useRadio } from "@/lib/radio-context";
import { cn } from "@/lib/utils";
import type { RadioShow } from "@shared/schema";

const demoShows: Partial<RadioShow>[] = [
  {
    id: "1",
    title: "Morning Therapy",
    hostName: "DJ Luna",
    description: "Wake up with the smoothest electronic beats to start your day right",
    dayOfWeek: 1,
    startTime: "07:00",
    endTime: "10:00",
    hostImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    isLive: false,
  },
  {
    id: "2",
    title: "Peak Time Sessions",
    hostName: "Neon Pulse",
    description: "High-energy techno and house for the main room experience",
    dayOfWeek: 2,
    startTime: "20:00",
    endTime: "23:00",
    hostImageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100&h=100&fit=crop",
    isLive: true,
  },
  {
    id: "3",
    title: "Late Night Grooves",
    hostName: "Circuit Breaker",
    description: "Deep cuts and underground selections for the after hours",
    dayOfWeek: 4,
    startTime: "23:00",
    endTime: "02:00",
    hostImageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=100&h=100&fit=crop",
    isLive: false,
  },
  {
    id: "4",
    title: "Weekend Warm-Up",
    hostName: "Aqua Dreams",
    description: "Get ready for the weekend with progressive vibes",
    dayOfWeek: 5,
    startTime: "18:00",
    endTime: "21:00",
    hostImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    isLive: false,
  },
];

const recentTracks = [
  { title: "Midnight Drive", artist: "Luna Wave", time: "2 min ago" },
  { title: "Electric Dreams", artist: "Neon Pulse", time: "6 min ago" },
  { title: "Deep Waters", artist: "Aqua Dreams", time: "10 min ago" },
  { title: "Velocity", artist: "Circuit Breaker", time: "15 min ago" },
  { title: "Solar Flare", artist: "Cosmic Ray", time: "20 min ago" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RadioPage() {
  const { isPlaying, volume, currentTrack, isLive, togglePlay, setVolume } = useRadio();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  return (
    <div className="min-h-screen">
      <PageHero
        title="GroupTherapy Radio"
        subtitle="24/7 electronic music streaming - tune in and turn up"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Player Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Player Visual */}
              <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-primary/20 via-muted to-background p-8 flex flex-col items-center justify-center">
                {/* Animated circles */}
                <div className="absolute inset-0 overflow-hidden">
                  {isPlaying && (
                    <>
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/20"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/10"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-primary/5"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      />
                    </>
                  )}
                </div>

                {/* Cover / Logo */}
                <div className="relative z-10 w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-card shadow-xl flex items-center justify-center">
                  {currentTrack?.coverUrl ? (
                    <img
                      src={currentTrack.coverUrl}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Radio className={cn("h-16 w-16 lg:h-24 lg:w-24", isPlaying && "text-primary")} />
                  )}
                </div>

                {/* Live Badge */}
                {isLive && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="gap-1">
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                )}
              </div>

              {/* Player Controls */}
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Now Playing</p>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2" data-testid="text-radio-now-playing">
                    {currentTrack?.title || "GroupTherapy Radio"}
                  </h2>
                  <p className="text-muted-foreground" data-testid="text-radio-artist-name">
                    {currentTrack?.artist || "Live Stream"}
                  </p>
                </div>

                {/* Big Play Button */}
                <div className="flex items-center gap-6 mb-8">
                  <Button
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={togglePlay}
                    data-testid="button-radio-main-play"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Volume</p>
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[volume * 100]}
                        onValueChange={([val]) => setVolume(val / 100)}
                        max={100}
                        className="flex-1"
                        data-testid="slider-radio-main-volume"
                      />
                      <span className="text-sm text-muted-foreground w-8">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Listener Count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>127 listeners</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Tabs: Schedule, Recent & Chat */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="schedule" data-testid="tab-schedule">
              <Calendar className="h-4 w-4 mr-2" />
              Show Schedule
            </TabsTrigger>
            <TabsTrigger value="recent" data-testid="tab-recent">
              <Clock className="h-4 w-4 mr-2" />
              Recently Played
            </TabsTrigger>
            <TabsTrigger value="chat" data-testid="tab-chat">
              <Users className="h-4 w-4 mr-2" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          {/* Schedule */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {days.map((day, index) => (
                    <Button
                      key={day}
                      variant={selectedDay === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(index)}
                      data-testid={`button-day-${day.toLowerCase()}`}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoShows
                    .filter((show) => show.dayOfWeek === selectedDay)
                    .map((show) => (
                      <ShowCard key={show.id} show={show as RadioShow} />
                    ))}
                  {demoShows.filter((show) => show.dayOfWeek === selectedDay).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No scheduled shows for {days[selectedDay]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recently Played */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recently Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTracks.map((track, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                      data-testid={`track-recent-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <Radio className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{track.title}</p>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{track.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Chat */}
          <TabsContent value="chat" className="h-[600px]">
            <RadioChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ShowCard({ show }: { show: RadioShow }) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-md border transition-colors",
        show.isLive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
      )}
      data-testid={`card-show-${show.id}`}
    >
      {/* Host Image */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
          {show.hostImageUrl ? (
            <img
              src={show.hostImageUrl}
              alt={show.hostName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Radio className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        {show.isLive && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background" />
        )}
      </div>

      {/* Show Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold truncate">{show.title}</h4>
          {show.isLive && (
            <Badge variant="default" className="text-[10px]">
              LIVE
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">with {show.hostName}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{show.description}</p>
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium">
          {show.startTime} - {show.endTime}
        </p>
        <p className="text-xs text-muted-foreground">{show.timezone}</p>
      </div>

      {/* Arrow */}
      <Button size="icon" variant="ghost" className="flex-shrink-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
