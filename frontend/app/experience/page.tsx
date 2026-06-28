import type { Metadata } from "next";
import AnimateIn from "@/components/ui/AnimateIn";
import Badge from "@/components/ui/Badge";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience of Jose Paulo Timbang — Full Stack Developer and Computer Technician.",
};

const experiences = [
  {
    role: "Freelance Full Stack Developer",
    company: "Self-Employed",
    type: "Freelance",
    location: "Remote / Philippines",
    start_date: "2023-01-01",
    end_date: null,
    is_current: true,
    description:
      "Designing and building full-stack web applications for clients. Specializing in PHP/CodeIgniter backends, React/Next.js frontends, MySQL databases, and AI API integration.",
    highlights: [
      "Designed and deployed pamangan.com — a full-stack AI recipe platform with Google Gemini and Groq integration",
      "Built DevQuiz, an interactive developer quiz platform with real-time scoring",
      "Integrated AI APIs (Gemini, OpenAI, Groq) with fallback logic into production applications",
      "Managed end-to-end project delivery — from requirements to deployment on Hostinger and cloud platforms",
      "Implemented CI/CD pipelines using GitHub Actions for automated frontend deployments",
    ],
  },
  {
    role: "Computer Technician",
    company: "Self-Employed",
    type: "Full-time",
    location: "Philippines",
    start_date: "2020-01-01",
    end_date: null,
    is_current: true,
    description:
      "Hardware diagnosis, repair, and maintenance for personal computers, laptops, and peripherals. Software troubleshooting, OS installation, and system optimization for individual and small business clients.",
    highlights: [
      "Diagnosed and repaired hardware faults across 100+ devices — desktops, laptops, and peripherals",
      "Performed OS installations, driver updates, BIOS configurations, and software setup",
      "Provided network configuration and WiFi troubleshooting for home and small office environments",
      "Built and customized desktop systems for gaming, productivity, and creative work",
    ],
  },
];

const certifications = [
  {
    name: "Responsive Web Design",
    issuer: "freeCodeCamp",
    year: "2022",
  },
  {
    name: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    year: "2022",
  },
  {
    name: "AI Engineering Foundations",
    issuer: "Self-study (OpenAI, Gemini, Groq)",
    year: "2024–present",
  },
];

export default function ExperiencePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <AnimateIn>
        <div className="mb-16">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
            Career
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Experience
          </h1>
          <p className="text-muted max-w-xl leading-relaxed text-[15px]">
            My professional journey — roles I&apos;ve held and the work behind them.
          </p>
        </div>
      </AnimateIn>

      {/* Experience timeline */}
      <div className="relative mb-20">
        <div className="absolute left-[19px] top-2 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent hidden sm:block" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <AnimateIn key={i} delay={i * 0.08}>
              <div className="sm:pl-12 relative">
                {/* Dot */}
                <div
                  className={`absolute left-3.5 top-2 w-3 h-3 rounded-full border-2 hidden sm:block ${
                    exp.is_current
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  }`}
                />

                <div className="bg-card border border-border rounded-xl p-7 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        {exp.role}
                      </h2>
                      <p className="text-sm text-muted mt-0.5">
                        {exp.company} &mdash; {exp.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono text-subtle">
                        {formatMonthYear(exp.start_date)} –{" "}
                        {exp.is_current ? "Present" : exp.end_date ? formatMonthYear(exp.end_date) : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 sm:justify-end">
                        {exp.is_current && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">
                            Current
                          </span>
                        )}
                        <span className="text-xs text-subtle">{exp.type}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  <ul className="space-y-2.5">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-muted">
                        <span className="text-primary shrink-0 mt-0.5">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <AnimateIn>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            Certifications &amp; Learning
          </h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{cert.name}</p>
                  <p className="text-xs text-muted mt-0.5">{cert.issuer}</p>
                </div>
                <Badge>{cert.year}</Badge>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
