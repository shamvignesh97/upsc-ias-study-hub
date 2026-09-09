import Link from "next/link";
import { Topic } from "@/types";
import LikelihoodBadge from "./LikelihoodBadge";

export default function TopicCard({
  topic,
  studied,
  showWhy = false,
  href,
}: {
  topic: Topic;
  studied?: boolean;
  showWhy?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/topic/${topic.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 group-hover:text-[#0f2744]">{topic.title}</h3>
        {studied && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
            Studied
          </span>
        )}
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-slate-600">{topic.summary}</p>
      <LikelihoodBadge
        likelihood={topic.likelihood}
        probability={topic.probability}
        chanceLabel={topic.chanceLabel}
        shortWhy={showWhy ? topic.shortWhy ?? topic.whyBlurb : undefined}
        trend={topic.pyqAnalysis?.trend}
        compact
      />
    </Link>
  );
}
