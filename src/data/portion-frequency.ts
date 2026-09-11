import type { Trend } from "@/types";

/**
 * Portion / theme-level PYQ frequency — Loop’s 10-year synthesis (2016–2025).
 * Used for Next-exam focus ranks, weekly high-prob packs, battle cards, and article depth.
 * Not scraped verbatim papers — approximate theme counts for study prioritisation.
 */
export interface PortionFrequency {
  id: string;
  topicId: string;
  paper: "prelims-gs" | "prelims-csat";
  title: string;
  articleSlug: string;
  yearCounts: Record<string, number>;
  syllabusWeight: number;
  notes: string;
  /** Optional pattern tag for CSAT quants */
  patternTag?: string;
}

export const portionFrequency: PortionFrequency[] = [
  // —— Environment (highest GS topics) ——
  {
    id: "climate-unfccc-paris",
    topicId: "env-climate",
    paper: "prelims-gs",
    title: "Climate Science, UNFCCC & Paris Agreement",
    articleSlug: "climate-unfccc-paris",
    yearCounts: { "2016": 2, "2017": 2, "2018": 3, "2019": 3, "2020": 2, "2021": 3, "2022": 3, "2023": 4, "2024": 3, "2025": 4 },
    syllabusWeight: 5,
    notes: "Rising with COP/NDC diplomacy; science + regime vocabulary every few papers.",
  },
  {
    id: "protected-areas-wpa",
    topicId: "env-biodiversity",
    paper: "prelims-gs",
    title: "Protected Areas, WPA & Species",
    articleSlug: "protected-areas-wpa",
    yearCounts: { "2016": 3, "2017": 3, "2018": 3, "2019": 4, "2020": 3, "2021": 4, "2022": 3, "2023": 3, "2024": 4, "2025": 3 },
    syllabusWeight: 5,
    notes: "NP/WLS/BR + schedules + species–habitat matching — densest env block.",
  },
  {
    id: "biodiversity-hotspots-conventions",
    topicId: "env-biodiversity",
    paper: "prelims-gs",
    title: "Biodiversity Hotspots & Global Conventions",
    articleSlug: "biodiversity-hotspots-conventions",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 1, "2024": 2, "2025": 2 },
    syllabusWeight: 4,
    notes: "Hotspot criteria + CBD/CITES/CMS purpose one-liners recur.",
  },
  // —— Modern History ——
  {
    id: "acts-congress-sessions",
    topicId: "hist-modern",
    paper: "prelims-gs",
    title: "Constitutional Acts & Congress Sessions",
    articleSlug: "acts-congress-sessions",
    yearCounts: { "2016": 3, "2017": 2, "2018": 3, "2019": 2, "2020": 3, "2021": 2, "2022": 3, "2023": 2, "2024": 3, "2025": 2 },
    syllabusWeight: 5,
    notes: "Acts + INC sessions = highest Modern India MCQ density.",
  },
  {
    id: "national-gandhian-movements",
    topicId: "hist-modern",
    paper: "prelims-gs",
    title: "National & Gandhian Mass Movements",
    articleSlug: "national-gandhian-movements",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "NCM/CDM/Quit India chronology and method differences every cycle.",
  },
  // —— Polity ——
  {
    id: "fundamental-rights-dpsp",
    topicId: "polity-const",
    paper: "prelims-gs",
    title: "Fundamental Rights, DPSPs & Interplay",
    articleSlug: "fundamental-rights-dpsp",
    yearCounts: { "2016": 3, "2017": 3, "2018": 2, "2019": 3, "2020": 2, "2021": 3, "2022": 3, "2023": 2, "2024": 3, "2025": 3 },
    syllabusWeight: 5,
    notes: "FR/DPSP articles + harmony doctrine — perennial polity core.",
  },
  {
    id: "basic-structure-amendment",
    topicId: "polity-const",
    paper: "prelims-gs",
    title: "Amendment Procedure & Basic Structure",
    articleSlug: "basic-structure-amendment",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 1, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Art 368 pathways + Kesavananda essentials — conceptual high-weight.",
  },
  {
    id: "parliament-procedures",
    topicId: "polity-institutions",
    paper: "prelims-gs",
    title: "Parliament: Devices, Sessions & Law-Making",
    articleSlug: "parliament-procedures",
    yearCounts: { "2016": 2, "2017": 2, "2018": 3, "2019": 2, "2020": 3, "2021": 2, "2022": 2, "2023": 3, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Money Bill, devices, adjournment/prorogation — procedural MCQ magnets.",
  },
  {
    id: "judiciary-constitutional-bodies",
    topicId: "polity-institutions",
    paper: "prelims-gs",
    title: "Judiciary & Constitutional Bodies",
    articleSlug: "judiciary-constitutional-bodies",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Writs, jurisdiction, EC/CAG/UPSC independence facts yearly.",
  },
  // —— Economy ——
  {
    id: "inflation-monetary",
    topicId: "econ-basics",
    paper: "prelims-gs",
    title: "Inflation & Monetary Policy",
    articleSlug: "inflation-monetary",
    yearCounts: { "2016": 2, "2017": 2, "2018": 3, "2019": 2, "2020": 3, "2021": 2, "2022": 3, "2023": 3, "2024": 2, "2025": 3 },
    syllabusWeight: 5,
    notes: "CPI/WPI, MPC, tools — core econ every year.",
  },
  {
    id: "fiscal-budget-national-income",
    topicId: "econ-basics",
    paper: "prelims-gs",
    title: "Fiscal Policy, Budget & National Income",
    articleSlug: "fiscal-budget-national-income",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Deficits, budget terms, GDP/GVA basics — stable high weight.",
  },
  {
    id: "external-sector",
    topicId: "econ-schemes",
    paper: "prelims-gs",
    title: "External Sector & BoP",
    articleSlug: "external-sector",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 1 },
    syllabusWeight: 4,
    notes: "CAD, forex, trade — recurring with CA hooks.",
  },
  // —— Geography ——
  {
    id: "monsoon-climatology",
    topicId: "geo-physical",
    paper: "prelims-gs",
    title: "Monsoon & Climatology",
    articleSlug: "monsoon-climatology",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 3, "2022": 2, "2023": 3, "2024": 2, "2025": 3 },
    syllabusWeight: 5,
    notes: "Monsoon mechanism + ENSO/orography — Loop marks this as a perennial GS geo staple.",
  },
  {
    id: "geomorphology-oceans",
    topicId: "geo-physical",
    paper: "prelims-gs",
    title: "Geomorphology & Oceanography",
    articleSlug: "geomorphology-oceans",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 1, "2020": 2, "2021": 1, "2022": 2, "2023": 1, "2024": 2, "2025": 1 },
    syllabusWeight: 4,
    notes: "Landforms, earthquakes, ocean currents — map/concept mix.",
  },
  {
    id: "physiography-drainage",
    topicId: "geo-india",
    paper: "prelims-gs",
    title: "Indian Physiography & Drainage",
    articleSlug: "physiography-drainage",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 4,
    notes: "Himalaya/Peninsular/drainage matching — steady India geo core.",
  },
  {
    id: "agri-resources-minerals",
    topicId: "geo-india",
    paper: "prelims-gs",
    title: "Agriculture, Resources & Minerals",
    articleSlug: "agri-resources-minerals",
    yearCounts: { "2016": 1, "2017": 1, "2018": 2, "2019": 1, "2020": 1, "2021": 2, "2022": 1, "2023": 2, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "Crops, soils, mineral belts — location questions.",
  },
  // —— Ancient India (medium topic weight; hottest sub-portions kept) ——
  {
    id: "ivc-sites-culture",
    topicId: "hist-ancient",
    paper: "prelims-gs",
    title: "IVC Sites, Urban Culture & Decline",
    articleSlug: "ivc-sites-culture",
    yearCounts: { "2016": 1, "2017": 0, "2018": 1, "2019": 1, "2020": 1, "2021": 0, "2022": 1, "2023": 0, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "Hottest Ancient slice — site↔feature matching almost every alternate year.",
  },
  {
    id: "buddhism-jainism",
    topicId: "hist-ancient",
    paper: "prelims-gs",
    title: "Buddhism & Jainism: Doctrines & Councils",
    articleSlug: "buddhism-jainism",
    yearCounts: { "2016": 1, "2017": 1, "2018": 0, "2019": 1, "2020": 1, "2021": 1, "2022": 0, "2023": 1, "2024": 1, "2025": 0 },
    syllabusWeight: 4,
    notes: "Councils, doctrines, patrons — second Ancient magnet.",
  },
  {
    id: "maurya-gupta",
    topicId: "hist-ancient",
    paper: "prelims-gs",
    title: "Mauryas & Guptas: Polity, Dhamma, Culture",
    articleSlug: "maurya-gupta",
    yearCounts: { "2016": 0, "2017": 1, "2018": 1, "2019": 0, "2020": 1, "2021": 0, "2022": 1, "2023": 1, "2024": 0, "2025": 1 },
    syllabusWeight: 4,
    notes: "Edicts/Dhamma + Gupta culture/science — third Ancient priority.",
  },
  // —— S&T / CA ——
  {
    id: "isro-space-defence",
    topicId: "sci-space-defence",
    paper: "prelims-gs",
    title: "ISRO, Space & Defence Tech",
    articleSlug: "isro-space-defence",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 3, "2024": 2, "2025": 3 },
    syllabusWeight: 4,
    notes: "Rising with missions/missiles — CA–static blend.",
  },
  {
    id: "national-schemes-institutions",
    topicId: "ca-national",
    paper: "prelims-gs",
    title: "National Schemes & Institutions in News",
    articleSlug: "national-schemes-institutions",
    yearCounts: { "2016": 3, "2017": 3, "2018": 3, "2019": 4, "2020": 3, "2021": 4, "2022": 3, "2023": 4, "2024": 4, "2025": 3 },
    syllabusWeight: 4,
    notes: "High volume but ephemeral — revise last 12–18 months + static anchors.",
  },
  // —— CSAT Quants themes ——
  {
    id: "csat-quant-percentages",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Percentages & Profit-Loss",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Among densest CSAT arith blocks every year.",
    patternTag: "quant-pct",
  },
  {
    id: "csat-quant-ratio",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Ratio, Proportion & Mixtures",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 2, "2020": 1, "2021": 2, "2022": 1, "2023": 1, "2024": 2, "2025": 1 },
    syllabusWeight: 5,
    notes: "Ratio/mixture replacements appear regularly.",
    patternTag: "quant-ratio",
  },
  {
    id: "csat-quant-averages",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Averages & Alligation basics",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 1, "2020": 1, "2021": 1, "2022": 1, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "Short average manipulations — high attempt value.",
    patternTag: "quant-avg",
  },
  {
    id: "csat-quant-time-work",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Time & Work",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 1, "2020": 1, "2021": 1, "2022": 1, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "Pipes/cisterns & combined work — classic CSAT.",
    patternTag: "quant-work",
  },
  {
    id: "csat-quant-time-distance",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Time, Speed & Distance",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 1, "2017": 1, "2018": 2, "2019": 1, "2020": 1, "2021": 1, "2022": 2, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "Trains/boats/relative speed — recurring.",
    patternTag: "quant-tsd",
  },
  {
    id: "csat-quant-si-ci",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Simple & Compound Interest",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 1, "2017": 0, "2018": 1, "2019": 1, "2020": 0, "2021": 1, "2022": 1, "2023": 0, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "SI every few years; CI basics when present.",
    patternTag: "quant-interest",
  },
  {
    id: "csat-quant-number-simp",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Number System & Simplification",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 1, "2020": 2, "2021": 1, "2022": 1, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 4,
    notes: "HCF/LCM, remainders, BODMAS — speed builders.",
    patternTag: "quant-number",
  },
  {
    id: "csat-quant-di",
    topicId: "csat-math",
    paper: "prelims-csat",
    title: "Data Interpretation",
    articleSlug: "numeracy-di",
    yearCounts: { "2016": 2, "2017": 1, "2018": 2, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 1, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Tables/charts sets — large share of numeracy marks when present.",
    patternTag: "quant-di",
  },
];

const YEARS = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"] as const;
const NEXT = 2026;

export interface RankedPortion {
  id: string;
  topicId: string;
  paper: "prelims-gs" | "prelims-csat";
  title: string;
  articleSlug: string;
  probability: number;
  trend: Trend;
  yearsAppeared: number[];
  totalAppearances: number;
  notes: string;
  patternTag?: string;
  chanceLabel: string;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** Same spirit as topic engine, calibrated for portion-level counts. */
export function computePortionProbability(entry: PortionFrequency): RankedPortion {
  const counts = YEARS.map((y) => entry.yearCounts[y] ?? 0);
  const yearsAppeared = YEARS.filter((_, i) => counts[i] > 0).map(Number);
  const totalAppearances = counts.reduce((a, b) => a + b, 0);
  const weighted = counts.reduce((sum, c, i) => sum + c * (1 + i / 9), 0);
  const maxWeighted = YEARS.reduce((s, _, i) => s + 5 * (1 + i / 9), 0) * 0.5;
  let frequencyScore = clamp(Math.round((100 * weighted) / Math.max(maxWeighted, 1)), 0, 100);
  const last3 = counts.slice(-3).reduce((a, b) => a + b, 0);
  const prev3 = counts.slice(-6, -3).reduce((a, b) => a + b, 0);
  let recencyAdj = 0;
  if (last3 >= prev3 + 2) recencyAdj += 6;
  else if (last3 + 2 <= prev3) recencyAdj -= 4;
  let yearsSinceLast = 99;
  for (let i = counts.length - 1; i >= 0; i--) {
    if (counts[i] > 0) {
      yearsSinceLast = NEXT - Number(YEARS[i]);
      break;
    }
  }
  if (yearsSinceLast >= 2 && yearsSinceLast <= 4 && entry.syllabusWeight >= 3) recencyAdj += 5;
  if (yearsSinceLast === 1) recencyAdj += 3;
  const syllabusBoost = Math.round((entry.syllabusWeight / 5) * 10);
  let probability = frequencyScore * 0.72 + syllabusBoost + recencyAdj;
  if (entry.paper === "prelims-csat") {
    probability = Math.max(probability, 70 + entry.syllabusWeight * 3);
  }
  probability = clamp(Math.round(probability), 12, 96);
  const early = counts.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
  const late = counts.slice(-4).reduce((a, b) => a + b, 0) / 4;
  const trend: Trend = late >= early + 0.5 ? "rising" : early >= late + 0.5 ? "falling" : "stable";
  const chanceLabel =
    entry.paper === "prelims-csat"
      ? `~${probability}% structural chance in next CSAT numeracy mix`
      : `~${probability}% chance this portion theme appears in next Prelims GS`;
  return {
    id: entry.id,
    topicId: entry.topicId,
    paper: entry.paper,
    title: entry.title,
    articleSlug: entry.articleSlug,
    probability,
    trend,
    yearsAppeared,
    totalAppearances,
    notes: entry.notes,
    patternTag: entry.patternTag,
    chanceLabel,
  };
}

export function getRankedPortions(opts?: {
  paper?: "prelims-gs" | "prelims-csat" | "all";
  limit?: number;
}): RankedPortion[] {
  const paper = opts?.paper ?? "all";
  let list = portionFrequency.map(computePortionProbability);
  if (paper !== "all") list = list.filter((p) => p.paper === paper);
  list.sort((a, b) => b.probability - a.probability);
  if (opts?.limit) list = list.slice(0, opts.limit);
  return list;
}

export function getPortionRank(articleSlug: string, topicId: string): RankedPortion | undefined {
  return getRankedPortions().find((p) => p.articleSlug === articleSlug && p.topicId === topicId);
}

/** High-chance floor used by weekly pack / Loop focus (≥70% = High band). */
export const HIGH_PORTION_CHANCE = 70;

/** Loop’s next-exam portion picks for Prelims GS (default top 12). */
export function getLoopNextExamPicks(limit = 12): RankedPortion[] {
  return getRankedPortions({ paper: "prelims-gs", limit });
}

/** Topic ids covered by High-chance (≥70%) Prelims GS portions. */
export function getHighChancePortionTopicIds(floor = HIGH_PORTION_CHANCE): string[] {
  const ids = new Set<string>();
  for (const p of getRankedPortions({ paper: "prelims-gs" })) {
    if (p.probability >= floor) ids.add(p.topicId);
  }
  return [...ids];
}

export function getPortionById(id: string): RankedPortion | undefined {
  return getRankedPortions().find((p) => p.id === id);
}
