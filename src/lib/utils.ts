import { Likelihood } from "@/types";

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

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
