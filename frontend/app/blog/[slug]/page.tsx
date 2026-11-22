import type { Metadata } from "next";
import { absoluteUrl, OG_IMAGE, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { marked } from "marked";
import Badge from "@/components/ui/Badge";
import { blogPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return pageMetadata({
    title: post.title,
    socialTitle: post.title,
    description: post.meta_description ?? post.excerpt,
    path: `/blog/${post.slug}`,
    article: { publishedTime: post.published_at, tags: post.tags },
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const html = await marked(post.content, { async: false }) as string;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description ?? post.excerpt,
    datePublished: post.published_at,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: SITE_URL + OG_IMAGE.url,
    keywords: post.tags.join(", "),
    articleSection: post.categories,
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL + "/" },
    publisher: { "@type": "Person", name: SITE_NAME, url: SITE_URL + "/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-5">
          {post.categories.map((cat) => (
            <Badge key={cat} variant="primary">
              {cat}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-subtle pb-8 border-b border-border">
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} />
            {post.read_time} min read
          </span>
          <span>Jose Paulo Timbang</span>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-xs font-mono text-subtle uppercase tracking-widest mb-3">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-base font-semibold text-foreground mb-5">
            Related posts
          </h2>
          <div className="space-y-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group flex items-start gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors"
              >
                <ArrowLeft
                  size={14}
                  className="text-subtle group-hover:text-primary transition-colors mt-0.5 rotate-180 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {r.title}
                  </p>
                  <p className="text-xs text-subtle mt-0.5">
                    {r.read_time} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author card */}
      <div className="mt-12 p-6 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            JP
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Jose Paulo Timbang
            </p>
            <p className="text-xs text-muted">
              Full Stack Developer &amp; AI Engineer
            </p>
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Self-taught developer from the Philippines. Building web applications
          and AI-powered tools.{" "}
          <Link href="/about" className="text-primary hover:underline">
            Learn more →
          </Link>
        </p>
      </div>
    </div>
  );
}
