"use client";

import Link from "next/link";
import { useState } from "react";

export default function HireMeReveal() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="group inline-flex items-center gap-3 mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span className="text-xs font-medium text-primary tracking-wide">
          Available for work
        </span>
      </div>
      <Link
        href="/contact"
        onAnimationEnd={() => setRevealed(true)}
        className={`hire-me-btn inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium tracking-wide ${
          revealed ? "hire-me-btn--revealed" : ""
        }`}
      >
        Hire me
      </Link>
    </div>
  );
}
