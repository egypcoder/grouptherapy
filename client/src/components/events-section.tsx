import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Ticket, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Event } from "@shared/schema";

interface EventsSectionProps {
  events?: Event[];
  title?: string;
  showViewAll?: boolean;
}

// Demo events for initial display
const demoEvents: Partial<Event>[] = [
  {
    id: "1",
    title: "GroupTherapy Sessions Vol. 1",
    venue: "Warehouse 23",
    city: "London",
    country: "UK",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop",
    ticketUrl: "#",
    ticketPrice: "25",
    featured: true,
  },
  {
    id: "2",
    title: "Summer Festival 2024",
    venue: "Victoria Park",
    city: "Manchester",
    country: "UK",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
    ticketUrl: "#",
    ticketPrice: "45",
  },
  {
    id: "3",
    title: "Club Night: Neon Pulse",
    venue: "The Underground",
    city: "Berlin",
    country: "Germany",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&h=400&fit=crop",
    ticketUrl: "#",
    ticketPrice: "20",
    featured: true,
  },
  {
    id: "4",
    title: "Rooftop Sessions",
    venue: "Sky Lounge",
    city: "Amsterdam",
    country: "Netherlands",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
    ticketUrl: "#",
    ticketPrice: "30",
  },
];

export function EventsSection({
  events = [],
  title = "Upcoming Events",
  showViewAll = true,
}: EventsSectionProps) {
  const displayEvents = events.length > 0 ? events : demoEvents;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            data-testid="text-events-title"
          >
            {title}
          </motion.h2>
          <div className="flex items-center gap-2">
            {showViewAll && (
              <Link href="/events">
                <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-view-all-events">
                  View All
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              data-testid="button-events-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              data-testid="button-events-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Events Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] snap-start"
            >
              <EventCard event={event as Event} formatDate={formatDate} formatTime={formatTime} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  formatDate,
  formatTime,
}: {
  event: Event;
  formatDate: (date: Date | string | null) => string;
  formatTime: (date: Date | string | null) => string;
}) {
  const isPast = event.date ? new Date(event.date) < new Date() : false;

  return (
    <Card className={cn("overflow-hidden group", isPast && "opacity-60")} data-testid={`card-event-${event.id}`}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted" />
        )}
        
        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-md px-3 py-2 text-center min-w-[60px]">
          <div className="text-xs font-medium text-muted-foreground uppercase">
            {new Date(event.date!).toLocaleDateString("en-US", { month: "short" })}
          </div>
          <div className="text-xl font-bold">
            {new Date(event.date!).getDate()}
          </div>
        </div>

        {event.featured && (
          <Badge className="absolute top-3 right-3" variant="default">
            Featured
          </Badge>
        )}

        {isPast && (
          <Badge className="absolute top-3 right-3" variant="secondary">
            Past
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors" data-testid={`text-event-title-${event.id}`}>
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate" data-testid={`text-event-location-${event.id}`}>
              {event.venue}, {event.city}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span data-testid={`text-event-date-${event.id}`}>{formatDate(event.date)}</span>
          </div>
          {event.date && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{formatTime(event.date)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          {event.ticketPrice && (
            <span className="font-semibold text-primary" data-testid={`text-event-price-${event.id}`}>
              From ${event.ticketPrice}
            </span>
          )}
          {event.ticketUrl && !isPast ? (
            <Button size="sm" asChild data-testid={`button-event-tickets-${event.id}`}>
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                <Ticket className="h-4 w-4 mr-2" />
                Get Tickets
              </a>
            </Button>
          ) : (
            <Link href={`/events/${event.slug || event.id}`}>
              <Button size="sm" variant="outline" data-testid={`button-event-details-${event.id}`}>
                View Details
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
