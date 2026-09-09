import { Suspense } from "react";
import { notFound } from "next/navigation";
import { papers, subjects } from "@/data/papers";
import { getTopicsBySubject } from "@/data/topics";
import StudySubjectClient from "@/components/study/StudySubjectClient";

export function generateStaticParams() {
  return subjects.map((s) => ({ paperId: s.paperId, subjectId: s.id }));
}

export default async function StudySubjectPage({
  params,
}: {
  params: Promise<{ paperId: string; subjectId: string }>;
}) {
  const { paperId, subjectId } = await params;
  const paper = papers.find((p) => p.id === paperId);
  const subject = subjects.find((s) => s.id === subjectId && s.paperId === paperId);
  if (!paper || !subject) notFound();
  const subjectTopics = getTopicsBySubject(subject.id);

  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-slate-100" />}>
      <StudySubjectClient paper={paper} subject={subject} subjectTopics={subjectTopics} />
    </Suspense>
  );
}
