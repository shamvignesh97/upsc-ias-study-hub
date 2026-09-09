import Link from "next/link";
import { papers } from "@/data/papers";
import { topics } from "@/data/topics";

export default function StudyHubPage() {
  const counts = Object.fromEntries(
    papers.map((p) => [p.id, topics.filter((t) => t.paperId === p.id).length])
  ) as Record<string, number>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-amber-800">Study mode</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Study UPSC IAS inside the app</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Pick a paper, then a subject, then read topics sequentially with notes, must-remember boxes,
          traps, and revision cards. Progress is saved on this device.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {papers.map((p) => (
          <Link
            key={p.id}
            href={`/study/${p.id}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.stage}</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{p.shortTitle}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description}</p>
            <p className="mt-3 text-xs font-medium text-amber-800">{counts[p.id] || 0} study topics →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
