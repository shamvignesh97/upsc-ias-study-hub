"use client";

import { useMemo, useState } from "react";
import { papers, subjects } from "@/data/papers";
import { topics } from "@/data/topics";
import { Likelihood, PaperId } from "@/types";
import TopicCard from "./TopicCard";
import { useProgress } from "@/hooks/useClientStore";

export default function SyllabusFilters() {
  const [paperId, setPaperId] = useState<PaperId | "all">("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [likelihood, setLikelihood] = useState<Likelihood | "all">("all");
  const { progress } = useProgress();

  const filteredSubjects = useMemo(
    () => (paperId === "all" ? subjects : subjects.filter((s) => s.paperId === paperId)),
    [paperId]
  );

  const filtered = useMemo(() => {
    return topics.filter((t) => {
      if (paperId !== "all" && t.paperId !== paperId) return false;
      if (subjectId !== "all" && t.subjectId !== subjectId) return false;
      if (likelihood !== "all" && t.likelihood !== likelihood) return false;
      return true;
    });
  }, [paperId, subjectId, likelihood]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Paper</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={paperId}
            onChange={(e) => {
              setPaperId(e.target.value as PaperId | "all");
              setSubjectId("all");
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
            onChange={(e) => setSubjectId(e.target.value)}
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
          <span className="mb-1 block font-medium text-slate-700">Likelihood</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={likelihood}
            onChange={(e) => setLikelihood(e.target.value as Likelihood | "all")}
          >
            <option value="all">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-slate-600">
        Showing <strong>{filtered.length}</strong> topics
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TopicCard key={t.id} topic={t} studied={!!progress[t.id]} showWhy />
        ))}
      </div>
    </div>
  );
}
