import type { StudyArticle } from "./types";
import { histArticles } from "./hist";
import { geoArticles } from "./geo";
import { polityArticles } from "./polity";
import { econArticles } from "./econ";
import { envArticles } from "./env";
import { sciCaArticles } from "./sci-ca";
import { cultureArticles } from "./culture";
import { csatArticles } from "./csat";
import { mainsArticles } from "./mains";
import { deepArticleKey, deepArticleMap, deepArticles } from "./deep/generated";

export type { StudyArticle, ArticleSection, ArticleTable } from "./types";
export { deepArticles } from "./deep/generated";

const baseArticles: StudyArticle[] = [
  ...histArticles,
  ...geoArticles,
  ...polityArticles,
  ...econArticles,
  ...envArticles,
  ...sciCaArticles,
  ...cultureArticles,
  ...csatArticles,
  ...mainsArticles,
];

/** Merge deep high-chance expansions over thin base stubs (same topicId+slug). */
function mergeArticles(): StudyArticle[] {
  const map = new Map<string, StudyArticle>();
  for (const a of baseArticles) {
    map.set(deepArticleKey(a.topicId, a.slug), a);
  }
  for (const a of deepArticles) {
    map.set(deepArticleKey(a.topicId, a.slug), a);
  }
  return [...map.values()];
}

export const allArticles: StudyArticle[] = mergeArticles();

export function getArticlesByTopic(topicId: string): StudyArticle[] {
  return allArticles
    .filter((a) => a.topicId === topicId)
    .sort((a, b) => b.portionChance - a.portionChance);
}

export function getArticle(topicId: string, slug: string): StudyArticle | undefined {
  return deepArticleMap[deepArticleKey(topicId, slug)] ?? allArticles.find((a) => a.topicId === topicId && a.slug === slug);
}

export function getArticlePdfPath(topicId: string, slug: string): string {
  return `/articles/${topicId}/${slug}.pdf`;
}

export function getTopicCombinedPdfPath(topicId: string): string {
  return `/articles/${topicId}/high-prob-portions.pdf`;
}

export function getAllArticleParams(): { topicId: string; slug: string }[] {
  return allArticles.map((a) => ({ topicId: a.topicId, slug: a.slug }));
}

export function countArticles(): { total: number; byTopic: Record<string, number> } {
  const byTopic: Record<string, number> = {};
  for (const a of allArticles) {
    byTopic[a.topicId] = (byTopic[a.topicId] ?? 0) + 1;
  }
  return { total: allArticles.length, byTopic };
}

export function countDeepArticles(): number {
  return deepArticles.length;
}
