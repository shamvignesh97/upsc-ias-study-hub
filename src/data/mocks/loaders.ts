import type { MockQuestion } from "@/types";

const gs1Loaders: Record<string, () => Promise<MockQuestion[]>> = {
  a: () => import("./gs1-paper-a").then((m) => m.gs1PaperA),
  b: () => import("./gs1-paper-b").then((m) => m.gs1PaperB),
  c: () => import("./gs1-paper-c").then((m) => m.gs1PaperC),
};

const csatLoaders: Record<string, () => Promise<MockQuestion[]>> = {
  a: () => import("./csat-paper-a").then((m) => m.csatPaperA),
  b: () => import("./csat-paper-b").then((m) => m.csatPaperB),
  c: () => import("./csat-paper-c").then((m) => m.csatPaperC),
};

export async function loadMockPaper(kind: "gs1" | "csat", key: string): Promise<MockQuestion[]> {
  const loaders = kind === "gs1" ? gs1Loaders : csatLoaders;
  const loader = loaders[key];
  if (!loader) return [];
  return loader();
}
