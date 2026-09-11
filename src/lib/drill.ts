import type { MockQuestion } from "@/types";
import { hashStringToSeed, seededShuffle } from "@/lib/seeded-rng";
import { enrichQuestionPool, resolveQuestionChance } from "@/lib/question-chance";
import { getHighChancePortionTopicIds, HIGH_PORTION_CHANCE } from "@/data/portion-frequency";

/** Calendar day key in Asia/Kolkata (IST) so drills align with the user's day. */
export function istDayKey(d = new Date()): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // en-CA → YYYY-MM-DD
  return fmt.format(d);
}

export function previousIstDayKey(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  // Noon UTC on that civil date avoids DST edge cases (IST has none anyway).
  const utc = Date.UTC(y, m - 1, d, 6, 30, 0);
  const prev = new Date(utc - 24 * 60 * 60 * 1000);
  return istDayKey(prev);
}

/** ISO week key in IST (YYYY-Www) for weekly pack stability. */
export function istWeekKey(d = new Date()): string {
  const dayKey = istDayKey(d);
  const [y, m, day] = dayKey.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, day, 6, 30, 0));
  // ISO week: Thursday-based
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

const HIGH_CHANCE_FLOOR = HIGH_PORTION_CHANCE;
const DRILL_SIZE = 10;
const WEEKLY_SIZE = 25;
const CSAT_QUANTS_DAILY = 5;

function diversifyPick(pool: MockQuestion[], size: number, seedKey: string): MockQuestion[] {
  const seed = hashStringToSeed(seedKey);
  const shuffled = seededShuffle(pool, seed);
  const picked: MockQuestion[] = [];
  const seenTopics = new Set<string>();
  for (const q of shuffled) {
    if (picked.length >= size) break;
    const tid = q.topicId ?? q.subjectId;
    if (seenTopics.has(tid)) continue;
    seenTopics.add(tid);
    picked.push(q);
  }
  if (picked.length < size) {
    for (const q of shuffled) {
      if (picked.length >= size) break;
      if (picked.some((p) => p.id === q.id)) continue;
      picked.push(q);
    }
  }
  return picked.slice(0, size);
}

/**
 * Sample 10 GS1-weighted questions from high nextExamChance themes.
 * Stable per dayKey — refresh does not reshuffle.
 */
export function sampleDailyDrill(
  pool: MockQuestion[],
  dayKey: string,
  size = DRILL_SIZE
): MockQuestion[] {
  const enriched = enrichQuestionPool(pool);
  const gs1 = enriched.filter((q) => q.paperId === "prelims-gs");
  const highTopicIds = new Set(getHighChancePortionTopicIds());
  const high = gs1.filter(
    (q) =>
      resolveQuestionChance(q) >= HIGH_CHANCE_FLOOR ||
      (q.topicId != null && highTopicIds.has(q.topicId))
  );
  const base = high.length >= size ? high : gs1.length ? gs1 : enriched;
  return diversifyPick(base, size, `upsc-drill-${dayKey}`);
}

/** 25 mixed GS1 MCQs only from High-chance portions (≥70%). Stable per ISO week. */
export function sampleWeeklyHighProbPack(
  pool: MockQuestion[],
  weekKey: string,
  size = WEEKLY_SIZE
): MockQuestion[] {
  const enriched = enrichQuestionPool(pool);
  const highTopicIds = new Set(getHighChancePortionTopicIds());
  const gs1 = enriched.filter((q) => q.paperId === "prelims-gs");
  const high = gs1.filter(
    (q) =>
      resolveQuestionChance(q) >= HIGH_CHANCE_FLOOR ||
      (q.topicId != null && highTopicIds.has(q.topicId))
  );
  const base = high.length >= size ? high : gs1;
  return diversifyPick(base, size, `upsc-weekly-${weekKey}`);
}

function isQuantSection(q: MockQuestion): boolean {
  const s = (q.section ?? "").toLowerCase();
  if (s.startsWith("quant") || s.includes("numer")) return true;
  const tid = (q.topicId ?? "").toLowerCase();
  return tid.includes("math") || tid.includes("numeracy") || tid.includes("csat-math");
}

/** Daily CSAT quants-only 5Q from high-prob numeracy themes. */
export function sampleCsatQuantsDaily(
  pool: MockQuestion[],
  dayKey: string,
  size = CSAT_QUANTS_DAILY
): MockQuestion[] {
  const enriched = enrichQuestionPool(pool);
  const quants = enriched.filter(
    (q) => q.paperId === "prelims-csat" && isQuantSection(q)
  );
  const high = quants.filter((q) => resolveQuestionChance(q) >= 70);
  const base = high.length >= size ? high : quants.length ? quants : enriched;
  return diversifyPick(base, size, `upsc-csat-quant-${dayKey}`);
}

export const DRILL_QUESTION_COUNT = DRILL_SIZE;
export const WEEKLY_QUESTION_COUNT = WEEKLY_SIZE;
export const CSAT_QUANTS_DAILY_COUNT = CSAT_QUANTS_DAILY;
