"use client";

import { useMemo, useState } from "react";
import { QuizQuestion } from "@/types";

export default function QuizPlayer({ questions }: { questions: QuizQuestion[] }) {
  const shuffled = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!shuffled.length) {
    return <p className="text-slate-600">No questions available for this subject yet.</p>;
  }

  const q = shuffled[index];

  function submit(opt: number) {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === q.correctIndex) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= shuffled.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Quiz complete</h2>
        <p className="mt-2 text-slate-600">
          Score: <strong>{score}</strong> / {shuffled.length} (
          {Math.round((score / shuffled.length) * 100)}%)
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>
          Question {index + 1} of {shuffled.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{q.question}</h2>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "border-slate-200 hover:border-amber-300";
          if (selected !== null) {
            if (i === q.correctIndex) style = "border-emerald-500 bg-emerald-50";
            else if (i === selected) style = "border-rose-400 bg-rose-50";
            else style = "border-slate-100 opacity-70";
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => submit(i)}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-sm ${style}`}
            >
              <span className="mr-2 font-semibold text-slate-500">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-4 space-y-3">
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{q.explanation}</p>
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white"
          >
            {index + 1 >= shuffled.length ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
