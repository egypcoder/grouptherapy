import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/hero-section";
import { SEOHead, generateStructuredData } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiSpotify, SiInstagram, SiSoundcloud } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "@shared/schema";

const demoArtists: Partial<Artist>[] = [
  {
    id: "1",
    name: "Luna Wave",
    slug: "luna-wave",
    bio: "Electronic producer known for atmospheric soundscapes and driving beats that transport listeners to otherworldly dimensions.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop",
    featured: true,
    socialLinks: { instagram: "#", spotify: "#", soundcloud: "#" },
  },
  {
    id: "2",
    name: "Neon Pulse",
    slug: "neon-pulse",
    bio: "Techno artist pushing the boundaries of electronic music with innovative sound design and relentless energy.",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=500&fit=crop",
    featured: true,
    socialLinks: { instagram: "#", spotify: "#" },
  },
  {
    id: "3",
    name: "Circuit Breaker",
    slug: "circuit-breaker",
    bio: "Drum and bass pioneer with a unique fusion of genres that has earned him a dedicated following worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=500&fit=crop",
    featured: true,
    socialLinks: { spotify: "#", soundcloud: "#" },
  },
  {
    id: "4",
    name: "Aqua Dreams",
    slug: "aqua-dreams",
    bio: "Deep house specialist creating waves of emotion through carefully crafted productions.",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop",
    socialLinks: { instagram: "#", spotify: "#" },
  },
  {
    id: "5",
    name: "Cosmic Ray",
    slug: "cosmic-ray",
    bio: "Progressive house producer taking listeners on cosmic journeys through sound.",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=500&fit=crop",
    socialLinks: { spotify: "#" },
  },
  {
    id: "6",
    name: "Street Beat",
    slug: "street-beat",
    bio: "UK Garage revivalist bringing the classic sound to a new generation.",
    imageUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=500&fit=crop",
    socialLinks: { instagram: "#", soundcloud: "#" },
  },
];

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: artists } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const displayArtists = artists?.length ? artists : demoArtists;

  const filteredArtists = displayArtists.filter((artist) =>
    artist.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const artistsSchema = generateStructuredData("ItemList", {
    itemListElement: displayArtists.slice(0, 20).map((artist, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MusicGroup",
        name: artist.name,
        description: artist.bio,
        image: artist.imageUrl,
        sameAs: [
          artist.socialLinks?.spotify,
          artist.socialLinks?.instagram,
          artist.socialLinks?.soundcloud,
        ].filter(Boolean),
      },
    })),
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Artists - GroupTherapy Records | Electronic Music Producers & DJs"
        description="Explore our roster of talented electronic music artists, producers, and DJs. From house to techno, discover the innovative talent shaping the future of dance music."
        keywords={["electronic music artists", "DJ roster", "house music producers", "techno artists", "music talent", "electronic producers"]}
        structuredData={artistsSchema}
      />
      
      <PageHero
        title="Artists"
        subtitle="Meet the talent behind the sound"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-artists"
            />
          </div>
        </div>

        {/* Featured Artists */}
        {filteredArtists.some((a) => a.featured) && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists
                .filter((a) => a.featured)
                .map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ArtistCard artist={artist as Artist} featured />
                  </motion.div>
                ))}
            </div>
          </section>
        )}

        {/* All Artists */}
        <section>
          <h2 className="text-2xl font-bold mb-6">All Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ArtistCard artist={artist as Artist} />
              </motion.div>
            ))}
          </div>
        </section>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No artists found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArtistCard({ artist, featured = false }: { artist: Artist; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/artists/${artist.slug || artist.id}`}>
        <div className="group relative overflow-hidden rounded-md bg-card" data-testid={`card-artist-featured-${artist.id}`}>
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
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{artist.name}</h3>
              {artist.bio && (
                <p className="text-sm text-white/70 line-clamp-2 mb-4">{artist.bio}</p>
              )}
              
              <div className="flex items-center gap-3">
                {artist.socialLinks?.spotify && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/80 hover:text-[#1DB954] hover:bg-white/10"
                    asChild
                  >
                    <a href={artist.socialLinks.spotify} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <SiSpotify className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {artist.socialLinks?.instagram && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/80 hover:text-pink-500 hover:bg-white/10"
                    asChild
                  >
                    <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <SiInstagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {artist.socialLinks?.soundcloud && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/80 hover:text-orange-500 hover:bg-white/10"
                    asChild
                  >
                    <a href={artist.socialLinks.soundcloud} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <SiSoundcloud className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/artists/${artist.slug || artist.id}`}>
      <div className="group cursor-pointer" data-testid={`card-artist-${artist.id}`}>
        <div className="relative aspect-square rounded-md overflow-hidden bg-muted mb-3">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted" />
          )}
        </div>
        <h3 className="font-semibold text-sm text-center group-hover:text-primary transition-colors">
          {artist.name}
        </h3>
      </div>
    </Link>
  );
}
