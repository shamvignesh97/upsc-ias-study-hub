/** High-probability portion reading article (original exam-oriented notes). */
export interface ArticleSection {
  heading: string;
  body: string;
}

export interface ArticleTable {
  title: string;
  headers: string[];
  rows: string[][];
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
  /** Comparison / revision tables rendered in app + PDF */
  tables?: ArticleTable[];
  /** Common Prelims traps */
  commonTraps?: string[];
  /** Bullet checklist for last-night revision */
  quickRevision?: string[];
  /** Short note: years appeared / trend / why this portion was chosen */
  chanceNote?: string;
  /** Calendar years (approx) this portion/theme appeared in PYQ window */
  yearsAppeared?: number[];
}
