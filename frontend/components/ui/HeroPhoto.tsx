"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Hammer, Lightbulb, Zap, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const expressions: { Icon: LucideIcon; label: string; cls: string; color: string }[] = [
  { Icon: Hammer,    label: "Ready to build", cls: "animate-expr-1", color: "#4f6ef7" },
  { Icon: Lightbulb, label: "Problem solving", cls: "animate-expr-2", color: "#f59e0b" },
  { Icon: Zap,       label: "In the zone",    cls: "animate-expr-3", color: "#7c3aed" },
  { Icon: Rocket,    label: "Shipping ideas", cls: "animate-expr-4", color: "#10b981" },
];

// Tech chips positioned around the photo. `depth` sets how far each chip
// drifts toward the cursor; `follow` sets how long it takes to catch up —
// staggered so they trail the cursor one after another instead of in lockstep.
const chips: { label: string; pos: string; textCls: string; delay: string; depth: number; follow: number; dot?: boolean }[] = [
  { label: "TypeScript", pos: "-top-4 left-4",           textCls: "text-accent",  delay: "0.8s", depth: 8,  follow: 0.45 },
  { label: "Next.js",    pos: "-top-4 -right-4",         textCls: "text-primary", delay: "1.2s", depth: 10, follow: 0.8 },
  { label: "LLM / AI",   pos: "top-[22%] -right-10",     textCls: "text-success", delay: "1.6s", depth: 14, follow: 1.15, dot: true },
  { label: "FastAPI",    pos: "bottom-20 -right-10",     textCls: "text-primary", delay: "2.0s", depth: 12, follow: 1.5 },
  { label: "PHP",        pos: "bottom-20 -left-8",       textCls: "text-accent",  delay: "2.4s", depth: 11, follow: 1.85 },
  { label: "Python",     pos: "top-[28%] -left-10",      textCls: "text-muted",   delay: "2.8s", depth: 13, follow: 2.2 },
];

export default function HeroPhoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
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
          className="coin-flip-trigger p-[3px] rounded-full"
          style={{
            background: "linear-gradient(135deg, #4f6ef7, #7c3aed, #4f6ef7)",
            backgroundSize: "200% 200%",
          }}
        >
          {/* Photo container */}
          <div className="coin-flip relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden bg-card">
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
            {expressions.map(({ Icon, label, cls, color }) => (
              <div
                key={label}
                className={`${cls} absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-lg whitespace-nowrap`}
              >
                <Icon size={14} strokeWidth={2} style={{ color }} />
                <span className="text-xs font-medium text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack floating chips — staggered reveal + cursor parallax */}
        {chips.map(({ label, pos, textCls, delay, depth, follow, dot }) => (
          <div
            key={label}
            className={`absolute ${pos}`}
            style={{
              transform: `translate3d(${tilt.x * depth}px, ${tilt.y * depth}px, 0)`,
              transition: `transform ${follow}s cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            <div
              className={`chip-reveal flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border ${dot ? "border-success/30" : "border-border"} text-xs ${textCls} font-mono shadow-lg whitespace-nowrap`}
              style={{ animationDelay: delay }}
            >
              {dot && <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />}
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
