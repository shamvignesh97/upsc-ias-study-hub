export type Likelihood = "High" | "Medium" | "Low";

export type Trend = "rising" | "stable" | "falling";

export type PaperId =
  | "prelims-gs"
  | "prelims-csat"
  | "mains-essay"
  | "mains-gs1"
  | "mains-gs2"
  | "mains-gs3"
  | "mains-gs4"
  | "optional"
  | "interview";

export interface Subtopic {
  id: string;
  title: string;
  notes: string;
}

export interface PyqAnalysisSummary {
  yearsAppeared: number[];
  totalAppearances: number;
  frequencyScore: number;
  trend: Trend;
  methodologyNote: string;
}

export interface Definition {
  term: string;
  meaning: string;
}

export interface RevisionCard {
  front: string;
  back: string;
}

export interface StudyTable {
  title: string;
  headers: string[];
  rows: string[][];
}

/** Rich in-app study payload merged onto each topic. */
export interface StudyEnrichment {
  keyConcepts: string[];
  definitions?: Definition[];
  mustRemember: string[];
  commonTraps: string[];
  revisionCards: RevisionCard[];
  tables?: StudyTable[];
  /** Longer original study notes (replaces thin stub notes when present). */
  studyNotes: string;
}

export interface Topic {
  id: string;
  title: string;
  subjectId: string;
  paperId: PaperId;
  likelihood: Likelihood;
  probability: number; // 0-100 estimate from PYQ analysis
  whyBlurb: string;
  /** One-line rationale for focus lists / cards. */
  shortWhy?: string;
  /** Plain-language chance line, e.g. "~82% chance in next Prelims GS Paper I". */
  chanceLabel?: string;
  summary: string;
  notes: string;
  subtopics: Subtopic[];
  relatedTopicIds: string[];
  tags: string[];
  pyqAnalysis?: PyqAnalysisSummary;
  keyConcepts?: string[];
  definitions?: Definition[];
  mustRemember?: string[];
  commonTraps?: string[];
  revisionCards?: RevisionCard[];
  tables?: StudyTable[];
}

export interface Subject {
  id: string;
  title: string;
  paperId: PaperId;
  description: string;
  icon: string;
}

export interface Paper {
  id: PaperId;
  title: string;
  shortTitle: string;
  description: string;
  stage: "Prelims" | "Mains" | "Interview" | "Optional";
}

export interface QuizQuestion {
  id: string;
  subjectId: string;
  paperId: PaperId;
  topicId?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  yearTag?: number;
  illustrative?: boolean;
}

export interface MainsPrompt {
  id: string;
  subjectId: string;
  paperId: PaperId;
  topicId?: string;
  question: string;
  tags: string[];
  marksHint: string;
  modelOutline: string[];
  keyPoints: string[];
  yearTag?: number;
  illustrative?: boolean;
}

export interface PyqQuestion {
  id: string;
  year: number;
  paper: string;
  subjectId: string;
  topicId?: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  answerHint: string;
  type: "mcq" | "descriptive";
  illustrative?: boolean;
}

export interface PyqTopicFrequency {
  topicId: string;
  paper: PaperId;
  /** Approximate theme/question counts by calendar year (educational synthesis of PYQ patterns). */
  yearCounts: Record<string, number>;
  syllabusWeight: number; // 1–5
  notes: string;
}

export interface OptionalSubject {
  id: string;
  title: string;
  category: string;
  briefNotes: string;
  whyChoose: string;
  keyTopics: string[];
}

export interface QuizTrackMeta {
  id: string;
  subjectId: string;
  paperId: PaperId;
  title: string;
  icon: string;
  description: string;
  kind: "mcq" | "mains";
  count: number;
}


export type MockKind = "gs1" | "csat";

export interface MockQuestion extends QuizQuestion {
  /** Estimated next-exam theme chance % from PYQ analysis (0–100). */
  nextExamChance: number;
  /** CSAT skill section tag when applicable. */
  section?: string;
}

export interface MockPaperMeta {
  id: string;
  kind: MockKind;
  key: string;
  title: string;
  subtitle: string;
  questionCount: number;
  durationMinutes: number;
}

export interface MockAttemptSummary {
  id: string;
  kind: MockKind;
  paperKey: string;
  paperTitle: string;
  finishedAt: string;
  rawScore: number;
  maxScore: number;
  correct: number;
  wrong: number;
  unattempted: number;
  attempted: number;
  accuracy: number;
  timeUsedSeconds: number;
  durationSeconds: number;
  passedHeuristic: boolean;
  topicBreakup: { topicId: string; correct: number; total: number }[];
  subjectBreakup: { subjectId: string; correct: number; total: number }[];
}
