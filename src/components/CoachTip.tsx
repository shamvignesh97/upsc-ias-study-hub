import { coachTipForTopic, coachTipHeadline } from "@/lib/coach-tips";
import type { Topic } from "@/types";
import { cn } from "@/lib/utils";

export default function CoachTip({
  topic,
  compact = false,
  className,
}: {
  topic: Topic;
  compact?: boolean;
  className?: string;
}) {
  const tip = coachTipForTopic(topic);
  return (
    <aside
      className={cn(
        "rounded-lg border border-sky-200 bg-sky-50 text-sky-950",
        compact ? "px-3 py-2" : "px-4 py-3",
        className
      )}
    >
      <p className={cn("font-semibold text-sky-900", compact ? "text-[11px]" : "text-xs")}>
        💡 {coachTipHeadline(topic)}
      </p>
      <p className={cn("mt-1 text-sky-900/90", compact ? "text-xs leading-snug" : "text-sm leading-relaxed")}>
        {tip}
      </p>
    </aside>
  );
}
