"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { type Job, type JobStatus, fromUtc, getJobs, setJobStatus } from "@/lib/admin-api";

const BUCKETS: Record<string, string> = {
  ottawa: "Ottawa area",
  remote_canada: "Remote (Canada)",
  remote_worldwide: "Remote (worldwide)",
};
const SOURCES: Record<string, string> = {
  remotive: "Remotive", remoteok: "Remote OK", jobicy: "Jobicy", himalayas: "Himalayas",
  adzuna: "Adzuna", greenhouse: "Greenhouse", lever: "Lever", ashby: "Ashby",
};
const STATUS_TABS: { id: JobStatus | "all"; label: string }[] = [
  { id: "new", label: "New" },
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "hidden", label: "Hidden" },
  { id: "all", label: "All" },
];

const input =
  "rounded-lg bg-surface border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary";

export default function JobMatches({ onAuthError }: { onAuthError: (e: unknown) => boolean }) {
  const [data, setData] = useState<{ updated_at: string | null; items: Job[] } | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<JobStatus | "all">("new");
  const [bucket, setBucket] = useState("");
  const [minScore, setMinScore] = useState(60);
  const [q, setQ] = useState("");

  useEffect(() => {
    getJobs()
      .then(setData)
      .catch((e) => {
        if (!onAuthError(e)) setError(e instanceof Error ? e.message : String(e));
      });
  }, [onAuthError]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0, new: 0, saved: 0, applied: 0, hidden: 0 };
    data?.items.forEach((j) => {
      if (j.score < minScore) return;
      c[j.status]++;
      if (j.status !== "hidden") c.all++;
    });
    return c;
  }, [data, minScore]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.items ?? [])
      .filter((j) => (status === "all" ? j.status !== "hidden" : j.status === status))
      .filter((j) => j.score >= minScore)
      .filter((j) => !bucket || j.bucket === bucket)
      .filter((j) => !term || `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(term))
      .sort((a, b) => b.found.localeCompare(a.found) || b.score - a.score);
  }, [data, status, bucket, minScore, q]);

  async function mark(job: Job, next: JobStatus) {
    const prev = job.status;
    setData((d) => d && { ...d, items: d.items.map((j) => (j.id === job.id ? { ...j, status: next } : j)) });
    try {
      await setJobStatus(job.id, next);
    } catch (e) {
      setData((d) => d && { ...d, items: d.items.map((j) => (j.id === job.id ? { ...j, status: prev } : j)) });
      if (!onAuthError(e)) setError(e instanceof Error ? e.message : String(e));
    }
  }

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!data) return <p className="text-muted">Loading…</p>;
  if (data.items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
        No job matches yet. The job finder sends results here after its daily run.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setStatus(t.id)}
              className={`px-3 py-1.5 text-sm rounded-md ${status === t.id ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
            >
              {t.label} <span className="opacity-70">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <select value={bucket} onChange={(e) => setBucket(e.target.value)} className={input} aria-label="Location">
          <option value="">All locations</option>
          {Object.entries(BUCKETS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className={input} aria-label="Minimum score">
          {[0, 50, 60, 70, 80, 90].map((n) => (
            <option key={n} value={n}>{n === 0 ? "Any score" : `Score ${n}+`}</option>
          ))}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, company" className={`${input} flex-1 min-w-48`} />
      </div>

      <p className="text-xs text-subtle">
        {data.updated_at ? `Last run ${fromUtc(data.updated_at.slice(0, 19).replace("T", " ")).toLocaleString("en-CA")}` : "Never run"} ·{" "}
        {shown.length} shown
      </p>

      <div className="space-y-3">
        {shown.map((j) => (
          <JobCard key={j.id} job={j} onMark={(s) => mark(j, s)} />
        ))}
        {shown.length === 0 && <p className="text-muted text-sm">Nothing here with these filters.</p>}
      </div>
    </div>
  );
}

function JobCard({ job: j, onMark }: { job: Job; onMark: (s: JobStatus) => void }) {
  const [showLetter, setShowLetter] = useState(false);
  const [copied, setCopied] = useState(false);
  const tone = j.score >= 85 ? "bg-success" : j.score >= 70 ? "bg-primary" : "bg-amber-600";

  async function copy() {
    await navigator.clipboard.writeText(`Subject: ${j.letter_subject ?? ""}\n\n${j.letter ?? ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <article className={`bg-card border border-border rounded-xl p-4 ${j.status === "hidden" ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start gap-3">
        <span className={`${tone} text-white text-sm font-bold rounded-md px-2 py-0.5`} title="Fit score">{j.score}</span>
        <div className="flex-1 min-w-0">
          <a href={j.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary inline-flex items-center gap-1.5">
            {j.title} <ExternalLink size={13} className="opacity-60" />
          </a>
          <p className="text-sm text-muted">
            {j.company} · {BUCKETS[j.bucket] ?? j.bucket}
            {j.contract ? " · contract" : ""}
            {j.location ? ` · ${j.location}` : ""}
            {j.salary ? ` · ${j.salary}` : ""}
          </p>
          <p className="text-xs text-subtle mt-0.5">
            Posted {j.posted ?? "—"} · found {j.found} · via {SOURCES[j.source] ?? j.source}
            {!j.eligible && <span className="text-danger"> · may not be open to Canada</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {(["saved", "applied", "hidden"] as const).map((s) =>
            j.status === s ? (
              <button key={s} onClick={() => onMark("new")} className="px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/40 capitalize" title="Undo">
                {s} ✓
              </button>
            ) : (
              <button key={s} onClick={() => onMark(s)} className="px-2.5 py-1 rounded-md border border-border text-muted hover:text-foreground">
                {s === "saved" ? "Save" : s === "applied" ? "Mark applied" : "Hide"}
              </button>
            ),
          )}
        </div>
      </div>

      {(j.why?.length || j.gaps?.length) ? (
        <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
          {j.why?.length ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-success mb-1">Why it fits</p>
              <ul className="list-disc pl-5 text-muted space-y-0.5">{j.why.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
          ) : null}
          {j.gaps?.length ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-500 mb-1">Gaps</p>
              <ul className="list-disc pl-5 text-muted space-y-0.5">{j.gaps.map((g) => <li key={g}>{g}</li>)}</ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {j.letter && (
        <div className="mt-3">
          <button onClick={() => setShowLetter(!showLetter)} className="text-sm text-primary hover:underline">
            {showLetter ? "Hide cover letter draft" : "Show cover letter draft"}
          </button>
          {showLetter && (
            <div className="mt-2 bg-surface border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm text-foreground"><span className="text-subtle">Subject:</span> {j.letter_subject}</p>
                <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground shrink-0">
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <p className="text-sm text-muted whitespace-pre-wrap">{j.letter}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
