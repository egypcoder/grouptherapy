import { sql } from "drizzle-orm";
import { type User, type InsertUser, type AdminUser, type InsertAdminUser, type InsertLoginAttempt, type LoginAttempt, type Release, type InsertRelease, type Event, type InsertEvent, type Post, type InsertPost, type Contact, type InsertContact, type Artist, type InsertArtist, type RadioShow, type InsertRadioShow, type Playlist, type InsertPlaylist, type Video, type InsertVideo } from "@shared/schema";
import { randomUUID } from "crypto";

// Helper function to convert undefined to null
function nullify<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin user methods
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(username: string): Promise<void>;

  // Login attempt tracking
  recordLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt>;
  getRecentLoginAttempts(username: string, minutes: number): Promise<LoginAttempt[]>;

  // Releases
  getAllReleases(): Promise<Release[]>;
  getReleaseById(id: string): Promise<Release | undefined>;
  createRelease(release: InsertRelease): Promise<Release>;
  updateRelease(id: string, release: Partial<Release>): Promise<Release>;
  deleteRelease(id: string): Promise<void>;

  // Events
  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;

  // Posts
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;

  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<Contact>): Promise<Contact>;
  deleteContact(id: string): Promise<void>;

  // Artists
  getAllArtists(): Promise<Artist[]>;
  getArtistById(id: string): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: string, artist: Partial<Artist>): Promise<Artist>;
  deleteArtist(id: string): Promise<void>;

  // Radio Shows
  getAllRadioShows(): Promise<RadioShow[]>;
  getRadioShowById(id: string): Promise<RadioShow | undefined>;
  createRadioShow(show: InsertRadioShow): Promise<RadioShow>;
  updateRadioShow(id: string, show: Partial<RadioShow>): Promise<RadioShow>;
  deleteRadioShow(id: string): Promise<void>;

  // Playlists
  getAllPlaylists(): Promise<Playlist[]>;
  getPlaylistById(id: string): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, playlist: Partial<Playlist>): Promise<Playlist>;
  deletePlaylist(id: string): Promise<void>;

  // Videos
  getAllVideos(): Promise<Video[]>;
  getVideoById(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<Video>): Promise<Video>;
  deleteVideo(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private adminUsers: Map<string, AdminUser>;
  private loginAttempts: LoginAttempt[];
  private releases: Map<string, Release>;
  private events: Map<string, Event>;
  private posts: Map<string, Post>;
  private contacts: Map<string, Contact>;
  private artists: Map<string, Artist>;
  private radioShows: Map<string, RadioShow>;
  private playlists: Map<string, Playlist>;
  private videos: Map<string, Video>;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    this.loginAttempts = [];
    this.releases = new Map();
    this.events = new Map();
    this.posts = new Map();
    this.contacts = new Map();
    this.artists = new Map();
    this.radioShows = new Map();
    this.playlists = new Map();
    this.videos = new Map();

    // Seed initial data
    this.seedData();
  }

  private seedData() {
    // Seed Artists
    const artists = [
      { id: randomUUID(), name: "Luna Wave", slug: "luna-wave", bio: "Electronic music producer from Berlin", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", featured: true, createdAt: new Date() },
      { id: randomUUID(), name: "Neon Pulse", slug: "neon-pulse", bio: "Techno artist pushing boundaries", imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", featured: true, createdAt: new Date() },
      { id: randomUUID(), name: "Aqua Dreams", slug: "aqua-dreams", bio: "Deep house specialist", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", featured: false, createdAt: new Date() },
    ];
    artists.forEach(a => this.artists.set(a.id, a as Artist));

    // Seed Releases
    const releases = [
      { id: randomUUID(), title: "Midnight Sessions", slug: "midnight-sessions", artistName: "Luna Wave", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", type: "album", genres: ["Electronic", "House"], published: true, featured: true, releaseDate: new Date("2024-01-15"), createdAt: new Date() },
      { id: randomUUID(), title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", artistName: "Neon Pulse", coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", type: "single", genres: ["Techno"], published: true, featured: false, releaseDate: new Date("2024-02-01"), createdAt: new Date() },
      { id: randomUUID(), title: "Deep Waters", slug: "deep-waters", artistName: "Aqua Dreams", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", type: "ep", genres: ["Deep House"], published: true, featured: true, releaseDate: new Date("2024-02-10"), createdAt: new Date() },
    ];
    releases.forEach(r => this.releases.set(r.id, r as Release));

    // Seed Events
    const events = [
      { id: randomUUID(), title: "GroupTherapy Sessions Vol. 1", slug: "grouptherapy-sessions-vol-1", venue: "Warehouse 23", city: "London", country: "UK", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop", ticketPrice: "25", published: true, featured: true, createdAt: new Date() },
      { id: randomUUID(), title: "Summer Festival 2024", slug: "summer-festival-2024", venue: "Victoria Park", city: "Manchester", country: "UK", date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop", ticketPrice: "45", published: true, featured: false, createdAt: new Date() },
    ];
    events.forEach(e => this.events.set(e.id, e as Event));

    // Seed Posts
    const posts = [
      { id: randomUUID(), title: "GroupTherapy Announces Summer Festival 2024 Lineup", slug: "summer-festival-2024-lineup", excerpt: "Get ready for the biggest GroupTherapy event yet!", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop", category: "events", published: true, featured: true, publishedAt: new Date("2024-03-01"), authorName: "GroupTherapy Team", createdAt: new Date() },
      { id: randomUUID(), title: "Luna Wave Drops New Album 'Midnight Sessions'", slug: "luna-wave-midnight-sessions", excerpt: "After two years in the making, Luna Wave delivers her most ambitious project to date.", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop", category: "releases", published: true, featured: false, publishedAt: new Date("2024-02-28"), authorName: "Sarah Chen", createdAt: new Date() },
    ];
    posts.forEach(p => this.posts.set(p.id, p as Post));

    // Seed Radio Shows
    const shows = [
      { id: randomUUID(), title: "Morning Therapy", slug: "morning-therapy", hostName: "DJ Luna", description: "Wake up with the smoothest electronic beats", dayOfWeek: 1, startTime: "07:00", endTime: "10:00", timezone: "UTC", published: true, isLive: false, createdAt: new Date() },
      { id: randomUUID(), title: "Peak Time Sessions", slug: "peak-time-sessions", hostName: "Neon Pulse", description: "High-energy techno and house", dayOfWeek: 2, startTime: "20:00", endTime: "23:00", timezone: "UTC", published: true, isLive: true, createdAt: new Date() },
    ];
    shows.forEach(s => this.radioShows.set(s.id, s as RadioShow));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.username === username,
    );
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const id = this.adminUsers.size + 1;
    const adminUser: AdminUser = {
      ...insertUser,
      id,
      isActive: insertUser.isActive ?? true,
      role: insertUser.role ?? "admin",
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(adminUser.username, adminUser);
    return adminUser;
  }

  async updateAdminLastLogin(username: string): Promise<void> {
    const user = await this.getAdminUserByUsername(username);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
      this.adminUsers.set(username, user);
    }
  }

  async recordLoginAttempt(insertAttempt: InsertLoginAttempt): Promise<LoginAttempt> {
    const attempt: LoginAttempt = {
      ...insertAttempt,
      id: this.loginAttempts.length + 1,
      attemptedAt: new Date(),
    };
    this.loginAttempts.push(attempt);
    return attempt;
  }

  async getRecentLoginAttempts(username: string, minutes: number): Promise<LoginAttempt[]> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.loginAttempts.filter(
      (attempt) =>
        attempt.username === username &&
        attempt.attemptedAt >= cutoffTime
    );
  }

  // Releases
  async getAllReleases(): Promise<Release[]> {
    return Array.from(this.releases.values());
  }

  async getReleaseById(id: string): Promise<Release | undefined> {
    return this.releases.get(id);
  }

  async createRelease(release: InsertRelease): Promise<Release> {
    const id = randomUUID();
    const newRelease: Release = { ...release, id, createdAt: new Date() };
    this.releases.set(id, newRelease);
    return newRelease;
  }

  async updateRelease(id: string, update: Partial<Release>): Promise<Release> {
    const existing = this.releases.get(id);
    if (!existing) throw new Error("Release not found");
    const updated = { ...existing, ...update };
    this.releases.set(id, updated);
    return updated;
  }

  async deleteRelease(id: string): Promise<void> {
    this.releases.delete(id);
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent: Event = { ...event, id, createdAt: new Date() };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: string, update: Partial<Event>): Promise<Event> {
    const existing = this.events.get(id);
    if (!existing) throw new Error("Event not found");
    const updated = { ...existing, ...update };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    this.events.delete(id);
  }

  // Posts
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = randomUUID();
    const newPost: Post = { ...post, id, createdAt: new Date() };
    this.posts.set(id, newPost);
    return newPost;
  }

  async updatePost(id: string, update: Partial<Post>): Promise<Post> {
    const existing = this.posts.get(id);
    if (!existing) throw new Error("Post not found");
    const updated = { ...existing, ...update };
    this.posts.set(id, updated);
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    this.posts.delete(id);
  }

  // Contacts
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const newContact: Contact = {
      id,
      name: contact.name,
      email: contact.email,
      message: contact.message,
      subject: nullify(contact.subject),
      category: nullify(contact.category),
      attachmentUrl: nullify(contact.attachmentUrl),
      status: "new",
      createdAt: new Date(),
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async updateContact(id: string, update: Partial<Contact>): Promise<Contact> {
    const existing = this.contacts.get(id);
    if (!existing) throw new Error("Contact not found");
    const updated = { ...existing, ...update };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: string): Promise<void> {
    this.contacts.delete(id);
  }

  // Artists
  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const id = randomUUID();
    const newArtist: Artist = {
      id,
      name: artist.name,
      slug: artist.slug,
      bio: nullify(artist.bio),
      imageUrl: nullify(artist.imageUrl),
      spotifyArtistId: nullify(artist.spotifyArtistId),
      socialLinks: nullify(artist.socialLinks),
      featured: nullify(artist.featured),
      createdAt: new Date(),
    };
    this.artists.set(id, newArtist);
    return newArtist;
  }

  async updateArtist(id: string, update: Partial<Artist>): Promise<Artist> {
    const existing = this.artists.get(id);
    if (!existing) throw new Error("Artist not found");
    const updated = { ...existing, ...update };
    this.artists.set(id, updated);
    return updated;
  }

  async deleteArtist(id: string): Promise<void> {
    this.artists.delete(id);
  }

  // Radio Shows
  async getAllRadioShows(): Promise<RadioShow[]> {
    return Array.from(this.radioShows.values());
  }

  async getRadioShowById(id: string): Promise<RadioShow | undefined> {
    return this.radioShows.get(id);
  }

  async createRadioShow(show: InsertRadioShow): Promise<RadioShow> {
    const id = randomUUID();
    const newShow: RadioShow = {
      id,
      title: show.title,
      slug: show.slug,
      hostName: show.hostName,
      description: nullify(show.description),
      hostBio: nullify(show.hostBio),
      hostImageUrl: nullify(show.hostImageUrl),
      coverUrl: nullify(show.coverUrl),
      streamUrl: nullify(show.streamUrl),
      recordedUrl: nullify(show.recordedUrl),
      dayOfWeek: nullify(show.dayOfWeek),
      startTime: nullify(show.startTime),
      endTime: nullify(show.endTime),
      timezone: nullify(show.timezone),
      isLive: nullify(show.isLive),
      published: nullify(show.published),
      createdAt: new Date(),
    };
    this.radioShows.set(id, newShow);
    return newShow;
  }

  async updateRadioShow(id: string, update: Partial<RadioShow>): Promise<RadioShow> {
    const existing = this.radioShows.get(id);
    if (!existing) throw new Error("Radio show not found");
    const updated = { ...existing, ...update };
    this.radioShows.set(id, updated);
    return updated;
  }

  async deleteRadioShow(id: string): Promise<void> {
    this.radioShows.delete(id);
  }

  // Playlists
  async getAllPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async getPlaylistById(id: string): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async createPlaylist(data: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = {
      id,
      title: data.title,
      slug: data.slug,
      featured: nullify(data.featured),
      coverUrl: nullify(data.coverUrl),
      spotifyUrl: nullify(data.spotifyUrl),
      published: nullify(data.published),
      description: nullify(data.description),
      spotifyPlaylistId: nullify(data.spotifyPlaylistId),
      trackCount: nullify(data.trackCount),
      createdAt: new Date(),
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: string, update: Partial<Playlist>): Promise<Playlist> {
    const existing = this.playlists.get(id);
    if (!existing) throw new Error("Playlist not found");
    const updated = { ...existing, ...update };
    this.playlists.set(id, updated);
    return updated;
  }

  async deletePlaylist(id: string): Promise<void> {
    this.playlists.delete(id);
  }

  // Videos
  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(data: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = {
      id,
      title: data.title,
      slug: data.slug,
      featured: nullify(data.featured),
      artistId: nullify(data.artistId),
      artistName: nullify(data.artistName),
      published: nullify(data.published),
      description: nullify(data.description),
      thumbnailUrl: nullify(data.thumbnailUrl),
      videoUrl: nullify(data.videoUrl),
      youtubeId: nullify(data.youtubeId),
      duration: nullify(data.duration),
      category: nullify(data.category),
      vimeoId: nullify(data.vimeoId),
      createdAt: new Date(),
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: string, update: Partial<Video>): Promise<Video> {
    const existing = this.videos.get(id);
    if (!existing) throw new Error("Video not found");
    const updated = { ...existing, ...update };
    this.videos.set(id, updated);
    return updated;
  }

  async deleteVideo(id: string): Promise<void> {
    this.videos.delete(id);
  }
}

export const storage = new MemStorage();