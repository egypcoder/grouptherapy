import { motion } from "framer-motion";
import { HeroSection } from "@/components/hero-section";
import { ReleasesCarousel } from "@/components/releases-carousel";
import { EventsSection } from "@/components/events-section";
import { PlaylistsSection } from "@/components/playlists-section";
import { FeaturedArtists } from "@/components/featured-artists";
import { SEOHead, generateStructuredData } from "@/components/seo-head";
import { useQuery } from "@tanstack/react-query";
import type { Release, Event, Playlist, Artist } from "@shared/schema";

export default function HomePage() {
  const { data: releases } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const { data: artists } = useQuery<Artist[]>({
    queryKey: ["/api/artists", "featured"],
  });

  const organizationSchema = generateStructuredData("Organization", {
    name: "GroupTherapy Records",
    url: "https://grouptherapy.com",
    logo: "https://grouptherapy.com/logo.png",
    description: "Independent electronic music record label pushing the boundaries of sound",
    sameAs: [
      "https://www.instagram.com/grouptherapyrecords",
      "https://twitter.com/grouptherapy",
      "https://www.youtube.com/grouptherapyrecords",
      "https://open.spotify.com/user/grouptherapyrecords",
      "https://soundcloud.com/grouptherapyrecords",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@grouptherapy.com",
      contactType: "Customer Service",
    },
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="GroupTherapy Records - Electronic Music Label | New Releases & Events"
        description="Discover the future of electronic music with GroupTherapy Records. Stream new releases, find upcoming events, listen to 24/7 radio, and connect with cutting-edge artists."
        keywords={["electronic music label", "house music", "techno", "DJ events", "music releases", "live radio", "independent label", "electronic artists", "music streaming"]}
        structuredData={organizationSchema}
      />
      
      {/* Hero Section */}
      <HeroSection
        title="GROUPTHERAPY"
        subtitle="The sound of tomorrow, today. Discover the future of electronic music."
        showRadio={true}
        ctaText="Explore Releases"
        ctaLink="/releases"
      />

      {/* New Releases Carousel (20+ slides) */}
      <ReleasesCarousel
        releases={releases || []}
        title="New Releases"
        autoPlay={true}
        showViewAll={true}
      />

      {/* Featured Artists */}
      <FeaturedArtists
        artists={artists?.filter((a) => a.featured) || []}
        title="Featured Artists"
      />

      {/* Upcoming Events */}
      <EventsSection
        events={events || []}
        title="Upcoming Events"
        showViewAll={true}
      />

      {/* Curated Playlists */}
      <PlaylistsSection
        playlists={playlists || []}
        title="Curated Playlists"
      />

      {/* Latest News Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              GroupTherapy Radar
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stay updated with the latest news, interviews, and behind-the-scenes content from the label.
            </p>
            <motion.a
              href="/news"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="link-news-cta"
            >
              Read Latest News
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
