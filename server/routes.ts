import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateSitemap } from "./sitemap";
import { validateCredentials, createSession, deleteSession, requireAuth, validateSession } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const ipAddress = req.ip || req.socket.remoteAddress;
      const result = await validateCredentials(username, password, ipAddress);

      if (!result.valid) {
        return res.status(401).json({ message: result.message || "Invalid credentials" });
      }

      const sessionId = createSession(username);
      res.json({ sessionId, username });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (sessionId) {
      deleteSession(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const username = validateSession(sessionId);
    if (!username) {
      return res.status(401).json({ message: "Invalid session" });
    }

    res.json({ username });
  });
  // Radio metadata endpoint
  app.get("/api/radio/metadata", async (req, res) => {
    // In production, this would fetch from your streaming service API
    // For now, return demo data with simulated updates
    const demoTracks = [
      { title: "Midnight Drive", artist: "Luna Wave", showName: "Morning Therapy", hostName: "DJ Luna" },
      { title: "Electric Dreams", artist: "Neon Pulse", showName: "Peak Time Sessions", hostName: "Neon Pulse" },
      { title: "Deep Waters", artist: "Aqua Dreams", showName: "Weekend Warm-Up", hostName: "Aqua Dreams" },
    ];

    const randomTrack = demoTracks[Math.floor(Math.random() * demoTracks.length)];
    const listenerCount = Math.floor(Math.random() * 50) + 100; // 100-150 listeners

    res.json({
      ...randomTrack,
      listenerCount,
      coverUrl: undefined,
    });
  });

  // Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const sitemap = await generateSitemap();
      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/overview", requireAuth, async (req, res) => {
    try {
      const releases = await storage.getAllReleases();
      const radioShows = await storage.getAllRadioShows();

      // Calculate total streams (simulated data based on releases)
      const totalStreams = releases.length * 9750;
      const totalListeners = releases.length * 375;
      const activeUsers = Math.floor(totalListeners * 0.27);

      // Get top releases by simulated streams
      const topReleases = releases
        .filter(r => r.published)
        .slice(0, 5)
        .map((release, index) => ({
          id: release.id,
          title: release.title,
          streams: Math.floor(45000 - (index * 7000) + Math.random() * 5000),
        }));

      // Get radio show performance
      const showPerformance = radioShows.slice(0, 4).map((show, index) => ({
        id: show.id,
        title: show.title,
        avgListeners: Math.floor(1200 - (index * 200) + Math.random() * 300),
      }));

      res.json({
        totalStreams,
        totalListeners,
        activeUsers,
        engagement: {
          releases: topReleases,
          radioShows: showPerformance,
        },
      });
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Releases CRUD
  app.get("/api/releases", async (req, res) => {
    const releases = await storage.getAllReleases();
    res.json(releases);
  });

  app.get("/api/releases/:id", async (req, res) => {
    const release = await storage.getReleaseById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });
    res.json(release);
  });

  app.post("/api/releases", requireAuth, async (req, res) => {
    try {
      const release = await storage.createRelease(req.body);
      res.json(release);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/releases/:id", requireAuth, async (req, res) => {
    try {
      const release = await storage.updateRelease(req.params.id, req.body);
      res.json(release);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/releases/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteRelease(req.params.id);
      res.json({ message: "Release deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Events CRUD
  app.get("/api/events", async (req, res) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post("/api/events", requireAuth, async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/events/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Posts CRUD
  app.get("/api/posts", async (req, res) => {
    const posts = await storage.getAllPosts();
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const post = await storage.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post("/api/posts", requireAuth, async (req, res) => {
    try {
      const post = await storage.createPost(req.body);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const post = await storage.updatePost(req.params.id, req.body);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePost(req.params.id);
      res.json({ message: "Post deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Contacts CRUD
  app.get("/api/contacts", requireAuth, async (req, res) => {
    const contacts = await storage.getAllContacts();
    res.json(contacts);
  });

  app.get("/api/contacts/:id", requireAuth, async (req, res) => {
    const contact = await storage.getContactById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/contacts/:id", requireAuth, async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.body);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/contacts/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteContact(req.params.id);
      res.json({ message: "Contact deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Artists CRUD
  app.get("/api/artists", async (req, res) => {
    const artists = await storage.getAllArtists();
    res.json(artists);
  });

  app.get("/api/artists/featured", async (req, res) => {
    const artists = await storage.getAllArtists();
    res.json(artists.filter(a => a.featured));
  });

  app.get("/api/artists/:id", async (req, res) => {
    const artist = await storage.getArtistById(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artist not found" });
    res.json(artist);
  });

  app.post("/api/artists", requireAuth, async (req, res) => {
    try {
      const artist = await storage.createArtist(req.body);
      res.json(artist);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/artists/:id", requireAuth, async (req, res) => {
    try {
      const artist = await storage.updateArtist(req.params.id, req.body);
      res.json(artist);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/artists/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteArtist(req.params.id);
      res.json({ message: "Artist deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Radio Shows CRUD
  app.get("/api/radio/shows", async (req, res) => {
    const shows = await storage.getAllRadioShows();
    res.json(shows);
  });

  app.get("/api/radio/shows/:id", async (req, res) => {
    const show = await storage.getRadioShowById(req.params.id);
    if (!show) return res.status(404).json({ message: "Radio show not found" });
    res.json(show);
  });

  app.post("/api/radio/shows", requireAuth, async (req, res) => {
    try {
      const show = await storage.createRadioShow(req.body);
      res.json(show);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/radio/shows/:id", requireAuth, async (req, res) => {
    try {
      const show = await storage.updateRadioShow(req.params.id, req.body);
      res.json(show);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/radio/shows/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteRadioShow(req.params.id);
      res.json({ message: "Radio show deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Playlists CRUD
  app.get("/api/playlists", async (req, res) => {
    const playlists = await storage.getAllPlaylists();
    res.json(playlists);
  });

  app.get("/api/playlists/:id", async (req, res) => {
    const playlist = await storage.getPlaylistById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json(playlist);
  });

  app.post("/api/playlists", requireAuth, async (req, res) => {
    try {
      const playlist = await storage.createPlaylist(req.body);
      res.json(playlist);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
      const playlist = await storage.updatePlaylist(req.params.id, req.body);
      res.json(playlist);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePlaylist(req.params.id);
      res.json({ message: "Playlist deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Videos CRUD
  app.get("/api/videos", async (req, res) => {
    const videos = await storage.getAllVideos();
    res.json(videos);
  });

  app.get("/api/videos/:id", async (req, res) => {
    const video = await storage.getVideoById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  });

  app.post("/api/videos", requireAuth, async (req, res) => {
    try {
      const video = await storage.createVideo(req.body);
      res.json(video);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/videos/:id", requireAuth, async (req, res) => {
    try {
      const video = await storage.updateVideo(req.params.id, req.body);
      res.json(video);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/videos/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteVideo(req.params.id);
      res.json({ message: "Video deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}