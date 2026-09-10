import type { MockKind, MockQuestion } from "@/types";

const gs1Loaders: Record<string, () => Promise<MockQuestion[]>> = {
  a: () => import("./gs1-paper-a").then((m) => m.gs1PaperA),
  b: () => import("./gs1-paper-b").then((m) => m.gs1PaperB),
  c: () => import("./gs1-paper-c").then((m) => m.gs1PaperC),
  d: () => import("./gs1-paper-d").then((m) => m.gs1PaperD),
  e: () => import("./gs1-paper-e").then((m) => m.gs1PaperE),
  f: () => import("./gs1-paper-f").then((m) => m.gs1PaperF),
};

const csatLoaders: Record<string, () => Promise<MockQuestion[]>> = {
  a: () => import("./csat-paper-a").then((m) => m.csatPaperA),
  b: () => import("./csat-paper-b").then((m) => m.csatPaperB),
  c: () => import("./csat-paper-c").then((m) => m.csatPaperC),
  d: () => import("./csat-paper-d").then((m) => m.csatPaperD),
  e: () => import("./csat-paper-e").then((m) => m.csatPaperE),
  f: () => import("./csat-paper-f").then((m) => m.csatPaperF),
};

const csatQuantsLoaders: Record<string, () => Promise<MockQuestion[]>> = {
  q1: () => import("./csat-quants-paper-q1").then((m) => m.csatQuantsPaperQ1),
  q2: () => import("./csat-quants-paper-q2").then((m) => m.csatQuantsPaperQ2),
  q3: () => import("./csat-quants-paper-q3").then((m) => m.csatQuantsPaperQ3),
  q4: () => import("./csat-quants-paper-q4").then((m) => m.csatQuantsPaperQ4),
};

export async function loadMockPaper(kind: MockKind, key: string): Promise<MockQuestion[]> {
  const loaders =
    kind === "gs1" ? gs1Loaders : kind === "csat-quants" ? csatQuantsLoaders : csatLoaders;
  const loader = loaders[key];
  if (!loader) return [];
  return loader();
}
