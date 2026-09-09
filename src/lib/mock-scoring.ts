import type { MockKind, MockQuestion } from "@/types";

export const GS1_MARKS = { correct: 2, wrong: -2 / 3, unattempted: 0 } as const;
/** Common UPSC CSAT pattern: +2.5 correct, −0.83 (≈ 2.5/3) wrong. */
export const CSAT_MARKS = { correct: 2.5, wrong: -2.5 / 3, unattempted: 0 } as const;

export function marksFor(kind: MockKind) {
  return kind === "gs1" ? GS1_MARKS : CSAT_MARKS;
}

export function maxScore(kind: MockKind, count: number) {
  const m = marksFor(kind);
  return count * m.correct;
}

/** Prelims GS1 cutoff is variable; educational heuristic band ~95–105/200. */
export const GS1_CUTOFF_BAND = { low: 95, high: 105, max: 200 } as const;
/** CSAT qualifying ≈ 33% of 200 = ~66.67. */
export const CSAT_QUALIFYING = { ratio: 1 / 3, max: 200 } as const;

export function qualifyingThreshold(kind: MockKind): { label: string; score: number; note: string } {
  if (kind === "gs1") {
    return {
      label: "GS1 cutoff heuristic",
      score: GS1_CUTOFF_BAND.low,
      note: `Prelims GS Paper I cutoff varies yearly; treat ~${GS1_CUTOFF_BAND.low}–${GS1_CUTOFF_BAND.high}/200 as a flexible study heuristic (not official).`,
    };
  }
  const score = Math.round((CSAT_QUALIFYING.ratio * CSAT_QUALIFYING.max) * 100) / 100;
  return {
    label: "CSAT qualifying (≈33%)",
    score,
    note: "CSAT is qualifying — roughly 33% of 200 (≈66.67). Marks here use +2.5 / −0.83 pattern.",
  };
}

export function scoreAnswers(
  kind: MockKind,
  questions: MockQuestion[],
  answers: Record<string, number | null | undefined>
) {
  const m = marksFor(kind);
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  let raw = 0;
  const subjectMap = new Map<string, { correct: number; total: number }>();
  const topicMap = new Map<string, { correct: number; total: number }>();

  for (const q of questions) {
    const ans = answers[q.id];
    const sub = subjectMap.get(q.subjectId) ?? { correct: 0, total: 0 };
    sub.total += 1;
    const tid = q.topicId ?? q.subjectId;
    const top = topicMap.get(tid) ?? { correct: 0, total: 0 };
    top.total += 1;

    if (ans === null || ans === undefined) {
      unattempted += 1;
      raw += m.unattempted;
    } else if (ans === q.correctIndex) {
      correct += 1;
      raw += m.correct;
      sub.correct += 1;
      top.correct += 1;
    } else {
      wrong += 1;
      raw += m.wrong;
    }
    subjectMap.set(q.subjectId, sub);
    topicMap.set(tid, top);
  }

  const attempted = correct + wrong;
  const accuracy = attempted ? Math.round((100 * correct) / attempted) : 0;
  const max = maxScore(kind, questions.length);
  const threshold = qualifyingThreshold(kind);
  // Round to 2 decimals for display stability
  raw = Math.round(raw * 100) / 100;

  return {
    rawScore: raw,
    maxScore: max,
    correct,
    wrong,
    unattempted,
    attempted,
    accuracy,
    passedHeuristic: raw >= threshold.score,
    threshold,
    subjectBreakup: [...subjectMap.entries()].map(([subjectId, v]) => ({ subjectId, ...v })),
    topicBreakup: [...topicMap.entries()].map(([topicId, v]) => ({ topicId, ...v })),
  };
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
