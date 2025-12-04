import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useRadio } from "@/lib/radio-context";

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  showRadio?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title = "GROUPTHERAPY",
  subtitle = "The sound of tomorrow, today",
  backgroundImage,
  showRadio = true,
  ctaText = "Explore Releases",
  ctaLink = "/releases",
}: HeroProps) {
  const { togglePlay, isPlaying } = useRadio();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-background via-muted to-background" />
        )}
        {/* Dark wash overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter mb-6"
            data-testid="text-hero-title"
          >
            {title.split("THERAPY").map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && <span className="text-primary">THERAPY</span>}
              </span>
            ))}
          </h1>
          <p 
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
            data-testid="text-hero-subtitle"
          >
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {showRadio && (
            <Button
              size="lg"
              variant={isPlaying ? "default" : "secondary"}
              onClick={togglePlay}
              className="min-w-[180px] gap-2"
              data-testid="button-hero-radio"
            >
              <Play className={`h-5 w-5 ${isPlaying ? "fill-current" : ""}`} />
              {isPlaying ? "Now Playing" : "Listen Live"}
            </Button>
          )}
          <Link href={ctaLink}>
            <Button 
              size="lg" 
              variant="outline" 
              className="min-w-[180px] gap-2 backdrop-blur-sm"
              data-testid="button-hero-cta"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
}: {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}) {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted via-background to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-4"
          data-testid="text-page-title"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-page-subtitle"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
