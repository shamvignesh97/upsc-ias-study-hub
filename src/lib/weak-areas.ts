import type { MockAttemptSummary, MockQuestion, Topic } from "@/types";
import { getHighProbabilityTopics, getTopicById } from "@/data/topics";
import type { PlannerItem } from "@/lib/storage";

export type WeakAreaRow = {
  topicId: string;
  title: string;
  subjectId: string;
  paperId: string;
  correct: number;
  total: number;
  wrongOrSkip: number;
  accuracy: number;
  studyHref: string;
};

function studyHrefFor(topicId: string, subjectId: string, paperId?: string): string {
  const topic = getTopicById(topicId);
  const pid = topic?.paperId ?? paperId ?? "prelims-gs";
  const sid = topic?.subjectId ?? subjectId;
  return `/study/${pid}/${sid}?topic=${encodeURIComponent(topicId)}`;
}

/**
 * Rank weak areas from a scored mock: topics with wrong + unattempted weighted higher.
 * Uses question-level answers when available; falls back to topicBreakup accuracy.
 */
export function analyzeWeakAreas(
  questions: MockQuestion[],
  answers: Record<string, number | null | undefined>,
  topicBreakup: { topicId: string; correct: number; total: number }[]
): WeakAreaRow[] {
  const map = new Map<
    string,
    { correct: number; total: number; wrongOrSkip: number; subjectId: string }
  >();

  if (questions.length) {
    for (const q of questions) {
      const tid = q.topicId ?? q.subjectId;
      const row = map.get(tid) ?? {
        correct: 0,
        total: 0,
        wrongOrSkip: 0,
        subjectId: q.subjectId,
      };
      row.total += 1;
      const ans = answers[q.id];
      if (ans === null || ans === undefined) {
        row.wrongOrSkip += 1;
      } else if (ans === q.correctIndex) {
        row.correct += 1;
      } else {
        row.wrongOrSkip += 1;
      }
      map.set(tid, row);
    }
  } else {
    for (const t of topicBreakup) {
      const topic = getTopicById(t.topicId);
      map.set(t.topicId, {
        correct: t.correct,
        total: t.total,
        wrongOrSkip: t.total - t.correct,
        subjectId: topic?.subjectId ?? t.topicId,
      });
    }
  }

  const rows: WeakAreaRow[] = [];
  for (const [topicId, v] of map) {
    if (v.wrongOrSkip === 0) continue;
    const topic = getTopicById(topicId);
    const title = topic?.title ?? topicId.replace(/-/g, " ");
    const paperId = topic?.paperId ?? "prelims-gs";
    const accuracy = v.total ? Math.round((100 * v.correct) / v.total) : 0;
    rows.push({
      topicId,
      title,
      subjectId: topic?.subjectId ?? v.subjectId,
      paperId,
      correct: v.correct,
      total: v.total,
      wrongOrSkip: v.wrongOrSkip,
      accuracy,
      studyHref: studyHrefFor(topicId, topic?.subjectId ?? v.subjectId, paperId),
    });
  }

  rows.sort((a, b) => {
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
    return b.wrongOrSkip - a.wrongOrSkip;
  });
  return rows;
}

/** Mix high-probability + weak topics into a 7-day checklist (2/day ≈ 14 slots). */
export function buildWeakAwarePlan(
  weakTopicIds: string[],
  highLimit = 8,
  weakLimit = 6
): PlannerItem[] {
  const weakUnique = [...new Set(weakTopicIds)].slice(0, weakLimit);
  const high = getHighProbabilityTopics(highLimit + weakUnique.length)
    .map((t) => t.id)
    .filter((id) => !weakUnique.includes(id))
    .slice(0, highLimit);

  // Interleave: weak, high, weak, high…
  const mixed: string[] = [];
  const max = Math.max(weakUnique.length, high.length);
  for (let i = 0; i < max; i++) {
    if (i < weakUnique.length) mixed.push(weakUnique[i]);
    if (i < high.length) mixed.push(high[i]);
  }
  const capped = mixed.slice(0, 14);
  return capped.map((topicId, i) => ({
    topicId,
    day: Math.floor(i / 2) + 1,
    done: false,
  }));
}

export function weakAreasFromAttempt(attempt: MockAttemptSummary): WeakAreaRow[] {
  return analyzeWeakAreas([], {}, attempt.topicBreakup);
}

export function topicTitle(topicId: string): string {
  const t: Topic | undefined = getTopicById(topicId);
  return t?.title ?? topicId.replace(/-/g, " ");
}
