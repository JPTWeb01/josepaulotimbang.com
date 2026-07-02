"use client";

import { useEffect, useRef } from "react";

const CHARS = "01{}[]()<>/;=+-*&|!$#";
const FONT_SIZE = 18;
const FRAME_INTERVAL_MS = 60;

const MAX_CIRCLES = 3;
const MIN_RADIUS = FONT_SIZE * 7;
const MAX_RADIUS = FONT_SIZE * 14;
const CIRCLE_SPAWN_CHANCE = 0.02;
const CIRCLE_MIN_DURATION_MS = 4000;
const CIRCLE_MAX_DURATION_MS = 7000;
const CIRCLE_FADE_MS = 500;
// Fraction of the radius that stays fully visible before the soft falloff begins.
const FALLOFF_START = 0.5;

interface Circle {
  x: number;
  y: number;
  radius: number;
  start: number;
  duration: number;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) return;

    let columns = 0;
    let drops: number[] = [];
    let circles: Circle[] = [];

    const spawnCircle = (now: number) => {
      if (canvas.width === 0 || canvas.height === 0) return;
      const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        start: now,
        duration: CIRCLE_MIN_DURATION_MS + Math.random() * (CIRCLE_MAX_DURATION_MS - CIRCLE_MIN_DURATION_MS),
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      columns = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
      // Spawn immediately so the effect is visible right away instead of
      // waiting for the random per-frame spawn chance to eventually hit.
      circles = [];
      spawnCircle(Date.now());
    };

    resize();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    // Distance-based visibility for one circle: 1 inside FALLOFF_START * radius,
    // smoothly easing to 0 at the radius — no hard edge to read as "a circle".
    const circleReveal = (circle: Circle, x: number, y: number) => {
      const dx = x - circle.x;
      const dy = y - circle.y;
      const t = Math.sqrt(dx * dx + dy * dy) / circle.radius;
      if (t >= 1) return 0;
      if (t <= FALLOFF_START) return 1;
      const f = (t - FALLOFF_START) / (1 - FALLOFF_START);
      return 1 - f * f * (3 - 2 * f);
    };

    const draw = () => {
      const now = Date.now();
      ctx.font = `${FONT_SIZE}px monospace`;

      circles = circles.filter((circle) => {
        const alive = now - circle.start < circle.duration;
        if (!alive) {
          // Fully clear the region so it vanishes with the circle instead of
          // lingering while the slow global trail fade catches up.
          ctx.clearRect(
            circle.x - circle.radius,
            circle.y - circle.radius,
            circle.radius * 2,
            circle.radius * 2
          );
        }
        return alive;
      });
      if (circles.length < MAX_CIRCLES && Math.random() < CIRCLE_SPAWN_CHANCE) {
        spawnCircle(now);
      }

      const active = circles
        .map((circle) => {
          const elapsed = now - circle.start;
          const fadeIn = Math.min(1, elapsed / CIRCLE_FADE_MS);
          const fadeOut = Math.min(1, (circle.duration - elapsed) / CIRCLE_FADE_MS);
          return { circle, lifeOpacity: Math.max(0, Math.min(fadeIn, fadeOut)) };
        })
        .filter(({ lifeOpacity }) => lifeOpacity > 0);

      // Trail fade via erasing, not painting: "destination-out" reduces the
      // alpha of whatever's already drawn instead of layering a translucent
      // color on top. Transparent pixels stay transparent no matter how many
      // frames pass, so there's nothing here that can build up into a dot,
      // a square, or any other stray shape.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < columns; i++) {
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        let reveal = 0;
        for (const { circle, lifeOpacity } of active) {
          const value = circleReveal(circle, x, y) * lifeOpacity;
          if (value > reveal) reveal = value;
        }

        if (reveal > 0) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillStyle = `oklch(97% 0.01 265 / ${26 * reveal}%)`;
          ctx.fillText(char, x, y);
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(draw, FRAME_INTERVAL_MS);
    };
    const stop = () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-60"
    />
  );
}
