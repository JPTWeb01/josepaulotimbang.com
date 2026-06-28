import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, MapPin, Mail } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Jose Paulo Timbang - Full-Stack Developer specialising in Next.js, React, PHP/CodeIgniter 4, and AI-integrated web applications.",
};

const experience = [
  {
    company: "Freelance",
    role: "Full-Stack Developer",
    type: "Freelance",
    period: "Jan 2023 - Present",
    current: true,
    points: [
      "Designed and built full-stack web apps for clients using Next.js + CodeIgniter 4",
      "Integrated AI APIs (Claude, OpenAI) into production applications",
      "Delivered projects on time with TypeScript, MySQL, and Tailwind CSS",
    ],
    tech: ["Next.js", "React", "TypeScript", "CodeIgniter 4", "MySQL", "Claude API"],
  },
  {
    company: "Pasig City Government",
    role: "IT Support Specialist",
    type: "Full-time",
    period: "Jun 2021 - Dec 2022",
    current: false,
    points: [
      "Provided technical support for 200+ government employees",
      "Maintained and improved internal web systems built on PHP/MySQL",
      "Assisted in digitising manual processes to reduce operational overhead",
    ],
    tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
  },
  {
    company: "Self-Employed",
    role: "Web Developer",
    type: "Part-time",
    period: "Jan 2020 - May 2021",
    current: false,
    points: [
      "Built and customised WordPress sites for small businesses",
      "Created custom landing pages and improved page speed scores",
    ],
    tech: ["WordPress", "PHP", "HTML", "CSS", "jQuery"],
  },
];

const education = [
  {
    institution: "Pamantasan ng Lungsod ng Maynila",
    degree: "Bachelor of Science in Information Technology",
    period: "2016 - 2020",
  },
];

const skills = [
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["PHP", "CodeIgniter 4", "Node.js", "REST APIs"] },
  { category: "Database", items: ["MySQL", "PostgreSQL", "MongoDB"] },
  { category: "AI", items: ["Claude API", "OpenAI API", "LangChain", "Prompt Engineering"] },
  { category: "Tools", items: ["Git", "GitHub Actions", "Docker", "Vercel", "Linux CLI"] },
];

const certifications = [
  { name: "Meta Front-End Developer Professional Certificate", issuer: "Meta / Coursera", year: "2023" },
  { name: "Responsive Web Design", issuer: "freeCodeCamp", year: "2022" },
  { name: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp", year: "2022" },
];

export default function ResumePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Jose Paulo Timbang</h1>
            <p className="text-lg text-primary font-medium mb-4">Full-Stack Developer</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5"><MapPin size={14} />Manila, Philippines</span>
              <span className="flex items-center gap-1.5"><Mail size={14} />josepaulotimbang@gmail.com</span>
              <Link href="https://josepaulotimbang.com" target="_blank" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <ExternalLink size={14} />josepaulotimbang.com
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
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Summary</h2>
          <p className="text-foreground/80 leading-relaxed">
            Full-stack developer with 3+ years of experience building production web applications using
            Next.js, React, and PHP/CodeIgniter 4. Focused on clean, maintainable code and integrating
            modern AI APIs to build smarter user experiences. Comfortable working independently and
            shipping end-to-end from design to deployment.
          </p>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <section className="mb-14">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Experience</h2>
          <div className="space-y-10">
            {experience.map((job, i) => (
              <div key={i} className="relative pl-6 border-l border-border">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary" />
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
                <div className="flex flex-wrap gap-1.5">
                  {job.tech.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-card border border-border text-muted">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <section className="mb-14">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Skills</h2>
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
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="pl-6 border-l border-border relative">
              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
              <p className="font-semibold text-foreground">{edu.degree}</p>
              <p className="text-sm text-primary mt-0.5">{edu.institution}</p>
              <p className="text-xs text-muted mt-1">{edu.period}</p>
            </div>
          ))}
        </section>
      </AnimateIn>

      <AnimateIn delay={0.25}>
        <section>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-8">Certifications</h2>
          <div className="space-y-4">
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
    </main>
  );
}
