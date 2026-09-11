"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildFlashPoints, flashSourceLabel, type FlashPoint } from "@/lib/flash-revision";
import { getStoredWeakAreas, getFlashRevisePersist, saveFlashRevisePersist } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function FlashRevisionClient({
  seedTopicIds,
}: {
  seedTopicIds?: string[];
}) {
  const [points, setPoints] = useState<FlashPoint[]>([]);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [sourceLabel, setSourceLabel] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const weak = getStoredWeakAreas();
    const ids = seedTopicIds?.length
      ? seedTopicIds
      : weak?.rows?.slice(0, 8).map((r) => r.topicId) ?? [];
    const built = buildFlashPoints(10, ids.length ? ids : undefined);
    setPoints(built);
    setSourceLabel(
      ids.length && weak?.rows?.some((r) => ids.includes(r.topicId))
        ? `From weak areas${weak?.sourceTitle ? ` · ${weak.sourceTitle}` : ""}`
        : "From Loop high-prob portions (no weak-area mock yet)"
    );
    const prev = getFlashRevisePersist();
    setReviewed(new Set(prev.reviewedIds));
    saveFlashRevisePersist({
      lastGeneratedAt: new Date().toISOString(),
      topicIds: [...new Set(built.map((p) => p.topicId))],
      reviewedIds: prev.reviewedIds,
    });
    setReady(true);
  }, [seedTopicIds]);

  const progress = useMemo(() => {
    if (!points.length) return 0;
    return points.filter((p) => reviewed.has(p.id)).length;
  }, [points, reviewed]);

  function toggle(id: string) {
    setReviewed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFlashRevisePersist({
        lastGeneratedAt: new Date().toISOString(),
        topicIds: [...new Set(points.map((p) => p.topicId))],
        reviewedIds: [...next],
      });
      return next;
    });
  }

  if (!ready) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Revise 10 flash points</h1>
        <p className="mt-1 text-sm text-slate-600">
          One-tap flash revision from must-remember / cards / traps of your weak topics (or Loop
          high-prob fallback). {sourceLabel}.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-800">
          Reviewed {progress}/{points.length}
        </p>
      </div>

      {!points.length ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          No flash points yet. Finish a mock (weak-area coach) or open{" "}
          <Link href="/battle" className="font-semibold underline">
            battle cards
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {points.map((p, i) => {
            const done = reviewed.has(p.id);
            return (
              <li
                key={p.id}
                className={cn(
                  "rounded-xl border p-4 shadow-sm transition",
                  done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                        {i + 1}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-900">
                        {flashSourceLabel(p.source)}
                      </span>
                      <span className="text-slate-500">{p.topicTitle}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">{p.text}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold",
                        done
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-[#0f2744]"
                      )}
                    >
                      {done ? "Reviewed ✓" : "Mark reviewed"}
                    </button>
                    <Link
                      href={`/topic/${p.topicId}`}
                      className="text-center text-[11px] font-semibold text-amber-900 underline"
                    >
                      Topic →
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/mock" className="rounded-lg border border-slate-200 px-3 py-2 font-medium">
          Back to mocks
        </Link>
        <Link href="/weekly" className="rounded-lg border border-slate-200 px-3 py-2 font-medium">
          Weekly pack
        </Link>
        <Link href="/battle" className="rounded-lg bg-rose-600 px-3 py-2 font-semibold text-white">
          Battle cards
        </Link>
      </div>
    </div>
  );
}
