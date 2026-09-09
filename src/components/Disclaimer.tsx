import Link from "next/link";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-slate-500">
        Likelihoods come from multi-year PYQ frequency + recency weighting — not official UPSC
        predictions.{" "}
        <Link href="/methodology" className="font-medium text-amber-700 underline">
          How we estimate
        </Link>
      </p>
    );
  }
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <strong>Disclaimer:</strong> Topic probabilities and High/Medium/Low labels are{" "}
      <em>estimates</em> computed from a structured PYQ theme-frequency dataset (approx. last 10
      years) with recency weighting and syllabus importance. They are <strong>not</strong> official
      UPSC forecasts. Always prepare the full syllabus.{" "}
      <Link href="/methodology" className="font-semibold underline">
        Read methodology
      </Link>
    </div>
  );
}
