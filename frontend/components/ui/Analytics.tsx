"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsEnabled, getConsent, setConsent, initAnalytics, pageView, CONSENT_EVENT,
} from "@/lib/analytics";

// The banner shows while no consent choice is stored. Subscribing to localStorage
// this way avoids a hydration mismatch on the static export (server = hidden).
const subscribe = (cb: () => void) => {
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const needsChoice = () => analyticsEnabled() && !getConsent();

// Loads GA (only after consent), sends a page view on every route change,
// and shows a small non-blocking cookie notice until the visitor chooses.
export default function Analytics() {
  const pathname = usePathname();
  const open = useSyncExternalStore(subscribe, needsChoice, () => false);

  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { pageView(); }, [pathname]);

  if (!open || pathname.startsWith("/admin")) return null;

  const choose = (granted: boolean) => {
    setConsent(granted);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-[60] rounded-2xl border border-border bg-card/95 backdrop-blur p-4 shadow-xl"
    >
      <p className="text-sm text-muted leading-relaxed">
        I use Google Analytics cookies to see which pages and projects people find useful.
        No ads, and your data is never sold.{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy</a>
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => choose(false)}
          className="px-4 py-1.5 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
