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

export type { StudyArticle, ArticleSection } from "./types";

export const allArticles: StudyArticle[] = [
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

export function getArticlesByTopic(topicId: string): StudyArticle[] {
  return allArticles
    .filter((a) => a.topicId === topicId)
    .sort((a, b) => b.portionChance - a.portionChance);
}

export function getArticle(topicId: string, slug: string): StudyArticle | undefined {
  return allArticles.find((a) => a.topicId === topicId && a.slug === slug);
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
