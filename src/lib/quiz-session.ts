import type { QuizQuestion } from "@/types";

/** Fisher–Yates shuffle — does not mutate input. */
export function shuffle<T>(items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a lean quiz session: shuffle then take a chunk so we never hold
 * unused questions in player state beyond the session size.
 */
export function buildSession(questions: QuizQuestion[], sessionSize = 15): QuizQuestion[] {
  if (!questions.length) return [];
  const size = Math.min(sessionSize, questions.length);
  return shuffle(questions).slice(0, size);
}
