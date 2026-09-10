"use client";

import { getArticlePdfPath, getTopicCombinedPdfPath } from "@/data/articles";

export default function ArticlePdfActions({
  topicId,
  slug,
}: {
  topicId: string;
  slug: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <a
        href={getArticlePdfPath(topicId, slug)}
        download
        className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-[#0f2744]"
      >
        Download PDF
      </a>
      <a
        href={getTopicCombinedPdfPath(topicId)}
        download
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800"
      >
        Topic combined PDF
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800"
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
