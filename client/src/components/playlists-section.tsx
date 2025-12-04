import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiSpotify } from "react-icons/si";
import type { Playlist } from "@shared/schema";

interface PlaylistsSectionProps {
  playlists?: Playlist[];
  title?: string;
}

const demoPlaylists: Partial<Playlist>[] = [
  {
    id: "1",
    title: "GroupTherapy Essentials",
    description: "The best tracks from our roster",
    coverUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop",
    trackCount: 50,
    spotifyUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "Late Night Sessions",
    description: "Deep cuts for the after hours",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    trackCount: 35,
    spotifyUrl: "#",
  },
  {
    id: "3",
    title: "Peak Time Energy",
    description: "High-energy tracks for the main room",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    trackCount: 42,
    spotifyUrl: "#",
  },
  {
    id: "4",
    title: "Chill Therapy",
    description: "Ambient and downtempo selections",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    trackCount: 28,
    spotifyUrl: "#",
  },
];

export function PlaylistsSection({
  playlists = [],
  title = "Curated Playlists",
}: PlaylistsSectionProps) {
  const displayPlaylists = playlists.length > 0 ? playlists : demoPlaylists;

  return (
    <section className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight" data-testid="text-playlists-title">
              {title}
            </h2>
            <p className="text-muted-foreground mt-2">
              Listen to our handpicked collections on Spotify
            </p>
          </motion.div>
          <Link href="/playlists">
            <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-view-all-playlists">
              View All
            </Button>
          </Link>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PlaylistCard playlist={playlist as Playlist} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="group cursor-pointer" data-testid={`card-playlist-${playlist.id}`}>
      {/* Cover */}
      <div className="relative aspect-square rounded-md overflow-hidden bg-muted mb-3">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-muted flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          {playlist.spotifyUrl && (
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760]"
              asChild
            >
              <a
                href={playlist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                data-testid={`button-spotify-playlist-${playlist.id}`}
              >
                <SiSpotify className="h-6 w-6 text-white" />
              </a>
            </Button>
          )}
        </div>

        {/* Spotify Badge */}
        <div className="absolute bottom-3 right-3">
          <SiSpotify className="h-6 w-6 text-[#1DB954]" />
        </div>
      </div>

      {/* Info */}
      <h3 className="font-semibold text-sm lg:text-base truncate group-hover:text-primary transition-colors" data-testid={`text-playlist-title-${playlist.id}`}>
        {playlist.title}
      </h3>
      <p className="text-sm text-muted-foreground truncate" data-testid={`text-playlist-desc-${playlist.id}`}>
        {playlist.description || `${playlist.trackCount} tracks`}
      </p>
    </div>
  );
}
