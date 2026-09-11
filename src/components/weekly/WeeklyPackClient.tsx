"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MockQuestion } from "@/types";
import {
  WEEKLY_QUESTION_COUNT,
  istWeekKey,
  sampleWeeklyHighProbPack,
} from "@/lib/drill";
import {
  getWeeklyPackPersist,
  saveWeeklyPackPersist,
  type WeeklyPackPersist,
  type WeeklyPackState,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import ExplanationPanel from "@/components/ExplanationPanel";

export default function WeeklyPackClient() {
  const [questions, setQuestions] = useState<MockQuestion[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [persist, setPersist] = useState<WeeklyPackPersist | null>(null);
  const [index, setIndex] = useState(0);
  const weekKey = useMemo(() => istWeekKey(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@/data/mocks/gs1-pool");
        if (cancelled) return;
        setQuestions(sampleWeeklyHighProbPack(mod.gs1MockPool, weekKey));
      } catch {
        if (!cancelled) setLoadError("Could not load weekly high-prob pack.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [weekKey]);

  useEffect(() => {
    const existing = getWeeklyPackPersist();
    let current: WeeklyPackState =
      existing.current?.weekKey === weekKey
        ? existing.current
        : { weekKey, answered: {}, completed: false, correctCount: 0 };
    const next: WeeklyPackPersist = { ...existing, current };
    saveWeeklyPackPersist(next);
    setPersist(next);
  }, [weekKey]);

  const answeredMap = persist?.current?.answered ?? {};
  const q = questions?.[index];
  const selected = q ? answeredMap[q.id] : undefined;
  const hasAnswer = selected !== undefined;
  const isCorrect = hasAnswer && q && selected === q.correctIndex;
  const answeredCount = questions
    ? questions.filter((qq) => answeredMap[qq.id] !== undefined).length
    : 0;

  const selectOption = useCallback(
    (opt: number) => {
      if (!q || !persist?.current || persist.current.weekKey !== weekKey) return;
      if (answeredMap[q.id] !== undefined) return;
      const answered = { ...persist.current.answered, [q.id]: opt };
      const correctCount = questions
        ? questions.filter((qq) => {
            const a = answered[qq.id];
            return a !== undefined && a === qq.correctIndex;
          }).length
        : 0;
      const completed = Object.keys(answered).length >= WEEKLY_QUESTION_COUNT;
      let history = persist.history;
      let scoreSavedAt = persist.current.scoreSavedAt;
      if (completed && !persist.current.completed) {
        scoreSavedAt = new Date().toISOString();
        history = [
          {
            weekKey,
            correctCount,
            total: WEEKLY_QUESTION_COUNT,
            savedAt: scoreSavedAt,
          },
          ...history.filter((h) => h.weekKey !== weekKey),
        ].slice(0, 12);
      }
      const current: WeeklyPackState = {
        weekKey,
        answered,
        completed,
        correctCount,
        scoreSavedAt,
      };
      const next: WeeklyPackPersist = { history, current };
      saveWeeklyPackPersist(next);
      setPersist(next);
    },
    [q, persist, weekKey, answeredMap, questions]
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
          <h1 className="text-3xl font-bold text-slate-900">Weekly high-prob pack</h1>
          <p className="mt-1 text-sm text-slate-600">
            {WEEKLY_QUESTION_COUNT} mixed GS1 MCQs drawn only from High-chance portions (≥70%) —
            Loop’s 10-year PYQ synthesis. Seeded by week ({weekKey}) — refresh won’t reshuffle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-900">
            {answeredCount}/{WEEKLY_QUESTION_COUNT}
          </span>
          {persist.current?.completed ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">
              Score {persist.current.correctCount}/{WEEKLY_QUESTION_COUNT} saved
            </span>
          ) : null}
        </div>
      </div>

      {persist.current?.completed ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          Pack complete — {persist.current.correctCount}/{WEEKLY_QUESTION_COUNT} correct (saved in
          localStorage).{" "}
          <Link href="/revise/flash" className="font-semibold underline">
            Revise 10 flash points
          </Link>{" "}
          ·{" "}
          <Link href="/battle" className="font-semibold underline">
            Battle cards
          </Link>
        </div>
      ) : null}

      {persist.history.length > 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Recent weeks: </span>
          {persist.history.slice(0, 4).map((h) => (
            <span key={h.weekKey} className="mr-2 tabular-nums">
              {h.weekKey} {h.correctCount}/{h.total}
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
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
                i === index && "ring-2 ring-rose-500",
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
            <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-800">
              ~{q.nextExamChance}% Loop chance
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">
              Q {index + 1}/{questions.length}
            </span>
          </div>
          <h2 className="whitespace-pre-wrap text-lg font-semibold text-slate-900">{q.question}</h2>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              let style = "border-slate-200 hover:border-rose-300";
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
              <ExplanationPanel
                className="mt-2 bg-white/70"
                explanation={q.explanation}
                correctIndex={q.correctIndex}
              />
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
