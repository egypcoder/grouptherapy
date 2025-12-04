import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users/Admin table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("contributor"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users table for authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  email: text("email"),
  role: text("role").notNull().default("admin"), // admin, editor, contributor
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Login attempts tracking table
export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  ipAddress: text("ip_address"),
  successful: boolean("successful").notNull(),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

// Artists roster
export const artists = pgTable("artists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  spotifyArtistId: text("spotify_artist_id"),
  socialLinks: jsonb("social_links").$type<{
    instagram?: string;
    twitter?: string;
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
  }>(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Music releases
export const releases = pgTable("releases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  artistId: varchar("artist_id").references(() => artists.id),
  artistName: text("artist_name").notNull(),
  coverUrl: text("cover_url"),
  releaseDate: timestamp("release_date"),
  genres: text("genres").array(),
  spotifyAlbumId: text("spotify_album_id"),
  spotifyUrl: text("spotify_url"),
  appleMusicUrl: text("apple_music_url"),
  soundcloudUrl: text("soundcloud_url"),
  previewUrl: text("preview_url"),
  type: text("type").default("album"),
  featured: boolean("featured").default(false),
  featuredUntil: timestamp("featured_until"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  venue: text("venue").notNull(),
  address: text("address"),
  city: text("city").notNull(),
  country: text("country").notNull(),
  lat: text("lat"),
  lng: text("lng"),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  ticketUrl: text("ticket_url"),
  ticketPrice: text("ticket_price"),
  capacity: integer("capacity"),
  rsvpCount: integer("rsvp_count").default(0),
  artistIds: text("artist_ids").array(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts / News
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverUrl: text("cover_url"),
  category: text("category").default("news"),
  tags: text("tags").array(),
  authorId: varchar("author_id").references(() => users.id),
  authorName: text("author_name"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImageUrl: text("og_image_url"),
  publishedAt: timestamp("published_at"),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Radio shows
export const radioShows = pgTable("radio_shows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  hostName: text("host_name").notNull(),
  hostBio: text("host_bio"),
  hostImageUrl: text("host_image_url"),
  coverUrl: text("cover_url"),
  streamUrl: text("stream_url"),
  recordedUrl: text("recorded_url"),
  dayOfWeek: integer("day_of_week"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  timezone: text("timezone").default("UTC"),
  isLive: boolean("is_live").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Radio track history
export const radioTracks = pgTable("radio_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  showId: varchar("show_id").references(() => radioShows.id),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  coverUrl: text("cover_url"),
  playedAt: timestamp("played_at").defaultNow(),
});

// Playlists
export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  coverUrl: text("cover_url"),
  spotifyPlaylistId: text("spotify_playlist_id"),
  spotifyUrl: text("spotify_url"),
  trackCount: integer("track_count").default(0),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Videos
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  youtubeId: text("youtube_id"),
  vimeoId: text("vimeo_id"),
  artistId: varchar("artist_id").references(() => artists.id),
  artistName: text("artist_name"),
  duration: text("duration"),
  category: text("category").default("music-video"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team members
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  }>(),
  order: integer("order").default(0),
  published: boolean("published").default(true),
});

// Contact submissions
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  category: text("category").default("general"),
  attachmentUrl: text("attachment_url"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Press kit / Media assets
export const pressAssets = pgTable("press_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").default("logo"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Radio station settings
export const radioSettings = pgTable("radio_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stationName: text("station_name").default("GroupTherapy Radio"),
  streamUrl: text("stream_url"),
  fallbackStreamUrl: text("fallback_stream_url"),
  currentTrack: text("current_track"),
  currentArtist: text("current_artist"),
  currentCoverUrl: text("current_cover_url"),
  isLive: boolean("is_live").default(false),
  listenerCount: integer("listener_count").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertArtistSchema = createInsertSchema(artists).omit({ id: true, createdAt: true });
export const insertReleaseSchema = createInsertSchema(releases).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });
export const insertRadioShowSchema = createInsertSchema(radioShows).omit({ id: true, createdAt: true });
export const insertRadioTrackSchema = createInsertSchema(radioTracks).omit({ id: true });
export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true, createdAt: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true, status: true });
export const insertPressAssetSchema = createInsertSchema(pressAssets).omit({ id: true, createdAt: true });
export const insertRadioSettingsSchema = createInsertSchema(radioSettings).omit({ id: true, updatedAt: true });

// Admin user insert and select schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAdminUserSchema = createSelectSchema(adminUsers);
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Login attempt insert and select schemas
export const insertLoginAttemptSchema = createInsertSchema(loginAttempts).omit({ id: true, attemptedAt: true });
export const selectLoginAttemptSchema = createSelectSchema(loginAttempts);
export type InsertLoginAttempt = z.infer<typeof insertLoginAttemptSchema>;
export type LoginAttempt = typeof loginAttempts.$inferSelect;


// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export type InsertRelease = z.infer<typeof insertReleaseSchema>;
export type Release = typeof releases.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertRadioShow = z.infer<typeof insertRadioShowSchema>;
export type RadioShow = typeof radioShows.$inferSelect;

export type InsertRadioTrack = z.infer<typeof insertRadioTrackSchema>;
export type RadioTrack = typeof radioTracks.$inferSelect;

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertPressAsset = z.infer<typeof insertPressAssetSchema>;
export type PressAsset = typeof pressAssets.$inferSelect;

export type InsertRadioSettings = z.infer<typeof insertRadioSettingsSchema>;
export type RadioSettings = typeof radioSettings.$inferSelect;