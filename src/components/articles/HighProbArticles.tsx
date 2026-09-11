import Link from "next/link";
import {
  getArticlesByTopic,
  getArticlePdfPath,
  getTopicCombinedPdfPath,
} from "@/data/articles";
import { getRankedPortions } from "@/data/portion-frequency";

export default function HighProbArticles({ topicId }: { topicId: string }) {
  const articles = getArticlesByTopic(topicId);
  if (!articles.length) return null;

  const combinedPdf = getTopicCombinedPdfPath(topicId);
  const ranked = getRankedPortions({ paper: "all" }).filter((p) => p.topicId === topicId);
  const whyBlurb =
    ranked.length > 0
      ? `Chosen via Loop’s 10-year (2016–2025) PYQ portion synthesis: ${ranked
          .slice(0, 3)
          .map((p) => `${p.title} ~${p.probability}% (${p.trend})`)
          .join("; ")}.`
      : "Focused original notes on the PYQ themes that drive this topic’s score — not full-syllabus dumps.";

  return (
    <section className="rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Read: high-chance portions</h2>
          <p className="mt-1 text-sm text-slate-600">{whyBlurb}</p>
          <p className="mt-1 text-xs text-slate-500">
            Deep multi-page PDFs for top portions (intro, concepts, tables, traps, PYQ angle, quick revision).
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
          <li key={a.slug} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{a.title}</h3>
                  <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-amber-950">
                    ~{(ranked.find((r) => r.articleSlug === a.slug)?.probability ?? a.portionChance)}% Loop chance
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{a.blurb}</p>
                {a.chanceNote ? (
                  <p className="mt-2 text-xs text-amber-900">
                    <span className="font-semibold">Why: </span>
                    {a.chanceNote}
                  </p>
                ) : null}
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
