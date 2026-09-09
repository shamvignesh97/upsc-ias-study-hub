import { Likelihood, Trend } from "@/types";
import {
  likelihoodColor,
  probabilityBarColor,
  probabilityTextColor,
  trendColor,
  trendLabel,
  cn,
} from "@/lib/utils";

export default function LikelihoodBadge({
  likelihood,
  probability,
  chanceLabel,
  shortWhy,
  trend,
  yearsAppeared,
  compact = false,
}: {
  likelihood: Likelihood;
  probability: number;
  chanceLabel?: string;
  shortWhy?: string;
  trend?: Trend;
  yearsAppeared?: number[];
  compact?: boolean;
}) {
  const label = chanceLabel ?? `~${probability}% chance next exam`;

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-end justify-between gap-2">
          <div className={cn("text-2xl font-bold leading-none tabular-nums", probabilityTextColor(probability))}>
            ~{probability}%
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${likelihoodColor(likelihood)}`}
          >
            {likelihood}
          </span>
        </div>
        <p className="text-[11px] leading-snug text-slate-600">{label}</p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${probabilityBarColor(probability)}`}
            style={{ width: `${Math.min(100, probability)}%` }}
          />
        </div>
        {shortWhy ? <p className="line-clamp-2 text-[11px] text-slate-500">{shortWhy}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className={cn("text-4xl font-bold tabular-nums tracking-tight", probabilityTextColor(probability))}>
            ~{probability}%
          </div>
          <p className="mt-1 max-w-md text-sm font-medium text-slate-800">{label}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${likelihoodColor(likelihood)}`}
          >
            {likelihood} chance
          </span>
          {trend ? (
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${trendColor(trend)}`}
            >
              {trendLabel(trend)} trend
            </span>
          ) : null}
        </div>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${probabilityBarColor(probability)}`}
          style={{ width: `${Math.min(100, probability)}%` }}
        />
      </div>
      {yearsAppeared && yearsAppeared.length > 0 ? (
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Years appeared: </span>
          {yearsAppeared.join(", ")}
        </p>
      ) : null}
      {shortWhy ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Why this score: </span>
          {shortWhy}
        </p>
      ) : null}
    </div>
  );
}
