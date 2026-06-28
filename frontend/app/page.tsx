import Link from "next/link";
import { ArrowRight, Mail, ExternalLink, MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/ui/AnimateIn";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

const featuredProjects = [
  {
    slug: "pamangan",
    title: "pamangan.com",
    excerpt:
      "AI-powered Filipino recipe platform with search, recipe generation, grocery lists, and nutrition analysis.",
    tech: ["React", "Flask", "MongoDB", "Gemini AI"],
    github: "https://github.com/josepaulotimbang/pamangan.com",
    live: "https://pamangan.com",
    status: "Live" as const,
  },
  {
    slug: "devquiz",
    title: "DevQuiz",
    excerpt:
      "Interactive developer quiz platform with categorized questions, scoring, and leaderboard.",
    tech: ["React", "Node.js", "MySQL"],
    github: "https://github.com/josepaulotimbang/devquiz",
    live: null,
    status: "In Progress" as const,
  },
  {
    slug: "paulo-ai-chatbot",
    title: "Paulo AI Chatbot",
    excerpt:
      "Conversational AI chatbot with streaming responses, markdown rendering, and conversation history.",
    tech: ["React", "Python", "OpenAI API"],
    github: "https://github.com/josepaulotimbang/paulo-ai-chatbot",
    live: null,
    status: "Completed" as const,
  },
];

const skillGroups = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["PHP / CodeIgniter", "Python / Flask", "REST APIs"] },
  { label: "Database", items: ["MySQL", "MongoDB"] },
  { label: "AI", items: ["Gemini API", "OpenAI API", "Prompt Engineering"] },
];

const stats = [
  { value: "3+", label: "Years experience" },
  { value: "10+", label: "Projects built" },
  { value: "6+", label: "Tech stacks" },
  { value: "2", label: "AI platforms" },
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
  email: "josepaulotimbang@gmail.com",
  jobTitle: "Full-Stack Developer",
  description:
    "Full-stack developer specialising in Next.js, React, PHP/CodeIgniter 4, and AI-integrated web applications.",
  sameAs: [
    "https://github.com/josepaulotimbang",
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
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dot-grid opacity-40" />

        {/* Radial glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(60% 0.25 265 / 8%), transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto w-full px-6 py-32">
          {/* Availability pill */}
          <AnimateIn delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success tracking-wide">
                Available for work
              </span>
            </div>
          </AnimateIn>

          {/* Name */}
          <AnimateIn delay={0.05}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-gradient">Jose Paulo</span>
              <br />
              <span className="text-muted/70">Timbang</span>
            </h1>
          </AnimateIn>

          {/* Role */}
          <AnimateIn delay={0.1}>
            <p className="text-lg sm:text-xl text-muted mb-4 font-light">
              Full Stack Developer
              <span className="mx-3 text-border">·</span>
              <span className="text-gradient-primary font-medium">
                AI Engineer
              </span>
            </p>
          </AnimateIn>

          {/* Location */}
          <AnimateIn delay={0.12}>
            <p className="flex items-center gap-1.5 text-sm text-subtle mb-8">
              <MapPin size={13} />
              Philippines
            </p>
          </AnimateIn>

          {/* Description */}
          <AnimateIn delay={0.15}>
            <p className="text-muted max-w-lg leading-relaxed mb-10 text-base">
              I build modern web applications and AI-powered tools. Experienced
              with PHP, Python, React, and Next.js — actively transitioning
              into AI engineering and automation.
            </p>
          </AnimateIn>

          {/* CTAs */}
          <AnimateIn delay={0.2}>
            <div className="flex flex-wrap gap-4 mb-12">
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
                  href: "https://github.com/josepaulotimbang",
                  label: "GitHub",
                  icon: <GitHubIcon size={18} />,
                },
                {
                  href: "https://linkedin.com/in/josepaulotimbang",
                  label: "LinkedIn",
                  icon: <LinkedInIcon size={18} />,
                },
                {
                  href: "mailto:josepaulotimbang@gmail.com",
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
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => (
            <AnimateIn key={label} delay={i * 0.06}>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground mb-1 font-mono">
                  {value}
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
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-subtle hover:text-foreground transition-colors"
                    >
                      <GitHubIcon size={13} />
                      Code
                    </a>
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
