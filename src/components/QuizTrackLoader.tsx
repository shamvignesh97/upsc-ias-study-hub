"use client";

import { useEffect, useState } from "react";
import type { MainsPrompt, QuizQuestion, QuizTrackMeta } from "@/types";
import { isMainsTrack, loadMcqTrack, loadMainsTrack } from "@/data/quizzes";
import QuizPlayer from "@/components/QuizPlayer";
import MainsPracticePlayer from "@/components/MainsPracticePlayer";

export default function QuizTrackLoader({ track }: { track: QuizTrackMeta }) {
  const [mcqs, setMcqs] = useState<QuizQuestion[] | null>(null);
  const [prompts, setPrompts] = useState<MainsPrompt[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setMcqs(null);
    setPrompts(null);
    setError(null);

    (async () => {
      try {
        if (isMainsTrack(track.id) || track.kind === "mains") {
          const data = await loadMainsTrack(track.id);
          if (!cancelled) setPrompts(data);
        } else {
          const data = await loadMcqTrack(track.id);
          if (!cancelled) setMcqs(data);
        }
      } catch {
        if (!cancelled) setError("Failed to load this quiz bank. Please retry.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [track.id, track.kind]);

  if (error) {
    return <p className="text-rose-700">{error}</p>;
  }

  if (track.kind === "mains") {
    if (!prompts) {
      return <div className="h-40 animate-pulse rounded-xl bg-slate-100" aria-label="Loading prompts" />;
    }
    return <MainsPracticePlayer prompts={prompts} />;
  }

  if (!mcqs) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" aria-label="Loading questions" />;
  }

  return <QuizPlayer questions={mcqs} sessionSize={15} />;
}
