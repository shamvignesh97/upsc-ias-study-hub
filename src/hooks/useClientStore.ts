"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getBookmarks,
  getOptionalFocus,
  getPlanner,
  getProgress,
  PlannerItem,
  ProgressMap,
  setOptionalFocus,
  setPlanner,
  setTopicStudied,
  toggleBookmark,
  togglePlannerDone,
} from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setReady(true);
  }, []);

  const mark = useCallback((topicId: string, studied: boolean) => {
    setProgress(setTopicStudied(topicId, studied));
  }, []);

  const studiedCount = Object.values(progress).filter(Boolean).length;

  return { progress, mark, studiedCount, ready };
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setReady(true);
  }, []);

  const toggle = useCallback((topicId: string) => {
    setBookmarks(toggleBookmark(topicId));
  }, []);

  return { bookmarks, toggle, ready };
}

export function useOptionalFocus() {
  const [focus, setFocus] = useState<string | null>(null);
  useEffect(() => {
    setFocus(getOptionalFocus());
  }, []);
  const save = useCallback((id: string | null) => {
    setOptionalFocus(id);
    setFocus(id);
  }, []);
  return { focus, save };
}

export function usePlanner() {
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(getPlanner());
    setReady(true);
  }, []);

  const save = useCallback((next: PlannerItem[]) => {
    setPlanner(next);
    setItems(next);
  }, []);

  const toggleDone = useCallback((topicId: string) => {
    setItems(togglePlannerDone(topicId));
  }, []);

  return { items, save, toggleDone, ready };
}
