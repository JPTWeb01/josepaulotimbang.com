"use client";

import { useEffect, useRef } from "react";

// Shifts the dot-grid's background-position with the cursor. Moving the
// position (not the element) keeps the repeating pattern seamless — no
// edges to expose no matter how far the grid drifts.
const STRENGTH = 14;

export default function ParallaxDots() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.backgroundPosition = `${x * STRENGTH}px ${y * STRENGTH}px`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-dot-grid opacity-65"
      style={{ transition: "background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
    />
  );
}
