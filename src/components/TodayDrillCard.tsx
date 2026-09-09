"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DRILL_QUESTION_COUNT, istDayKey } from "@/lib/drill";
import { getDrillPersist } from "@/lib/storage";

export default function TodayDrillCard() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const day = istDayKey();
    const d = getDrillPersist();
    const today = d.today?.dayKey === day ? d.today : null;
    const answered = today ? Object.keys(today.answered).length : 0;
    setProgress(Math.min(DRILL_QUESTION_COUNT, answered));
    setStreak(d.streak);
    setCompleted(!!today?.completed);
    setReady(true);
  }, []);

  return (
    <Link
      href="/drill"
      className="block rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm transition hover:border-amber-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Today’s drill</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">10 high-chance GS1 Qs</h3>
          <p className="mt-1 text-sm text-slate-600">
            Instant practice feedback · streak {ready ? streak : "…"}
            {completed ? " · done for today ✓" : ""}
          </p>
        </div>
        <div className="rounded-lg bg-amber-500 px-3 py-2 text-center text-[#0f2744]">
          <div className="text-lg font-bold leading-none">
            {ready ? progress : "–"}/{DRILL_QUESTION_COUNT}
          </div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase">progress</div>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100">
        <div
          className="h-full rounded-full bg-amber-500 transition-all"
          style={{ width: `${ready ? (100 * progress) / DRILL_QUESTION_COUNT : 0}%` }}
        />
      </div>
    </Link>
  );
}
