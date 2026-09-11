import Link from "next/link";
import { getLoopNextExamPicks } from "@/data/portion-frequency";
import { getTopicById } from "@/data/topics";
import { trendColor, trendLabel, probabilityTextColor } from "@/lib/utils";
import { battleCardDefs } from "@/data/battle/cards";
import { NEXT_EXAM_YEAR } from "@/lib/pyq-probability";

export default function NextExamFocusLoop({ limit = 12 }: { limit?: number }) {
  const picks = getLoopNextExamPicks(limit);
  const battleByPortion = new Map(battleCardDefs.map((b) => [b.portionId, b.id]));

  return (
    <section className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50 via-white to-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">
            Loop pick · Prelims {NEXT_EXAM_YEAR}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            Next exam focus (Loop pick)
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Top portions by Loop’s 10-year PYQ synthesis (2016–2025) — frequency × recency × syllabus
            weight. Not an official UPSC prediction; use to sequence revision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/weekly"
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Weekly high-prob pack
          </Link>
          <Link
            href="/battle"
            className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-900"
          >
            Battle cards
          </Link>
          <Link href="/methodology" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
            Method
          </Link>
        </div>
      </div>

      <ol className="space-y-3">
        {picks.map((p, i) => {
          const topic = getTopicById(p.topicId);
          const subject = topic?.subjectId ?? "env";
          const battleId = battleByPortion.get(p.id);
          const studyHref = `/study/${p.paper}/${subject}?topic=${encodeURIComponent(p.topicId)}`;
          const articleHref = `/article/${p.topicId}/${p.articleSlug}`;
          const why = p.notes.length > 110 ? `${p.notes.slice(0, 107)}…` : p.notes;

          return (
            <li
              key={p.id}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-900">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{p.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${trendColor(p.trend)}`}>
                      {trendLabel(p.trend)}
                    </span>
                    {p.probability >= 70 ? (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
                        High
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    <span className="font-medium text-slate-800">Why: </span>
                    {why}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <Link href={studyHref} className="rounded-md bg-amber-500 px-2.5 py-1 font-semibold text-[#0f2744]">
                      Study
                    </Link>
                    <Link href={articleHref} className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-800 hover:bg-slate-50">
                      Article
                    </Link>
                    <a
                      href={`/articles/${p.topicId}/${p.articleSlug}.pdf`}
                      download
                      className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-800 hover:bg-slate-50"
                    >
                      PDF
                    </a>
                    {battleId ? (
                      <Link href={`/battle/${battleId}`} className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 font-semibold text-rose-900">
                        Battle card
                      </Link>
                    ) : null}
                    <Link href="/weekly" className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-900">
                      Weekly pack
                    </Link>
                    <Link href="/drill" className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-700">
                      Drill
                    </Link>
                  </div>
                </div>
                <div className="shrink-0 text-right sm:w-24">
                  <div className={`text-2xl font-bold tabular-nums ${probabilityTextColor(p.probability)}`}>
                    ~{p.probability}%
                  </div>
                  <div className="text-[10px] text-slate-500">next GS chance</div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
