import Link from "next/link";
import { notFound } from "next/navigation";
import { papers, subjects } from "@/data/papers";
import { getTopicsBySubject } from "@/data/topics";
import TopicCard from "@/components/TopicCard";

export function generateStaticParams() {
  return subjects.map((s) => ({ paperId: s.paperId, subjectId: s.id }));
}

export default async function SubjectPage({
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
    <div className="space-y-6">
      <div>
        <Link href={`/syllabus/${paper.id}`} className="text-sm text-amber-800 underline">
          ← {paper.shortTitle}
        </Link>
        <h1 className="mt-2 text-3xl font-bold">
          {subject.icon} {subject.title}
        </h1>
        <p className="mt-2 text-slate-600">{subject.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjectTopics.map((t) => (
          <TopicCard key={t.id} topic={t} showWhy />
        ))}
      </div>
      {!subjectTopics.length && (
        <p className="text-slate-600">No seeded topics for this subject yet.</p>
      )}
    </div>
  );
}
