import { getTopicById } from "@/data/topics";
import { getStoredWeakAreas } from "@/lib/storage";
import { getArticle } from "@/data/articles";
import { getRankedPortions } from "@/data/portion-frequency";

export type FlashPoint = {
  id: string;
  text: string;
  topicId: string;
  topicTitle: string;
  source: "mustRemember" | "revisionCard" | "article" | "trap";
};

/**
 * Build ~10 flash points from weak-area topics (last mock) or fallback high-prob topics.
 */
export function buildFlashPoints(limit = 10, topicIds?: string[]): FlashPoint[] {
  const weak = getStoredWeakAreas();
  const ids =
    topicIds?.length
      ? topicIds
      : weak?.rows?.map((r) => r.topicId).filter(Boolean) ?? [];

  const fallback = getRankedPortions({ paper: "prelims-gs", limit: 6 }).map((p) => p.topicId);
  const ordered = [...ids];
  for (const f of fallback) {
    if (!ordered.includes(f)) ordered.push(f);
  }

  const points: FlashPoint[] = [];
  const seen = new Set<string>();

  for (const tid of ordered) {
    if (points.length >= limit) break;
    const topic = getTopicById(tid);
    if (!topic) continue;
    const title = topic.title;

    for (const line of topic.mustRemember ?? []) {
      if (points.length >= limit) break;
      const key = line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      points.push({
        id: `${tid}-mr-${points.length}`,
        text: line,
        topicId: tid,
        topicTitle: title,
        source: "mustRemember",
      });
    }

    for (const card of topic.revisionCards ?? []) {
      if (points.length >= limit) break;
      const line = `${card.front} → ${card.back}`;
      const key = line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      points.push({
        id: `${tid}-rc-${points.length}`,
        text: line,
        topicId: tid,
        topicTitle: title,
        source: "revisionCard",
      });
    }

    // Top article mustRemember for this topic
    const articles = getRankedPortions({ paper: "prelims-gs" }).filter((p) => p.topicId === tid);
    for (const p of articles.slice(0, 1)) {
      const art = getArticle(p.topicId, p.articleSlug);
      for (const line of art?.mustRemember ?? []) {
        if (points.length >= limit) break;
        const key = line.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        points.push({
          id: `${tid}-ar-${points.length}`,
          text: line,
          topicId: tid,
          topicTitle: title,
          source: "article",
        });
      }
    }

    for (const line of topic.commonTraps ?? []) {
      if (points.length >= limit) break;
      const trap = `Trap: ${line}`;
      const key = trap.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      points.push({
        id: `${tid}-tr-${points.length}`,
        text: trap,
        topicId: tid,
        topicTitle: title,
        source: "trap",
      });
    }
  }

  return points.slice(0, limit);
}

export function flashSourceLabel(source: FlashPoint["source"]): string {
  switch (source) {
    case "mustRemember":
      return "Must-remember";
    case "revisionCard":
      return "Revision card";
    case "article":
      return "High-prob article";
    case "trap":
      return "Common trap";
  }
}
