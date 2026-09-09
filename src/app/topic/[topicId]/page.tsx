import Link from "next/link";
import { notFound } from "next/navigation";
import { topics, getTopicById } from "@/data/topics";
import { subjects, papers } from "@/data/papers";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import TopicActions from "@/components/TopicActions";
import Disclaimer from "@/components/Disclaimer";

export function generateStaticParams() {
  return topics.map((t) => ({ topicId: t.id }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) notFound();

  const subject = subjects.find((s) => s.id === topic.subjectId);
  const paper = papers.find((p) => p.id === topic.paperId);
  const related = topic.relatedTopicIds
    .map((id) => getTopicById(id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap gap-2 text-sm">
          {paper && (
            <Link href={`/syllabus/${paper.id}`} className="text-amber-800 underline">
              {paper.shortTitle}
            </Link>
          )}
          {subject && (
            <>
              <span className="text-slate-400">/</span>
              <Link
                href={`/syllabus/${topic.paperId}/${subject.id}`}
                className="text-amber-800 underline"
              >
                {subject.title}
              </Link>
            </>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{topic.title}</h1>
        <p className="mt-2 text-slate-600">{topic.summary}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <LikelihoodBadge likelihood={topic.likelihood} probability={topic.probability} />
        <p className="mt-3 text-sm text-slate-700">
          <strong>Why this estimate:</strong> {topic.whyBlurb}
        </p>
        <div className="mt-3">
          <Disclaimer compact />
        </div>
      </div>

      <TopicActions topicId={topic.id} />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Notes</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {topic.notes}
        </p>
      </section>

      {topic.subtopics.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Subtopics</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.subtopics.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.notes}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        {topic.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            #{tag}
          </span>
        ))}
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Related topics</h2>
          <ul className="space-y-2">
            {related.map(
              (r) =>
                r && (
                  <li key={r.id}>
                    <Link href={`/topic/${r.id}`} className="text-amber-800 underline">
                      {r.title}
                    </Link>
                    <span className="ml-2 text-xs text-slate-500">
                      {r.likelihood} · ~{r.probability}%
                    </span>
                  </li>
                )
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
