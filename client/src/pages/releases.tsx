import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, Filter, Search, Grid, List } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/hero-section";
import { SEOHead, generateStructuredData } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Release } from "@shared/schema";

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
    releaseDate: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    artistName: "Neon Pulse",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Techno"],
    spotifyUrl: "#",
    releaseDate: new Date("2024-02-01"),
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
    releaseDate: new Date("2024-02-10"),
  },
  {
    id: "4",
    title: "Velocity",
    artistName: "Circuit Breaker",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    type: "album",
    genres: ["Drum & Bass"],
    spotifyUrl: "#",
    releaseDate: new Date("2024-01-20"),
  },
  {
    id: "5",
    title: "Solar Flare",
    artistName: "Cosmic Ray",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Progressive"],
    spotifyUrl: "#",
    releaseDate: new Date("2024-03-01"),
  },
  {
    id: "6",
    title: "Urban Nights",
    artistName: "Street Beat",
    coverUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop",
    type: "album",
    genres: ["UK Garage"],
    spotifyUrl: "#",
    releaseDate: new Date("2024-02-28"),
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
    releaseDate: new Date("2024-03-15"),
  },
  {
    id: "8",
    title: "Thunder Road",
    artistName: "Storm Chasers",
    coverUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&h=400&fit=crop",
    type: "single",
    genres: ["Electro"],
    spotifyUrl: "#",
    releaseDate: new Date("2024-03-20"),
  },
];

const genres = ["All", "Electronic", "House", "Techno", "Deep House", "Drum & Bass", "Progressive", "Ambient"];
const releaseTypes = ["All", "Album", "EP", "Single"];

export default function ReleasesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const { data: releases } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  const displayReleases = releases?.length ? releases : demoReleases;

  const filteredReleases = displayReleases.filter((release) => {
    const matchesSearch =
      release.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      release.artistName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || release.genres?.includes(selectedGenre);
    const matchesType =
      selectedType === "All" ||
      release.type?.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesGenre && matchesType;
  });

  const sortedReleases = [...filteredReleases].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime();
    }
    if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  const musicGroupSchema = generateStructuredData("MusicGroup", {
    name: "GroupTherapy Records",
    genre: ["Electronic", "House", "Techno", "Deep House", "Drum & Bass"],
    album: sortedReleases.slice(0, 10).map((release) => ({
      "@type": "MusicAlbum",
      name: release.title,
      byArtist: {
        "@type": "MusicGroup",
        name: release.artistName,
      },
      datePublished: release.releaseDate,
      image: release.coverUrl,
    })),
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Music Releases - GroupTherapy Records | Electronic Music Albums & EPs"
        description="Browse the complete catalog of electronic music releases from GroupTherapy Records. Discover new albums, EPs, and singles from innovative artists in house, techno, and more."
        keywords={["electronic music releases", "house music albums", "techno EPs", "new music", "music catalog", "electronic albums", "DJ music"]}
        structuredData={musicGroupSchema}
      />
      
      <PageHero
        title="Releases"
        subtitle="Explore our complete catalog of releases"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search releases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-releases"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Genre Filter */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[140px]" data-testid="select-genre">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[120px]" data-testid="select-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {releaseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                data-testid="button-view-grid"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {sortedReleases.length} releases
        </p>

        {/* Releases Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {sortedReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ReleaseGridCard release={release as Release} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ReleaseListCard release={release as Release} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReleaseGridCard({ release }: { release: Release }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/releases/${release.slug || release.id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`card-release-${release.id}`}
      >
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

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
          >
            <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
          </motion.div>

          {release.featured && (
            <Badge className="absolute top-2 left-2">Featured</Badge>
          )}
          <Badge variant="secondary" className="absolute top-2 right-2">
            {release.type}
          </Badge>
        </div>

        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {release.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{release.artistName}</p>
      </div>
    </Link>
  );
}

function ReleaseListCard({ release }: { release: Release }) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/releases/${release.slug || release.id}`}>
      <div
        className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors group"
        data-testid={`card-release-list-${release.id}`}
      >
        <div className="relative w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
          {release.coverUrl ? (
            <img
              src={release.coverUrl}
              alt={release.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {release.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{release.artistName}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {release.genres?.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        <Badge variant="secondary" className="hidden md:flex">
          {release.type}
        </Badge>

        <span className="text-sm text-muted-foreground hidden lg:block w-24 text-right">
          {formatDate(release.releaseDate)}
        </span>

        {release.spotifyUrl && (
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              window.open(release.spotifyUrl!, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Link>
  );
}
