import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/ui/AnimateIn";
import { blogPosts, getAllCategories } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles by Jose Paulo Timbang on web development, AI engineering, and software craftsmanship.",
};

export default function BlogPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <AnimateIn>
        <div className="mb-16">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
            Writing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-muted max-w-xl leading-relaxed text-[15px]">
            Thoughts on web development, AI engineering, and the things I learn
            while building.
          </p>
        </div>
      </AnimateIn>

      {/* Categories */}
      <AnimateIn delay={0.05}>
        <div className="flex flex-wrap gap-2 mb-12">
          <span className="text-xs font-mono text-subtle uppercase tracking-widest self-center mr-2">
            Topics:
          </span>
          {categories.map((cat) => (
            <Badge key={cat} variant="default">
              {cat}
            </Badge>
          ))}
        </div>
      </AnimateIn>

      {/* Posts */}
      <div className="space-y-6">
        {blogPosts.map((post, i) => (
          <AnimateIn key={post.slug} delay={i * 0.07}>
            <article className="group bg-card border border-border rounded-xl p-7 hover:border-primary/40 transition-all duration-300">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-subtle mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {post.read_time} min read
                </span>
              </div>

              {/* Title */}
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                  {post.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-sm text-muted leading-relaxed mb-5">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {post.categories.map((cat) => (
                    <Badge key={cat} variant="primary">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Read article <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          </AnimateIn>
        ))}
      </div>

      {/* Tags cloud */}
      <AnimateIn delay={0.25}>
        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-xs font-mono text-subtle uppercase tracking-widest mb-4">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(blogPosts.flatMap((p) => p.tags)))
              .sort()
              .map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
