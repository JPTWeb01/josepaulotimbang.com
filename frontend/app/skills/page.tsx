import type { Metadata } from "next";
import AnimateIn from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills and technologies used by Jose Paulo Timbang — Frontend, Backend, Database, and AI.",
};

const skillGroups = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 85 },
      { name: "Next.js", level: 75 },
      { name: "TypeScript", level: 70 },
      { name: "JavaScript", level: 85 },
      { name: "Tailwind CSS", level: 80 },
      { name: "Bootstrap", level: 85 },
      { name: "HTML5 / CSS3", level: 90 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "PHP", level: 80 },
      { name: "CodeIgniter 4", level: 80 },
      { name: "Python", level: 70 },
      { name: "Flask", level: 70 },
      { name: "REST API Design", level: 75 },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MySQL", level: 80 },
      { name: "MongoDB", level: 65 },
    ],
  },
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "Google Gemini API", level: 65 },
      { name: "OpenAI API", level: 65 },
      { name: "Groq API", level: 60 },
      { name: "Prompt Engineering", level: 70 },
      { name: "RAG (learning)", level: 40 },
    ],
  },
  {
    category: "Tools & DevOps",
    skills: [
      { name: "Git / GitHub", level: 80 },
      { name: "GitHub Actions", level: 65 },
      { name: "VS Code", level: 90 },
      { name: "Postman", level: 80 },
      { name: "Linux CLI", level: 65 },
    ],
  },
  {
    category: "Currently Learning",
    skills: [
      { name: "AI Agents", level: 35 },
      { name: "LangChain", level: 30 },
      { name: "Vector Databases", level: 25 },
      { name: "Docker", level: 40 },
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
