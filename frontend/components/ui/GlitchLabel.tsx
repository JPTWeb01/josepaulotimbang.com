"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Globe, PlugZap, BrainCircuit } from "lucide-react";

type Phase = "default" | "glitch-out" | "alt-enter" | "alt" | "glitch-in";

const VARIANTS = {
  fullstack: {
    defaultText: "Full-Stack Developer",
    DefaultIcon: Code2,
    altText: "Web Developer",
    AltIcon: Globe,
    defaultClassName: "",
    altTextClassName: "text-muted font-light",
  },
  ai: {
    defaultText: "AI Integrations",
    DefaultIcon: PlugZap,
    altText: "AI Engineer",
    AltIcon: BrainCircuit,
    defaultClassName: "text-gradient-primary font-medium",
    altTextClassName: "font-medium text-gradient-primary",
  },
} as const;

interface Props {
  variant: keyof typeof VARIANTS;
  initialDelay?: number;
}

export default function GlitchLabel({ variant, initialDelay = 0 }: Props) {
  const { defaultText, DefaultIcon, altText, AltIcon, defaultClassName, altTextClassName } = VARIANTS[variant];
  const [phase, setPhase] = useState<Phase>("default");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => timers.current.forEach(clearTimeout);

    const run = (delay = 0) => {
      clear();
      timers.current = [];
      const at = (fn: () => void, ms: number) => {
        const t = setTimeout(fn, delay + ms);
        timers.current.push(t);
      };

      at(() => setPhase("glitch-out"), 3500);
      at(() => setPhase("alt-enter"),  4000);
      at(() => setPhase("alt"),        4400);
      at(() => setPhase("glitch-in"),  7000);
      at(() => { setPhase("default"); run(); }, 7500);
    };

    run(initialDelay);
    return clear;
  }, [initialDelay]);

  const showAlt = phase === "alt-enter" || phase === "alt" || phase === "glitch-in";
  const isGlitching = phase === "glitch-out" || phase === "glitch-in";

  return (
    <span className="relative inline-grid items-center">
      {/* Invisible spacer — always reserves width of the widest state */}
      <span className="[grid-area:1/1] invisible select-none pointer-events-none inline-flex items-center gap-1.5" aria-hidden>
        <DefaultIcon size={17} strokeWidth={1.75} />
        <span className={defaultClassName}>{defaultText}</span>
      </span>

      {/* Actual visible content */}
      <span className="[grid-area:1/1] inline-flex items-center gap-1.5">
        {showAlt ? (
          <span
            className={[
              "inline-flex items-center gap-1.5",
              isGlitching ? "ai-glitch" : "",
              phase === "alt-enter" ? "ai-icon-enter" : "",
              phase === "alt" ? "ai-icon-idle" : "",
            ].filter(Boolean).join(" ")}
          >
            <AltIcon size={17} strokeWidth={1.75} style={{ color: "var(--color-primary)" }} />
            <span className={altTextClassName}>{altText}</span>
          </span>
        ) : (
          <span
            className={[
              "inline-flex items-center gap-1.5",
              isGlitching ? "ai-glitch" : "",
            ].filter(Boolean).join(" ")}
          >
            <DefaultIcon size={17} strokeWidth={1.75} style={{ color: "var(--color-primary)" }} />
            <span className={defaultClassName}>{defaultText}</span>
          </span>
        )}
      </span>
    </span>
  );
}
