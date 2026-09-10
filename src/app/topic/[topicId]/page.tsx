import Link from "next/link";
import { notFound } from "next/navigation";
import { topics, getTopicById, getAdjacentInSubject } from "@/data/topics";
import { subjects, papers } from "@/data/papers";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import TopicActions from "@/components/TopicActions";
import Disclaimer from "@/components/Disclaimer";
import StudyNotes from "@/components/study/StudyNotes";
import RevisionCards from "@/components/study/RevisionCards";
import StudyNav from "@/components/study/StudyNav";
import CoachTip from "@/components/CoachTip";
import HighProbArticles from "@/components/articles/HighProbArticles";

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
  const related = topic.relatedTopicIds.map((id) => getTopicById(id)).filter(Boolean);
  const analysis = topic.pyqAnalysis;
  const adj = getAdjacentInSubject(topic.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap gap-2 text-sm">
          {paper ? (
            <Link href={`/syllabus/${paper.id}`} className="text-amber-800 underline">
              {paper.shortTitle}
            </Link>
          ) : null}
          {subject ? (
            <>
              <span className="text-slate-400">/</span>
              <Link
                href={`/syllabus/${topic.paperId}/${subject.id}`}
                className="text-amber-800 underline"
              >
                {subject.title}
              </Link>
            </>
          ) : null}
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{topic.title}</h1>
        <p className="mt-2 text-slate-600">{topic.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/study/${topic.paperId}/${topic.subjectId}?topic=${topic.id}`}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-[#0f2744]"
          >
            Open in Study mode
          </Link>
          <Link
            href={`/study/${topic.paperId}/${topic.subjectId}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800"
          >
            Subject study path
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Chance next exam
        </p>
        <LikelihoodBadge
          likelihood={topic.likelihood}
          probability={topic.probability}
          chanceLabel={topic.chanceLabel}
          shortWhy={topic.shortWhy}
          trend={analysis?.trend}
          yearsAppeared={analysis?.yearsAppeared}
        />
        <p className="mt-3 text-sm text-slate-700">
          <strong>Full rationale:</strong> {topic.whyBlurb}
        </p>
        {analysis ? (
          <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Frequency score
              </div>
              <p className="mt-1 text-slate-800">
                {analysis.frequencyScore}/100 · {analysis.totalAppearances} tagged appearances
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Method</div>
              <p className="mt-1 text-slate-800">{analysis.methodologyNote}</p>
            </div>
          </div>
        ) : null}
        <div className="mt-3">
          <Disclaimer compact />
        </div>
        <div className="mt-4">
          <CoachTip topic={topic} />
        </div>
      </div>

      <StudyNav prev={adj.prev} next={adj.next} index={adj.index} total={adj.total} />
      <TopicActions topicId={topic.id} />
      <HighProbArticles topicId={topic.id} />
      <StudyNotes topic={topic} />
      {topic.revisionCards?.length ? <RevisionCards cards={topic.revisionCards} /> : null}

      <div className="flex flex-wrap gap-2">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      {related.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Related topics</h2>
          <ul className="space-y-2">
            {related.map(
              (r) =>
                r && (
                  <li key={r.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <Link href={`/topic/${r.id}`} className="font-medium text-amber-800 underline">
                      {r.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {r.chanceLabel ?? `~${r.probability}%`} · {r.likelihood}
                    </p>
                  </li>
                )
            )}
          </ul>
        </section>
      ) : null}

      <StudyNav prev={adj.prev} next={adj.next} index={adj.index} total={adj.total} />
    </div>
  );
}
