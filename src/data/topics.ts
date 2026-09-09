import { Topic, Likelihood, PaperId, Trend } from "@/types";
import { topicsPart1 } from "./topics-part1";
import { topicsPart2 } from "./topics-part2";
import { topicsPart3 } from "./topics-part3";
import { getFrequencyByTopicId } from "./pyq-frequency";
import { computeFromFrequency } from "@/lib/pyq-probability";
import { getStudyEnrichment } from "./study/enrichment";
import { examChanceLabel } from "@/lib/utils";

const rawTopics: Topic[] = [...topicsPart1, ...topicsPart2, ...topicsPart3];

/** Enrich static topic copy with PYQ-derived probability and rich study content. */
export const topics: Topic[] = rawTopics.map((t) => {
  const freq = getFrequencyByTopicId(t.id);
  const study = getStudyEnrichment(t.id);

  let next: Topic = { ...t };

  if (freq) {
    const computed = computeFromFrequency(freq);
    next = {
      ...next,
      probability: computed.probability,
      likelihood: computed.likelihood,
      whyBlurb: computed.whyBlurb,
      shortWhy: computed.shortWhy,
      chanceLabel: computed.chanceLabel,
      pyqAnalysis: computed.analysis,
    };
  } else {
    next = {
      ...next,
      shortWhy: t.whyBlurb,
      chanceLabel: examChanceLabel(t.paperId, t.probability),
    };
  }

  if (study) {
    next = {
      ...next,
      notes: study.studyNotes || next.notes,
      keyConcepts: study.keyConcepts,
      definitions: study.definitions,
      mustRemember: study.mustRemember,
      commonTraps: study.commonTraps,
      revisionCards: study.revisionCards,
      tables: study.tables,
    };
  }

  return next;
});

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getTopicsBySubject(subjectId: string): Topic[] {
  return topics.filter((t) => t.subjectId === subjectId);
}

export function getTopicsByPaper(paperId: PaperId): Topic[] {
  return topics.filter((t) => t.paperId === paperId);
}

export function getTopicsByLikelihood(likelihood: Likelihood): Topic[] {
  return topics.filter((t) => t.likelihood === likelihood);
}

export function getHighProbabilityTopics(limit = 8, paperId?: PaperId): Topic[] {
  const pool = paperId ? topics.filter((t) => t.paperId === paperId) : topics;
  return [...pool]
    .filter((t) => t.paperId !== "optional" && t.paperId !== "interview")
    .sort((a, b) => b.probability - a.probability)
    .slice(0, limit);
}

export function getTopicsByTrend(trend: Trend): Topic[] {
  return topics.filter((t) => t.pyqAnalysis?.trend === trend);
}

/** Topics in stable syllabus order within a subject (array order). */
export function getSubjectTopicSequence(subjectId: string): Topic[] {
  return getTopicsBySubject(subjectId);
}

export function getAdjacentInSubject(topicId: string): {
  prev: Topic | null;
  next: Topic | null;
  index: number;
  total: number;
} {
  const topic = getTopicById(topicId);
  if (!topic) return { prev: null, next: null, index: -1, total: 0 };
  const seq = getSubjectTopicSequence(topic.subjectId);
  const index = seq.findIndex((t) => t.id === topicId);
  return {
    prev: index > 0 ? seq[index - 1] : null,
    next: index >= 0 && index < seq.length - 1 ? seq[index + 1] : null,
    index,
    total: seq.length,
  };
}

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return topics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.notes.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.subtopics.some((s) => s.title.toLowerCase().includes(q)) ||
      (t.keyConcepts ?? []).some((k) => k.toLowerCase().includes(q))
  );
}
