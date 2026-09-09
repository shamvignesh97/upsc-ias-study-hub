import { Likelihood } from "@/types";
import { likelihoodColor, probabilityBarColor } from "@/lib/utils";

export default function LikelihoodBadge({
  likelihood,
  probability,
  compact = false,
}: {
  likelihood: Likelihood;
  probability: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${likelihoodColor(likelihood)}`}
        >
          {likelihood} likelihood
        </span>
        <span className="text-xs font-medium text-slate-600">~{probability}% estimate</span>
      </div>
      {!compact && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${probabilityBarColor(probability)}`}
            style={{ width: `${Math.min(100, probability)}%` }}
          />
        </div>
      )}
    </div>
  );
}
