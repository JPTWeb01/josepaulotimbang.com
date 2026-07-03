import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/ui/AnimateIn";
import { GitHubIcon } from "@/components/ui/BrandIcons";

const projects: Record<string, {
  title: string;
  excerpt: string;
  description: string;
  tech: string[];
  features: string[];
  challenges: string;
  solutions: string;
  lessons: string;
  github: string | null;
  live: string | null;
  status: string;
}> = {
  pamangan: {
    title: "pamangan.com",
    excerpt: "AI-powered Filipino recipe platform",
    status: "Live",
    description:
      "pamangan.com is a full-stack AI-powered recipe platform celebrating Filipino cuisine and global flavors. Users can discover recipes, generate new ones via AI, build grocery lists from multiple recipes, get per-serving nutrition estimates, and plan meals for the week. The platform uses a database-first search strategy to minimise unnecessary API calls.",
    tech: ["React 18", "Flask", "Python", "MongoDB Atlas", "Gemini 1.5 Flash", "Groq", "PyMongo", "Bootstrap 5", "Hugging Face Spaces", "Hostinger"],
    features: [
      "AI recipe generation using Gemini 1.5 Flash (primary) and Groq llama-3.3-70b (fallback)",
      "Database-first search — MongoDB text index checked before any AI API call",
      "AI grocery list generation from multiple selected recipes",
      "AI nutritional breakdown per serving with macro estimates",
      "Cultural and historical background for any dish",
      "Weekly meal planner saved to localStorage",
      "Admin dashboard with JWT authentication and recipe CRUD",
      "Pexels image integration and ImgBB upload for recipe photos",
    ],
    challenges:
      "Coordinating two AI providers with silent fallback so users never see an error. Also ensuring the database-first search was fast enough to avoid unnecessary API calls on every keystroke.",
    solutions:
      "Built a service layer that tries Gemini, catches any failure silently, and immediately retries with Groq. MongoDB text indexes on recipe name, cuisine, and tags made DB lookups fast enough to always run first.",
    lessons:
      "AI reliability is not guaranteed — always design for graceful fallback. MongoDB text indexes are powerful but require careful field selection. Separating AI logic into a service class makes it trivially swappable.",
    github: "https://github.com/JPTWeb01/pamangan.com",
    live: "https://pamangan.com",
  },
  devquiz: {
    title: "DevQuiz",
    excerpt: "AI-powered developer quiz platform with weekly scheduling",
    status: "Live",
    description:
      "DevQuiz is a developer quiz platform where questions are generated weekly by AI so the content never goes stale. It covers JavaScript, TypeScript, React, Python, PHP, and more. An admin panel lets me control question categories, scheduling, and review AI output before publishing.",
    tech: ["React", "FastAPI", "Python", "AI Generation", "Admin Panel"],
    features: [
      "AI-generated quiz questions refreshed on a weekly schedule",
      "Categories across JavaScript, TypeScript, React, Python, PHP, and more",
      "Real-time score tracking with a countdown timer",
      "Admin panel for question review, editing, and scheduling",
      "Leaderboard tracking top scores across sessions",
      "Responsive design for both mobile and desktop",
    ],
    challenges:
      "AI-generated questions occasionally had ambiguous wording or incorrect answers that slipped through. Also needed a fair timer system consistent across devices.",
    solutions:
      "Added an admin review queue so all AI output is checked before publishing. Server-side timestamps are used for quiz start/end times rather than client-side timers.",
    lessons:
      "AI content generation still needs a human review step in production. Server-authoritative timing is essential for any competitive feature — never trust the client clock.",
    github: "https://github.com/JPTWeb01/devquiz",
    live: "https://devquiz.josepaulotimbang.com",
  },
  "paulo-ai-chatbot": {
    title: "Paulo AI Resume Chatbot",
    excerpt: "AI chatbot that answers recruiter questions about my background",
    status: "Live",
    description:
      "An AI-powered resume chatbot built with Python and Flask, using the Google Gemini API. It is embedded directly into WordPress as a custom plugin so recruiters visiting josepaulotimbang.com can get instant answers about my skills, projects, and experience without having to scroll through a static page. The backend runs on Render.com.",
    tech: ["Python", "Flask", "Gemini API", "WordPress", "JavaScript", "CSS", "Render.com"],
    features: [
      "Answers recruiter questions about skills, projects, and work history",
      "Custom system prompt trained on my complete portfolio and resume",
      "Embedded into WordPress via a custom plugin with no page reload",
      "Streamed responses for a fast, natural chat feel",
      "Clean chat UI built with vanilla JS and CSS to keep the plugin lightweight",
    ],
    challenges:
      "Keeping the chatbot on-topic — without guardrails, Gemini would happily answer unrelated questions and drift off-brand.",
    solutions:
      "Built a tight system prompt that defines the chatbot's persona, scope, and fallback response for out-of-scope questions. Tested with adversarial inputs before going live.",
    lessons:
      "System prompt engineering is as important as the model choice. A well-scoped prompt produces a focused, professional assistant. A loose one produces a general chatbot that doesn't serve the use case.",
    github: "https://github.com/JPTWeb01/paulo-ai-chatbot",
    live: null,
  },
  "ai-blog-generator": {
    title: "AI Blog Generator",
    excerpt: "WordPress plugin that autonomously generates and publishes blog posts via Groq",
    status: "Live",
    description:
      "A WordPress plugin that uses the Groq API (llama-3.3-70b) to autonomously generate and publish blog posts on a schedule. The plugin admin UI is built with React 18 and Webpack and lets you configure topics, post frequency, tone, and category. WP-Cron handles scheduling, and a GitHub Actions workflow automates deployment.",
    tech: ["PHP 8.0+", "React 18", "Webpack", "Groq API", "llama-3.3-70b", "WP REST API", "WP-Cron", "GitHub Actions"],
    features: [
      "Autonomous blog post generation using Groq llama-3.3-70b",
      "Configurable topics, post frequency, tone, and WordPress category",
      "React 18 admin UI bundled with Webpack and loaded via WP REST API",
      "WP-Cron scheduling for fully hands-off automated publishing",
      "GitHub Actions workflow for one-command plugin deployment",
      "Draft mode option to review posts before they go live",
    ],
    challenges:
      "Integrating a modern React build pipeline inside the WordPress plugin ecosystem without conflicts with the WordPress admin JS environment.",
    solutions:
      "Used Webpack with a custom config to scope all React code under a unique namespace, preventing collisions with WordPress core scripts and other plugins.",
    lessons:
      "WordPress plugin development and modern JS tooling can coexist cleanly if namespacing and asset enqueuing are handled deliberately from the start.",
    github: "https://github.com/JPTWeb01/ai-blog-generator",
    live: null,
  },
  pawfurrytail: {
    title: "Pawfurrytail.com",
    excerpt: "WooCommerce e-commerce store for pet products",
    status: "Live",
    description:
      "A full-stack WooCommerce e-commerce store for a pet products brand. Built with a custom WordPress theme, product catalogue management, and SEO optimisation including structured data, sitemap, and page speed improvements. The store went from a blank WordPress install to a live, indexed site.",
    tech: ["WordPress", "WooCommerce", "PHP", "JavaScript", "CSS", "SEO"],
    features: [
      "Custom WordPress theme matched to brand identity",
      "WooCommerce product catalogue with categories and filters",
      "SEO optimisation — structured data, XML sitemap, meta tags",
      "Page speed improvements: image compression, lazy loading, caching",
      "Mobile-first responsive design",
    ],
    challenges:
      "Achieving good Core Web Vitals scores on a shared Hostinger hosting plan with WooCommerce's heavy JS/CSS footprint.",
    solutions:
      "Dequeued unused WooCommerce scripts on non-shop pages, implemented lazy loading for product images, and used a caching plugin tuned for WooCommerce.",
    lessons:
      "WooCommerce ships a lot of JS/CSS that is not always needed. Selective dequeuing per page type makes a measurable difference on performance scores without breaking functionality.",
    github: null,
    live: "https://pawfurrytail.com",
  },
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.excerpt };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  const statusStyles: Record<string, string> = {
    Live: "bg-success/10 text-success border border-success/20",
    "In Progress": "bg-primary/10 text-primary border border-primary/20",
    Completed: "bg-card text-muted border border-border",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <AnimateIn>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          All projects
        </Link>
      </AnimateIn>

      {/* Header */}
      <AnimateIn delay={0.05}>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              {project.title}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${statusStyles[project.status]}`}>
              {project.status}
            </span>
          </div>
          <p className="text-xl text-muted">{project.excerpt}</p>
        </div>
      </AnimateIn>

      {/* Links */}
      <AnimateIn delay={0.08}>
        <div className="flex flex-wrap gap-3 mb-12">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted rounded-lg text-sm font-medium hover:text-foreground hover:border-primary/50 hover:bg-card transition-colors"
            >
              <GitHubIcon size={15} />
              View on GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </AnimateIn>

      {/* Tech stack */}
      <AnimateIn delay={0.1}>
        <div className="mb-10 pb-10 border-b border-border">
          <h2 className="text-xs font-mono text-subtle uppercase tracking-widest mb-4">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Badge key={t} variant="primary">{t}</Badge>
            ))}
          </div>
        </div>
      </AnimateIn>

      {/* Overview */}
      <AnimateIn delay={0.12}>
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-muted leading-relaxed text-[15px]">{project.description}</p>
        </div>
      </AnimateIn>

      {/* Features */}
      <AnimateIn delay={0.14}>
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-5">Key Features</h2>
          <ul className="space-y-3">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                <CheckCircle size={15} className="text-success shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </AnimateIn>

      {/* Challenge + Solution */}
      <AnimateIn delay={0.16}>
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xs font-mono text-subtle uppercase tracking-widest mb-3">
              Challenge
            </h3>
            <p className="text-sm text-muted leading-relaxed">{project.challenges}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xs font-mono text-subtle uppercase tracking-widest mb-3">
              Solution
            </h3>
            <p className="text-sm text-muted leading-relaxed">{project.solutions}</p>
          </div>
        </div>
      </AnimateIn>

      {/* Lessons */}
      <AnimateIn delay={0.18}>
        <div className="bg-surface border border-border rounded-xl p-6 mb-12">
          <h3 className="text-xs font-mono text-subtle uppercase tracking-widest mb-3">
            Lessons Learned
          </h3>
          <p className="text-sm text-muted leading-relaxed">{project.lessons}</p>
        </div>
      </AnimateIn>

      {/* Nav to other projects */}
      <AnimateIn delay={0.2}>
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <Link href="/projects" className="text-sm text-muted hover:text-foreground transition-colors">
            ← All projects
          </Link>
          <Link href="/contact" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            Work together →
          </Link>
        </div>
      </AnimateIn>
    </div>
  );
}
