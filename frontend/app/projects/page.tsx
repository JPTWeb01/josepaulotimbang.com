import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/ui/AnimateIn";
import { GitHubIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Jose Paulo Timbang — web applications, AI tools, and full-stack systems.",
};

const projects = [
  {
    slug: "pamangan",
    title: "pamangan.com",
    excerpt:
      "AI-powered Filipino recipe platform with recipe discovery, AI generation, grocery lists, nutrition analysis, and an admin dashboard.",
    tech: ["React 18", "Flask", "Python", "MongoDB Atlas", "Gemini 1.5 Flash", "Groq", "Koyeb"],
    github: "https://github.com/JPTWeb01/pamangan.com",
    live: "https://pamangan.com",
    status: "Live" as const,
  },
  {
    slug: "devquiz",
    title: "DevQuiz",
    excerpt:
      "Developer quiz platform with AI-generated questions, weekly scheduling, real-time scoring, and an admin panel.",
    tech: ["React", "FastAPI", "Python", "AI Generation"],
    github: "https://github.com/JPTWeb01/devquiz",
    live: "https://devquiz.josepaulotimbang.com",
    status: "Live" as const,
  },
  {
    slug: "paulo-ai-chatbot",
    title: "Paulo AI Resume Chatbot",
    excerpt:
      "AI-powered resume chatbot built with Python and Flask — answers recruiter questions about my background, embedded into WordPress as a plugin.",
    tech: ["Python", "Flask", "Gemini API", "WordPress", "JavaScript", "Render.com"],
    github: "https://github.com/JPTWeb01/paulo-ai-chatbot",
    live: null,
    status: "Live" as const,
  },
  {
    slug: "ai-blog-generator",
    title: "AI Blog Generator",
    excerpt:
      "WordPress plugin that autonomously generates and publishes AI-powered blog posts using the Groq API on a scheduled WP-Cron job.",
    tech: ["PHP 8", "React 18", "Webpack", "Groq API", "WP REST API", "WP-Cron", "GitHub Actions"],
    github: "https://github.com/JPTWeb01/ai-blog-generator",
    live: null,
    status: "Live" as const,
  },
  {
    slug: "pawfurrytail",
    title: "Pawfurrytail.com",
    excerpt:
      "Full-stack WooCommerce e-commerce store for pet products with custom theming, product management, and SEO optimisation.",
    tech: ["WordPress", "WooCommerce", "PHP", "JavaScript", "SEO"],
    github: null,
    live: "https://pawfurrytail.com",
    status: "Live" as const,
  },
];

const statusStyles: Record<string, string> = {
  Live: "bg-success/10 text-success border border-success/20",
  "In Progress": "bg-primary/10 text-primary border border-primary/20",
  Completed: "bg-card text-muted border border-border",
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <AnimateIn>
        <div className="mb-16">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
            Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Projects
          </h1>
          <p className="text-muted max-w-xl leading-relaxed text-[15px]">
            Things I&apos;ve built — from AI-powered platforms to full-stack web
            applications. Each one taught me something worth keeping.
          </p>
        </div>
      </AnimateIn>

      <div className="space-y-5">
        {projects.map((project, i) => (
          <AnimateIn key={project.slug} delay={i * 0.07}>
            <article className="group bg-card border border-border rounded-xl p-7 hover:border-primary/40 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-base font-semibold text-foreground group-hover:text-primary transition-colors"
                    >
                      {project.title}
                    </Link>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium shrink-0 ${statusStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
                    {project.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-4 shrink-0">
                  <div className="flex items-center gap-3">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={13} />
                        Live
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
                      >
                        <GitHubIcon size={13} />
                        Code
                      </a>
                    )}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </article>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
