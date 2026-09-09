"use client";

import { optionalSubjects } from "@/data/optionals";
import { useOptionalFocus } from "@/hooks/useClientStore";

export default function OptionalClient() {
  const { focus, save } = useOptionalFocus();
  const focused = optionalSubjects.find((o) => o.id === focus);

  return (
    <div className="space-y-6">
      {focused && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Your focus optional
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{focused.title}</h2>
          <p className="mt-2 text-sm text-slate-700">{focused.briefNotes}</p>
          <button
            type="button"
            onClick={() => save(null)}
            className="mt-3 text-sm font-medium text-amber-900 underline"
          >
            Clear focus
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {optionalSubjects.map((o) => (
          <article
            key={o.id}
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              focus === o.id ? "border-amber-400 ring-2 ring-amber-200" : "border-slate-200"
            }`}
          >
            <div className="mb-1 text-xs font-medium uppercase text-slate-500">{o.category}</div>
            <h3 className="text-lg font-semibold text-slate-900">{o.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{o.briefNotes}</p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Why choose:</strong> {o.whyChoose}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {o.keyTopics.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                >
                  {t}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => save(o.id)}
              className="mt-4 rounded-lg bg-[#0f2744] px-3 py-1.5 text-sm font-semibold text-white"
            >
              {focus === o.id ? "Focused ✓" : "Focus this optional"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
