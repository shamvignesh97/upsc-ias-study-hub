"use client";

import { memo, useMemo, useState } from "react";
import type { MainsPrompt } from "@/types";

function MainsPracticePlayer({ prompts }: { prompts: MainsPrompt[] }) {
  const [index, setIndex] = useState(0);
  const [showOutline, setShowOutline] = useState(false);

  const list = useMemo(() => prompts, [prompts]);
  if (!list.length) {
    return <p className="text-slate-600">No mains prompts available yet.</p>;
  }

  const p = list[index];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>
          Prompt {index + 1} of {list.length}
        </span>
        <div className="flex flex-wrap gap-2">
          {p.yearTag ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium">
              Theme ~{p.yearTag}
            </span>
          ) : null}
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-900">
            Illustrative
          </span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800">
            {p.marksHint}
          </span>
        </div>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{p.question}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Practice tip</p>
          <p className="mt-1">
            Write your answer on paper/timer first, then reveal the model outline and key points.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowOutline((v) => !v)}
          className="mt-4 text-sm font-semibold text-amber-800 underline"
        >
          {showOutline ? "Hide model outline" : "Show model outline & key points"}
        </button>

        {showOutline ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-50 p-4">
              <h3 className="text-sm font-semibold text-emerald-900">Model answer outline</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-emerald-950">
                {p.modelOutline.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg bg-sky-50 p-4">
              <h3 className="text-sm font-semibold text-sky-900">Key points to hit</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-sky-950">
                {p.keyPoints.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </article>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setShowOutline(false);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={index + 1 >= list.length}
          onClick={() => {
            setIndex((i) => Math.min(list.length - 1, i + 1));
            setShowOutline(false);
          }}
          className="rounded-lg bg-[#0f2744] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Next prompt
        </button>
      </div>
    </div>
  );
}

export default memo(MainsPracticePlayer);
