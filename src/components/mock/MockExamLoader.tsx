"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MockKind, MockQuestion } from "@/types";
import { getMockPaperMeta, loadMockPaper } from "@/data/mocks";
import MockExamPlayer from "@/components/mock/MockExamPlayer";

export default function MockExamLoader({
  kind,
  paperKey,
}: {
  kind: string;
  paperKey: string;
}) {
  const meta = getMockPaperMeta(kind, paperKey);
  const [questions, setQuestions] = useState<MockQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (kind !== "gs1" && kind !== "csat") {
      setError("Unknown mock type");
      return;
    }
    if (!meta) {
      setError("Unknown paper");
      return;
    }
    loadMockPaper(kind as MockKind, paperKey)
      .then((qs) => {
        if (!cancelled) setQuestions(qs);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load paper");
      });
    return () => {
      cancelled = true;
    };
  }, [kind, paperKey, meta]);

  if (error || !meta) {
    return (
      <div className="p-6">
        <p className="text-slate-700">{error || "Paper not found"}</p>
        <Link href="/mock" className="mt-3 inline-block text-amber-800 underline">
          Back to mocks
        </Link>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Loading {meta.title}…
        </div>
      </div>
    );
  }

  return (
    <MockExamPlayer
      kind={meta.kind}
      paperKey={meta.key}
      title={meta.title}
      questions={questions}
      durationMinutes={meta.durationMinutes}
    />
  );
}
