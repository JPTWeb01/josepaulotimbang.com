import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, MapPin, Mail, Phone } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Jose Paulo Timbang - Full-Stack Developer with 8 years of experience building web apps and AI-powered platforms.",
};

const experience = [
  {
    company: "Various Clients",
    role: "Freelance Full-Stack Developer",
    type: "Freelance",
    period: "2024 - Present",
    current: true,
    points: [
      "Built pamangan.com - AI recipe platform with Gemini 2.0 Flash, Groq fallback, React, Flask, MongoDB Atlas, JWT auth",
      "Shipped DevQuiz - quiz platform with AI-generated questions, FastAPI, role-based access, GitHub Actions CI/CD",
      "Created AI Blog Generator WordPress plugin using Groq API, React 18, Webpack, and WP-Cron",
      "Built Paulo AI Resume Chatbot (Gemini API) embedded as a WordPress PHP plugin, backend on Render.com",
    ],
    tech: ["React", "Python", "Flask", "FastAPI", "PHP", "MongoDB", "MySQL", "Gemini API", "Groq API"],
  },
  {
    company: "Savvytech Computer Services",
    role: "Owner / Computer Technician",
    type: "Self-Employed",
    period: "Apr 2020 - Oct 2022",
    current: false,
    points: [
      "Built and repaired custom PCs, replaced faulty components, and configured BIOS/UEFI settings",
      "Performed advanced data recovery and implemented cybersecurity measures for clients",
      "Managed inventory, supplier relations, and client communications",
    ],
    tech: ["PC Hardware", "Networking", "Windows", "Cybersecurity"],
  },
  {
    company: "Carolinas Dream Team",
    role: "Marketing Assistant / Web Designer",
    type: "Remote (USA)",
    period: "Dec 2020 - Apr 2022",
    current: false,
    points: [
      "Designed marketing materials, updated WordPress websites, and customised site themes",
      "Managed automated email campaigns using Mailchimp and created social media graphics",
      "Monitored website performance with Google Analytics and prepared weekly reports",
    ],
    tech: ["WordPress", "Mailchimp", "Google Analytics", "Figma"],
  },
  {
    company: "Cyberbacker",
    role: "Web Developer",
    type: "Remote (USA)",
    period: "Jun 2018 - Nov 2020",
    current: false,
    points: [
      "Developed and maintained responsive websites and custom internal management tools",
      "Integrated live chat, social media channels, and SEO strategies to increase engagement",
      "Provided technical support and troubleshooting for internal systems",
    ],
    tech: ["PHP", "JavaScript", "HTML", "CSS", "SEO"],
  },
  {
    company: "Various US Clients",
    role: "Freelance Web Developer",
    type: "Freelance",
    period: "2013 - 2017",
    current: false,
    points: [
      "WordPress sites and CodeIgniter apps for US real estate, design, and small business clients",
      "End-to-end delivery: design, development, SEO, Google Analytics, and social media integration",
    ],
    tech: ["WordPress", "CodeIgniter", "PHP", "HTML", "CSS", "SEO"],
  },
];

const skills = [
  { category: "Frontend", items: ["React", "JavaScript", "TypeScript", "HTML5/CSS3", "Next.js", "Bootstrap", "Tailwind CSS", "WordPress", "Shopify"] },
  { category: "Backend", items: ["Python", "PHP", "Flask", "FastAPI", "REST APIs", "SQLAlchemy"] },
  { category: "Databases", items: ["MySQL", "MongoDB", "PostgreSQL"] },
  { category: "AI & APIs", items: ["Gemini API", "Groq API", "LLM Integration", "Prompt Engineering"] },
  { category: "DevOps", items: ["Git", "GitHub Actions", "CI/CD", "Linux/SSH", "Render", "Hostinger"] },
  { category: "SEO & Design", items: ["Google Analytics", "Yoast SEO", "SEMrush", "Figma", "Photoshop"] },
];

const certifications = [
  { name: "React Basics", issuer: "Meta / Coursera", year: "2026" },
  { name: "HTML and CSS in Depth", issuer: "Meta / Coursera", year: "2026" },
  { name: "Programming with JavaScript", issuer: "Meta / Coursera", year: "2026" },
  { name: "Version Control", issuer: "Meta / Coursera", year: "2026" },
];

export default function ResumePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Jose Paulo Timbang</h1>
            <p className="text-lg text-primary font-medium mb-4">Full-Stack Developer</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-1.5"><MapPin size={14} />Stittsville, ON, Canada</span>
              <span className="flex items-center gap-1.5"><Phone size={14} />(613) 890-9037</span>
              <span className="flex items-center gap-1.5"><Mail size={14} />josepaulotimbang@gmail.com</span>
              <Link href="https://linkedin.com/in/josepaulotimbang" target="_blank" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <ExternalLink size={14} />linkedin.com/in/josepaulotimbang
              </Link>
            </div>
          </div>
          <Link href="/jose-paulo-timbang-resume.pdf" target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors glow-primary-sm shrink-0">
            <Download size={15} />Download PDF
          </Link>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <section className="mb-14">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Professional Summary</h2>
          <p className="text-foreground/80 leading-relaxed">
            Full-Stack Developer with 8 years of experience building and deploying responsive web applications and AI-powered
            platforms. Proficient in React, Python, PHP, Flask, FastAPI, and REST API development. Experienced in LLM integration
            using Google Gemini and Groq APIs, JWT authentication, MongoDB, MySQL, SQLAlchemy, CI/CD pipelines, and GitHub
            Actions. Skilled in cloud deployment, prompt engineering, and building scalable full-stack solutions.
          </p>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <section className="mb-14">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Experience</h2>
          <div className="space-y-10">
            {experience.map((job, i) => (
              <div key={i} className="relative pl-6 border-l border-border">
                <div className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ${job.current ? "bg-primary" : "bg-border"}`} />
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground">{job.role}</h3>
                  {job.current && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Current</span>
                  )}
                </div>
                <p className="text-sm text-primary mb-1">{job.company} <span className="text-muted">· {job.type}</span></p>
                <p className="text-xs text-muted mb-4">{job.period}</p>
                <ul className="space-y-1.5 mb-4">
                  {job.points.map((pt, j) => (
                    <li key={j} className="text-sm text-foreground/80 flex gap-2">
                      <span className="text-primary mt-1 shrink-0">›</span>{pt}
                    </li>
                  ))}
                </ul>
                {job.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-card border border-border text-muted">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <section className="mb-14">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Technical Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((group) => (
              <div key={group.category}>
                <p className="text-xs text-muted uppercase tracking-wider mb-2">{group.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="text-sm px-2.5 py-1 rounded-lg bg-card border border-border text-foreground/80">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.2}>
        <section className="mb-14">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Certifications</h2>
          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-start gap-4 p-4 rounded-xl bg-card border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{cert.name}</p>
                  <p className="text-xs text-muted mt-0.5">{cert.issuer}</p>
                </div>
                <span className="text-xs text-muted shrink-0 mt-0.5">{cert.year}</span>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.25}>
        <section>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Education</h2>
          <div className="pl-6 border-l border-border relative">
            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
            <p className="font-semibold text-foreground">Bachelor of Science in Information Technology</p>
            <p className="text-sm text-primary mt-0.5">AMA Computer College, Philippines</p>
            <p className="text-xs text-muted mt-1">2011</p>
          </div>
        </section>
      </AnimateIn>
    </main>
  );
}
