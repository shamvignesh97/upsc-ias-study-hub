"use client";

import { getTopicById } from "@/data/topics";
import { useBookmarks, useProgress } from "@/hooks/useClientStore";
import TopicCard from "./TopicCard";

export default function BookmarksClient() {
  const { bookmarks, ready } = useBookmarks();
  const { progress } = useProgress();

  if (!ready) return <div className="h-32 animate-pulse rounded-xl bg-slate-100" />;

  const topics = bookmarks.map((id) => getTopicById(id)).filter(Boolean);

  if (!topics.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        No bookmarks yet. Open any topic and tap ★ Bookmark.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((t) => t && <TopicCard key={t.id} topic={t} studied={!!progress[t.id]} showWhy />)}
    </div>
  );
}
