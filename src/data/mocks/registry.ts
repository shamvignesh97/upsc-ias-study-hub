import type { MockPaperMeta } from "@/types";

export const mockPapers: MockPaperMeta[] = [
  { id: "gs1-a", kind: "gs1", key: "a", title: "GS Paper I — Mock A", subtitle: "100 MCQs · 2 hours · High-likelihood theme mix", questionCount: 100, durationMinutes: 120 },
  { id: "gs1-b", kind: "gs1", key: "b", title: "GS Paper I — Mock B", subtitle: "100 MCQs · 2 hours · Alternate high-prob set", questionCount: 100, durationMinutes: 120 },
  { id: "gs1-c", kind: "gs1", key: "c", title: "GS Paper I — Mock C", subtitle: "100 MCQs · 2 hours · Third full paper", questionCount: 100, durationMinutes: 120 },
  { id: "gs1-d", kind: "gs1", key: "d", title: "GS Paper I — Mock D", subtitle: "100 MCQs · 2 hours · Fourth distinct set", questionCount: 100, durationMinutes: 120 },
  { id: "gs1-e", kind: "gs1", key: "e", title: "GS Paper I — Mock E", subtitle: "100 MCQs · 2 hours · Fifth distinct set", questionCount: 100, durationMinutes: 120 },
  { id: "gs1-f", kind: "gs1", key: "f", title: "GS Paper I — Mock F", subtitle: "100 MCQs · 2 hours · Sixth distinct set", questionCount: 100, durationMinutes: 120 },
  { id: "csat-a", kind: "csat", key: "a", title: "CSAT Paper II — Mock A", subtitle: "80 MCQs · 2 hours · Qualifying pattern", questionCount: 80, durationMinutes: 120 },
  { id: "csat-b", kind: "csat", key: "b", title: "CSAT Paper II — Mock B", subtitle: "80 MCQs · 2 hours · Alternate skill mix", questionCount: 80, durationMinutes: 120 },
  { id: "csat-c", kind: "csat", key: "c", title: "CSAT Paper II — Mock C", subtitle: "80 MCQs · 2 hours · Third full paper", questionCount: 80, durationMinutes: 120 },
  { id: "csat-d", kind: "csat", key: "d", title: "CSAT Paper II — Mock D", subtitle: "80 MCQs · 2 hours · Fourth distinct set", questionCount: 80, durationMinutes: 120 },
  { id: "csat-e", kind: "csat", key: "e", title: "CSAT Paper II — Mock E", subtitle: "80 MCQs · 2 hours · Fifth distinct set", questionCount: 80, durationMinutes: 120 },
  { id: "csat-f", kind: "csat", key: "f", title: "CSAT Paper II — Mock F", subtitle: "80 MCQs · 2 hours · Sixth distinct set", questionCount: 80, durationMinutes: 120 },
];

export function getMockPaperMeta(kind: string, key: string) {
  return mockPapers.find((p) => p.kind === kind && p.key === key);
}

export const MOCK_DISCLAIMER =
  "Selected from high-likelihood themes based on PYQ trend analysis (not leaked papers). Illustrative study aids only.";
