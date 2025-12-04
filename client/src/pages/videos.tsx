import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Search, Filter } from "lucide-react";
import { PageHero } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { Video } from "@shared/schema";

const demoVideos: Partial<Video>[] = [
  {
    id: "1",
    title: "Luna Wave - Midnight Sessions (Official Video)",
    artistName: "Luna Wave",
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    category: "music-video",
    duration: "4:32",
    featured: true,
  },
  {
    id: "2",
    title: "Neon Pulse - Behind the Scenes",
    artistName: "Neon Pulse",
    thumbnailUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=450&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    category: "behind-the-scenes",
    duration: "12:45",
  },
  {
    id: "3",
    title: "GroupTherapy Sessions Vol. 1 - Aftermovie",
    artistName: "GroupTherapy",
    thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=450&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    category: "event",
    duration: "6:18",
    featured: true,
  },
  {
    id: "4",
    title: "Circuit Breaker - Velocity (Live Performance)",
    artistName: "Circuit Breaker",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=450&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    category: "live",
    duration: "8:21",
  },
  {
    id: "5",
    title: "Studio Session with Aqua Dreams",
    artistName: "Aqua Dreams",
    thumbnailUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&h=450&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    category: "behind-the-scenes",
    duration: "15:33",
  },
  {
    id: "6",
    title: "Cosmic Ray - Solar Flare (Official Video)",
    artistName: "Cosmic Ray",
    thumbnailUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=450&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    category: "music-video",
    duration: "3:58",
  },
];

const categories = [
  { value: "all", label: "All Videos" },
  { value: "music-video", label: "Music Videos" },
  { value: "live", label: "Live Performances" },
  { value: "behind-the-scenes", label: "Behind the Scenes" },
  { value: "event", label: "Event Videos" },
];

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const displayVideos = videos?.length ? videos : demoVideos;

  const filteredVideos = displayVideos.filter((video) => {
    const matchesSearch =
      video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.artistName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <PageHero
        title="Videos"
        subtitle="Watch music videos, live performances, and behind-the-scenes content"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-videos"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]" data-testid="select-video-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Videos */}
        {filteredVideos.some((v) => v.featured) && selectedCategory === "all" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVideos
                .filter((v) => v.featured)
                .map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <VideoCard
                      video={video as Video}
                      featured
                      onClick={() => setSelectedVideo(video as Video)}
                    />
                  </motion.div>
                ))}
            </div>
          </section>
        )}

        {/* All Videos */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === "all" ? "All Videos" : categories.find((c) => c.value === selectedCategory)?.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <VideoCard
                  video={video as Video}
                  onClick={() => setSelectedVideo(video as Video)}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{selectedVideo?.title}</DialogTitle>
          {selectedVideo && (
            <div>
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedVideo.artistName}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VideoCard({
  video,
  featured = false,
  onClick,
}: {
  video: Video;
  featured?: boolean;
  onClick: () => void;
}) {
  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.value === category)?.label || category;
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
      data-testid={`card-video-${video.id}`}
    >
      <div className={`relative overflow-hidden rounded-md bg-muted mb-3 ${featured ? "aspect-video" : "aspect-video"}`}>
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="h-8 w-8 text-primary-foreground ml-1" />
          </div>
        </div>

        {/* Duration */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium bg-black/80 text-white rounded">
            {video.duration}
          </span>
        )}

        {/* Category Badge */}
        <Badge className="absolute top-2 left-2" variant="secondary">
          {getCategoryLabel(video.category || "video")}
        </Badge>
      </div>

      <h3 className={`font-semibold line-clamp-2 group-hover:text-primary transition-colors ${featured ? "text-lg" : "text-sm"}`}>
        {video.title}
      </h3>
      <p className="text-sm text-muted-foreground">{video.artistName}</p>
    </div>
  );
}
