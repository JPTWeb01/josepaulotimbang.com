"use client";

import { useEffect, useState } from "react";

const LINE1 = "Jose Paulo";
const LINE2 = "Timbang";
const CHAR_DELAY = 85;    // ms per character
const START_DELAY = 650;  // wait for AnimateIn fade-in to finish
const LINE_PAUSE = 260;   // pause before second line starts

type Phase = "idle" | "line1" | "pause" | "line2" | "done";

export default function TypeWriter() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  // Kick off after AnimateIn completes
  useEffect(() => {
    const t = setTimeout(() => setPhase("line1"), START_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    if (phase === "line1") {
      if (line1.length < LINE1.length) {
        t = setTimeout(() => setLine1(LINE1.slice(0, line1.length + 1)), CHAR_DELAY);
      } else {
        t = setTimeout(() => setPhase("pause"), LINE_PAUSE);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("line2"), LINE_PAUSE);
    } else if (phase === "line2") {
      if (line2.length < LINE2.length) {
        t = setTimeout(() => setLine2(LINE2.slice(0, line2.length + 1)), CHAR_DELAY);
      } else {
        setPhase("done");
      }
    }

    return () => clearTimeout(t);
  }, [phase, line1, line2]);

  const showCursor = phase !== "idle" && phase !== "done";
  const cursorOnLine2 = phase === "line2";

  return (
    <>
      <span className="text-gradient">
        {line1 || " "}
        {showCursor && !cursorOnLine2 && (
          <span className="typewriter-cursor" aria-hidden />
        )}
      </span>
      <br />
      <span className="text-muted/70">
        {line2 || " "}
        {showCursor && cursorOnLine2 && (
          <span className="typewriter-cursor" aria-hidden />
        )}
      </span>
    </>
  );
}
