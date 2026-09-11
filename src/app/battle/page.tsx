import type { Metadata } from "next";
import Link from "next/link";
import { getAllBattleCards } from "@/data/battle/cards";
import Disclaimer from "@/components/Disclaimer";
import { trendColor, trendLabel, probabilityTextColor } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portion battle cards",
  description:
    "Dense in-app battle cards for Loop’s top Prelims portions — climate, FR/DPSP, inflation, protected areas, parliament, schemes, ISRO, monsoon.",
};

export default function BattleHubPage() {
  const cards = getAllBattleCards();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Portion battle cards</h1>
        <p className="mt-2 text-sm text-slate-600">
          Short in-app cards (not PDFs) with densest facts + Loop chance badge. Built for last-mile
          Prelims revision on Loop’s highest-yield magnets.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.id}
            href={`/battle/${c.id}`}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-rose-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {c.emoji} {c.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">{c.rank.notes}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${trendColor(c.rank.trend)}`}>
                    {trendLabel(c.rank.trend)}
                  </span>
                  {c.rank.probability >= 70 ? (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
                      High
                    </span>
                  ) : null}
                </div>
              </div>
              <div className={`text-2xl font-bold tabular-nums ${probabilityTextColor(c.rank.probability)}`}>
                ~{c.rank.probability}%
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
