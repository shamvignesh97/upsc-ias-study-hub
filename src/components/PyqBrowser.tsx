"use client";

import { useMemo, useState } from "react";
import { pyqQuestions } from "@/data/pyqs";
import { subjects } from "@/data/papers";

export default function PyqBrowser() {
  const [subjectId, setSubjectId] = useState("all");
  const [year, setYear] = useState("all");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const years = useMemo(
    () => [...new Set(pyqQuestions.map((q) => q.year))].sort((a, b) => b - a),
    []
  );

  const filtered = useMemo(() => {
    return pyqQuestions.filter((q) => {
      if (subjectId !== "all" && q.subjectId !== subjectId) return false;
      if (year !== "all" && q.year !== Number(year)) return false;
      return true;
    });
  }, [subjectId, year]);

  const subjectOptions = useMemo(() => {
    const ids = new Set(pyqQuestions.map((q) => q.subjectId));
    return subjects.filter((s) => ids.has(s.id));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Subject</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="all">All</option>
            {subjectOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Year</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="all">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.map((q) => (
        <article key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              {q.year}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
              {q.paper}
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-800">
              {q.type.toUpperCase()}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900">{q.question}</h3>
          {q.options && (
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              {q.options.map((o, i) => (
                <li key={o}>
                  {String.fromCharCode(65 + i)}. {o}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-amber-800 underline"
            onClick={() => setRevealed((r) => ({ ...r, [q.id]: !r[q.id] }))}
          >
            {revealed[q.id] ? "Hide hint" : "Show answer hint"}
          </button>
          {revealed[q.id] && (
            <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
              {q.answerHint}
              {typeof q.correctIndex === "number" && q.options && (
                <span className="mt-1 block font-semibold">
                  Correct: {String.fromCharCode(65 + q.correctIndex)}
                </span>
              )}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
