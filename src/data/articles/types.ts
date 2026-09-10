/** High-probability portion reading article (original exam-oriented notes). */
export interface ArticleSection {
  heading: string;
  body: string;
}

export interface StudyArticle {
  /** URL slug unique within topic */
  slug: string;
  topicId: string;
  title: string;
  /** One-line card blurb */
  blurb: string;
  /** Estimated chance weight for this portion within the topic (heuristic) */
  portionChance: number;
  /** PYQ themes that drove selection */
  pyqThemes: string[];
  sections: ArticleSection[];
  mustRemember: string[];
  /** Why UPSC keeps asking this */
  whyUpscAsks: string;
  /** Optional map / list facts */
  mapFacts?: string[];
}
