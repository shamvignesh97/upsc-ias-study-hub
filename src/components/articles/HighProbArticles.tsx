import Link from "next/link";
import {
  getArticlesByTopic,
  getArticlePdfPath,
  getTopicCombinedPdfPath,
} from "@/data/articles";

export default function HighProbArticles({ topicId }: { topicId: string }) {
  const articles = getArticlesByTopic(topicId);
  if (!articles.length) return null;

  const combinedPdf = getTopicCombinedPdfPath(topicId);

  return (
    <section className="rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Read: high-chance portions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Focused original notes on the PYQ themes that drive this topic&apos;s score — not full-syllabus dumps.
          </p>
        </div>
        <a
          href={combinedPdf}
          download
          className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-sm font-semibold text-amber-950 hover:bg-amber-100"
        >
          Download all PDFs (topic)
        </a>
      </div>

      <ul className="mt-4 space-y-3">
        {articles.map((a) => (
          <li
            key={a.slug}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{a.title}</h3>
                  <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-amber-950">
                    ~{a.portionChance}% portion
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{a.blurb}</p>
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">PYQ themes: </span>
                  {a.pyqThemes.join(" · ")}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/article/${topicId}/${a.slug}`}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-[#0f2744]"
              >
                Read article
              </Link>
              <a
                href={getArticlePdfPath(topicId, a.slug)}
                download
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Download PDF
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
