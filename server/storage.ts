import { eq, desc, sql, and, lte, gte } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  adminUsers,
  loginAttempts,
  releases,
  events,
  posts,
  contacts,
  artists,
  radioShows,
  playlists,
  videos,
  radioSettings,
  radioAssets,
  radioSchedule,
  type User,
  type InsertUser,
  type AdminUser,
  type InsertAdminUser,
  type InsertLoginAttempt,
  type LoginAttempt,
  type Release,
  type InsertRelease,
  type Event,
  type InsertEvent,
  type Post,
  type InsertPost,
  type Contact,
  type InsertContact,
  type Artist,
  type InsertArtist,
  type RadioShow,
  type InsertRadioShow,
  type Playlist,
  type InsertPlaylist,
  type Video,
  type InsertVideo,
  type RadioSettings,
  type InsertRadioSettings,
  type RadioAsset,
  type InsertRadioAsset,
  type RadioScheduleItem,
  type InsertRadioSchedule,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(username: string): Promise<void>;

  recordLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt>;
  getRecentLoginAttempts(username: string, minutes: number): Promise<LoginAttempt[]>;

  getAllReleases(): Promise<Release[]>;
  getReleaseById(id: string): Promise<Release | undefined>;
  createRelease(release: InsertRelease): Promise<Release>;
  updateRelease(id: string, release: Partial<Release>): Promise<Release>;
  deleteRelease(id: string): Promise<void>;

  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;

  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;

  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<Contact>): Promise<Contact>;
  deleteContact(id: string): Promise<void>;

  getAllArtists(): Promise<Artist[]>;
  getArtistById(id: string): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: string, artist: Partial<Artist>): Promise<Artist>;
  deleteArtist(id: string): Promise<void>;

  getAllRadioShows(): Promise<RadioShow[]>;
  getRadioShowById(id: string): Promise<RadioShow | undefined>;
  createRadioShow(show: InsertRadioShow): Promise<RadioShow>;
  updateRadioShow(id: string, show: Partial<RadioShow>): Promise<RadioShow>;
  deleteRadioShow(id: string): Promise<void>;

  getAllPlaylists(): Promise<Playlist[]>;
  getPlaylistById(id: string): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, playlist: Partial<Playlist>): Promise<Playlist>;
  deletePlaylist(id: string): Promise<void>;

  getAllVideos(): Promise<Video[]>;
  getVideoById(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<Video>): Promise<Video>;
  deleteVideo(id: string): Promise<void>;

  getRadioSettings(): Promise<RadioSettings | undefined>;
  updateRadioSettings(settings: Partial<InsertRadioSettings>): Promise<RadioSettings>;

  getAllRadioAssets(): Promise<RadioAsset[]>;
  getRadioAssetById(id: string): Promise<RadioAsset | undefined>;
  createRadioAsset(asset: InsertRadioAsset): Promise<RadioAsset>;
  updateRadioAsset(id: string, asset: Partial<RadioAsset>): Promise<RadioAsset>;
  deleteRadioAsset(id: string): Promise<void>;

  getAllRadioSchedule(): Promise<RadioScheduleItem[]>;
  getRadioScheduleById(id: string): Promise<RadioScheduleItem | undefined>;
  getCurrentScheduledItem(): Promise<RadioScheduleItem | undefined>;
  createRadioSchedule(schedule: InsertRadioSchedule): Promise<RadioScheduleItem>;
  updateRadioSchedule(id: string, schedule: Partial<RadioScheduleItem>): Promise<RadioScheduleItem>;
  deleteRadioSchedule(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  async updateAdminLastLogin(username: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(adminUsers.username, username));
  }

  async recordLoginAttempt(insertAttempt: InsertLoginAttempt): Promise<LoginAttempt> {
    const [attempt] = await db.insert(loginAttempts).values(insertAttempt).returning();
    return attempt;
  }

  async getRecentLoginAttempts(username: string, minutes: number): Promise<LoginAttempt[]> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return await db
      .select()
      .from(loginAttempts)
      .where(
        sql`${loginAttempts.username} = ${username} AND ${loginAttempts.attemptedAt} >= ${cutoffTime}`
      );
  }

  async getAllReleases(): Promise<Release[]> {
    return await db.select().from(releases).orderBy(desc(releases.createdAt));
  }

  async getReleaseById(id: string): Promise<Release | undefined> {
    const [release] = await db.select().from(releases).where(eq(releases.id, id));
    return release || undefined;
  }

  async createRelease(release: InsertRelease): Promise<Release> {
    const [newRelease] = await db.insert(releases).values(release).returning();
    return newRelease;
  }

  async updateRelease(id: string, update: Partial<Release>): Promise<Release> {
    const [updated] = await db
      .update(releases)
      .set(update)
      .where(eq(releases.id, id))
      .returning();
    if (!updated) throw new Error("Release not found");
    return updated;
  }

  async deleteRelease(id: string): Promise<void> {
    await db.delete(releases).where(eq(releases.id, id));
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: string, update: Partial<Event>): Promise<Event> {
    const [updated] = await db
      .update(events)
      .set(update)
      .where(eq(events.id, id))
      .returning();
    if (!updated) throw new Error("Event not found");
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, update: Partial<Post>): Promise<Post> {
    const [updated] = await db
      .update(posts)
      .set(update)
      .where(eq(posts.id, id))
      .returning();
    if (!updated) throw new Error("Post not found");
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async updateContact(id: string, update: Partial<Contact>): Promise<Contact> {
    const [updated] = await db
      .update(contacts)
      .set(update)
      .where(eq(contacts.id, id))
      .returning();
    if (!updated) throw new Error("Contact not found");
    return updated;
  }

  async deleteContact(id: string): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(desc(artists.createdAt));
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist || undefined;
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const [newArtist] = await db.insert(artists).values(artist as any).returning();
    return newArtist;
  }

  async updateArtist(id: string, update: Partial<Artist>): Promise<Artist> {
    const [updated] = await db
      .update(artists)
      .set(update)
      .where(eq(artists.id, id))
      .returning();
    if (!updated) throw new Error("Artist not found");
    return updated;
  }

  async deleteArtist(id: string): Promise<void> {
    await db.delete(artists).where(eq(artists.id, id));
  }

  async getAllRadioShows(): Promise<RadioShow[]> {
    return await db.select().from(radioShows).orderBy(desc(radioShows.createdAt));
  }

  async getRadioShowById(id: string): Promise<RadioShow | undefined> {
    const [show] = await db.select().from(radioShows).where(eq(radioShows.id, id));
    return show || undefined;
  }

  async createRadioShow(show: InsertRadioShow): Promise<RadioShow> {
    const [newShow] = await db.insert(radioShows).values(show).returning();
    return newShow;
  }

  async updateRadioShow(id: string, update: Partial<RadioShow>): Promise<RadioShow> {
    const [updated] = await db
      .update(radioShows)
      .set(update)
      .where(eq(radioShows.id, id))
      .returning();
    if (!updated) throw new Error("Radio show not found");
    return updated;
  }

  async deleteRadioShow(id: string): Promise<void> {
    await db.delete(radioShows).where(eq(radioShows.id, id));
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return await db.select().from(playlists).orderBy(desc(playlists.createdAt));
  }

  async getPlaylistById(id: string): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist || undefined;
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db.insert(playlists).values(playlist).returning();
    return newPlaylist;
  }

  async updatePlaylist(id: string, update: Partial<Playlist>): Promise<Playlist> {
    const [updated] = await db
      .update(playlists)
      .set(update)
      .where(eq(playlists.id, id))
      .returning();
    if (!updated) throw new Error("Playlist not found");
    return updated;
  }

  async deletePlaylist(id: string): Promise<void> {
    await db.delete(playlists).where(eq(playlists.id, id));
  }

  async getAllVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideo(id: string, update: Partial<Video>): Promise<Video> {
    const [updated] = await db
      .update(videos)
      .set(update)
      .where(eq(videos.id, id))
      .returning();
    if (!updated) throw new Error("Video not found");
    return updated;
  }

  async deleteVideo(id: string): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  async getRadioSettings(): Promise<RadioSettings | undefined> {
    const [settings] = await db.select().from(radioSettings).limit(1);
    return settings || undefined;
  }

  async updateRadioSettings(update: Partial<InsertRadioSettings>): Promise<RadioSettings> {
    const existing = await this.getRadioSettings();
    if (existing) {
      const [updated] = await db
        .update(radioSettings)
        .set({ ...update, updatedAt: new Date() })
        .where(eq(radioSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newSettings] = await db
        .insert(radioSettings)
        .values(update as InsertRadioSettings)
        .returning();
      return newSettings;
    }
  }

  async getAllRadioAssets(): Promise<RadioAsset[]> {
    return await db.select().from(radioAssets).orderBy(desc(radioAssets.createdAt));
  }

  async getRadioAssetById(id: string): Promise<RadioAsset | undefined> {
    const [asset] = await db.select().from(radioAssets).where(eq(radioAssets.id, id));
    return asset || undefined;
  }

  async createRadioAsset(asset: InsertRadioAsset): Promise<RadioAsset> {
    const [newAsset] = await db.insert(radioAssets).values(asset).returning();
    return newAsset;
  }

  async updateRadioAsset(id: string, update: Partial<RadioAsset>): Promise<RadioAsset> {
    const [updated] = await db
      .update(radioAssets)
      .set(update)
      .where(eq(radioAssets.id, id))
      .returning();
    if (!updated) throw new Error("Radio asset not found");
    return updated;
  }

  async deleteRadioAsset(id: string): Promise<void> {
    await db.delete(radioAssets).where(eq(radioAssets.id, id));
  }

  async getAllRadioSchedule(): Promise<RadioScheduleItem[]> {
    return await db.select().from(radioSchedule).orderBy(desc(radioSchedule.scheduledStart));
  }

  async getRadioScheduleById(id: string): Promise<RadioScheduleItem | undefined> {
    const [schedule] = await db.select().from(radioSchedule).where(eq(radioSchedule.id, id));
    return schedule || undefined;
  }

  async getCurrentScheduledItem(): Promise<RadioScheduleItem | undefined> {
    const now = new Date();
    const [current] = await db
      .select()
      .from(radioSchedule)
      .where(
        and(
          lte(radioSchedule.scheduledStart, now),
          gte(radioSchedule.scheduledEnd, now)
        )
      )
      .orderBy(desc(radioSchedule.scheduledStart))
      .limit(1);
    return current || undefined;
  }

  async createRadioSchedule(schedule: InsertRadioSchedule): Promise<RadioScheduleItem> {
    const [newSchedule] = await db.insert(radioSchedule).values(schedule).returning();
    return newSchedule;
  }

  async updateRadioSchedule(id: string, update: Partial<RadioScheduleItem>): Promise<RadioScheduleItem> {
    const [updated] = await db
      .update(radioSchedule)
      .set(update)
      .where(eq(radioSchedule.id, id))
      .returning();
    if (!updated) throw new Error("Radio schedule not found");
    return updated;
  }

  async deleteRadioSchedule(id: string): Promise<void> {
    await db.delete(radioSchedule).where(eq(radioSchedule.id, id));
  }
}

export const storage = new DatabaseStorage();
