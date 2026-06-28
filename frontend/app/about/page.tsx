import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Jose Paulo Timbang — Full Stack Developer and AI Engineer from the Philippines.",
};

const timeline = [
  {
    year: "2026",
    title: "Portfolio Rebuild",
    description:
      "Rebuilt personal portfolio from WordPress to a custom Next.js 16 + CodeIgniter 4 full-stack system. Documented the process as a live engineering case study.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PHP"],
    current: true,
  },
  {
    year: "2026",
    title: "pamangan.com — AI Recipe Platform",
    description:
      "Designed and deployed a full-stack AI recipe platform celebrating Filipino cuisine. Integrated Google Gemini and Groq APIs with automatic fallback. Built React frontend, Flask backend, MongoDB database, and admin dashboard.",
    tags: ["React", "Flask", "MongoDB", "Gemini AI", "Groq"],
  },
  {
    year: "2025",
    title: "DevQuiz — Developer Quiz Platform",
    description:
      "Built an interactive quiz platform for developers with categorized questions, real-time scoring, and a leaderboard. First full-stack project using Node.js and MySQL.",
    tags: ["React", "Node.js", "MySQL"],
  },
  {
    year: "2024",
    title: "Started AI Engineering",
    description:
      "Began studying AI Engineering and prompt engineering. Built the Paulo AI Chatbot using OpenAI's API — first experience with LLM integration, streaming responses, and conversational UI design.",
    tags: ["Python", "OpenAI API", "React"],
  },
  {
    year: "2023",
    title: "Freelance Full Stack Development",
    description:
      "Started taking freelance web development projects — primarily PHP/CodeIgniter backends with React frontends. Focused on building production-ready applications for local clients.",
    tags: ["PHP", "CodeIgniter", "React", "MySQL"],
  },
  {
    year: "2022",
    title: "Self-Taught Web Development",
    description:
      "Completed intensive self-study in web development. Built foundational skills in HTML, CSS, JavaScript, PHP, and MySQL by building real projects from scratch.",
    tags: ["HTML", "CSS", "JavaScript", "PHP"],
  },
  {
    year: "2020",
    title: "Computer Technician",
    description:
      "Started working as a computer technician — diagnosing hardware faults, performing repairs, OS installations, and software troubleshooting. Built a strong foundation in how computers actually work.",
    tags: ["Hardware", "Windows", "Networking"],
  },
];

const values = [
  {
    title: "Build to learn",
    body: "The fastest way to learn something is to build a project with it. Every side project is a deliberate experiment.",
  },
  {
    title: "Depth over breadth",
    body: "I'd rather understand one thing deeply than know ten things superficially. That depth is what makes real solutions possible.",
  },
  {
    title: "Ship and iterate",
    body: "Perfection is the enemy of done. Ship working software early, then improve based on real feedback.",
  },
  {
    title: "Write readable code",
    body: "Code is read far more than it's written. Clarity is more valuable than cleverness.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">

      {/* ─── Header ──────────────────────────────────────── */}
      <AnimateIn>
        <div className="mb-20">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
            About me
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 leading-tight">
            The person behind
            <br />
            <span className="text-muted/70">the code</span>
          </h1>

          <div className="grid sm:grid-cols-2 gap-6 text-[15px] text-muted leading-relaxed max-w-2xl">
            <p>
              I&apos;m Jose Paulo Timbang — a self-taught Full Stack Web
              Developer and Computer Technician from the Philippines. I
              specialize in building full-stack web applications using PHP,
              Python, React, and Next.js.
            </p>
            <p>
              I&apos;m actively transitioning into AI Engineering, integrating
              LLMs into production applications and learning how to build
              AI-powered tools that solve real problems.
            </p>
          </div>
        </div>
      </AnimateIn>

      {/* ─── What I do ───────────────────────────────────── */}
      <AnimateIn>
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            What I do
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: "◈",
                title: "Full Stack Development",
                body: "PHP/CodeIgniter backends, React/Next.js frontends, MySQL databases — built for production from day one.",
              },
              {
                icon: "◈",
                title: "AI Integration",
                body: "Integrating LLM APIs (Gemini, OpenAI, Groq) into web applications with fallback logic, caching, and prompt design.",
              },
              {
                icon: "◈",
                title: "Systems & Hardware",
                body: "PC diagnosis, repair, OS installation, and network troubleshooting. I understand the full stack — software and silicon.",
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <span className="text-primary text-lg block mb-3">{icon}</span>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>

      {/* ─── Career Timeline ─────────────────────────────── */}
      <AnimateIn>
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-12">
            Career Timeline
          </h2>
        </div>
      </AnimateIn>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />

        <div className="space-y-10">
          {timeline.map((item, i) => (
            <AnimateIn key={i} delay={i * 0.06}>
              <div className="pl-12 relative">
                {/* Dot */}
                <div
                  className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 transition-colors ${
                    item.current
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  }`}
                />

                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.current && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">
                          Current
                        </span>
                      )}
                      <span className="text-xs font-mono text-subtle">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>

      {/* ─── Values ──────────────────────────────────────── */}
      <AnimateIn>
        <div className="mt-24 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            How I work
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map(({ title, body }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <AnimateIn>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            See my projects <ArrowRight size={15} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-muted rounded-lg text-sm font-medium hover:text-foreground hover:border-primary/50 hover:bg-card transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </AnimateIn>
    </div>
  );
}
