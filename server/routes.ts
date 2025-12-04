import type { Express, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateSitemap } from "./sitemap";
import { validateCredentials, createSession, deleteSession, requireAuth, validateSession } from "./auth";
import { v2 as cloudinary } from "cloudinary";

const DEMO_STREAM_URL = "https://stream.zeno.fm/yn65fsaurfhvv";

const sseClients: Set<Response> = new Set();

function broadcastToSSEClients(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    client.write(message);
  });
}

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
  // Radio metadata endpoint - returns currently playing track based on schedule
  app.get("/api/radio/metadata", async (req, res) => {
    try {
      const currentSchedule = await storage.getCurrentScheduledItem();
      
      if (currentSchedule) {
        const asset = await storage.getRadioAssetById(currentSchedule.assetId);
        if (asset) {
          const startedAt = new Date(currentSchedule.scheduledStart).getTime();
          const now = Date.now();
          const positionSeconds = Math.floor((now - startedAt) / 1000);
          
          let show = null;
          if (currentSchedule.showId) {
            show = await storage.getRadioShowById(currentSchedule.showId);
          }
          
          return res.json({
            isScheduled: true,
            currentAsset: {
              id: asset.id,
              title: asset.title,
              artist: asset.artist,
              audioUrl: asset.audioUrl,
              durationSeconds: asset.durationSeconds,
            },
            streamUrl: asset.audioUrl,
            startedAt: currentSchedule.scheduledStart,
            durationSeconds: asset.durationSeconds,
            positionSeconds: Math.min(positionSeconds, asset.durationSeconds),
            showName: show?.title,
            hostName: show?.hostName,
            listenerCount: Math.floor(Math.random() * 50) + 100,
          });
        }
      }
      
      // Fallback to demo stream when nothing is scheduled
      const demoTracks = [
        { title: "Midnight Drive", artist: "Luna Wave", showName: "Morning Therapy", hostName: "DJ Luna" },
        { title: "Electric Dreams", artist: "Neon Pulse", showName: "Peak Time Sessions", hostName: "Neon Pulse" },
        { title: "Deep Waters", artist: "Aqua Dreams", showName: "Weekend Warm-Up", hostName: "Aqua Dreams" },
      ];

      const randomTrack = demoTracks[Math.floor(Math.random() * demoTracks.length)];
      const listenerCount = Math.floor(Math.random() * 50) + 100;

      res.json({
        isScheduled: false,
        ...randomTrack,
        streamUrl: DEMO_STREAM_URL,
        listenerCount,
        coverUrl: undefined,
      });
    } catch (error: any) {
      console.error("Error fetching radio metadata:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // SSE endpoint for synchronized playback
  app.get("/api/radio/stream-state", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    sseClients.add(res);

    // Send initial state
    (async () => {
      try {
        const currentSchedule = await storage.getCurrentScheduledItem();
        if (currentSchedule) {
          const asset = await storage.getRadioAssetById(currentSchedule.assetId);
          if (asset) {
            const startedAt = new Date(currentSchedule.scheduledStart).getTime();
            const now = Date.now();
            const positionSeconds = Math.floor((now - startedAt) / 1000);
            
            res.write(`data: ${JSON.stringify({
              type: "state",
              isScheduled: true,
              currentAsset: {
                id: asset.id,
                title: asset.title,
                artist: asset.artist,
                audioUrl: asset.audioUrl,
                durationSeconds: asset.durationSeconds,
              },
              streamUrl: asset.audioUrl,
              startedAt: currentSchedule.scheduledStart,
              positionSeconds: Math.min(positionSeconds, asset.durationSeconds),
            })}\n\n`);
          }
        } else {
          res.write(`data: ${JSON.stringify({
            type: "state",
            isScheduled: false,
            streamUrl: DEMO_STREAM_URL,
          })}\n\n`);
        }
      } catch (error) {
        console.error("Error sending initial SSE state:", error);
      }
    })();

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
      res.write(":heartbeat\n\n");
    }, 30000);

    req.on("close", () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // Radio Assets CRUD
  app.get("/api/radio/assets", requireAuth, async (req, res) => {
    try {
      const assets = await storage.getAllRadioAssets();
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/radio/assets/:id", requireAuth, async (req, res) => {
    try {
      const asset = await storage.getRadioAssetById(req.params.id);
      if (!asset) return res.status(404).json({ message: "Radio asset not found" });
      res.json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/radio/assets", requireAuth, async (req, res) => {
    try {
      const asset = await storage.createRadioAsset(req.body);
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/radio/assets/:id", requireAuth, async (req, res) => {
    try {
      const asset = await storage.updateRadioAsset(req.params.id, req.body);
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/radio/assets/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteRadioAsset(req.params.id);
      res.json({ message: "Radio asset deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cloudinary upload signature for secure uploads
  app.post("/api/radio/assets/upload-signature", requireAuth, async (req, res) => {
    try {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        return res.status(500).json({ 
          message: "Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET." 
        });
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = "radio-assets";
      
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder,
          resource_type: "video",
        },
        apiSecret
      );

      res.json({
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder,
      });
    } catch (error: any) {
      console.error("Error generating upload signature:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Radio Schedule CRUD
  app.get("/api/radio/schedule", requireAuth, async (req, res) => {
    try {
      const schedule = await storage.getAllRadioSchedule();
      res.json(schedule);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/radio/schedule/:id", requireAuth, async (req, res) => {
    try {
      const scheduleItem = await storage.getRadioScheduleById(req.params.id);
      if (!scheduleItem) return res.status(404).json({ message: "Schedule item not found" });
      res.json(scheduleItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/radio/schedule", requireAuth, async (req, res) => {
    try {
      const scheduleItem = await storage.createRadioSchedule(req.body);
      
      // Broadcast to SSE clients that schedule has changed
      const asset = await storage.getRadioAssetById(scheduleItem.assetId);
      if (asset) {
        broadcastToSSEClients({
          type: "schedule_update",
          scheduleItem,
          asset: {
            id: asset.id,
            title: asset.title,
            artist: asset.artist,
            audioUrl: asset.audioUrl,
            durationSeconds: asset.durationSeconds,
          },
        });
      }
      
      res.json(scheduleItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/radio/schedule/:id", requireAuth, async (req, res) => {
    try {
      const scheduleItem = await storage.updateRadioSchedule(req.params.id, req.body);
      
      // Broadcast update to SSE clients
      broadcastToSSEClients({
        type: "schedule_update",
        scheduleItem,
      });
      
      res.json(scheduleItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/radio/schedule/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteRadioSchedule(req.params.id);
      
      // Broadcast to SSE clients that schedule has changed
      broadcastToSSEClients({
        type: "schedule_deleted",
        scheduleId: req.params.id,
      });
      
      res.json({ message: "Schedule item deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
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