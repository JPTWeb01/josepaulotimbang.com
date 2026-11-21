"use client";

import { analyticsEnabled, resetConsent } from "@/lib/analytics";

export default function CookieSettingsLink({ className = "" }: { className?: string }) {
  if (!analyticsEnabled()) return null;
  return (
    <button type="button" onClick={resetConsent} className={className}>
      Cookie settings
    </button>
  );
}
