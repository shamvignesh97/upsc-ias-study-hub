"use client";

import { getHighProbabilityTopics, getTopicById } from "@/data/topics";
import { usePlanner } from "@/hooks/useClientStore";
import Link from "next/link";

export default function PlannerClient() {
  const { items, save, toggleDone, ready } = usePlanner();

  function generate() {
    const top = getHighProbabilityTopics(14);
    const plan = top.map((t, i) => ({
      topicId: t.id,
      day: Math.floor(i / 2) + 1,
      done: false,
    }));
    save(plan);
  }

  if (!ready) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]"
        >
          {items.length ? "Regenerate 7-day plan" : "Generate 7-day focus plan"}
        </button>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => save([])}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      {!items.length && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Generate a planner from the highest-probability topics across papers. Estimates only —
          balance with full syllabus coverage.
        </p>
      )}

      {[1, 2, 3, 4, 5, 6, 7].map((day) => {
        const dayItems = items.filter((i) => i.day === day);
        if (!dayItems.length) return null;
        return (
          <div key={day} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-[#0f2744]">Day {day}</h3>
            <ul className="space-y-2">
              {dayItems.map((item) => {
                const topic = getTopicById(item.topicId);
                if (!topic) return null;
                return (
                  <li
                    key={item.topicId}
                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <label className="flex flex-1 items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleDone(item.topicId)}
                        className="mt-1"
                      />
                      <span className={item.done ? "text-slate-400 line-through" : ""}>
                        <Link href={`/topic/${topic.id}`} className="font-medium text-slate-900 hover:underline">
                          {topic.title}
                        </Link>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {topic.likelihood} · ~{topic.probability}%
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
