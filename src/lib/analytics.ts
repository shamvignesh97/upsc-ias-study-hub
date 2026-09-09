import type { MockAttemptSummary, MockKind } from "@/types";
import { GS1_CUTOFF_BAND, CSAT_QUALIFYING } from "@/lib/mock-scoring";

export type ScorePoint = {
  id: string;
  finishedAt: string;
  label: string;
  kind: MockKind;
  rawScore: number;
  maxScore: number;
  pct: number;
  accuracy: number;
};

export type SubjectAvg = {
  subjectId: string;
  label: string;
  correct: number;
  total: number;
  accuracy: number;
};

export type AnalyticsSummary = {
  attempts: MockAttemptSummary[];
  points: ScorePoint[];
  gs1: MockAttemptSummary[];
  csat: MockAttemptSummary[];
  avgAccuracy: number;
  avgGs1Score: number | null;
  avgCsatScore: number | null;
  latestGs1: MockAttemptSummary | null;
  latestCsat: MockAttemptSummary | null;
  gs1CutoffProximity: { score: number; bandLow: number; bandHigh: number; delta: number } | null;
  csatCutoffProximity: { score: number; qualifying: number; delta: number } | null;
  subjectAverages: SubjectAvg[];
};

function shortLabel(a: MockAttemptSummary): string {
  const d = new Date(a.finishedAt);
  const date = d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
  });
  return `${a.kind.toUpperCase()} ${a.paperKey.toUpperCase()} · ${date}`;
}

export function buildAnalytics(history: MockAttemptSummary[]): AnalyticsSummary {
  const chronological = [...history].sort(
    (a, b) => new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime()
  );
  const points: ScorePoint[] = chronological.map((a) => ({
    id: a.id,
    finishedAt: a.finishedAt,
    label: shortLabel(a),
    kind: a.kind,
    rawScore: a.rawScore,
    maxScore: a.maxScore,
    pct: a.maxScore ? Math.round((100 * a.rawScore) / a.maxScore) : 0,
    accuracy: a.accuracy,
  }));

  const gs1 = history.filter((a) => a.kind === "gs1");
  const csat = history.filter((a) => a.kind === "csat");
  const avgAccuracy = history.length
    ? Math.round(history.reduce((s, a) => s + a.accuracy, 0) / history.length)
    : 0;
  const avgGs1Score = gs1.length
    ? Math.round((gs1.reduce((s, a) => s + a.rawScore, 0) / gs1.length) * 10) / 10
    : null;
  const avgCsatScore = csat.length
    ? Math.round((csat.reduce((s, a) => s + a.rawScore, 0) / csat.length) * 10) / 10
    : null;

  const latestGs1 = gs1[0] ?? null;
  const latestCsat = csat[0] ?? null;

  const gs1CutoffProximity = latestGs1
    ? {
        score: latestGs1.rawScore,
        bandLow: GS1_CUTOFF_BAND.low,
        bandHigh: GS1_CUTOFF_BAND.high,
        delta: Math.round((latestGs1.rawScore - GS1_CUTOFF_BAND.low) * 10) / 10,
      }
    : null;

  const csatQ = Math.round(CSAT_QUALIFYING.ratio * CSAT_QUALIFYING.max * 100) / 100;
  const csatCutoffProximity = latestCsat
    ? {
        score: latestCsat.rawScore,
        qualifying: csatQ,
        delta: Math.round((latestCsat.rawScore - csatQ) * 10) / 10,
      }
    : null;

  const subMap = new Map<string, { correct: number; total: number }>();
  for (const a of history) {
    for (const s of a.subjectBreakup) {
      const cur = subMap.get(s.subjectId) ?? { correct: 0, total: 0 };
      cur.correct += s.correct;
      cur.total += s.total;
      subMap.set(s.subjectId, cur);
    }
  }
  const subjectAverages: SubjectAvg[] = [...subMap.entries()]
    .map(([subjectId, v]) => ({
      subjectId,
      label: subjectId.replace(/^csat-/, "").replace(/-/g, " "),
      correct: v.correct,
      total: v.total,
      accuracy: v.total ? Math.round((100 * v.correct) / v.total) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return {
    attempts: history,
    points,
    gs1,
    csat,
    avgAccuracy,
    avgGs1Score,
    avgCsatScore,
    latestGs1,
    latestCsat,
    gs1CutoffProximity,
    csatCutoffProximity,
    subjectAverages,
  };
}
