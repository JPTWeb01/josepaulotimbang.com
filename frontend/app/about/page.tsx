import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Jose Paulo Timbang — Full-Stack Developer with 8 years of experience building responsive websites, web apps, and AI-powered platforms. Based in Stittsville, ON, Canada.",
};

const timeline = [
  {
    year: "2026",
    title: "Portfolio Rebuild",
    description:
      "Rebuilt personal portfolio from WordPress to a custom Next.js 16 stack — React 19, TypeScript, and Tailwind CSS, with custom animations, deployed as a static export to Hostinger via GitHub Actions.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    current: true,
  },
  {
    year: "2026",
    title: "pamangan.com",
    description:
      "Shipped pamangan.com — a full-stack AI recipe platform using Google Gemini 2.0 Flash and Groq as fallback, with a React frontend, Flask REST API, MongoDB Atlas, and an admin dashboard.",
    tags: ["React", "Flask", "MongoDB", "Gemini AI", "Groq"],
  },
  {
    year: "2026",
    title: "DevQuiz",
    description:
      "Built DevQuiz — a quiz platform with AI-generated questions (Groq llama-3.3-70b), role-based access, JWT auth, and a React 18 / FastAPI stack.",
    tags: ["React", "FastAPI", "Python", "Groq"],
  },
  {
    year: "2026",
    title: "AI Blog Generator",
    description:
      "Shipped the AI Blog Generator, a WordPress plugin that autonomously writes and publishes posts using the Groq API via WP-Cron.",
    tags: ["PHP", "WordPress", "Groq"],
  },
  {
    year: "2026",
    title: "LLM Integration & Paulo AI Chatbot",
    description:
      "Went deep on LLM integration and prompt engineering. Built the Paulo AI Resume Chatbot — a Gemini-powered chat widget embedded in WordPress as a custom PHP plugin, with a Python/Flask backend deployed on Render.com.",
    tags: ["Python", "Flask", "Gemini API", "WordPress", "Render"],
  },
  {
    year: "2020–2022",
    title: "Owner / Computer Technician — Savvytech",
    description:
      "Founded and operated Savvytech Computer Services in Angeles City, Philippines. Built and repaired custom PCs, performed data recovery, implemented cybersecurity measures, and managed inventory, supplier relations, and client communications.",
    tags: ["Hardware", "Networking", "Business"],
  },
  {
    year: "2020–2022",
    title: "Marketing Assistant / Web Designer — Carolinas Dream Team",
    description:
      "Designed marketing materials and customised WordPress sites for a US-based real estate team. Managed automated Mailchimp campaigns, created social media graphics, and monitored site performance via Google Analytics.",
    tags: ["WordPress", "Mailchimp", "Google Analytics", "Figma"],
  },
  {
    year: "2018–2020",
    title: "Web Developer — Cyberbacker",
    description:
      "Developed and maintained responsive websites and custom internal management tools for a US-based remote staffing company. Integrated live chat, social media channels, and SEO strategies to increase engagement.",
    tags: ["PHP", "JavaScript", "HTML", "CSS", "SEO"],
  },
  {
    year: "2013–2017",
    title: "Freelance Web Developer",
    description:
      "Built WordPress sites and custom CodeIgniter applications for US-based clients — real estate agencies, design studios, and small businesses. Handled end-to-end delivery: design, development, SEO, and Google Analytics setup.",
    tags: ["WordPress", "CodeIgniter", "PHP", "HTML", "CSS", "SEO"],
  },
  {
    year: "2011",
    title: "B.S. Information Technology — AMA Computer College",
    description:
      "Graduated with a Bachelor of Science in Information Technology from AMA Computer College, Philippines. Built the foundation in computer science, networking, and software development.",
    tags: ["Philippines", "BSIT"],
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
    body: "From WordPress sites for US clients to full-stack AI platforms — eight years taught me that a live working product beats a perfect plan on paper. Ship early, learn from real users, then improve.",
  },
  {
    title: "Write readable code",
    body: "Code is read far more than it's written. Clarity is more valuable than cleverness.",
  },
  {
    title: "LLM-augmented development",
    body: "I use large language models as a core part of my workflow — not as a crutch, but as a force multiplier. LLMs help me research faster, debug smarter, generate boilerplate in seconds, and catch edge cases I might miss. The result is higher accuracy, faster delivery, and more mental bandwidth reserved for architecture and problem-solving that actually matters.",
  },
  {
    title: "Wired for the screen",
    body: "Sitting in front of a computer for hours solving hard problems isn't work to me — it's where I'm most alive. I have the patience to stay with a bug until it breaks, trace an issue through every layer, and not walk away until it's properly understood. Being genuinely computer-savvy means the machine is never the obstacle — I am always the one pushing it further.",
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
              I&apos;m Jose Paulo Timbang — a Full-Stack Developer with 8 years
              of experience building and deploying responsive websites, web
              applications, and AI-powered platforms. I&apos;m based in
              Stittsville, Ontario, Canada.
            </p>
            <p>
              I work across the full stack — React and TypeScript on the
              frontend, Python (Flask, FastAPI) and PHP on the backend — and
              integrate LLMs like Google Gemini and Groq into production
              applications with fallback logic, prompt engineering, and
              CI/CD-automated deployments.
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
                body: "End-to-end ownership from database to deployed UI — React/Next.js frontends, PHP and Python (Flask/FastAPI) backends, MySQL and MongoDB data layers. I ship production-ready features, not just prototypes.",
              },
              {
                icon: "◈",
                title: "AI Integration",
                body: "Building practical AI features that hold up in production — LLM integration (Gemini, OpenAI, Groq) with fallback logic, caching, and careful prompt design, not just an API call bolted on.",
              },
              {
                icon: "◈",
                title: "Systems & Hardware",
                body: "A hands-on understanding of the machines code runs on — PC diagnosis, repair, OS installs, and network troubleshooting. When something breaks at the hardware layer, I don't need to call someone else.",
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
