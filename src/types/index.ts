export type Likelihood = "High" | "Medium" | "Low";

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

export interface Topic {
  id: string;
  title: string;
  subjectId: string;
  paperId: PaperId;
  likelihood: Likelihood;
  probability: number; // 0-100 estimate
  whyBlurb: string;
  summary: string;
  notes: string;
  subtopics: Subtopic[];
  relatedTopicIds: string[];
  tags: string[];
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
  topicId?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
}

export interface OptionalSubject {
  id: string;
  title: string;
  category: string;
  briefNotes: string;
  whyChoose: string;
  keyTopics: string[];
}
