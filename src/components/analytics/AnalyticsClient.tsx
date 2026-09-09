"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMockHistory, getStoredWeakAreas, type StoredMockAttempt } from "@/lib/storage";
import { buildAnalytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function SparkBars({
  values,
  labels,
  kindColors,
}: {
  values: number[];
  labels: string[];
  kindColors: string[];
}) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-40 items-end gap-1.5 overflow-x-auto pb-1">
      {values.map((v, i) => (
        <div key={i} className="flex min-w-[28px] flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-medium text-slate-600">{v}</span>
          <div
            className={cn("w-full max-w-[36px] rounded-t-md", kindColors[i] ?? "bg-amber-500")}
            style={{ height: `${Math.max(8, Math.round((100 * v) / max))}%` }}
            title={labels[i]}
          />
          <span className="max-w-[40px] truncate text-[9px] text-slate-400" title={labels[i]}>
            {labels[i]?.split("·")[0]?.trim() ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsClient() {
  const [history, setHistory] = useState<StoredMockAttempt[]>([]);
  const [weak, setWeak] = useState(getStoredWeakAreas());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHistory(getMockHistory());
    setWeak(getStoredWeakAreas());
    setReady(true);
  }, []);

  const summary = useMemo(() => buildAnalytics(history), [history]);

  if (!ready) return <div className="h-48 animate-pulse rounded-xl bg-slate-100" />;

  if (!history.length) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Attempt analytics</h1>
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-700">No mock attempts yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Finish a Prelims GS1 or CSAT mock — scores, accuracy, and subject averages will appear
            here (stored in localStorage).
          </p>
          <Link
            href="/mock"
            className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]"
          >
            Open Mock hub →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Attempt analytics</h1>
        <p className="mt-1 text-sm text-slate-600">
          From {history.length} saved mock attempt{history.length === 1 ? "" : "s"} (local only).
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg accuracy" value={`${summary.avgAccuracy}%`} />
        <StatCard
          label="Avg GS1 score"
          value={summary.avgGs1Score != null ? `${summary.avgGs1Score}` : "—"}
          hint=" / 200 heuristic"
        />
        <StatCard
          label="Avg CSAT score"
          value={summary.avgCsatScore != null ? `${summary.avgCsatScore}` : "—"}
          hint=" qualifying ≈66.7"
        />
        <StatCard label="Attempts" value={`${history.length}`} hint={`GS1 ${summary.gs1.length} · CSAT ${summary.csat.length}`} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-semibold text-slate-900">Scores over time</h2>
        <p className="text-xs text-slate-500">Raw score by attempt (amber = GS1, sky = CSAT).</p>
        <div className="mt-4">
          <SparkBars
            values={summary.points.map((p) => p.rawScore)}
            labels={summary.points.map((p) => p.label)}
            kindColors={summary.points.map((p) =>
              p.kind === "gs1" ? "bg-amber-500" : "bg-sky-500"
            )}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-900">Cutoff proximity</h2>
          <p className="mt-1 text-xs text-slate-500">Latest attempt vs educational heuristic (not official).</p>
          <ul className="mt-3 space-y-3 text-sm">
            {summary.gs1CutoffProximity ? (
              <li className="rounded-lg bg-amber-50 px-3 py-2 text-amber-950">
                <strong>GS1</strong> latest {summary.gs1CutoffProximity.score} vs band{" "}
                {summary.gs1CutoffProximity.bandLow}–{summary.gs1CutoffProximity.bandHigh}
                <span className="mt-0.5 block text-xs">
                  {summary.gs1CutoffProximity.delta >= 0 ? "Above" : "Below"} low band by{" "}
                  {Math.abs(summary.gs1CutoffProximity.delta)} marks
                </span>
              </li>
            ) : (
              <li className="text-slate-500">No GS1 attempts yet.</li>
            )}
            {summary.csatCutoffProximity ? (
              <li className="rounded-lg bg-sky-50 px-3 py-2 text-sky-950">
                <strong>CSAT</strong> latest {summary.csatCutoffProximity.score} vs ≈
                {summary.csatCutoffProximity.qualifying} qualifying
                <span className="mt-0.5 block text-xs">
                  {summary.csatCutoffProximity.delta >= 0 ? "Above" : "Below"} by{" "}
                  {Math.abs(summary.csatCutoffProximity.delta)} marks
                </span>
              </li>
            ) : (
              <li className="text-slate-500">No CSAT attempts yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-900">Subject-wise averages</h2>
          <p className="mt-1 text-xs text-slate-500">Pooled accuracy across all attempts (lowest first).</p>
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
            {summary.subjectAverages.map((s) => (
              <li key={s.subjectId} className="flex items-center gap-2">
                <span className="w-24 shrink-0 capitalize text-slate-700">{s.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      s.accuracy >= 70 ? "bg-emerald-500" : s.accuracy >= 50 ? "bg-amber-500" : "bg-rose-500"
                    )}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
                <span className="w-16 text-right text-xs text-slate-600">
                  {s.accuracy}% · {s.correct}/{s.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {weak?.rows?.length ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
          <h2 className="font-semibold text-slate-900">Last weak-area snapshot</h2>
          <p className="text-xs text-slate-600">
            From {weak.sourceTitle} · persisted for coaching
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {weak.rows.slice(0, 6).map((r) => (
              <li key={r.topicId}>
                <Link href={r.studyHref} className="text-sm font-medium text-amber-900 underline">
                  {r.title}
                </Link>
                <span className="ml-2 text-xs text-slate-600">{r.accuracy}% acc</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-900">Recent attempts</h2>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {history.slice(0, 12).map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>
                <span className="font-medium text-slate-900">{a.paperTitle}</span>
                <span className="ml-2 text-xs text-slate-500">
                  {new Date(a.finishedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                </span>
              </span>
              <span className="text-slate-700">
                {a.rawScore}/{a.maxScore} · {a.accuracy}%
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}
