
import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "music.song" | "music.album" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object;
}

export function SEOHead({
  title = "GroupTherapy Records - Electronic Music Label",
  description = "The sound of tomorrow, today. Discover cutting-edge electronic music from the world's most innovative artists. Releases, events, radio, and more.",
  keywords = ["electronic music", "record label", "house music", "techno", "DJ", "music events", "music releases", "independent label"],
  image = "https://grouptherapy.com/og-image.jpg",
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl,
  noindex = false,
  structuredData,
}: SEOProps) {
  const [location] = useLocation();
  const fullUrl = `https://grouptherapy.com${location}`;
  const canonical = canonicalUrl || fullUrl;

  useEffect(() => {
    // Set document title
    document.title = title;

    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords.join(", "));
    
    // Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:url", fullUrl, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:site_name", "GroupTherapy Records", "property");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

    // Additional SEO tags
    if (author) updateMetaTag("author", author);
    if (publishedTime) updateMetaTag("article:published_time", publishedTime, "property");
    if (modifiedTime) updateMetaTag("article:modified_time", modifiedTime, "property");

    // Canonical URL
    updateLinkTag("canonical", canonical);

    // Robots meta
    if (noindex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

    // Structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [title, description, keywords, image, fullUrl, type, author, publishedTime, modifiedTime, canonical, noindex, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: string = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.href = href;
}

function updateStructuredData(data: object) {
  const id = "structured-data";
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function generateStructuredData(type: string, data: any) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
  return baseData;
}
