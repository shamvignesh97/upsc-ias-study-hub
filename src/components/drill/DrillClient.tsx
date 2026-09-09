"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MockQuestion } from "@/types";
import { DRILL_QUESTION_COUNT, istDayKey, previousIstDayKey, sampleDailyDrill } from "@/lib/drill";
import {
  getDrillPersist,
  saveDrillPersist,
  type DrillDayState,
  type DrillPersist,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import ExplanationPanel from "@/components/ExplanationPanel";

export default function DrillClient() {
  const [questions, setQuestions] = useState<MockQuestion[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [persist, setPersist] = useState<DrillPersist | null>(null);
  const [index, setIndex] = useState(0);
  const dayKey = useMemo(() => istDayKey(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@/data/mocks/gs1-pool");
        if (cancelled) return;
        const sampled = sampleDailyDrill(mod.gs1MockPool, dayKey);
        setQuestions(sampled);
      } catch {
        if (!cancelled) setLoadError("Could not load today’s drill bank.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dayKey]);

  useEffect(() => {
    const existing = getDrillPersist();
    let today: DrillDayState =
      existing.today?.dayKey === dayKey
        ? existing.today
        : { dayKey, answered: {}, completed: false, correctCount: 0 };
    const next: DrillPersist = { ...existing, today };
    saveDrillPersist(next);
    setPersist(next);
  }, [dayKey]);

  const answeredMap = persist?.today?.answered ?? {};
  const q = questions?.[index];
  const selected = q ? answeredMap[q.id] : undefined;
  const hasAnswer = selected !== undefined;
  const isCorrect = hasAnswer && q && selected === q.correctIndex;
  const answeredCount = questions
    ? questions.filter((qq) => answeredMap[qq.id] !== undefined).length
    : 0;

  const selectOption = useCallback(
    (opt: number) => {
      if (!q || !persist?.today || persist.today.dayKey !== dayKey) return;
      if (answeredMap[q.id] !== undefined) return;
      const answered = { ...persist.today.answered, [q.id]: opt };
      const correctCount = questions
        ? questions.filter((qq) => {
            const a = answered[qq.id];
            return a !== undefined && a === qq.correctIndex;
          }).length
        : 0;
      const completed = Object.keys(answered).length >= DRILL_QUESTION_COUNT;
      let streak = persist.streak;
      let bestStreak = persist.bestStreak;
      let lastCompletedDay = persist.lastCompletedDay;
      if (completed && !persist.today.completed) {
        const prev = previousIstDayKey(dayKey);
        if (lastCompletedDay === prev) streak = persist.streak + 1;
        else if (lastCompletedDay === dayKey) streak = persist.streak;
        else streak = 1;
        bestStreak = Math.max(bestStreak, streak);
        lastCompletedDay = dayKey;
      }
      const today: DrillDayState = {
        dayKey,
        answered,
        completed,
        correctCount,
      };
      const next: DrillPersist = { streak, bestStreak, lastCompletedDay, today };
      saveDrillPersist(next);
      setPersist(next);
    },
    [q, persist, dayKey, answeredMap, questions]
  );

  if (loadError) {
    return <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{loadError}</p>;
  }

  if (!questions || !persist) {
    return <div className="h-48 animate-pulse rounded-xl bg-slate-100" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Drill</h1>
          <p className="mt-1 text-sm text-slate-600">
            10 GS1-weighted questions from high next-exam-chance themes. Seeded by date (
            {dayKey} IST) — refresh won’t reshuffle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">
            Streak {persist.streak}🔥
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            Best {persist.bestStreak}
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-900">
            Today {answeredCount}/{DRILL_QUESTION_COUNT}
          </span>
        </div>
      </div>

      {persist.today?.completed ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          Drill complete — {persist.today.correctCount}/{DRILL_QUESTION_COUNT} correct. Streak saved
          in localStorage.{" "}
          <Link href="/analytics" className="font-semibold underline">
            See analytics
          </Link>{" "}
          or keep reviewing below.
        </div>
      ) : null}

      <div className="grid gap-2 grid-cols-5 sm:grid-cols-10">
        {questions.map((qq, i) => {
          const a = answeredMap[qq.id];
          const done = a !== undefined;
          const ok = done && a === qq.correctIndex;
          return (
            <button
              key={qq.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-9 rounded-md text-xs font-semibold",
                i === index && "ring-2 ring-amber-500",
                !done && "bg-slate-100 text-slate-700",
                done && ok && "bg-emerald-100 text-emerald-900",
                done && !ok && "bg-rose-100 text-rose-900"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {q ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize">{q.subjectId}</span>
            {q.topicId ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5">{q.topicId}</span>
            ) : null}
            <span className="rounded-full bg-rose-50 px-2 py-0.5 font-medium text-rose-800">
              ~{q.nextExamChance}% theme chance
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">
              Q {index + 1}/{questions.length}
            </span>
          </div>
          <h2 className="whitespace-pre-wrap text-lg font-semibold text-slate-900">{q.question}</h2>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              let style = "border-slate-200 hover:border-amber-300";
              if (hasAnswer) {
                if (i === q.correctIndex) style = "border-emerald-500 bg-emerald-50";
                else if (selected === i) style = "border-rose-400 bg-rose-50";
                else style = "border-slate-100 opacity-70";
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={hasAnswer}
                  onClick={() => selectOption(i)}
                  className={cn(
                    "block w-full rounded-lg border px-4 py-3 text-left text-sm transition disabled:cursor-default",
                    style
                  )}
                >
                  <span className="mr-2 font-semibold text-slate-500">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {hasAnswer ? (
            <div
              className={cn(
                "mt-4 rounded-lg border px-3 py-3 text-sm",
                isCorrect
                  ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                  : "border-rose-200 bg-rose-50 text-rose-950"
              )}
            >
              {isCorrect ? (
                <p className="font-semibold">Correct.</p>
              ) : (
                <p className="font-semibold">
                  Incorrect. Correct: {String.fromCharCode(65 + q.correctIndex)}
                </p>
              )}
              <ExplanationPanel className="mt-2 bg-white/70" explanation={q.explanation} correctIndex={q.correctIndex} />
              {q.topicId ? (
                <Link
                  href={`/topic/${q.topicId}`}
                  className="mt-2 inline-block text-xs font-semibold text-amber-900 underline"
                >
                  Open topic notes →
                </Link>
              ) : null}
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={index >= questions.length - 1}
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
