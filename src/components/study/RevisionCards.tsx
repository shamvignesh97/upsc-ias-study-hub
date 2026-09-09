"use client";

import { useState } from "react";
import type { RevisionCard } from "@/types";

export default function RevisionCards({ cards }: { cards: RevisionCard[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  if (!cards?.length) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quick revision cards</h2>
      <p className="mt-1 text-xs text-slate-500">Tap a card to reveal the answer — flash-style recall.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => {
          const shown = !!open[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
              className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-left transition hover:border-amber-400"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                {shown ? "Answer" : "Prompt"}
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900">{shown ? c.back : c.front}</p>
              <p className="mt-2 text-[11px] text-slate-500">{shown ? "Tap to hide" : "Tap to reveal"}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
