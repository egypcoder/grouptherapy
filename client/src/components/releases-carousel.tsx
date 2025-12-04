import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Release } from "@shared/schema";

interface ReleasesCarouselProps {
  releases: Release[];
  title?: string;
  autoPlay?: boolean;
  showViewAll?: boolean;
}

// Demo releases for initial display
const demoReleases: Partial<Release>[] = [
  {
    id: "1",
    title: "Midnight Sessions",
    artistName: "Luna Wave",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    type: "album",
    genres: ["Electronic", "House"],
    spotifyUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    artistName: "Neon Pulse",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Techno"],
    spotifyUrl: "#",
  },
  {
    id: "3",
    title: "Deep Waters",
    artistName: "Aqua Dreams",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    type: "ep",
    genres: ["Deep House"],
    spotifyUrl: "#",
    featured: true,
  },
  {
    id: "4",
    title: "Velocity",
    artistName: "Circuit Breaker",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    type: "album",
    genres: ["Drum & Bass"],
    spotifyUrl: "#",
  },
  {
    id: "5",
    title: "Solar Flare",
    artistName: "Cosmic Ray",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Progressive"],
    spotifyUrl: "#",
  },
  {
    id: "6",
    title: "Urban Nights",
    artistName: "Street Beat",
    coverUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop",
    type: "album",
    genres: ["UK Garage"],
    spotifyUrl: "#",
  },
  {
    id: "7",
    title: "Crystal Clear",
    artistName: "Glass House",
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    type: "ep",
    genres: ["Ambient"],
    spotifyUrl: "#",
    featured: true,
  },
  {
    id: "8",
    title: "Thunder Road",
    artistName: "Storm Chasers",
    coverUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Electro"],
    spotifyUrl: "#",
  },
  {
    id: "9",
    title: "Neon Dreams",
    artistName: "Synth Wave",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    type: "album",
    genres: ["Synthwave"],
    spotifyUrl: "#",
  },
  {
    id: "10",
    title: "Bass Culture",
    artistName: "Low Frequency",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
    type: "ep",
    genres: ["Dubstep"],
    spotifyUrl: "#",
  },
  {
    id: "11",
    title: "Horizon",
    artistName: "Skyline",
    coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=400&fit=crop",
    type: "album",
    genres: ["Trance"],
    spotifyUrl: "#",
    featured: true,
  },
  {
    id: "12",
    title: "After Hours",
    artistName: "Night Owl",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Tech House"],
    spotifyUrl: "#",
  },
];

export function ReleasesCarousel({
  releases = [],
  title = "New Releases",
  autoPlay = true,
  showViewAll = true,
}: ReleasesCarouselProps) {
  const displayReleases = releases.length > 0 ? releases : demoReleases;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      const itemWidth = 280;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;
        
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
            data-testid="text-releases-title"
          >
            {title}
          </motion.h2>
          <div className="flex items-center gap-2">
            {showViewAll && (
              <Link href="/releases">
                <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-view-all-releases">
                  View All
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              data-testid="button-carousel-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayReleases.map((release, index) => (
              <motion.div
                key={release.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[200px] sm:w-[240px] lg:w-[280px] snap-start"
              >
                <ReleaseCard release={release as Release} />
              </motion.div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: Math.ceil(displayReleases.length / 4) }).map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  Math.floor(currentIndex / 4) === i
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                )}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: i * 4 * 300,
                      behavior: "smooth",
                    });
                  }
                }}
                data-testid={`button-carousel-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReleaseCard({ release }: { release: Release }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/releases/${release.slug || release.id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`card-release-${release.id}`}
      >
        {/* Cover Image */}
        <div className="relative aspect-square rounded-md overflow-hidden bg-muted mb-3">
          {release.coverUrl ? (
            <img
              src={release.coverUrl}
              alt={release.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Hover Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // Play preview
              }}
              data-testid={`button-play-${release.id}`}
            >
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
            {release.spotifyUrl && (
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(release.spotifyUrl!, "_blank");
                }}
                data-testid={`button-spotify-${release.id}`}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </motion.div>

          {/* Featured Badge */}
          {release.featured && (
            <Badge
              className="absolute top-3 left-3"
              variant="default"
            >
              Featured
            </Badge>
          )}

          {/* Type Badge */}
          <Badge
            className="absolute top-3 right-3"
            variant="secondary"
          >
            {release.type || "Album"}
          </Badge>
        </div>

        {/* Info */}
        <h3 className="font-semibold text-sm lg:text-base truncate group-hover:text-primary transition-colors" data-testid={`text-release-title-${release.id}`}>
          {release.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate" data-testid={`text-release-artist-${release.id}`}>
          {release.artistName}
        </p>
        {release.genres && release.genres.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {release.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="text-[10px]">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
