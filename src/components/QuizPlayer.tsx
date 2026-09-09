"use client";

import { memo, useCallback, useMemo, useState } from "react";
import type { QuizQuestion } from "@/types";
import { buildSession } from "@/lib/quiz-session";
import ExplanationPanel from "@/components/ExplanationPanel";

const OptionButton = memo(function OptionButton({
  label,
  text,
  style,
  disabled,
  onSelect,
}: {
  label: string;
  text: string;
  style: string;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`block w-full rounded-lg border px-4 py-3 text-left text-sm transition ${style}`}
    >
      <span className="mr-2 font-semibold text-slate-500">{label}.</span>
      {text}
    </button>
  );
});

function QuizPlayerInner({
  questions,
  sessionSize = 15,
}: {
  questions: QuizQuestion[];
  sessionSize?: number;
}) {
  const [seed, setSeed] = useState(0);
  const session = useMemo(
    () => buildSession(questions, sessionSize),
    // seed reshuffles on retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, sessionSize, seed]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = session[index];

  const submit = useCallback(
    (opt: number) => {
      if (selected !== null || !q) return;
      setSelected(opt);
      if (opt === q.correctIndex) setScore((s) => s + 1);
    },
    [selected, q]
  );

  const next = useCallback(() => {
    if (index + 1 >= session.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }, [index, session.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setSeed((s) => s + 1);
  }, []);

  if (!session.length) {
    return <p className="text-slate-600">No questions available for this track yet.</p>;
  }

  if (done) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Quiz complete</h2>
        <p className="mt-2 text-slate-600">
          Score: <strong>{score}</strong> / {session.length} (
          {Math.round((score / session.length) * 100)}%)
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Session of {session.length} from a larger bank — retry for a fresh mix.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]"
        >
          New session
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>
          Question {index + 1} of {session.length}
        </span>
        <span className="flex items-center gap-2">
          <span>Score: {score}</span>
          {q.yearTag ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium">
              PYQ theme ~{q.yearTag}
            </span>
          ) : null}
          {q.illustrative ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-900">
              Illustrative
            </span>
          ) : null}
        </span>
      </div>
      <h2 className="mb-4 whitespace-pre-wrap text-lg font-semibold text-slate-900">{q.question}</h2>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "border-slate-200 hover:border-amber-300";
          if (selected !== null) {
            if (i === q.correctIndex) style = "border-emerald-500 bg-emerald-50";
            else if (i === selected) style = "border-rose-400 bg-rose-50";
            else style = "border-slate-100 opacity-70";
          }
          return (
            <OptionButton
              key={`${q.id}-${i}`}
              label={String.fromCharCode(65 + i)}
              text={opt}
              style={style}
              disabled={selected !== null}
              onSelect={() => submit(i)}
            />
          );
        })}
      </div>
      {selected !== null ? (
        <div className="mt-4 space-y-3">
          <ExplanationPanel explanation={q.explanation} correctIndex={q.correctIndex} />
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white"
          >
            {index + 1 >= session.length ? "Finish" : "Next"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default memo(QuizPlayerInner);
