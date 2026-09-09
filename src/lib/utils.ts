import { Likelihood, PaperId, Trend } from "@/types";

export function likelihoodColor(l: Likelihood): string {
  switch (l) {
    case "High":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "Medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function probabilityBarColor(p: number): string {
  if (p >= 70) return "bg-rose-500";
  if (p >= 50) return "bg-amber-500";
  return "bg-slate-400";
}

export function probabilityTextColor(p: number): string {
  if (p >= 70) return "text-rose-700";
  if (p >= 50) return "text-amber-700";
  return "text-slate-600";
}

export function paperExamPhrase(paperId: PaperId): string {
  switch (paperId) {
    case "prelims-gs":
      return "next Prelims GS Paper I";
    case "prelims-csat":
      return "next Prelims CSAT (Paper II)";
    case "mains-essay":
      return "next Mains Essay paper";
    case "mains-gs1":
      return "next Mains GS Paper I";
    case "mains-gs2":
      return "next Mains GS Paper II";
    case "mains-gs3":
      return "next Mains GS Paper III";
    case "mains-gs4":
      return "next Mains GS Paper IV";
    case "optional":
      return "Optional papers (strategic weight)";
    case "interview":
      return "Personality Test / Interview";
  }
}

/** Plain-language chance line for badges and cards. */
export function examChanceLabel(paperId: PaperId, probability: number): string {
  if (paperId === "optional") {
    return `~${probability}% strategic weight for Optional choice`;
  }
  if (paperId === "interview") {
    return `~${probability}% relevance in Personality Test prep`;
  }
  if (paperId === "prelims-csat") {
    return `~${probability}% skill-necessity for next Prelims CSAT`;
  }
  return `~${probability}% chance in ${paperExamPhrase(paperId)}`;
}

export function trendLabel(trend: Trend): string {
  switch (trend) {
    case "rising":
      return "Rising";
    case "falling":
      return "Softening";
    case "stable":
      return "Stable";
  }
}

export function trendColor(trend: Trend): string {
  switch (trend) {
    case "rising":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "falling":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "stable":
      return "bg-sky-100 text-sky-800 border-sky-200";
  }
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
