import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiSpotify, SiInstagram, SiSoundcloud } from "react-icons/si";
import type { Artist } from "@shared/schema";

interface FeaturedArtistsProps {
  artists?: Artist[];
  title?: string;
}

const demoArtists: Partial<Artist>[] = [
  {
    id: "1",
    name: "Luna Wave",
    slug: "luna-wave",
    bio: "Electronic producer known for atmospheric soundscapes and driving beats",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    featured: true,
    socialLinks: {
      instagram: "#",
      spotify: "#",
      soundcloud: "#",
    },
  },
  {
    id: "2",
    name: "Neon Pulse",
    slug: "neon-pulse",
    bio: "Techno artist pushing the boundaries of electronic music",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
    featured: true,
    socialLinks: {
      instagram: "#",
      spotify: "#",
    },
  },
  {
    id: "3",
    name: "Circuit Breaker",
    slug: "circuit-breaker",
    bio: "Drum and bass pioneer with a unique fusion of genres",
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=400&fit=crop",
    featured: true,
    socialLinks: {
      spotify: "#",
      soundcloud: "#",
    },
  },
];

export function FeaturedArtists({
  artists = [],
  title = "Featured Artists",
}: FeaturedArtistsProps) {
  const displayArtists = artists.length > 0 ? artists : demoArtists;

  return (
    <section className="py-12 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
            data-testid="text-artists-title"
          >
            {title}
          </motion.h2>
          <Link href="/artists">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2" data-testid="link-view-all-artists">
              View All Artists
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayArtists.map((artist, index) => (
            <motion.div
              key={artist.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ArtistCard artist={artist as Artist} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtistCard({ artist }: { artist: Artist }) {
  const handleCardClick = () => {
    window.location.href = `/artists/${artist.slug || artist.id}`;
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-md bg-card cursor-pointer" 
      data-testid={`card-artist-${artist.id}`}
      onClick={handleCardClick}
      role="link"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {artist.imageUrl ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-muted" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-2" data-testid={`text-artist-name-${artist.id}`}>
            {artist.name}
          </h3>
          {artist.bio && (
            <p className="text-sm text-white/70 line-clamp-2 mb-4" data-testid={`text-artist-bio-${artist.id}`}>
              {artist.bio}
            </p>
          )}
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {artist.socialLinks?.spotify && (
              <a
                href={artist.socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center h-8 w-8 rounded-md text-white/80 hover:text-[#1DB954] hover:bg-white/10 transition-colors"
                data-testid={`button-artist-spotify-${artist.id}`}
              >
                <SiSpotify className="h-4 w-4" />
              </a>
            )}
            {artist.socialLinks?.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center h-8 w-8 rounded-md text-white/80 hover:text-pink-500 hover:bg-white/10 transition-colors"
                data-testid={`button-artist-instagram-${artist.id}`}
              >
                <SiInstagram className="h-4 w-4" />
              </a>
            )}
            {artist.socialLinks?.soundcloud && (
              <a
                href={artist.socialLinks.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center h-8 w-8 rounded-md text-white/80 hover:text-orange-500 hover:bg-white/10 transition-colors"
                data-testid={`button-artist-soundcloud-${artist.id}`}
              >
                <SiSoundcloud className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
