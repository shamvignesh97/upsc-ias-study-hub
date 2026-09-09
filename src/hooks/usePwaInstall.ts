"use client";

import { useCallback, useEffect, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "upsc-pwa-install-dismissed";

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mq || iosStandalone;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

let wired = false;
function ensureGlobalListeners() {
  if (wired || typeof window === "undefined") return;
  wired = true;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

export function usePwaInstall() {
  const [standalone, setStandalone] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    ensureGlobalListeners();
    setStandalone(isStandaloneDisplay());
    setIos(isIosDevice());
    setCanPrompt(Boolean(deferredPrompt));
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const sync = () => {
      setCanPrompt(Boolean(deferredPrompt));
      setStandalone(isStandaloneDisplay());
    };
    listeners.add(sync);

    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setStandalone(isStandaloneDisplay());
    mq.addEventListener?.("change", onChange);

    return () => {
      listeners.delete(sync);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  const dismissBanner = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return { outcome: "unavailable" as const };
    const event = deferredPrompt;
    await event.prompt();
    const choice = await event.userChoice;
    deferredPrompt = null;
    notify();
    if (choice.outcome === "accepted") {
      setStandalone(true);
    }
    return { outcome: choice.outcome };
  }, []);

  return {
    standalone,
    canPrompt,
    dismissed,
    ios,
    dismissBanner,
    promptInstall,
  };
}
