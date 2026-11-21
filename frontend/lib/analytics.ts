// Google Analytics 4 with consent. Nothing loads and nothing is tracked until
// the visitor accepts analytics cookies. Admin pages (/admin) are never tracked.

// The Measurement ID is public (it appears in every page's HTML).
export const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || "G-468EP5YNPJ").trim();
const CONSENT_KEY = "jptConsent"; // "granted" | "denied"
export const CONSENT_EVENT = "jpt:consent-reset";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let loaded = false;

const store = {
  get(): string | null {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  },
  set(v: string) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch { /* private mode */ }
  },
};

export const analyticsEnabled = () => Boolean(GA_ID);
export const getConsent = () => store.get();
const isAdminPath = () => window.location.pathname.startsWith("/admin");

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // gtag.js expects the arguments object itself, not an array
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
  void args;
}

function load() {
  if (loaded || !GA_ID) return;
  loaded = true;
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "granted",
  });
  gtag("js", new Date());
  // Page views are sent manually on route changes (client-side navigation)
  gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
  document.addEventListener("click", trackLinkClick, true);
  pageView();
}

export function setConsent(granted: boolean) {
  store.set(granted ? "granted" : "denied");
  if (granted) load();
  else if (loaded) window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

/** Re-open the cookie banner (used by the "Cookie settings" link). */
export function resetConsent() {
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* private mode */ }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function initAnalytics() {
  if (GA_ID && store.get() === "granted") load();
}

export function pageView() {
  if (!loaded || isAdminPath()) return;
  window.gtag?.("event", "page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}

/** Track a custom event, e.g. track("chat_message", { message_number: 2 }). */
export function track(name: string, params: Record<string, unknown> = {}) {
  if (!loaded || isAdminPath()) return;
  window.gtag?.("event", name, params);
}

// Resume download, email, LinkedIn, GitHub and project links anywhere on the site
function trackLinkClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a) return;
  const href = a.getAttribute("href") || "";
  const link_page = window.location.pathname;
  if (href.endsWith(".pdf")) track("resume_download", { link_page });
  else if (href.startsWith("mailto:")) track("contact_email", { link_page });
  else if (href.startsWith("tel:")) track("contact_phone", { link_page });
  else if (href.includes("linkedin.com")) track("click_linkedin", { link_page });
  else if (href.includes("github.com")) track("click_github", { link_page, link_url: href });
  else if (/^https?:\/\//.test(href) && !href.includes("josepaulotimbang.com"))
    track("click_outbound", { link_page, link_url: href });
}
