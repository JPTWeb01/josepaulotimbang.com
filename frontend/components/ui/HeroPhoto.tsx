"use client";

import Image from "next/image";

const expressions = [
  { emoji: "😊", label: "Ready to build", cls: "animate-expr-1" },
  { emoji: "🤔", label: "Problem solving", cls: "animate-expr-2" },
  { emoji: "😎", label: "In the zone",    cls: "animate-expr-3" },
  { emoji: "🚀", label: "Shipping ideas", cls: "animate-expr-4" },
];

export default function HeroPhoto() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full animate-hero-glow"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, oklch(60% 0.25 265 / 15%), transparent 70%)",
        }}
      />

      {/* Floating wrapper */}
      <div className="relative animate-hero-float">

        {/* Gradient border ring */}
        <div
          className="p-[3px] rounded-full"
          style={{
            background: "linear-gradient(135deg, #4f6ef7, #7c3aed, #4f6ef7)",
            backgroundSize: "200% 200%",
          }}
        >
          {/* Photo container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden bg-card">
            <Image
              src="/paulo.jpg"
              alt="Jose Paulo Timbang"
              fill
              sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
              className="object-cover object-top"
              priority
            />
            {/* Bottom fade so white bg blends into dark */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse 100% 30% at 50% 105%, var(--color-background) 0%, transparent 60%)",
              }}
            />
          </div>
        </div>

        {/* Expression badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-max">
          <div className="relative h-9">
            {expressions.map(({ emoji, label, cls }) => (
              <div
                key={label}
                className={`${cls} absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-lg whitespace-nowrap`}
              >
                <span className="text-base leading-none">{emoji}</span>
                <span className="text-xs font-medium text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack floating chips */}
        <div className="absolute -top-3 -right-4 px-2.5 py-1 rounded-lg bg-card border border-border text-xs text-primary font-mono shadow-lg">
          React
        </div>
        <div className="absolute top-1/3 -left-6 px-2.5 py-1 rounded-lg bg-card border border-border text-xs text-accent font-mono shadow-lg">
          Python
        </div>
        <div className="absolute bottom-16 -right-6 px-2.5 py-1 rounded-lg bg-card border border-border text-xs text-muted font-mono shadow-lg">
          Flask
        </div>
      </div>
    </div>
  );
}
