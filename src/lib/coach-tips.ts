import type { Topic } from "@/types";
import { paperExamPhrase, trendLabel } from "@/lib/utils";

/** Templated 2–3 sentence coach tip from topic metadata + chance/trend. */
export function coachTipForTopic(topic: Topic): string {
  const exam = paperExamPhrase(topic.paperId);
  const trend = topic.pyqAnalysis?.trend;
  const years = topic.pyqAnalysis?.yearsAppeared?.length ?? 0;
  const why = (topic.shortWhy ?? topic.whyBlurb).replace(/\s+/g, " ").trim();
  const whyShort = why.length > 140 ? `${why.slice(0, 137)}…` : why;

  let whyLine: string;
  if (topic.probability >= 75) {
    whyLine = `This theme keeps showing up (~${topic.probability}% chance in ${exam}) because ${whyShort || "PYQ frequency and syllabus weight stay high"}.`;
  } else if (topic.probability >= 55) {
    whyLine = `Expect a solid chance (~${topic.probability}%) in ${exam}: ${whyShort || "recurring PYQ patterns and core syllabus coverage"}.`;
  } else {
    whyLine = `Lower relative chance (~${topic.probability}%) in ${exam}, but still worth a quick pass so gaps don’t surprise you.`;
  }

  let trendLine = "";
  if (trend === "rising") {
    trendLine = ` Trend is ${trendLabel(trend).toLowerCase()} — recent papers lean into this area more.`;
  } else if (trend === "falling") {
    trendLine = ` Trend is softening, so revise selectively rather than over-investing.`;
  } else if (trend === "stable") {
    trendLine = ` Pattern is stable${years ? ` across ~${years} tagged years` : ""} — reliable for steady revision.`;
  }

  const revise =
    " In 20 minutes: skim must-remember bullets, flash 3–4 revision cards, then write one 2-line answer trap you usually miss.";

  return `${whyLine}${trendLine}${revise}`;
}

export function coachTipHeadline(topic: Topic): string {
  if (topic.probability >= 75) return "High-yield coach tip";
  if (topic.likelihood === "Medium") return "Coach tip";
  return "Quick coach tip";
}
