import { db } from "./db";
import { artists, releases, events, posts, radioShows, radioSettings } from "@shared/schema";

async function seedData() {
  console.log("Starting database seed...");
  
  try {
    const existingArtists = await db.select().from(artists).limit(1);
    if (existingArtists.length > 0) {
      console.log("Database already has data, skipping seed");
      process.exit(0);
    }

    console.log("Seeding artists...");
    const artistData = [
      { name: "Luna Wave", slug: "luna-wave", bio: "Electronic music producer from Berlin", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", featured: true },
      { name: "Neon Pulse", slug: "neon-pulse", bio: "Techno artist pushing boundaries", imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", featured: true },
      { name: "Aqua Dreams", slug: "aqua-dreams", bio: "Deep house specialist", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", featured: false },
    ];
    
    for (const artist of artistData) {
      await db.insert(artists).values(artist as any);
    }

    console.log("Seeding releases...");
    const releaseData = [
      { title: "Midnight Sessions", slug: "midnight-sessions", artistName: "Luna Wave", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", type: "album", genres: ["Electronic", "House"], published: true, featured: true, releaseDate: new Date("2024-01-15") },
      { title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", artistName: "Neon Pulse", coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", type: "single", genres: ["Techno"], published: true, featured: false, releaseDate: new Date("2024-02-01") },
      { title: "Deep Waters", slug: "deep-waters", artistName: "Aqua Dreams", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", type: "ep", genres: ["Deep House"], published: true, featured: true, releaseDate: new Date("2024-02-10") },
    ];
    
    for (const release of releaseData) {
      await db.insert(releases).values(release as any);
    }

    console.log("Seeding events...");
    const eventData = [
      { title: "GroupTherapy Sessions Vol. 1", slug: "grouptherapy-sessions-vol-1", venue: "Warehouse 23", city: "London", country: "UK", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop", ticketPrice: "25", published: true, featured: true },
      { title: "Summer Festival 2024", slug: "summer-festival-2024", venue: "Victoria Park", city: "Manchester", country: "UK", date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop", ticketPrice: "45", published: true, featured: false },
    ];
    
    for (const event of eventData) {
      await db.insert(events).values(event as any);
    }

    console.log("Seeding posts...");
    const postData = [
      { title: "GroupTherapy Announces Summer Festival 2024 Lineup", slug: "summer-festival-2024-lineup", excerpt: "Get ready for the biggest GroupTherapy event yet!", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop", category: "events", published: true, featured: true, publishedAt: new Date("2024-03-01"), authorName: "GroupTherapy Team" },
      { title: "Luna Wave Drops New Album 'Midnight Sessions'", slug: "luna-wave-midnight-sessions", excerpt: "After two years in the making, Luna Wave delivers her most ambitious project to date.", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop", category: "releases", published: true, featured: false, publishedAt: new Date("2024-02-28"), authorName: "Sarah Chen" },
    ];
    
    for (const post of postData) {
      await db.insert(posts).values(post as any);
    }

    console.log("Seeding radio shows...");
    const showData = [
      { title: "Morning Therapy", slug: "morning-therapy", hostName: "DJ Luna", description: "Wake up with the smoothest electronic beats", dayOfWeek: 1, startTime: "07:00", endTime: "10:00", timezone: "UTC", published: true, isLive: false },
      { title: "Peak Time Sessions", slug: "peak-time-sessions", hostName: "Neon Pulse", description: "High-energy techno and house", dayOfWeek: 2, startTime: "20:00", endTime: "23:00", timezone: "UTC", published: true, isLive: true },
    ];
    
    for (const show of showData) {
      await db.insert(radioShows).values(show as any);
    }

    console.log("Seeding radio settings...");
    await db.insert(radioSettings).values({
      stationName: "GroupTherapy Radio",
      isLive: true,
      listenerCount: 0,
    } as any);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedData();
