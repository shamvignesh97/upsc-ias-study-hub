import type { MockQuestion } from "@/types";
import { hashStringToSeed, seededShuffle } from "@/lib/seeded-rng";

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

const HIGH_CHANCE_FLOOR = 70;
const DRILL_SIZE = 10;

/**
 * Sample 10 GS1-weighted questions from high nextExamChance themes.
 * Stable per dayKey — refresh does not reshuffle.
 */
export function sampleDailyDrill(
  pool: MockQuestion[],
  dayKey: string,
  size = DRILL_SIZE
): MockQuestion[] {
  const gs1 = pool.filter((q) => q.paperId === "prelims-gs");
  const high = gs1.filter((q) => q.nextExamChance >= HIGH_CHANCE_FLOOR);
  const base = high.length >= size ? high : gs1.length ? gs1 : pool;
  const seed = hashStringToSeed(`upsc-drill-${dayKey}`);
  const shuffled = seededShuffle(base, seed);
  // Prefer topic diversity: take first unique topicIds, then fill.
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

export const DRILL_QUESTION_COUNT = DRILL_SIZE;
