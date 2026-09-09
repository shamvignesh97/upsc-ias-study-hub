"use client";

import { useBookmarks, useProgress } from "@/hooks/useClientStore";

export default function TopicActions({ topicId }: { topicId: string }) {
  const { progress, mark, ready: pReady } = useProgress();
  const { bookmarks, toggle, ready: bReady } = useBookmarks();
  const studied = !!progress[topicId];
  const bookmarked = bookmarks.includes(topicId);

  if (!pReady || !bReady) {
    return <div className="h-10 animate-pulse rounded-lg bg-slate-100" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => mark(topicId, !studied)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          studied
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-[#0f2744] text-white hover:bg-[#16355c]"
        }`}
      >
        {studied ? "✓ Marked studied" : "Mark as studied"}
      </button>
      <button
        type="button"
        onClick={() => toggle(topicId)}
        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
          bookmarked
            ? "border-amber-400 bg-amber-50 text-amber-900"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
      </button>
    </div>
  );
}
