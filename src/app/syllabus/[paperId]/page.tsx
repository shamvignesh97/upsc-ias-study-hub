import Link from "next/link";
import { notFound } from "next/navigation";
import { papers, subjects } from "@/data/papers";
import { getTopicsByPaper } from "@/data/topics";
import { PaperId } from "@/types";
import TopicCard from "@/components/TopicCard";

export function generateStaticParams() {
  return papers.map((p) => ({ paperId: p.id }));
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  const paper = papers.find((p) => p.id === paperId);
  if (!paper) notFound();

  const paperSubjects = subjects.filter((s) => s.paperId === paper.id);
  const paperTopics = getTopicsByPaper(paper.id as PaperId);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/syllabus" className="text-sm text-amber-800 underline">
          ← All papers
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{paper.title}</h1>
        <p className="mt-2 text-slate-600">{paper.description}</p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Subjects</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {paperSubjects.map((s) => (
            <Link
              key={s.id}
              href={`/syllabus/${paper.id}/${s.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300"
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <p className="text-sm text-slate-600">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Topics in this paper</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paperTopics.map((t) => (
            <TopicCard key={t.id} topic={t} showWhy />
          ))}
        </div>
      </section>
    </div>
  );
}
