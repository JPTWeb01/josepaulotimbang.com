import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

export const dynamic = "force-static";

const BASE = "https://josepaulotimbang.com";

const projectSlugs = ["pamangan", "devquiz", "paulo-ai-chatbot", "ai-blog-generator", "pawfurrytail"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/about`, lastModified: new Date(), priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/projects`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/skills`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/experience`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/resume`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/blog`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/contact`, lastModified: new Date(), priority: 0.6, changeFrequency: "yearly" },
  ];

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE}/projects/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
