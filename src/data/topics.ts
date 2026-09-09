import { Topic, Likelihood, PaperId } from "@/types";
import { topicsPart1 } from "./topics-part1";
import { topicsPart2 } from "./topics-part2";
import { topicsPart3 } from "./topics-part3";

export const topics: Topic[] = [...topicsPart1, ...topicsPart2, ...topicsPart3];

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

export function getHighProbabilityTopics(limit = 8): Topic[] {
  return [...topics]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, limit);
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
      t.subtopics.some((s) => s.title.toLowerCase().includes(q))
  );
}
