const PROGRESS_KEY = "upsc-study-progress";
const BOOKMARKS_KEY = "upsc-bookmarks";
const OPTIONAL_FOCUS_KEY = "upsc-optional-focus";
const PLANNER_KEY = "upsc-planner";

export type ProgressMap = Record<string, boolean>;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(PROGRESS_KEY), {});
}

export function setTopicStudied(topicId: string, studied: boolean): ProgressMap {
  const current = getProgress();
  current[topicId] = studied;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
  return current;
}

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(BOOKMARKS_KEY), []);
}

export function toggleBookmark(topicId: string): string[] {
  const current = getBookmarks();
  const next = current.includes(topicId)
    ? current.filter((id) => id !== topicId)
    : [...current, topicId];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return next;
}

export function getOptionalFocus(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(OPTIONAL_FOCUS_KEY);
}

export function setOptionalFocus(optionalId: string | null): void {
  if (optionalId) localStorage.setItem(OPTIONAL_FOCUS_KEY, optionalId);
  else localStorage.removeItem(OPTIONAL_FOCUS_KEY);
}

export type PlannerItem = { topicId: string; day: number; done: boolean };

export function getPlanner(): PlannerItem[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(PLANNER_KEY), []);
}

export function setPlanner(items: PlannerItem[]): void {
  localStorage.setItem(PLANNER_KEY, JSON.stringify(items));
}

export function togglePlannerDone(topicId: string): PlannerItem[] {
  const items = getPlanner().map((i) =>
    i.topicId === topicId ? { ...i, done: !i.done } : i
  );
  setPlanner(items);
  return items;
}
