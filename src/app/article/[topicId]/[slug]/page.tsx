import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticle, getAllArticleParams } from "@/data/articles";
import { getTopicById } from "@/data/topics";
import ArticlePdfActions from "@/components/articles/ArticlePdfActions";
import Disclaimer from "@/components/Disclaimer";

export function generateStaticParams() {
  return getAllArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicId: string; slug: string }>;
}): Promise<Metadata> {
  const { topicId, slug } = await params;
  const article = getArticle(topicId, slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.blurb,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ topicId: string; slug: string }>;
}) {
  const { topicId, slug } = await params;
  const article = getArticle(topicId, slug);
  if (!article) notFound();
  const topic = getTopicById(topicId);

  return (
    <article className="mx-auto max-w-3xl space-y-6 print:max-w-none">
      <div className="print:hidden">
        <Link href={`/topic/${topicId}`} className="text-sm text-amber-800 underline">
          ← Back to {topic?.title ?? "topic"}
        </Link>
      </div>

      <header className="space-y-3 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          High-chance portion · {topic?.title ?? topicId}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900">{article.title}</h1>
        <p className="text-slate-600">{article.blurb}</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
            ~{article.portionChance}% portion focus
          </span>
          {topic?.chanceLabel ? (
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              Topic: {topic.chanceLabel}
            </span>
          ) : null}
        </div>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">PYQ themes that drove selection: </span>
          {article.pyqThemes.join(" · ")}
        </p>
        <ArticlePdfActions topicId={topicId} slug={slug} />
      </header>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 print:border print:bg-white">
        <h2 className="text-lg font-semibold text-amber-950">Why UPSC asks this</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-950">{article.whyUpscAsks}</p>
      </section>

      <div className="prose-article space-y-6">
        {article.sections.map((s) => (
          <section key={s.heading} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:shadow-none">
            <h2 className="text-lg font-semibold text-slate-900">{s.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{s.body}</p>
          </section>
        ))}
      </div>

      {article.mapFacts && article.mapFacts.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Map / list facts</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
            {article.mapFacts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold text-amber-950">Must remember</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-amber-950">
          {article.mustRemember.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>

      <div className="print:hidden">
        <Disclaimer compact />
        <p className="mt-3 text-xs text-slate-500">
          Original study notes for prioritisation — not NCERT/UPSC verbatim text and not an official prediction.
        </p>
        <div className="mt-4">
          <Link href={`/topic/${topicId}`} className="text-sm font-medium text-amber-800 underline">
            ← Return to {topic?.title ?? "topic"}
          </Link>
          {topic ? (
            <>
              <span className="mx-2 text-slate-300">·</span>
              <Link
                href={`/study/${topic.paperId}/${topic.subjectId}?topic=${topic.id}`}
                className="text-sm font-medium text-amber-800 underline"
              >
                Open in Study mode
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
