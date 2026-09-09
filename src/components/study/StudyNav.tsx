import Link from "next/link";
import type { Topic } from "@/types";

export default function StudyNav({
  prev,
  next,
  index,
  total,
  mode = "topic",
}: {
  prev: Topic | null;
  next: Topic | null;
  index: number;
  total: number;
  mode?: "topic" | "study";
}) {
  const hrefFor = (t: Topic) =>
    mode === "study"
      ? `/study/${t.paperId}/${t.subjectId}?topic=${t.id}`
      : `/topic/${t.id}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs font-medium text-slate-500">
        {index >= 0 ? (
          <>
            Topic {index + 1} of {total} in this subject
          </>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {prev ? (
          <Link
            href={hrefFor(prev)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-100 px-3 py-1.5 text-sm text-slate-400">← Previous</span>
        )}
        {next ? (
          <Link
            href={hrefFor(next)}
            className="rounded-lg bg-[#0f2744] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1a3d66]"
          >
            {next.title} →
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-100 px-3 py-1.5 text-sm text-slate-400">Next →</span>
        )}
      </div>
    </div>
  );
}
