import Link from "next/link";
import { ArrowRight, Mail, ExternalLink, MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/ui/AnimateIn";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import HeroPhoto from "@/components/ui/HeroPhoto";
import HeroRipple from "@/components/ui/HeroRipple";
import MatrixRain from "@/components/ui/MatrixRain";
import ParallaxDots from "@/components/ui/ParallaxDots";
import GlitchLabel from "@/components/ui/GlitchLabel";
import TypeWriter from "@/components/ui/TypeWriter";
import CountUp from "@/components/ui/CountUp";

const featuredProjects = [
  {
    slug: "pamangan",
    title: "pamangan.com",
    excerpt:
      "AI-powered Filipino recipe platform with recipe discovery, AI generation, grocery lists, and nutrition analysis.",
    tech: ["React 18", "Flask", "MongoDB Atlas", "Gemini 1.5 Flash", "Groq"],
    github: "https://github.com/JPTWeb01/pamangan.com",
    live: "https://pamangan.com",
    status: "Live" as const,
  },
  {
    slug: "devquiz",
    title: "DevQuiz",
    excerpt:
      "Developer quiz platform with AI-generated questions refreshed weekly, real-time scoring, and an admin panel.",
    tech: ["React", "FastAPI", "Python", "Groq AI"],
    github: "https://github.com/JPTWeb01/devquiz",
    live: "https://devquiz.josepaulotimbang.com",
    status: "Live" as const,
  },
  {
    slug: "ai-blog-generator",
    title: "AI Blog Generator",
    excerpt:
      "WordPress plugin that autonomously generates and publishes blog posts using Groq on a WP-Cron schedule.",
    tech: ["PHP 8", "React 18", "Groq API", "WP-Cron", "GitHub Actions"],
    github: "https://github.com/JPTWeb01/ai-blog-generator",
    live: null,
    status: "Live" as const,
  },
];

const skillGroups = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { label: "Backend", items: ["PHP / CodeIgniter", "Python / Flask", "REST APIs"] },
  { label: "Database", items: ["MySQL", "MongoDB"] },
  { label: "AI", items: ["Gemini API", "OpenAI API", "Prompt Engineering", "Retrieval-Augmented Generation"] },
];

const stats = [
  { value: "8+", label: "Years experience" },
  { value: "10+", label: "Projects built" },
  { value: "8+", label: "Tech stacks" },
  { value: "3", label: "AI APIs integrated" },
];

const statusStyles: Record<string, string> = {
  Live: "bg-success/10 text-success border border-success/20",
  "In Progress": "bg-primary/10 text-primary border border-primary/20",
  Completed: "bg-card text-muted border border-border",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jose Paulo Timbang",
  url: "https://josepaulotimbang.com",
  email: "contactme@josepaulotimbang.com",
  jobTitle: "Full-Stack Developer",
  description:
    "Full-Stack Developer with 8 years of experience building responsive web apps and AI-powered platforms using React, Python, PHP, Flask, FastAPI, and LLM APIs.",
  sameAs: [
    "https://github.com/JPTWeb01",
    "https://linkedin.com/in/josepaulotimbang",
  ],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "PHP",
    "CodeIgniter 4",
    "MySQL",
    "AI APIs",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Dot grid background — drifts with the cursor */}
        <ParallaxDots />

        {/* Matrix code rain */}
        <MatrixRain />

        {/* Water ripple on mouse move */}
        <HeroRipple />

        {/* Radial glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(60% 0.25 265 / 8%), transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto w-full px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            {/* ── Left: text ── */}
            <div>
              {/* Availability pill */}
              <AnimateIn delay={0}>
                <div className="group inline-flex items-center gap-3 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-primary tracking-wide">
                      Available for work
                    </span>
                  </div>
                  <Link
                    href="/contact"
                    className="hire-me-btn inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium tracking-wide"
                  >
                    Hire me
                  </Link>
                </div>
              </AnimateIn>

              {/* Name */}
              <AnimateIn delay={0.05}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                  <TypeWriter />
                </h1>
              </AnimateIn>

              {/* Role */}
              <AnimateIn delay={0.1}>
                <p className="text-lg sm:text-xl text-muted mb-4 font-light">
                  <GlitchLabel variant="fullstack" />
                  <span className="mx-3 text-border">·</span>
                  <GlitchLabel variant="ai" initialDelay={1750} />
                </p>
              </AnimateIn>

              {/* Location */}
              <AnimateIn delay={0.12}>
                <p className="flex items-center gap-1.5 text-sm text-subtle mb-8">
                  <MapPin size={13} />
                  Stittsville, ON, Canada
                </p>
              </AnimateIn>

              {/* Description */}
              <AnimateIn delay={0.15}>
                <p className="text-muted max-w-lg leading-relaxed mb-10 text-base">
                  8 years building responsive websites, web apps, and AI-powered platforms.
                  Proficient in React, Python, PHP, Flask, FastAPI, and LLM
                  integration with modern AI APIs.
                </p>
              </AnimateIn>

              {/* CTAs */}
              <AnimateIn delay={0.2}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 active:scale-95 transition-all glow-primary-sm"
                  >
                    View my work
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border text-muted rounded-lg font-medium text-sm hover:text-foreground hover:border-primary/50 hover:bg-card transition-all"
                  >
                    Get in touch
                  </Link>
                </div>
              </AnimateIn>

              {/* Social */}
              <AnimateIn delay={0.25}>
                <div className="flex items-center gap-1">
                  {[
                    {
                      href: "https://github.com/JPTWeb01",
                      label: "GitHub",
                      icon: <GitHubIcon size={18} />,
                    },
                    {
                      href: "https://linkedin.com/in/josepaulotimbang",
                      label: "LinkedIn",
                      icon: <LinkedInIcon size={18} />,
                    },
                    {
                      href: "mailto:contactme@josepaulotimbang.com",
                      label: "Email",
                      icon: <Mail size={18} />,
                    },
                  ].map(({ href, label, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2.5 rounded-lg text-subtle hover:text-foreground hover:bg-card transition-colors"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </AnimateIn>
            </div>

            {/* ── Right: photo ── */}
            <AnimateIn delay={0.15} direction="left">
              <div className="flex justify-center lg:justify-end pr-8">
                <HeroPhoto />
              </div>
            </AnimateIn>

          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => (
            <AnimateIn key={label} delay={i * 0.06}>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground mb-1 font-mono">
                  <CountUp value={value} />
                </p>
                <p className="text-xs text-subtle uppercase tracking-wider">
                  {label}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── Featured Projects ────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
                  Portfolio
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                All projects <ArrowRight size={14} />
              </Link>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-5">
            {featuredProjects.map((project, i) => (
              <AnimateIn key={project.slug} delay={i * 0.08}>
                <article className="group h-full bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-semibold text-foreground group-hover:text-primary transition-colors text-[15px]"
                    >
                      {project.title}
                    </Link>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                    {project.excerpt}
                  </p>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-subtle hover:text-foreground transition-colors"
                      >
                        <GitHubIcon size={13} />
                        Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-subtle hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={13} />
                        Live
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="ml-auto text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Details →
                    </Link>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              View all projects <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Skills ───────────────────────────────────────────── */}
      <section className="px-6 py-28 bg-surface/50 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="mb-14">
              <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
                Toolbox
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Skills & Technologies
              </h2>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {skillGroups.map((group, i) => (
              <AnimateIn key={group.label} delay={i * 0.07}>
                <div className="bg-card border border-border rounded-xl p-5 h-full">
                  <p className="text-xs font-mono text-subtle uppercase tracking-widest mb-4">
                    {group.label}
                  </p>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span className="text-sm text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.3}>
            <div className="mt-8">
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Full skill breakdown <ArrowRight size={14} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Contact CTA ──────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="relative bg-card border border-border rounded-2xl p-10 sm:p-16 text-center overflow-hidden">
              {/* Background gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 100% at 50% 120%, oklch(60% 0.25 265 / 10%), transparent 70%)",
                }}
              />
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-dot-grid opacity-20" />

              <div className="relative">
                <p className="text-primary text-xs font-mono uppercase tracking-widest mb-4">
                  Let&apos;s work together
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Have a project in mind?
                </h2>
                <p className="text-muted max-w-md mx-auto mb-8 leading-relaxed text-sm">
                  I&apos;m open to full-time roles, freelance projects, and
                  collaborations. Let&apos;s build something great.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors glow-primary-sm"
                >
                  Get in touch
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
