"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Paper, Subject, Topic } from "@/types";
import TopicCard from "@/components/TopicCard";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import StudyNotes from "@/components/study/StudyNotes";
import RevisionCards from "@/components/study/RevisionCards";
import StudyNav from "@/components/study/StudyNav";
import TopicActions from "@/components/TopicActions";
import Disclaimer from "@/components/Disclaimer";
import { useProgress } from "@/hooks/useClientStore";

export default function StudySubjectClient({
  paper,
  subject,
  subjectTopics,
}: {
  paper: Paper;
  subject: Subject;
  subjectTopics: Topic[];
}) {
  const search = useSearchParams();
  const topicId = search.get("topic");
  const { progress } = useProgress();

  const active = useMemo(() => {
    if (!topicId) return null;
    return subjectTopics.find((t) => t.id === topicId) ?? null;
  }, [topicId, subjectTopics]);

  const index = active ? subjectTopics.findIndex((t) => t.id === active.id) : -1;
  const prev = index > 0 ? subjectTopics[index - 1] : null;
  const next = index >= 0 && index < subjectTopics.length - 1 ? subjectTopics[index + 1] : null;

  if (active) {
    return (
      <div className="space-y-6">
        <div>
          <Link href={`/study/${paper.id}/${subject.id}`} className="text-sm text-amber-800 underline">
            ← {subject.title} topic list
          </Link>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Study mode · {paper.shortTitle} · {subject.title}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{active.title}</h1>
          <p className="mt-2 text-slate-600">{active.summary}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <LikelihoodBadge
            likelihood={active.likelihood}
            probability={active.probability}
            chanceLabel={active.chanceLabel}
            shortWhy={active.shortWhy}
            trend={active.pyqAnalysis?.trend}
            yearsAppeared={active.pyqAnalysis?.yearsAppeared}
          />
          <div className="mt-3">
            <Disclaimer compact />
          </div>
        </div>

        <StudyNav prev={prev} next={next} index={index} total={subjectTopics.length} mode="study" />
        <TopicActions topicId={active.id} />
        <StudyNotes topic={active} />
        {active.revisionCards?.length ? <RevisionCards cards={active.revisionCards} /> : null}
        <StudyNav prev={prev} next={next} index={index} total={subjectTopics.length} mode="study" />
      </div>
    );
  }

  const first = subjectTopics[0];

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/study/${paper.id}`} className="text-sm text-amber-800 underline">
          ← {paper.shortTitle}
        </Link>
        <h1 className="mt-2 text-3xl font-bold">
          {subject.icon} {subject.title}
        </h1>
        <p className="mt-2 text-slate-600">{subject.description}</p>
      </div>

      {first ? (
        <Link
          href={`/study/${paper.id}/${subject.id}?topic=${first.id}`}
          className="inline-flex rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-[#0f2744]"
        >
          Start studying → {first.title}
        </Link>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {subjectTopics.map((t) => (
          <TopicCard
            key={t.id}
            topic={t}
            studied={!!progress[t.id]}
            showWhy
            href={`/study/${paper.id}/${subject.id}?topic=${t.id}`}
          />
        ))}
      </div>
      {!subjectTopics.length ? <p className="text-slate-600">No topics seeded for this subject yet.</p> : null}
    </div>
  );
}
