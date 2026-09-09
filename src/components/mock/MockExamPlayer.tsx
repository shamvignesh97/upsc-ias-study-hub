"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { MockKind, MockQuestion } from "@/types";
import { formatTime, marksFor, scoreAnswers } from "@/lib/mock-scoring";
import { saveMockAttempt } from "@/lib/storage";
import { MOCK_DISCLAIMER } from "@/data/mocks";
import { cn } from "@/lib/utils";

type Phase = "exam" | "confirm" | "result";

export default function MockExamPlayer({
  kind,
  paperKey,
  title,
  questions,
  durationMinutes,
}: {
  kind: MockKind;
  paperKey: string;
  title: string;
  questions: MockQuestion[];
  durationMinutes: number;
}) {
  const durationSeconds = durationMinutes * 60;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(durationSeconds);
  const [phase, setPhase] = useState<Phase>("exam");
  const [paused, setPaused] = useState(false);
  const [mistakesOnly, setMistakesOnly] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const startedAt = useRef(Date.now());
  const [result, setResult] = useState<ReturnType<typeof scoreAnswers> | null>(null);

  const q = questions[index];
  const marks = marksFor(kind);

  useEffect(() => {
    if (phase !== "exam" || paused) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  useEffect(() => {
    if (remaining === 0 && phase === "exam") {
      finalize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase === "exam") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [phase]);

  const answeredCount = useMemo(
    () => questions.filter((x) => answers[x.id] !== null && answers[x.id] !== undefined).length,
    [answers, questions]
  );
  const markedCount = useMemo(
    () => questions.filter((x) => marked[x.id]).length,
    [marked, questions]
  );

  const selectOption = useCallback(
    (opt: number) => {
      if (!q || phase !== "exam") return;
      setAnswers((a) => ({ ...a, [q.id]: opt }));
    },
    [q, phase]
  );

  const clearAnswer = useCallback(() => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: null }));
  }, [q]);

  const toggleMark = useCallback(() => {
    if (!q) return;
    setMarked((m) => ({ ...m, [q.id]: !m[q.id] }));
  }, [q]);

  const finalize = useCallback(() => {
    const scored = scoreAnswers(kind, questions, answers);
    setResult(scored);
    setPhase("result");
    const timeUsed = Math.min(durationSeconds, Math.round((Date.now() - startedAt.current) / 1000));
    saveMockAttempt({
      id: `${kind}-${paperKey}-${Date.now()}`,
      kind,
      paperKey,
      paperTitle: title,
      finishedAt: new Date().toISOString(),
      rawScore: scored.rawScore,
      maxScore: scored.maxScore,
      correct: scored.correct,
      wrong: scored.wrong,
      unattempted: scored.unattempted,
      attempted: scored.attempted,
      accuracy: scored.accuracy,
      timeUsedSeconds: timeUsed,
      durationSeconds,
      passedHeuristic: scored.passedHeuristic,
      topicBreakup: scored.topicBreakup,
      subjectBreakup: scored.subjectBreakup,
    });
  }, [kind, paperKey, title, questions, answers, durationSeconds]);

  const reviewList = useMemo(() => {
    if (!result) return questions;
    if (!mistakesOnly) return questions;
    return questions.filter((qq) => {
      const a = answers[qq.id];
      return a !== null && a !== undefined && a !== qq.correctIndex;
    });
  }, [mistakesOnly, questions, answers, result]);

  if (!questions.length) {
    return <p className="p-6 text-slate-600">Could not load this mock paper.</p>;
  }

  if (phase === "confirm") {
    return (
      <div className="mx-auto max-w-lg space-y-4 p-6">
        <h2 className="text-xl font-bold text-slate-900">Submit mock test?</h2>
        <p className="text-sm text-slate-600">
          Answered <strong>{answeredCount}</strong> / {questions.length} · Marked for review:{" "}
          <strong>{markedCount}</strong> · Time left: <strong>{formatTime(remaining)}</strong>
        </p>
        <p className="text-xs text-slate-500">
          Unattempted = 0 · Wrong = negative marking ({marks.wrong.toFixed(2)}). You can still go back.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPhase("exam")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Continue exam
          </button>
          <button
            type="button"
            onClick={finalize}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit final answers
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    const rq = reviewList[reviewIndex] ?? reviewList[0];
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-amber-800">Scorecard · {title}</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {result.rawScore} / {result.maxScore}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Correct {result.correct} · Wrong {result.wrong} · Unattempted {result.unattempted} ·
            Accuracy {result.accuracy}% · Time used{" "}
            {formatTime(Math.min(durationSeconds, Math.round((Date.now() - startedAt.current) / 1000)))}
          </p>
          <div
            className={cn(
              "mt-4 rounded-lg px-3 py-2 text-sm font-medium",
              result.passedHeuristic ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
            )}
          >
            {result.passedHeuristic ? "Above" : "Below"} heuristic threshold ({result.threshold.score}
            ): {result.threshold.label}
          </div>
          <p className="mt-2 text-xs text-slate-500">{result.threshold.note}</p>
          <p className="mt-3 text-xs text-slate-500">{MOCK_DISCLAIMER}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/mock" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]">
              Back to Mock hub
            </Link>
            <button
              type="button"
              onClick={() => {
                setMistakesOnly(true);
                setReviewIndex(0);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
            >
              Review mistakes only
            </button>
            <button
              type="button"
              onClick={() => {
                setMistakesOnly(false);
                setReviewIndex(0);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
            >
              Review all
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">Subject / section breakup</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {result.subjectBreakup
                .sort((a, b) => b.total - a.total)
                .map((s) => (
                  <li key={s.subjectId} className="flex justify-between gap-2">
                    <span className="capitalize">{s.subjectId.replace(/^csat-/, "")}</span>
                    <span>
                      {s.correct}/{s.total}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">Marking used</h3>
            <p className="mt-2 text-sm text-slate-700">
              Correct +{marks.correct} · Wrong {marks.wrong.toFixed(2)} · Unattempted 0
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Attempt saved in localStorage (up to 40 recent mocks).
            </p>
          </div>
        </div>

        {rq ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <span>
                Review {reviewIndex + 1} / {reviewList.length || 1}
                {mistakesOnly ? " (mistakes)" : ""}
              </span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-800">
                ~{rq.nextExamChance}% theme chance
              </span>
            </div>
            <h3 className="whitespace-pre-wrap text-base font-semibold text-slate-900">{rq.question}</h3>
            <div className="mt-3 space-y-2">
              {rq.options.map((opt, i) => {
                const chosen = answers[rq.id];
                let style = "border-slate-200";
                if (i === rq.correctIndex) style = "border-emerald-500 bg-emerald-50";
                else if (chosen === i) style = "border-rose-400 bg-rose-50";
                return (
                  <div key={i} className={`rounded-lg border px-3 py-2 text-sm ${style}`}>
                    <span className="mr-2 font-semibold text-slate-500">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{rq.explanation}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={reviewIndex <= 0}
                onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={reviewIndex >= reviewList.length - 1}
                onClick={() => setReviewIndex((i) => Math.min(reviewList.length - 1, i + 1))}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-600">No mistakes to review — nice work.</p>
        )}
      </div>
    );
  }

  // Exam UI
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#0f2744] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{title}</div>
            <div className="text-[11px] text-slate-300">
              Q {index + 1}/{questions.length} · Answered {answeredCount} · Marked {markedCount}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-sm font-bold",
                remaining < 300 ? "bg-rose-500 text-white" : "bg-white/10"
              )}
            >
              {formatTime(remaining)}
            </span>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-md border border-white/30 px-2 py-1 text-xs"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => setPhase("confirm")}
              className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-[#0f2744]"
            >
              Submit
            </button>
          </div>
        </div>
        {paused ? (
          <div className="bg-amber-500/20 px-4 py-1 text-center text-xs text-amber-100">
            Timer paused — resume to continue. Leaving the page may lose progress.
          </div>
        ) : null}
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-3 sm:flex-row sm:p-4">
        <aside className="order-2 sm:order-1 sm:w-56">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Question palette
            </div>
            <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto sm:max-h-[70vh] sm:grid-cols-5">
              {questions.map((qq, i) => {
                const answered = answers[qq.id] !== null && answers[qq.id] !== undefined;
                const isMarked = !!marked[qq.id];
                return (
                  <button
                    key={qq.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-8 rounded text-[11px] font-medium",
                      i === index && "ring-2 ring-amber-500",
                      answered ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700",
                      isMarked && "outline outline-2 outline-offset-[-2px] outline-amber-500"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-slate-500">{MOCK_DISCLAIMER}</p>
          </div>
        </aside>

        <section className="order-1 flex-1 sm:order-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize">
                {(q.section || q.subjectId).replace(/^csat-/, "")}
              </span>
              {q.topicId ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5">{q.topicId}</span>
              ) : null}
              <span className="rounded-full bg-rose-50 px-2 py-0.5 font-medium text-rose-800">
                ~{q.nextExamChance}% next-exam theme chance
              </span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">Illustrative</span>
            </div>
            <h2 className="whitespace-pre-wrap text-lg font-semibold text-slate-900">{q.question}</h2>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectOption(i)}
                    className={cn(
                      "block w-full rounded-lg border px-4 py-3 text-left text-sm transition",
                      selected
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-amber-300"
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
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={index >= questions.length - 1}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
              <button
                type="button"
                onClick={toggleMark}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900"
              >
                {marked[q.id] ? "Unmark review" : "Mark for review"}
              </button>
              <button
                type="button"
                onClick={clearAnswer}
                className="rounded-lg border px-3 py-2 text-sm text-slate-600"
              >
                Clear
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
