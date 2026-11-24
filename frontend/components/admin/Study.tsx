"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { type Learning, type StudyGuide, getLearning } from "@/lib/admin-api";
import { safeUrl } from "./safe-url";

/** Study guides for the user's own projects and the daily lesson, written by the job finder. */
export default function Study({ onAuthError }: { onAuthError: (e: unknown) => boolean }) {
  const [data, setData] = useState<Learning | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLearning()
      .then(setData)
      .catch((e) => {
        if (!onAuthError(e)) setError(e instanceof Error ? e.message : String(e));
      });
  }, [onAuthError]);

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!data) return <p className="text-muted">Loading…</p>;
  if (data.guides.length === 0 && !data.lesson) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
        No study guides yet. The job finder sends them here after its daily run.
      </div>
    );
  }

  const lesson = data.lesson;
  const demand = lesson ? Object.entries(lesson.demand).sort((a, b) => b[1] - a[1]) : [];

  return (
    <div className="space-y-6">
      {lesson && (
        <section className="bg-card border border-primary/40 rounded-xl p-5">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-1">Today&apos;s lesson</p>
          <h2 className="text-xl font-semibold text-foreground">
            {lesson.concept} <span className="text-muted font-normal text-base">· {lesson.project}</span>
          </h2>
          <p className="text-muted mt-2">{lesson.explain}</p>
          {lesson.why && <p className="text-sm text-muted mt-2"><span className="text-foreground">Why it matters:</span> {lesson.why}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            {safeUrl(lesson.url) && (
              <a href={safeUrl(lesson.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                See it in your code: {lesson.where} <ExternalLink size={12} />
              </a>
            )}
            {demand.length > 0 && data.jobs ? (
              <span className="text-subtle">
                Asked for today: {demand.map(([t, n]) => `${t} in ${n} of ${data.jobs} postings`).join(", ")}
              </span>
            ) : null}
          </div>
        </section>
      )}

      {data.gaps && data.gaps.length > 0 && (
        <section className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-amber-500 mb-2">Skills jobs ask for that your studied projects don&apos;t use yet</p>
          <div className="flex flex-wrap gap-2">
            {data.gaps.map((g) => (
              <span key={g.tech} className="text-sm px-2.5 py-1 rounded-md border border-border text-foreground">
                {g.tech} <span className="text-subtle">· {g.count} postings</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-subtle mt-2">
            Based on the {data.guides.length} project{data.guides.length === 1 ? "" : "s"} studied so far. One more project is studied each day.
          </p>
        </section>
      )}

      {data.last_failure && (
        <p className="text-xs text-subtle">
          Last study attempt ({data.last_failure.repo.split("/").pop()}, {data.last_failure.date}) didn&apos;t finish. It will try again on the next run.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Study guides for your projects</h2>
        {data.guides.map((g, i) => (
          <GuideCard key={g.repo} g={g} startOpen={i === 0} />
        ))}
        <p className="text-xs text-subtle">
          Written by AI from your code{data.updated_at ? `, last sent ${new Date(data.updated_at).toLocaleString("en-CA")}` : ""}. AI can be wrong: open the linked files to check.
        </p>
      </section>
    </div>
  );
}

function GuideCard({ g: { name, studied, sha, base_url, guide: gd }, startOpen }: { g: StudyGuide; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const file = (path: string) => {
    const href = safeUrl(base_url + path);
    return href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline">{path}</a>
    ) : (
      <span className="font-mono text-xs">{path}</span>
    );
  };

  return (
    <article className="bg-card border border-border rounded-xl">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-3 p-4 text-left">
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted mt-0.5">{gd.summary}</p>
          <p className="text-xs text-subtle mt-1">Studied {studied} · commit {sha}</p>
        </div>
        <ChevronDown size={18} className={`shrink-0 mt-1 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-5 text-sm border-t border-border pt-4">
          {gd.how_it_works.length > 0 && (
            <Block title="How it works">
              <ol className="list-decimal pl-5 text-muted space-y-1">{gd.how_it_works.map((s) => <li key={s}>{s}</li>)}</ol>
            </Block>
          )}

          {gd.tech.length > 0 && (
            <Block title="Tech and why it's used">
              <dl className="grid sm:grid-cols-[minmax(0,12rem)_1fr] gap-x-4 gap-y-2">
                {gd.tech.map((t) => (
                  <div key={t.name} className="contents">
                    <dt className="text-foreground">{t.name}</dt>
                    <dd className="text-muted">{t.role}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}

          {gd.concepts.length > 0 && (
            <Block title="Concepts to learn">
              <div className="grid md:grid-cols-2 gap-3">
                {gd.concepts.map((c) => (
                  <div key={c.concept} className="bg-surface border border-border rounded-lg p-3">
                    <p className="text-foreground font-medium">{c.concept}</p>
                    {c.explain && <p className="text-muted mt-1">{c.explain}</p>}
                    {c.why_it_matters && <p className="text-muted mt-1"><span className="text-foreground">Why it matters:</span> {c.why_it_matters}</p>}
                    {c.where && <p className="mt-1.5">{file(c.where)}</p>}
                  </div>
                ))}
              </div>
            </Block>
          )}

          {gd.key_files.length > 0 && (
            <Block title="Key files to read">
              <ul className="space-y-1">
                {gd.key_files.map((k) => (
                  <li key={k.path} className="text-muted">{file(k.path)}{k.what ? `: ${k.what}` : ""}</li>
                ))}
              </ul>
            </Block>
          )}

          {gd.interview_pitch && (
            <Block title="Your 30-second interview answer">
              <blockquote className="border-l-2 border-primary pl-3 text-muted italic">{gd.interview_pitch}</blockquote>
            </Block>
          )}

          {gd.likely_questions.length > 0 && (
            <Block title="Questions you'll likely get about it">
              <ol className="space-y-2">
                {gd.likely_questions.map((q, i) => (
                  <li key={q.question}>
                    <p className="text-foreground"><span className="text-subtle">{i + 1}.</span> {q.question}</p>
                    <ul className="list-disc pl-9 text-muted space-y-0.5 mt-0.5">
                      {(q.talking_points ?? []).map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            </Block>
          )}
        </div>
      )}
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-subtle mb-2">{title}</p>
      {children}
    </div>
  );
}
