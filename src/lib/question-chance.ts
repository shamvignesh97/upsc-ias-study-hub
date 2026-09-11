import type { MockQuestion, PaperId } from "@/types";
import { getTopicById } from "@/data/topics";
import { getFrequencyByTopicId } from "@/data/pyq-frequency";
import { computeFromFrequency } from "@/lib/pyq-probability";

/** Map stub / alias topicIds used in mock banks onto canonical syllabus topic ids. */
const TOPIC_ALIASES: Record<string, string> = {
  "sci-space": "sci-space-defence",
  "sci-space-def": "sci-space-defence",
  "hist-mod-gandhi": "hist-modern",
  "hist-mod": "hist-modern",
  "geo-phys-climate": "geo-physical",
  "geo-phys": "geo-physical",
  "csat-math-ari": "csat-math",
  "csat-math-di": "csat-math",
  "csat-numeracy": "csat-math",
  "csat-read-inf": "csat-reading",
  "csat-logic-syl": "csat-logic",
  "csat-reasoning": "csat-logic",
  "env-bio": "env-biodiversity",
  "polity-parliament": "polity-institutions",
  "econ-inflation": "econ-basics",
};

export function canonicalTopicId(topicId?: string | null): string | undefined {
  if (!topicId) return undefined;
  return TOPIC_ALIASES[topicId] ?? topicId;
}

/** Live Loop PYQ chance for a mock/drill question (falls back to stored tag). */
export function resolveQuestionChance(q: Pick<MockQuestion, "topicId" | "subjectId" | "paperId" | "nextExamChance">): number {
  const tid = canonicalTopicId(q.topicId) ?? canonicalTopicId(q.subjectId);
  if (tid) {
    const topic = getTopicById(tid);
    if (topic?.probability != null) {
      // Prefer live topic probability; keep stored tag only if topic missing.
      return topic.probability;
    }
    const freq = getFrequencyByTopicId(tid);
    if (freq) return computeFromFrequency(freq).probability;
  }
  return typeof q.nextExamChance === "number" ? q.nextExamChance : 50;
}

export function enrichQuestionChance<T extends MockQuestion>(q: T): T {
  return { ...q, nextExamChance: resolveQuestionChance(q), topicId: canonicalTopicId(q.topicId) ?? q.topicId };
}

export function enrichQuestionPool(pool: MockQuestion[]): MockQuestion[] {
  return pool.map(enrichQuestionChance);
}

export function likelihoodFromChance(p: number): "High" | "Medium" | "Low" {
  if (p >= 70) return "High";
  if (p >= 45) return "Medium";
  return "Low";
}

export function paperOfQuestion(q: MockQuestion): PaperId {
  return q.paperId;
}
