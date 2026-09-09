"use client";

import { useMemo, useState } from "react";
import { papers, subjects } from "@/data/papers";
import { topics } from "@/data/topics";
import { Likelihood, PaperId } from "@/types";
import TopicCard from "./TopicCard";
import { useProgress } from "@/hooks/useClientStore";

const PAGE_SIZE = 12;

type SortMode = "chance-desc" | "chance-asc" | "title";

export default function SyllabusFilters() {
  const [paperId, setPaperId] = useState<PaperId | "all">("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [likelihood, setLikelihood] = useState<Likelihood | "all">("all");
  const [sort, setSort] = useState<SortMode>("chance-desc");
  const [page, setPage] = useState(0);
  const { progress } = useProgress();

  const filteredSubjects = useMemo(
    () => (paperId === "all" ? subjects : subjects.filter((s) => s.paperId === paperId)),
    [paperId]
  );

  const filtered = useMemo(() => {
    const list = topics.filter((t) => {
      if (paperId !== "all" && t.paperId !== paperId) return false;
      if (subjectId !== "all" && t.subjectId !== subjectId) return false;
      if (likelihood !== "all" && t.likelihood !== likelihood) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "chance-desc") sorted.sort((a, b) => b.probability - a.probability);
    else if (sort === "chance-asc") sorted.sort((a, b) => a.probability - b.probability);
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [paperId, subjectId, likelihood, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Paper</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={paperId}
            onChange={(e) => {
              setPaperId(e.target.value as PaperId | "all");
              setSubjectId("all");
              setPage(0);
            }}
          >
            <option value="all">All papers</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.shortTitle}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Subject</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All subjects</option>
            {filteredSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Chance band</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={likelihood}
            onChange={(e) => {
              setLikelihood(e.target.value as Likelihood | "all");
              setPage(0);
            }}
          >
            <option value="all">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Sort by chance</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortMode);
              setPage(0);
            }}
          >
            <option value="chance-desc">Highest % first</option>
            <option value="chance-asc">Lowest % first</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-slate-600">
        Showing <strong>{pageItems.length}</strong> of <strong>{filtered.length}</strong> topics
        (page {safePage + 1}/{pageCount}) — percentages are PYQ-based estimates, not official forecasts.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((t) => (
          <TopicCard key={t.id} topic={t} studied={!!progress[t.id]} showWhy />
        ))}
      </div>

      {pageCount > 1 ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
