import type { Likelihood, PyqTopicFrequency, Trend, PyqAnalysisSummary, PaperId } from "@/types";
import { examChanceLabel } from "@/lib/utils";

const ANALYSIS_YEARS = [
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
] as const;

const NEXT_EXAM_YEAR = 2026;

export interface ComputedProbability {
  probability: number;
  likelihood: Likelihood;
  trend: Trend;
  yearsAppeared: number[];
  totalAppearances: number;
  frequencyScore: number;
  whyBlurb: string;
  shortWhy: string;
  chanceLabel: string;
  analysis: PyqAnalysisSummary;
}

/**
 * Next-exam likelihood from multi-year PYQ frequency + recency + syllabus weight.
 *
 * Formula (0–100, then clamped):
 *   base = 100 * (weightedAppearances / maxWeighted)
 *   frequencyScore = average questions/themes per year in window (scaled)
 *   recencyBoost = higher weight for appearances in last 3 years; small rebound if quiet 2–4 years
 *   syllabusBoost = syllabusWeight (1–5) → up to +10
 *   CSAT papers: structural/qualifying framing — high floor for core skill blocks
 *
 * Disclaimer: educational prioritisation heuristic — NOT an official UPSC prediction.
 */
export function computeFromFrequency(entry: PyqTopicFrequency): ComputedProbability {
  const counts = ANALYSIS_YEARS.map((y) => entry.yearCounts[y] ?? 0);
  const yearsAppeared = ANALYSIS_YEARS.filter((_, i) => counts[i] > 0).map(Number);
  const totalAppearances = counts.reduce((a, b) => a + b, 0);

  const weighted = counts.reduce((sum, c, i) => {
    const w = 1 + i / (ANALYSIS_YEARS.length - 1);
    return sum + c * w;
  }, 0);

  const maxPerYear = 8;
  const maxWeighted =
    ANALYSIS_YEARS.reduce((s, _, i) => s + maxPerYear * (1 + i / (ANALYSIS_YEARS.length - 1)), 0) *
    0.45;

  let frequencyScore = Math.round((100 * weighted) / Math.max(maxWeighted, 1));
  frequencyScore = clamp(frequencyScore, 0, 100);

  const last3 = counts.slice(-3).reduce((a, b) => a + b, 0);
  const prev3 = counts.slice(-6, -3).reduce((a, b) => a + b, 0);
  const yearsSinceLast = (() => {
    for (let i = counts.length - 1; i >= 0; i--) {
      if (counts[i] > 0) return NEXT_EXAM_YEAR - Number(ANALYSIS_YEARS[i]);
    }
    return 99;
  })();

  let recencyAdj = 0;
  if (last3 >= prev3 + 2) recencyAdj += 6;
  else if (last3 + 2 <= prev3) recencyAdj -= 4;
  if (yearsSinceLast >= 2 && yearsSinceLast <= 4 && entry.syllabusWeight >= 3) recencyAdj += 5;
  if (yearsSinceLast === 1) recencyAdj += 3;

  const syllabusBoost = Math.round((entry.syllabusWeight / 5) * 10);

  let probability = frequencyScore * 0.72 + syllabusBoost + recencyAdj;

  if (entry.paper === "prelims-csat") {
    probability = Math.max(probability, 40 + entry.syllabusWeight * 8);
    if (entry.topicId.startsWith("csat-decision")) {
      probability = Math.min(probability, 55);
    } else {
      probability = Math.max(probability, 78);
    }
  }

  probability = clamp(Math.round(probability), 8, 96);

  const trend = deriveTrend(counts);
  const likelihood = toLikelihood(probability, entry.paper);

  const yearList =
    yearsAppeared.length <= 6
      ? yearsAppeared.join(", ")
      : `${yearsAppeared.slice(0, 3).join(", ")}…${yearsAppeared.slice(-2).join(", ")} (${yearsAppeared.length} yrs)`;

  const whyBlurb = buildWhy(entry, yearsAppeared, totalAppearances, trend, yearList);
  const shortWhy = buildShortWhy(entry, yearsAppeared.length, totalAppearances, trend);
  const chanceLabel = examChanceLabel(entry.paper as PaperId, probability);

  const methodologyNote = `Derived from PYQ theme frequency (${ANALYSIS_YEARS[0]}–${ANALYSIS_YEARS[ANALYSIS_YEARS.length - 1]}) with recency weighting and syllabus importance (weight ${entry.syllabusWeight}/5). Not an official UPSC prediction.`;

  return {
    probability,
    likelihood,
    trend,
    yearsAppeared,
    totalAppearances,
    frequencyScore,
    whyBlurb,
    shortWhy,
    chanceLabel,
    analysis: {
      yearsAppeared,
      totalAppearances,
      frequencyScore,
      trend,
      methodologyNote,
    },
  };
}

function deriveTrend(counts: number[]): Trend {
  const early = counts.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
  const late = counts.slice(-4).reduce((a, b) => a + b, 0) / 4;
  if (late >= early + 0.75) return "rising";
  if (early >= late + 0.75) return "falling";
  return "stable";
}

function toLikelihood(p: number, paper: string): Likelihood {
  if (p >= 70) return "High";
  if (p >= 45) return "Medium";
  return "Low";
}

function buildWhy(
  entry: PyqTopicFrequency,
  yearsAppeared: number[],
  total: number,
  trend: Trend,
  yearList: string
): string {
  const trendWord =
    trend === "rising" ? "rising recent weightage" : trend === "falling" ? "softer recent frequency" : "stable multi-year presence";
  const csatNote =
    entry.paper === "prelims-csat"
      ? " CSAT is qualifying (~33%); framing is skill-necessity, not GS merit rank."
      : "";
  return `PYQ themes across ${yearsAppeared.length || 0} year(s) [${yearList || "sparse"}]; ~${total} tagged appearances; ${trendWord}. ${entry.notes}${csatNote}`;
}

function buildShortWhy(
  entry: PyqTopicFrequency,
  yearCount: number,
  total: number,
  trend: Trend
): string {
  const trendBit =
    trend === "rising" ? "rising lately" : trend === "falling" ? "softer lately" : "stable pattern";
  const note = entry.notes.replace(/\s+/g, " ").trim();
  if (note.length <= 110) return note;
  return `Appeared in ${yearCount} of last 10 years (~${total} themes); ${trendBit}.`;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export { ANALYSIS_YEARS, NEXT_EXAM_YEAR };
