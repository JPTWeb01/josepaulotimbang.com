// Client for the CodeIgniter admin API. In production the API is served from
// the same origin at /api/v1; for local development set NEXT_PUBLIC_ADMIN_API_URL
// (e.g. http://localhost:8080/v1).

const API = (process.env.NEXT_PUBLIC_ADMIN_API_URL || "/api/v1").replace(/\/$/, "");
const TOKEN_KEY = "jptAdminToken";

type Session = { token: string; expiresAt: string };

export class AuthError extends Error {}

export function getSession(): Session | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || "null") as Session | null;
    if (s && new Date(s.expiresAt).getTime() > Date.now()) return s;
  } catch {}
  sessionStorage.removeItem(TOKEN_KEY);
  return null;
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body) headers["Content-Type"] = "application/json";
  if (auth) {
    const s = getSession();
    if (!s) throw new AuthError("Session expired");
    headers.Authorization = `Bearer ${s.token}`;
  }
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401 && auth) {
    logout();
    throw new AuthError(body.message || "Session expired");
  }
  if (!res.ok || body.success === false) {
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return body.data as T;
}

export async function login(email: string, password: string) {
  const data = await request<{ token: string; expires_at: string }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false,
  );
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token: data.token, expiresAt: data.expires_at }));
}

// ─── Chat logs ──────────────────────────────────────────────────────────

export type ChatLog = {
  id: string;
  created_at: string; // UTC "YYYY-MM-DD HH:MM:SS"
  session_id: string | null;
  ip: string;
  country: string | null;
  site: string | null;
  page: string | null;
  user_agent: string | null;
  message: string;
  reply: string | null;
};

export type ChatFilters = {
  from?: string; // UTC "YYYY-MM-DD HH:MM:SS"
  to?: string;
  country?: string;
  ip?: string;
  q?: string;
  session?: string;
  page?: number;
};

export type ChatStats = {
  messages: number;
  visitors: number;
  conversations: number;
  countries: { country: string | null; messages: string; visitors: string }[];
  daily: { day: string; messages: string }[];
  retention_days: number;
};

export type Paginated<T> = { items: T[]; total: number; page: number; per_page: number; total_pages: number };

function qs(f: ChatFilters) {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v !== undefined && v !== "") p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const getChats = (f: ChatFilters) => request<Paginated<ChatLog>>(`/admin/chats${qs(f)}`);
export const getChatStats = (f: ChatFilters) => {
  const { page: _page, ...rest } = f;
  void _page;
  return request<ChatStats>(`/admin/chats/stats${qs(rest)}`);
};
export const deleteChat = (id: string) => request<null>(`/admin/chats/${id}`, { method: "DELETE" });

// ─── Job finder ─────────────────────────────────────────────────────────

export type JobStatus = "new" | "saved" | "applied" | "hidden";

export type Job = {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string;
  remote?: boolean;
  job_type?: string;
  posted: string | null;
  url: string;
  salary?: string;
  bucket: string;
  contract?: boolean;
  score: number;
  eligible: boolean;
  why?: string[];
  gaps?: string[];
  letter?: string;
  letter_subject?: string;
  found: string;
  status: JobStatus;
};

export const getJobs = () => request<{ updated_at: string | null; items: Job[] }>("/admin/jobs");
export const setJobStatus = (id: string, status: JobStatus) =>
  request<{ id: string; status: JobStatus }>("/admin/jobs/status", {
    method: "POST",
    body: JSON.stringify({ id, status }),
  });

// ─── Helpers ────────────────────────────────────────────────────────────

/** Local calendar date (YYYY-MM-DD from a date input) → UTC datetime string for the API. */
export function localDateToUtc(date: string, endOfDay = false) {
  const d = new Date(`${date}T${endOfDay ? "23:59:59" : "00:00:00"}`);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

/** API UTC datetime → Date */
export const fromUtc = (s: string) => new Date(s.replace(" ", "T") + "Z");

const regionNames = typeof Intl !== "undefined" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

export function countryName(code: string | null) {
  if (!code) return "Unknown";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

export function flag(code: string | null) {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}
