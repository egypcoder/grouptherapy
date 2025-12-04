import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Ticket, Clock, Filter, Grid, List as ListIcon, Map } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/hero-section";
import { SEOHead, generateStructuredData } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Event } from "@shared/schema";

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
    description: "An immersive night of electronic music featuring our top artists.",
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
    description: "A full day of outdoor music with multiple stages.",
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
    description: "Techno night with Neon Pulse headlining.",
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
    description: "Sunset vibes with deep house and panoramic views.",
  },
  {
    id: "5",
    title: "Past Event: New Year's Eve",
    venue: "The Grand",
    city: "Paris",
    country: "France",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop",
    description: "Ring in the new year with GroupTherapy.",
  },
];

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const displayEvents = events?.length ? events : demoEvents;

  const filteredEvents = displayEvents.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isPast = event.date ? new Date(event.date) < new Date() : false;
    
    if (filter === "upcoming") return matchesSearch && !isPast;
    if (filter === "past") return matchesSearch && isPast;
    return matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return filter === "past" ? dateB - dateA : dateA - dateB;
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen">
      <PageHero
        title="Events"
        subtitle="Experience GroupTherapy live"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="flex-1">
            <TabsList>
              <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past" data-testid="tab-past">Past</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
              data-testid="input-search-events"
            />
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                data-testid="button-events-grid"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                data-testid="button-events-list"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-6">
          {sortedEvents.length} {filter === "past" ? "past" : filter === "upcoming" ? "upcoming" : ""} events
        </p>

        {/* Events Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard event={event as Event} formatDate={formatDate} formatTime={formatTime} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventListCard event={event as Event} formatDate={formatDate} formatTime={formatTime} />
              </motion.div>
            ))}
          </div>
        )}

        {sortedEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </div>
    </div>
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
    <Card className={cn("overflow-hidden group", isPast && "opacity-70")} data-testid={`card-event-${event.id}`}>
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

        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-md px-3 py-2 text-center">
          <div className="text-xs font-medium text-muted-foreground uppercase">
            {new Date(event.date!).toLocaleDateString("en-US", { month: "short" })}
          </div>
          <div className="text-xl font-bold">
            {new Date(event.date!).getDate()}
          </div>
        </div>

        {event.featured && !isPast && (
          <Badge className="absolute top-3 right-3">Featured</Badge>
        )}
        {isPast && (
          <Badge variant="secondary" className="absolute top-3 right-3">Past</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>

        {!isPast && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            {event.ticketPrice && (
              <span className="font-semibold text-primary">From ${event.ticketPrice}</span>
            )}
            {event.ticketUrl && (
              <Button size="sm" asChild>
                <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                  <Ticket className="h-4 w-4 mr-2" />
                  Tickets
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EventListCard({
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
    <Card className={cn("overflow-hidden", isPast && "opacity-70")} data-testid={`card-event-list-${event.id}`}>
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-square flex-shrink-0">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted" />
          )}
          
          <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-center">
            <div className="text-xs font-bold">
              {new Date(event.date!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
        </div>

        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              {event.featured && !isPast && <Badge>Featured</Badge>}
              {isPast && <Badge variant="secondary">Past</Badge>}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.venue}, {event.city}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(event.date)}
              </div>
            </div>
          </div>

          {!isPast && event.ticketUrl && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              {event.ticketPrice && (
                <span className="font-semibold text-primary">From ${event.ticketPrice}</span>
              )}
              <Button size="sm" asChild>
                <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                  <Ticket className="h-4 w-4 mr-2" />
                  Get Tickets
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
