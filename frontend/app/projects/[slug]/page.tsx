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
  github: string;
  live: string | null;
  status: string;
}> = {
  pamangan: {
    title: "pamangan.com",
    excerpt: "AI-powered Filipino recipe platform",
    status: "Live",
    description:
      "pamangan.com is a full-stack AI-powered recipe platform celebrating Filipino cuisine and global flavors. Users can search recipes, generate new ones via AI, create grocery lists, get nutrition estimates, and plan meals for the week.",
    tech: ["React 18", "Flask", "Python", "MongoDB Atlas", "Google Gemini", "Groq", "Bootstrap 5", "Koyeb", "Hostinger"],
    features: [
      "AI recipe generation using Google Gemini (primary) and Groq llama-3.1-8b (fallback)",
      "Database-first search — MongoDB text index checked before any AI API call",
      "AI grocery list generation from multiple selected recipes",
      "AI nutritional breakdown per serving",
      "Cultural and historical background for any dish",
      "Weekly meal planner saved to localStorage",
      "Admin dashboard with JWT authentication",
      "Recipe CRUD with Pexels image integration and ImgBB upload",
    ],
    challenges:
      "Coordinating two AI providers with silent fallback so users never see an error. Also ensuring the database-first search was fast enough to avoid unnecessary API calls on every keystroke.",
    solutions:
      "Built a service layer that tries Gemini, catches any failure silently, and immediately retries with Groq. MongoDB text indexes on recipe name, cuisine, and tags made DB lookups fast enough to always run first.",
    lessons:
      "AI reliability is not guaranteed — always design for graceful fallback. MongoDB text indexes are powerful but require careful field selection. Separating AI logic into a service class makes it trivially swappable.",
    github: "https://github.com/josepaulotimbang/pamangan.com",
    live: "https://pamangan.com",
  },
  devquiz: {
    title: "DevQuiz",
    excerpt: "Interactive developer quiz platform",
    status: "In Progress",
    description:
      "DevQuiz is an interactive platform for developers to test their knowledge across different programming topics. It features categorized questions, real-time scoring, a countdown timer, and a leaderboard.",
    tech: ["React", "Node.js", "Express", "MySQL"],
    features: [
      "Categorized quiz questions across JavaScript, Python, PHP, and more",
      "Real-time score tracking with a countdown timer",
      "Leaderboard tracking top scores across sessions",
      "Responsive design for both mobile and desktop",
    ],
    challenges:
      "Building a fair timer system consistent across devices and network conditions.",
    solutions:
      "Used server-side timestamps for quiz start and end times rather than client-side timers.",
    lessons:
      "Server-authoritative timing is essential for any competitive feature. Always validate scores server-side, never trust the client.",
    github: "https://github.com/josepaulotimbang/devquiz",
    live: null,
  },
  "paulo-ai-chatbot": {
    title: "Paulo AI Chatbot",
    excerpt: "Conversational AI chatbot with streaming",
    status: "Completed",
    description:
      "A conversational AI chatbot with a custom React UI, real-time streaming responses via Server-Sent Events, Markdown rendering for AI responses, and persistent conversation history.",
    tech: ["React", "Python", "FastAPI", "OpenAI API"],
    features: [
      "Real-time streaming token-by-token responses via Server-Sent Events",
      "Persistent conversation history across browser sessions",
      "Markdown rendering for AI responses including code blocks",
      "Custom React chat UI with typing indicators",
    ],
    challenges:
      "Displaying streamed text in React without causing excessive re-renders on every token.",
    solutions:
      "Used a ref-based streaming buffer for intermediate state with batched setState updates to render tokens smoothly without thrashing React.",
    lessons:
      "Refs for intermediate streaming state + state for final renders is the correct pattern. Never setState on every incoming character.",
    github: "https://github.com/josepaulotimbang/paulo-ai-chatbot",
    live: null,
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
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted rounded-lg text-sm font-medium hover:text-foreground hover:border-primary/50 hover:bg-card transition-colors"
          >
            <GitHubIcon size={15} />
            View on GitHub
          </a>
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
