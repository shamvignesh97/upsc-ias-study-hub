import Link from "next/link";
import { notFound } from "next/navigation";
import { papers, subjects } from "@/data/papers";
import { getTopicsBySubject } from "@/data/topics";

export function generateStaticParams() {
  return papers.map((p) => ({ paperId: p.id }));
}

export default async function StudyPaperPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  const paper = papers.find((p) => p.id === paperId);
  if (!paper) notFound();
  const paperSubjects = subjects.filter((s) => s.paperId === paper.id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/study" className="text-sm text-amber-800 underline">
          ← All papers
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{paper.title}</h1>
        <p className="mt-2 text-slate-600">{paper.description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {paperSubjects.map((s) => {
          const n = getTopicsBySubject(s.id).length;
          return (
            <Link
              key={s.id}
              href={`/study/${paper.id}/${s.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300"
            >
              <div className="text-2xl">{s.icon}</div>
              <h2 className="mt-2 font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{s.description}</p>
              <p className="mt-3 text-xs font-medium text-amber-800">
                {n} topics · start sequential study →
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
