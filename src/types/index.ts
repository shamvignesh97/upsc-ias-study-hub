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

export interface Topic {
  id: string;
  title: string;
  subjectId: string;
  paperId: PaperId;
  likelihood: Likelihood;
  probability: number; // 0-100 estimate from PYQ analysis
  whyBlurb: string;
  summary: string;
  notes: string;
  subtopics: Subtopic[];
  relatedTopicIds: string[];
  tags: string[];
  pyqAnalysis?: PyqAnalysisSummary;
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
