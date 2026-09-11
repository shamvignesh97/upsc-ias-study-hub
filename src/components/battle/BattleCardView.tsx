import Link from "next/link";
import type { BattleCardView as Card } from "@/data/battle/cards";
import { trendColor, trendLabel } from "@/lib/utils";

export default function BattleCardView({ card }: { card: Card }) {
  return (
    <article className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0f2744] to-[#1a3d66] p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Portion battle card · Loop pick
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {card.emoji} {card.title}
            </h1>
            <p className="mt-2 text-sm text-slate-200">{card.rank.chanceLabel}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur">
            <div className={`text-3xl font-bold tabular-nums text-amber-300`}>
              ~{card.rank.probability}%
            </div>
            <div className="mt-1 flex justify-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${trendColor(card.rank.trend)}`}>
                {trendLabel(card.rank.trend)}
              </span>
              {card.rank.probability >= 70 ? (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
                  High
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          <span className="font-semibold text-amber-200">Why Loop ranks this: </span>
          {card.rank.notes}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href={card.studyHref} className="rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-[#0f2744]">
            Study topic
          </Link>
          <Link href={card.articleHref} className="rounded-lg border border-white/30 px-3 py-1.5 font-semibold">
            Full article
          </Link>
          <a href={card.pdfHref} download className="rounded-lg border border-white/30 px-3 py-1.5 font-semibold">
            PDF
          </a>
          <Link href="/weekly" className="rounded-lg border border-white/30 px-3 py-1.5 font-semibold">
            Weekly pack
          </Link>
          <Link href={card.drillHref} className="rounded-lg border border-white/30 px-3 py-1.5 font-semibold">
            Daily drill
          </Link>
        </div>
      </header>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-amber-950">Densest facts (battle load)</h2>
        <ul className="mt-3 space-y-2">
          {card.mustRemember.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm text-amber-950">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold">
                {i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {card.table ? (
        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">{card.table.title}</h2>
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {card.table.headers.map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold text-slate-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {card.table.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-slate-100">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {card.traps.length ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-rose-950">Trap radar</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-950">
            {card.traps.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-slate-500">
        Chance badge from Loop’s portion model (~{card.rank.probability}%, {card.rank.trend}). In-app
        card — not a PDF substitute for deep articles.
      </p>
    </article>
  );
}
