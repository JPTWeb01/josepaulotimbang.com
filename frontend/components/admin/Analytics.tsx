"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { type AnalyticsData, getAnalytics, getRealtime } from "@/lib/admin-api";

const RANGES = [7, 28, 90];
const SITE = "https://josepaulotimbang.com";

const fmt = (n: number | null | undefined) => (n == null ? "—" : Math.round(n).toLocaleString("en-CA"));
const pct = (n: number | null | undefined) => (n == null ? "—" : `${(n * 100).toFixed(1)}%`);
const dur = (s: number | null | undefined) => {
  if (s == null) return "—";
  const m = Math.floor(s / 60);
  return m ? `${m}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`;
};

// Search Console reports countries as ISO 3166 alpha-3 codes
const A3: Record<string, string> = {
  can: "Canada", usa: "United States", phl: "Philippines", ind: "India", gbr: "United Kingdom",
  aus: "Australia", deu: "Germany", fra: "France", nld: "Netherlands", sgp: "Singapore",
  bra: "Brazil", mex: "Mexico", jpn: "Japan", kor: "South Korea", chn: "China", pak: "Pakistan",
  bgd: "Bangladesh", nga: "Nigeria", ken: "Kenya", zaf: "South Africa", are: "United Arab Emirates",
  sau: "Saudi Arabia", esp: "Spain", ita: "Italy", irl: "Ireland", pol: "Poland", ukr: "Ukraine",
  rus: "Russia", tur: "Turkey", idn: "Indonesia", mys: "Malaysia", vnm: "Vietnam", tha: "Thailand",
  nzl: "New Zealand", swe: "Sweden", nor: "Norway", che: "Switzerland", egy: "Egypt", hkg: "Hong Kong",
};

type State = { key: string; data?: AnalyticsData; error?: string };

export default function Analytics({ onAuthError }: { onAuthError: (e: unknown) => boolean }) {
  const [days, setDays] = useState(28);
  const [reload, setReload] = useState(0);
  const [state, setState] = useState<State>({ key: "" });
  const [live, setLive] = useState<number | null>(null);

  const key = `${days}:${reload}`;
  const loading = state.key !== key;

  useEffect(() => {
    let alive = true;
    getAnalytics(days, reload > 0)
      .then((data) => alive && setState({ key, data }))
      .catch((e) => {
        if (alive && !onAuthError(e)) setState({ key, error: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      alive = false;
    };
  }, [key, days, reload, onAuthError]);

  // Live visitors, refreshed every minute while this tab is open
  useEffect(() => {
    const tick = () => getRealtime().then((r) => setLive(r.active_users)).catch(() => {});
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  const data = state.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1" role="group" aria-label="Date range">
          {RANGES.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-sm rounded-md ${days === d ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
            >
              {d} days
            </button>
          ))}
        </div>
        <button
          onClick={() => setReload((r) => r + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-card text-muted hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
        {live != null && (
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden />
            {live} on the site now
          </span>
        )}
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {!data && !state.error && <p className="text-muted">Loading…</p>}

      {data && (
        <>
          <GaSection data={data} days={days} />
          <ScSection data={data} days={days} />

          <section>
            <SectionTitle title="From your site" note={`last ${days} days`} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat label="Chatbot messages" value={fmt(data.site.chat_messages)} hint={`from ${fmt(data.site.chat_visitors)} visitors`} />
              <Stat label="Job matches (latest run)" value={fmt(data.site.job_matches)} />
              <Stat label="Jobs marked applied" value={fmt(data.site.jobs_applied)} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ─── Google Analytics ───────────────────────────────────────────────────

function GaSection({ data, days }: { data: AnalyticsData; days: number }) {
  const ga = data.ga;
  if (!data.ga_configured) return <Setup data={data} which="ga" />;
  if (data.ga_error) return <ErrorBox title="Google Analytics" msg={data.ga_error} />;
  if (!ga) return null;

  const t = ga.totals;
  const ev = Object.fromEntries(ga.events.map((e) => [e.name, e.count]));
  const leads = (ev.resume_download ?? 0) + (ev.contact_submit ?? 0) + (ev.contact_email ?? 0) + (ev.click_linkedin ?? 0);

  return (
    <section className="space-y-4">
      <SectionTitle title="Visitors" note={`Google Analytics · last ${days} days`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Visitors" value={fmt(t.activeUsers)} hint={`${fmt(t.newUsers)} new`} />
        <Stat label="Page views" value={fmt(t.screenPageViews)} hint={`${fmt(t.sessions)} visits`} />
        <Stat label="Engaged visits" value={pct(t.engagementRate)} hint={`avg. ${dur(t.averageSessionDuration)} per visit`} />
        <Stat label="Recruiter actions" value={fmt(leads)} hint="resume, contact, email, LinkedIn" />
      </div>

      <Panel title="Visitors per day">
        <DailyChart
          days={days}
          rows={ga.daily.map((d) => ({ date: d.date, value: d.activeUsers, extra: `${fmt(d.screenPageViews)} page views` }))}
          unit="visitors"
        />
      </Panel>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Actions on the site">
          <BarList rows={ga.events.map((e) => ({ label: e.label, value: e.count }))} empty="No actions yet" />
        </Panel>
        <Panel title="Top pages">
          <BarList rows={ga.pages.map((p) => ({ label: p.pagePath, value: p.screenPageViews, href: SITE + p.pagePath }))} />
        </Panel>
        <Panel title="How people find you">
          <BarList rows={ga.channels.map((c) => ({ label: c.sessionDefaultChannelGroup, value: c.sessions }))} />
        </Panel>
        <Panel title="Top sources">
          <BarList rows={ga.sources.map((s) => ({ label: s.sessionSource, value: s.sessions }))} />
        </Panel>
        <Panel title="Countries">
          <BarList rows={ga.countries.map((c) => ({ label: c.country, value: c.activeUsers }))} />
        </Panel>
        <Panel title="Cities">
          <BarList rows={ga.cities.map((c) => ({ label: c.city, value: c.activeUsers }))} />
        </Panel>
        <Panel title="Devices">
          <BarList rows={ga.devices.map((d) => ({ label: cap(d.deviceCategory), value: d.activeUsers }))} />
        </Panel>
      </div>
    </section>
  );
}

// ─── Search Console ─────────────────────────────────────────────────────

function ScSection({ data, days }: { data: AnalyticsData; days: number }) {
  const sc = data.sc;
  if (!data.sc_configured) return <Setup data={data} which="sc" />;
  if (data.sc_error) return <ErrorBox title="Google Search (Search Console)" msg={data.sc_error} />;
  if (!sc) return null;

  const t = sc.totals;
  const path = (u: string) => u.replace(/^https?:\/\/(www\.)?josepaulotimbang\.com/, "") || "/";

  return (
    <section className="space-y-4">
      <SectionTitle title="Google Search (SEO)" note={`Search Console · last ${days} days · Google's data runs 2–3 days behind`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Clicks from Google" value={fmt(t.clicks)} />
        <Stat label="Times shown in Google" value={fmt(t.impressions)} hint="impressions" />
        <Stat label="Click rate" value={pct(t.ctr)} hint="clicks ÷ impressions" />
        <Stat label="Average position" value={t.impressions ? t.position.toFixed(1) : "—"} hint="1 = top result" />
      </div>

      <Panel title="Clicks from Google per day">
        <DailyChart
          days={days}
          rows={sc.daily.map((d) => ({ date: d.date, value: d.clicks, extra: `${fmt(d.impressions)} impressions · pos. ${d.position.toFixed(1)}` }))}
          unit="clicks"
        />
      </Panel>

      <Panel title="What people search to find you">
        {sc.queries.length === 0 ? (
          <p className="text-sm text-muted">No searches yet. New sites can take a few weeks to show up.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-subtle">
                  <th className="py-2 pr-3 font-medium">Search</th>
                  <th className="py-2 px-3 font-medium text-right">Clicks</th>
                  <th className="py-2 px-3 font-medium text-right">Shown</th>
                  <th className="py-2 px-3 font-medium text-right">Click rate</th>
                  <th className="py-2 pl-3 font-medium text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {sc.queries.map((q) => (
                  <tr key={q.query} className="border-t border-border">
                    <td className="py-2 pr-3 text-foreground">{q.query}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-foreground">{fmt(q.clicks)}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-muted">{fmt(q.impressions)}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-muted">{pct(q.ctr)}</td>
                    <td className="py-2 pl-3 text-right tabular-nums text-muted">{q.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Top pages in Google (clicks)">
          <BarList rows={sc.pages.map((p) => ({ label: path(p.page), value: p.clicks, href: p.page, hint: `${fmt(p.impressions)} shown` }))} />
        </Panel>
        <Panel title="Searchers by country (clicks)">
          <BarList rows={sc.countries.map((c) => ({ label: A3[c.country] ?? c.country.toUpperCase(), value: c.clicks, hint: `${fmt(c.impressions)} shown` }))} />
        </Panel>
        <Panel title="Searchers by device (clicks)">
          <BarList rows={sc.devices.map((d) => ({ label: cap(d.device), value: d.clicks, hint: `${fmt(d.impressions)} shown` }))} />
        </Panel>
      </div>
    </section>
  );
}

// ─── Setup / errors ─────────────────────────────────────────────────────

function Setup({ data, which }: { data: AnalyticsData; which: "ga" | "sc" }) {
  const title = which === "ga" ? "Connect Google Analytics" : "Connect Google Search Console";
  const missing: string[] = [];
  if (!data.service_account) missing.push("the service account key file (writable/google/service-account.json)");
  if (which === "ga" && data.service_account && !data.ga_configured) missing.push("GA_PROPERTY_ID in .env");
  if (which === "sc" && data.service_account && !data.sc_configured) missing.push("SEARCH_CONSOLE_SITE in .env");
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted mt-1">Not connected yet. Missing: {missing.join(" and ") || "setup"}.</p>
    </div>
  );
}

function ErrorBox({ title, msg }: { title: string; msg: string }) {
  return (
    <div className="bg-card border border-danger/40 rounded-xl p-5">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-danger mt-1">{msg}</p>
    </div>
  );
}

// ─── Building blocks ────────────────────────────────────────────────────

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s);

function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {note && <p className="text-xs text-subtle">{note}</p>}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{value}</p>
      {hint && <p className="text-xs text-subtle mt-0.5">{hint}</p>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      {children}
    </div>
  );
}

type Bar = { label: string; value: number; href?: string; hint?: string };

/** Ranked horizontal bars: one hue for magnitude, label and value in text colours. */
function BarList({ rows, empty = "No data yet" }: { rows: Bar[]; empty?: string }) {
  if (!rows.length) return <p className="text-sm text-muted">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2">
      {rows.map((r, i) => {
        const label = r.label || "(not set)";
        return (
          <li key={`${label}-${i}`} title={`${label}: ${fmt(r.value)}${r.hint ? ` · ${r.hint}` : ""}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              {r.href ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="truncate text-muted hover:text-primary">{label}</a>
              ) : (
                <span className="truncate text-muted">{label}</span>
              )}
              <span className="tabular-nums text-foreground shrink-0">{fmt(r.value)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(r.value ? 2 : 0, (r.value / max) * 100)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const localYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Single-series daily line with a hover crosshair + tooltip. Missing days count as 0. */
function DailyChart({ rows, days, unit }: { rows: { date: string; value: number; extra?: string }[]; days: number; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);

  const points = useMemo(() => {
    const byDate = new Map(rows.map((r) => [r.date, r]));
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i));
      const key = localYmd(d);
      const r = byDate.get(key);
      return { date: key, value: r?.value ?? 0, extra: r?.extra };
    });
  }, [rows, days]);

  const W = 600, H = 150, PAD = 6;
  const max = Math.max(1, ...points.map((p) => p.value));
  const x = (i: number) => (points.length === 1 ? W / 2 : (i / (points.length - 1)) * W);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const total = points.reduce((s, p) => s + p.value, 0);
  const h = hover != null ? points[hover] : null;
  const label = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

  if (total === 0) return <p className="text-sm text-muted">No {unit} in this period yet.</p>;

  return (
    <div>
      <div className="flex justify-between text-xs text-subtle mb-1 tabular-nums">
        <span>max {fmt(max)} / day</span>
        <span>{fmt(total)} total</span>
      </div>
      <div
        className="relative"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const i = Math.round(((e.clientX - box.left) / box.width) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, i)));
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-36 block" role="img" aria-label={`${cap(unit)} per day`}>
          <line x1="0" x2={W} y1={H - PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={area} fill="var(--color-primary)" opacity="0.12" />
          <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {hover != null && (
            <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        {h && hover != null && (
          <>
            <span
              className="absolute w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-card pointer-events-none"
              style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(h.value) / H) * 100}%`, transform: "translate(-50%,-50%)" }}
            />
            <div
              className="absolute top-0 z-10 pointer-events-none bg-surface border border-border rounded-lg px-3 py-2 text-xs shadow-lg whitespace-nowrap"
              style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > points.length / 2 ? "calc(-100% - 10px)" : "10px"})` }}
            >
              <p className="text-muted">{label(h.date)}</p>
              <p className="text-foreground font-medium tabular-nums">{fmt(h.value)} {unit}</p>
              {h.extra && <p className="text-subtle tabular-nums">{h.extra}</p>}
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between text-xs text-subtle mt-1">
        <span>{label(points[0].date)}</span>
        <span>{label(points[points.length - 1].date)}</span>
      </div>
    </div>
  );
}
