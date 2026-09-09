import type { MainsPrompt, QuizQuestion } from "@/types";

export type McqBank = { questions: QuizQuestion[] };
export type MainsBank = { prompts: MainsPrompt[] };

const mcqLoaders: Record<string, () => Promise<McqBank>> = {
  hist: () => import("./prelims-gs/hist").then((m) => ({ questions: m.histQuestions })),
  geo: () => import("./prelims-gs/geo").then((m) => ({ questions: m.geoQuestions })),
  polity: () => import("./prelims-gs/polity").then((m) => ({ questions: m.polityQuestions })),
  economy: () => import("./prelims-gs/economy").then((m) => ({ questions: m.economyQuestions })),
  env: () => import("./prelims-gs/env").then((m) => ({ questions: m.envQuestions })),
  sci: () => import("./prelims-gs/sci").then((m) => ({ questions: m.sciQuestions })),
  culture: () => import("./prelims-gs/culture").then((m) => ({ questions: m.cultureQuestions })),
  ca: () => import("./prelims-gs/ca").then((m) => ({ questions: m.caQuestions })),
  "csat-comp": () => import("./csat/comprehension").then((m) => ({ questions: m.csatCompQuestions })),
  "csat-lr": () => import("./csat/reasoning").then((m) => ({ questions: m.csatReasonQuestions })),
  "csat-quant": () => import("./csat/numeracy").then((m) => ({ questions: m.csatQuantQuestions })),
  "csat-dm": () => import("./csat/decision").then((m) => ({ questions: m.csatDmQuestions })),
};

const mainsLoaders: Record<string, () => Promise<MainsBank>> = {
  "mains-essay": () => import("./mains/essay").then((m) => ({ prompts: m.essayPrompts })),
  "mains-gs1": () => import("./mains/gs1").then((m) => ({ prompts: m.gs1Prompts })),
  "mains-gs2": () => import("./mains/gs2").then((m) => ({ prompts: m.gs2Prompts })),
  "mains-gs3": () => import("./mains/gs3").then((m) => ({ prompts: m.gs3Prompts })),
  "mains-gs4": () => import("./mains/gs4").then((m) => ({ prompts: m.gs4Prompts })),
};

export async function loadMcqTrack(trackId: string): Promise<QuizQuestion[]> {
  const loader = mcqLoaders[trackId];
  if (!loader) return [];
  const { questions } = await loader();
  return questions;
}

export async function loadMainsTrack(trackId: string): Promise<MainsPrompt[]> {
  const loader = mainsLoaders[trackId];
  if (!loader) return [];
  const { prompts } = await loader();
  return prompts;
}

export function isMcqTrack(trackId: string): boolean {
  return trackId in mcqLoaders;
}

export function isMainsTrack(trackId: string): boolean {
  return trackId in mainsLoaders;
}
