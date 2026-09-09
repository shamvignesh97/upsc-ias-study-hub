import type { MockQuestion } from "@/types";

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

export async function loadMockPaper(kind: "gs1" | "csat", key: string): Promise<MockQuestion[]> {
  const loaders = kind === "gs1" ? gs1Loaders : csatLoaders;
  const loader = loaders[key];
  if (!loader) return [];
  return loader();
}
