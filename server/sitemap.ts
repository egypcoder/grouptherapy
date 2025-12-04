
import { storage } from "./storage";

export async function generateSitemap(): Promise<string> {
  const baseUrl = "https://grouptherapy.com";
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/releases", priority: "0.9", changefreq: "daily" },
    { url: "/artists", priority: "0.9", changefreq: "weekly" },
    { url: "/events", priority: "0.9", changefreq: "weekly" },
    { url: "/radio", priority: "0.8", changefreq: "daily" },
    { url: "/videos", priority: "0.7", changefreq: "weekly" },
    { url: "/news", priority: "0.8", changefreq: "daily" },
    { url: "/about", priority: "0.6", changefreq: "monthly" },
    { url: "/contact", priority: "0.6", changefreq: "monthly" },
    { url: "/press", priority: "0.5", changefreq: "monthly" },
  ];

  // Fetch dynamic content
  const releases = await storage.getAllReleases();
  const artists = await storage.getAllArtists();
  const events = await storage.getAllEvents();
  const posts = await storage.getAllPosts();

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  staticPages.forEach((page) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add releases
  releases.forEach((release) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/releases/${release.slug || release.id}</loc>\n`;
    sitemap += `    <lastmod>${release.releaseDate?.toISOString() || currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add artists
  artists.forEach((artist) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/artists/${artist.slug || artist.id}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add events
  events.forEach((event) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/events/${event.slug || event.id}</loc>\n`;
    sitemap += `    <lastmod>${event.date?.toISOString() || currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add blog posts
  posts.forEach((post) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/news/${post.slug || post.id}</loc>\n`;
    sitemap += `    <lastmod>${post.publishedAt?.toISOString() || currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.6</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += "</urlset>";

  return sitemap;
}
