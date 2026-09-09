"use client";

import { useEffect, useMemo, useState } from "react";
import { searchTopics } from "@/data/topics";
import TopicCard from "./TopicCard";
import { useProgress } from "@/hooks/useClientStore";

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const { progress } = useProgress();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 200);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => searchTopics(debounced), [debounced]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search topics, notes, tags…"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
      />
      {debounced ? (
        <p className="text-sm text-slate-600">
          {results.length} result{results.length === 1 ? "" : "s"} for “{debounced}”
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((t) => (
          <TopicCard key={t.id} topic={t} studied={!!progress[t.id]} />
        ))}
      </div>
    </div>
  );
}
