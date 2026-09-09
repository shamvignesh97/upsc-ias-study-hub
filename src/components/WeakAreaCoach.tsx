"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MockQuestion } from "@/types";
import { analyzeWeakAreas, buildWeakAwarePlan } from "@/lib/weak-areas";
import { saveStoredWeakAreas, setPlanner } from "@/lib/storage";

export default function WeakAreaCoach({
  attemptId,
  paperTitle,
  questions,
  answers,
  topicBreakup,
}: {
  attemptId: string;
  paperTitle: string;
  questions: MockQuestion[];
  answers: Record<string, number | null | undefined>;
  topicBreakup: { topicId: string; correct: number; total: number }[];
}) {
  const rows = useMemo(
    () => analyzeWeakAreas(questions, answers, topicBreakup),
    [questions, answers, topicBreakup]
  );
  const [planMsg, setPlanMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!rows.length) return;
    saveStoredWeakAreas({
      updatedAt: new Date().toISOString(),
      sourceAttemptId: attemptId,
      sourceTitle: paperTitle,
      rows: rows.slice(0, 12),
    });
  }, [rows, attemptId, paperTitle]);

  function persistWeak() {
    saveStoredWeakAreas({
      updatedAt: new Date().toISOString(),
      sourceAttemptId: attemptId,
      sourceTitle: paperTitle,
      rows: rows.slice(0, 12),
    });
  }

  function rebuildPlan() {
    persistWeak();
    const plan = buildWeakAwarePlan(rows.map((r) => r.topicId));
    setPlanner(plan);
    setPlanMsg(`7-day plan rebuilt (${plan.length} topics) — mix of weak + high-prob. Open Planner.`);
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <h3 className="font-semibold">Your weak areas</h3>
        <p className="mt-1">No weak topic clusters this attempt — accuracy looked solid across themes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Your weak areas</h3>
          <p className="mt-1 text-sm text-slate-600">
            Ranked from wrong + unattempted themes. One-click into Study mode; rebuild a 7-day plan
            that mixes these with high next-exam-chance topics (saved in localStorage).
          </p>
        </div>
        <button
          type="button"
          onClick={rebuildPlan}
          className="shrink-0 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Rebuild my 7-day plan
        </button>
      </div>
      {planMsg ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {planMsg}{" "}
          <Link href="/planner" className="font-semibold underline">
            Go to Planner →
          </Link>
        </p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {rows.slice(0, 10).map((r, i) => (
          <li
            key={r.topicId}
            className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-800">
                  {i + 1}
                </span>
                <span className="font-medium text-slate-900">{r.title}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                Accuracy {r.accuracy}% · {r.correct}/{r.total} correct · {r.wrongOrSkip} wrong/skip
              </p>
            </div>
            <Link
              href={r.studyHref}
              className="shrink-0 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-[#0f2744]"
              onClick={persistWeak}
            >
              Study topic →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
