import type { Metadata } from "next";
import AnimateIn from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills and technologies used by Jose Paulo Timbang — Frontend, Backend, Database, and AI.",
};

const skillGroups = [
  {
    category: "Web / Frontend",
    skills: [
      { name: "React", level: 88 },
      { name: "JavaScript", level: 88 },
      { name: "TypeScript", level: 72 },
      { name: "HTML5 / CSS3", level: 92 },
      { name: "Next.js", level: 78 },
      { name: "Framer Motion", level: 78 },
      { name: "Bootstrap", level: 88 },
      { name: "Tailwind CSS", level: 82 },
      { name: "Lucide React", level: 85 },
      { name: "WordPress", level: 90 },
      { name: "Shopify", level: 70 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python", level: 80 },
      { name: "PHP", level: 82 },
      { name: "Flask", level: 78 },
      { name: "FastAPI", level: 74 },
      { name: "REST API Design", level: 82 },
      { name: "SQLAlchemy", level: 68 },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "MySQL", level: 82 },
      { name: "MongoDB", level: 72 },
      { name: "PostgreSQL", level: 65 },
    ],
  },
  {
    category: "AI & APIs",
    skills: [
      { name: "Gemini API", level: 80 },
      { name: "Groq API", level: 78 },
      { name: "LLM Integration", level: 78 },
      { name: "Prompt Engineering", level: 80 },
      { name: "Retrieval-Augmented Generation", level: 72 },
    ],
  },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Git / GitHub", level: 85 },
      { name: "GitHub Actions / CI/CD", level: 75 },
      { name: "Linux / SSH", level: 72 },
      { name: "Render / Hostinger", level: 80 },
      { name: "Web3Forms", level: 82 },
      { name: "Figma", level: 70 },
      { name: "Photoshop", level: 65 },
    ],
  },
  {
    category: "SEO & Analytics",
    skills: [
      { name: "Google Analytics", level: 78 },
      { name: "Yoast SEO", level: 80 },
      { name: "SEMrush", level: 65 },
      { name: "On-page SEO", level: 80 },
    ],
  },
];

function levelLabel(level: number): string {
  if (level >= 80) return "Advanced";
  if (level >= 60) return "Proficient";
  if (level >= 40) return "Intermediate";
  return "Learning";
}

export default function SkillsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <AnimateIn>
        <div className="mb-16">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
            Toolbox
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Skills &amp; Technologies
          </h1>
          <p className="text-muted max-w-xl leading-relaxed text-[15px]">
            A breakdown of the technologies I work with, grouped by domain with
            an honest proficiency rating. Still learning is still valid.
          </p>
        </div>
      </AnimateIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((group, gi) => (
          <AnimateIn key={group.category} delay={gi * 0.06}>
            <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/30 transition-colors">
              <h2 className="text-xs font-mono text-subtle uppercase tracking-widest mb-5">
                {group.category}
              </h2>

              <div className="space-y-4">
                {group.skills.map(({ name, level }) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-muted">{name}</span>
                      <span className="text-xs text-subtle font-mono">
                        {levelLabel(level)}
                      </span>
                    </div>
                    <div className="h-[3px] bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Legend */}
      <AnimateIn delay={0.3}>
        <div className="mt-10 flex flex-wrap gap-4 text-xs text-subtle">
          {[
            { label: "Advanced", range: "80–100%" },
            { label: "Proficient", range: "60–79%" },
            { label: "Intermediate", range: "40–59%" },
            { label: "Learning", range: "< 40%" },
          ].map(({ label, range }) => (
            <span key={label}>
              <span className="text-muted font-medium">{label}</span>{" "}
              {range}
            </span>
          ))}
        </div>
      </AnimateIn>
    </div>
  );
}
