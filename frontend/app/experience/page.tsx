import type { Metadata } from "next";
import AnimateIn from "@/components/ui/AnimateIn";
import Badge from "@/components/ui/Badge";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience of Jose Paulo Timbang — Full-Stack Developer with 8 years of experience in web development and AI integration.",
};

const experiences = [
  {
    role: "Freelance Full-Stack Developer",
    company: "Various Clients",
    type: "Freelance",
    location: "Remote",
    start_date: "2024-01-01",
    end_date: null,
    is_current: true,
    description:
      "Building and deploying full-stack web applications and AI-powered platforms for clients. Shipping production projects end-to-end — from architecture to deployment — with CI/CD pipelines and cloud hosting.",
    highlights: [
      "Built pamangan.com — AI recipe platform with Google Gemini 2.0 Flash, Groq fallback, React, Flask, MongoDB Atlas, and JWT auth",
      "Shipped DevQuiz — developer quiz platform with AI-generated questions, role-based access, FastAPI, and GitHub Actions CI/CD",
      "Created AI Blog Generator — WordPress plugin using Groq API, React 18, Webpack, and WP-Cron for autonomous post scheduling",
      "Built Paulo AI Resume Chatbot — Gemini-powered chat widget embedded as a WordPress PHP plugin, backend on Render.com",
      "Implemented CI/CD pipelines with GitHub Actions for automated SSH deployment to Hostinger and Render",
    ],
  },
  {
    role: "Grocery Associate",
    company: "Food Basics",
    type: "Part-time",
    location: "Stittsville, ON, Canada",
    start_date: "2024-01-01",
    end_date: "2026-01-01",
    is_current: false,
    description:
      "Worked in a fast-paced grocery retail environment while continuing full-stack and AI development projects on evenings and weekends.",
    highlights: [
      "Demonstrated reliability and teamwork in a high-volume retail environment",
      "Continued independent development of AI-powered web projects during this period",
    ],
  },
  {
    role: "Overnight Associate",
    company: "Walmart Canada",
    type: "Full-time",
    location: "Ontario, Canada",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    is_current: false,
    description:
      "Managed overnight inventory stocking and organisation while upskilling in Python, FastAPI, and LLM integration.",
    highlights: [
      "Met overnight shift targets for inventory stocking and organisation",
      "Used this transition period to build full-stack skills and begin integrating AI APIs into projects",
    ],
  },
  {
    role: "Fulfillment Associate",
    company: "Amazon",
    type: "Full-time",
    location: "Ontario, Canada",
    start_date: "2022-01-01",
    end_date: "2023-01-01",
    is_current: false,
    description:
      "Processed high-volume order fulfillment with accuracy in a warehouse environment after relocating to Canada.",
    highlights: [
      "Maintained accuracy and speed in a high-volume fulfillment environment",
      "Began rebuilding freelance web development practice while transitioning to Canadian job market",
    ],
  },
  {
    role: "Owner / Computer Technician",
    company: "Savvytech Computer Services",
    type: "Self-Employed",
    location: "Angeles City, Philippines",
    start_date: "2020-04-01",
    end_date: "2022-10-01",
    is_current: false,
    description:
      "Founded and operated a computer repair and services business. Handled hardware repairs, custom PC builds, data recovery, cybersecurity, and client management.",
    highlights: [
      "Built and repaired custom PCs, replaced faulty components, and configured BIOS/UEFI settings",
      "Performed advanced data recovery and implemented cybersecurity measures for clients",
      "Managed inventory, supplier relations, and client communications",
    ],
  },
  {
    role: "Marketing Assistant / Web Designer",
    company: "Carolinas Dream Team",
    type: "Remote (USA)",
    location: "Remote",
    start_date: "2020-12-01",
    end_date: "2022-04-01",
    is_current: false,
    description:
      "Designed marketing materials and maintained WordPress websites for a US-based real estate team. Managed email campaigns and monitored site analytics.",
    highlights: [
      "Designed marketing materials and customised WordPress site themes",
      "Managed automated email campaigns using Mailchimp and created social media graphics",
      "Monitored website performance with Google Analytics and prepared weekly reports",
    ],
  },
  {
    role: "Web Developer",
    company: "Cyberbacker",
    type: "Remote (USA)",
    location: "Remote",
    start_date: "2018-06-01",
    end_date: "2020-11-01",
    is_current: false,
    description:
      "Developed and maintained responsive websites and custom internal management tools for a US-based remote staffing company.",
    highlights: [
      "Developed and maintained responsive websites and custom internal management tools",
      "Integrated live chat, social media channels, and SEO strategies to increase engagement",
      "Provided technical support and troubleshooting for internal systems",
    ],
  },
  {
    role: "Freelance Web Developer",
    company: "Various US Clients",
    type: "Freelance",
    location: "Remote (USA)",
    start_date: "2013-01-01",
    end_date: "2017-12-31",
    is_current: false,
    description:
      "Built WordPress sites and CodeIgniter applications for US-based clients in real estate, design, and small business. Handled full-cycle delivery from design to SEO and analytics.",
    highlights: [
      "Fast CMA & MLS Deal Finder — WordPress site with SEO and social media integration",
      "Graphics Eye Catcher Design — mobile-responsive designs with on-page SEO and Google Analytics",
      "Affordable Homes — custom WordPress site with social media and branding consistency",
      "Tallships Business Centre — mobile-responsive CodeIgniter site with CRM and live chat integration",
    ],
  },
];

const certifications = [
  {
    name: "React Basics",
    issuer: "Meta / Coursera",
    year: "2026",
  },
  {
    name: "HTML and CSS in Depth",
    issuer: "Meta / Coursera",
    year: "2026",
  },
  {
    name: "Programming with JavaScript",
    issuer: "Meta / Coursera",
    year: "2026",
  },
  {
    name: "Version Control",
    issuer: "Meta / Coursera",
    year: "2026",
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
