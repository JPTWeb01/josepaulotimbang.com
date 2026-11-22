import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const projectSlugs = ["pamangan", "mycuddlycub", "devquiz", "paulo-ai-chatbot", "ai-blog-generator", "pawfurrytail"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: absoluteUrl(`/about`), lastModified: new Date(), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl(`/projects`), lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: absoluteUrl(`/skills`), lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: absoluteUrl(`/experience`), lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: absoluteUrl(`/resume`), lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl(`/blog`), lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: absoluteUrl(`/contact`), lastModified: new Date(), priority: 0.6, changeFrequency: "yearly" },
    { url: absoluteUrl(`/privacy`), lastModified: new Date(), priority: 0.3, changeFrequency: "yearly" },
  ];

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.published_at),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
