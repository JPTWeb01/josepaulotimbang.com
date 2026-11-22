"use client";

import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, RefreshCw, Trash2 } from "lucide-react";
import {
  type ChatFilters,
  type ChatLog,
  type ChatStats,
  type Paginated,
  countryName,
  deleteChat,
  flag,
  fromUtc,
  getChats,
  getChatStats,
  localDateToUtc,
} from "@/lib/admin-api";

type Draft = { from: string; to: string; country: string; ip: string; q: string; session: string };
const EMPTY: Draft = { from: "", to: "", country: "", ip: "", q: "", session: "" };

const toApi = (d: Draft, page: number): ChatFilters => ({
  from: d.from ? localDateToUtc(d.from) : undefined,
  to: d.to ? localDateToUtc(d.to, true) : undefined,
  country: d.country || undefined,
  ip: d.ip.trim() || undefined,
  q: d.q.trim() || undefined,
  session: d.session || undefined,
  page,
});

const localDate = (daysAgo: number) => {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const input =
  "rounded-lg bg-surface border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary";

type Result = { key: string; chats?: Paginated<ChatLog>; stats?: ChatStats; asOf?: number; error?: string };

export default function ChatLogs({ onAuthError }: { onAuthError: (e: unknown) => boolean }) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [applied, setApplied] = useState<Draft>(EMPTY);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<Result>({ key: "" });
  const [countries, setCountries] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const key = JSON.stringify([applied, page, reload]);
  const loading = result.key !== key;

  useEffect(() => {
    let live = true;
    const f = toApi(applied, page);
    Promise.all([getChats(f), getChatStats(f)])
      .then(([chats, stats]) => live && setResult({ key, chats, stats, asOf: Date.now() }))
      .catch((e) => {
        if (live && !onAuthError(e)) setResult({ key, error: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      live = false;
    };
  }, [key, applied, page, onAuthError]);

  // Country list for the filter (from all retained logs, not the filtered view)
  useEffect(() => {
    getChatStats({})
      .then((s) => setCountries(s.countries.map((c) => c.country).filter((c): c is string => !!c)))
      .catch(() => {});
  }, [reload]);

  const apply = (d: Draft) => {
    setDraft(d);
    setApplied(d);
    setPage(1);
    setOpen(null);
  };

  const quick = (days: number | null) =>
    apply({ ...draft, from: days === null ? "" : localDate(days), to: days === null ? "" : localDate(0) });

  async function remove(id: string) {
    try {
      await deleteChat(id);
      setConfirmDelete(null);
      setReload((r) => r + 1);
    } catch (e) {
      onAuthError(e);
    }
  }

  const { chats, stats } = result;
  const topCountry = stats?.countries.find((c) => c.country);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Messages" value={stats?.messages} />
        <Card label="Visitors (unique IPs)" value={stats?.visitors} />
        <Card label="Conversations" value={stats?.conversations} />
        <Card
          label="Top country"
          value={topCountry ? `${flag(topCountry.country)} ${countryName(topCountry.country)}` : stats ? "—" : undefined}
        />
      </div>

      {stats && result.asOf && stats.daily.length > 0 && <DailyBars daily={stats.daily} asOf={result.asOf} />}

      {/* Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply(draft);
        }}
        className="bg-card border border-border rounded-xl p-4 space-y-3"
      >
        <div className="flex flex-wrap gap-2 text-xs">
          {([["Today", 0], ["Last 7 days", 6], ["Last 30 days", 29], ["All", null]] as const).map(([label, d]) => (
            <button
              key={label}
              type="button"
              onClick={() => quick(d)}
              className="px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-primary"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <label className="text-xs text-muted space-y-1">
            <span>From</span>
            <input type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} className={`${input} w-full`} />
          </label>
          <label className="text-xs text-muted space-y-1">
            <span>To</span>
            <input type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} className={`${input} w-full`} />
          </label>
          <label className="text-xs text-muted space-y-1">
            <span>Country</span>
            <select value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} className={`${input} w-full`}>
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {flag(c)} {countryName(c)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted space-y-1">
            <span>IP address</span>
            <input value={draft.ip} onChange={(e) => setDraft({ ...draft, ip: e.target.value })} placeholder="e.g. 24.114." className={`${input} w-full`} />
          </label>
          <label className="text-xs text-muted space-y-1 lg:col-span-2">
            <span>Text</span>
            <input value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} placeholder="Search messages and replies" className={`${input} w-full`} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Apply filters
          </button>
          <button type="button" onClick={() => apply(EMPTY)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
            Reset
          </button>
          <button
            type="button"
            onClick={() => setReload((r) => r + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {applied.session && (
            <span className="text-xs text-muted">
              Showing one conversation ·{" "}
              <button type="button" className="text-primary hover:underline" onClick={() => apply({ ...applied, session: "" })}>
                show all
              </button>
            </span>
          )}
        </div>
      </form>

      {result.error && <p className="text-sm text-danger">{result.error}</p>}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-subtle border-b border-border">
            <tr>
              <th className="w-8" />
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Time</th>
              <th className="px-3 py-3 font-medium">IP</th>
              <th className="px-3 py-3 font-medium">Country</th>
              <th className="px-3 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {chats?.items.map((c) => {
              const at = fromUtc(c.created_at);
              const isOpen = open === c.id;
              return (
                <Fragment key={c.id}>
                  <tr
                    className={`border-b border-border-subtle cursor-pointer hover:bg-surface ${isOpen ? "bg-surface" : ""}`}
                    onClick={() => setOpen(isOpen ? null : c.id)}
                  >
                    <td className="pl-3 text-subtle">{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted">
                      {at.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted">
                      {at.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs">
                      <button
                        className="text-foreground hover:text-primary"
                        title="Filter by this IP"
                        onClick={(e) => {
                          e.stopPropagation();
                          apply({ ...EMPTY, ip: c.ip });
                        }}
                      >
                        {c.ip}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted">
                      {flag(c.country)} {countryName(c.country)}
                    </td>
                    <td className="px-3 py-2.5 text-foreground max-w-xl">
                      <span className={isOpen ? "whitespace-pre-wrap" : "line-clamp-1"}>{c.message}</span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-border bg-surface">
                      <td />
                      <td colSpan={5} className="px-3 pb-4 pt-1">
                        {c.reply && (
                          <div className="mb-3">
                            <p className="text-xs uppercase tracking-wider text-subtle mb-1">Bot reply</p>
                            <p className="text-muted whitespace-pre-wrap max-w-3xl">{c.reply}</p>
                          </div>
                        )}
                        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted max-w-3xl">
                          <div><dt className="inline text-subtle">Site: </dt><dd className="inline">{c.site || "—"}{c.page || ""}</dd></div>
                          <div><dt className="inline text-subtle">Time: </dt><dd className="inline">{at.toLocaleString("en-CA")} (local) · {c.created_at} UTC</dd></div>
                          <div className="sm:col-span-2"><dt className="inline text-subtle">Browser: </dt><dd className="inline break-all">{c.user_agent || "—"}</dd></div>
                        </dl>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs">
                          {c.session_id && (
                            <button className="text-primary hover:underline" onClick={() => apply({ ...EMPTY, session: c.session_id! })}>
                              View whole conversation
                            </button>
                          )}
                          {confirmDelete === c.id ? (
                            <span className="text-muted">
                              Delete this message?{" "}
                              <button className="text-danger hover:underline" onClick={() => remove(c.id)}>Yes, delete</button>{" "}
                              · <button className="hover:underline" onClick={() => setConfirmDelete(null)}>Cancel</button>
                            </span>
                          ) : (
                            <button className="inline-flex items-center gap-1 text-muted hover:text-danger" onClick={() => setConfirmDelete(c.id)}>
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {chats && chats.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">
                  No chats match these filters.
                </td>
              </tr>
            )}
            {!chats && !result.error && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">Loading…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {chats && chats.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            {chats.total} messages · page {chats.page} of {chats.total_pages}
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border border-border disabled:opacity-40">
              Previous
            </button>
            <button disabled={page >= chats.total_pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg border border-border disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-subtle">
        Logs are deleted automatically after {stats?.retention_days ?? 90} days. Times are shown in your local time zone.
        Country lookup: <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" className="underline">IP Geolocation by DB-IP</a>.
      </p>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number | string | undefined }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground truncate">{value ?? "…"}</p>
    </div>
  );
}

function DailyBars({ daily, asOf }: { daily: ChatStats["daily"]; asOf: number }) {
  // last 30 days, filling empty days with zero
  const counts = new Map(daily.map((d) => [d.day, Number(d.messages)]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(asOf - (29 - i) * 86400000).toISOString().slice(0, 10);
    return { day: d, n: counts.get(d) ?? 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.n));
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-muted mb-3">Messages per day, last 30 days (UTC)</p>
      <div className="flex items-end gap-1 h-20">
        {days.map((d) => (
          <div key={d.day} className="flex-1 h-full flex items-end" title={`${d.day}: ${d.n}`}>
            <div className="w-full rounded-sm bg-primary/70" style={{ height: `${d.n ? Math.max(6, (d.n / max) * 100) : 2}%`, opacity: d.n ? 1 : 0.25 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
