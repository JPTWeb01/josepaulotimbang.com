"use client";

import { useState, useSyncExternalStore } from "react";
import { BarChart3, Briefcase, GraduationCap, LineChart, LogOut, MessageSquare } from "lucide-react";
import { AuthError, getSession, login, logout } from "@/lib/admin-api";
import Analytics from "./Analytics";
import ChatLogs from "./ChatLogs";
import JobMatches from "./JobMatches";
import Study from "./Study";

const AUTH_EVENT = "jpt:admin-auth";
const subscribe = (cb: () => void) => {
  window.addEventListener(AUTH_EVENT, cb);
  return () => window.removeEventListener(AUTH_EVENT, cb);
};
const isLoggedIn = () => getSession() !== null;
const notifyAuth = () => window.dispatchEvent(new Event(AUTH_EVENT));

/** Expired/invalid token → back to the login form. Returns true if handled. */
const onAuthError = (e: unknown) => {
  if (e instanceof AuthError) {
    logout();
    notifyAuth();
    return true;
  }
  return false;
};

type Tab = "chats" | "jobs" | "study" | "analytics";

export default function AdminApp() {
  // null on the server / first paint, so the login form never flashes for a logged-in user
  const loggedIn = useSyncExternalStore(subscribe, isLoggedIn, () => null);
  const [tab, setTab] = useState<Tab>("chats");

  if (loggedIn === null) return <div className="min-h-[60vh]" />;
  if (!loggedIn) return <LoginForm onDone={notifyAuth} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-card text-muted hover:text-foreground"
          >
            <BarChart3 size={16} /> Google Analytics ↗
          </a>
          <button
            onClick={() => {
              logout();
              notifyAuth();
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-card text-muted hover:text-foreground"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border mb-6" role="tablist">
        {([
          ["chats", "AI chat logs", MessageSquare],
          ["jobs", "Job matches", Briefcase],
          ["study", "Study", GraduationCap],
          ["analytics", "Analytics & SEO", LineChart],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm -mb-px border-b-2 transition-colors ${
              tab === id ? "border-primary text-foreground" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "chats" && <ChatLogs onAuthError={onAuthError} />}
      {tab === "jobs" && <JobMatches onAuthError={onAuthError} />}
      {tab === "study" && <Study onAuthError={onAuthError} />}
      {tab === "analytics" && <Analytics onAuthError={onAuthError} />}
    </div>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        </div>
        <label className="block text-sm text-muted">
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-surface border border-border px-3 py-2 text-foreground focus:outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm text-muted">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-surface border border-border px-3 py-2 text-foreground focus:outline-none focus:border-primary"
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
