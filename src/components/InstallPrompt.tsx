"use client";

import { useState } from "react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function InstallPrompt() {
  const { standalone, canPrompt, dismissed, ios, dismissBanner, promptInstall } =
    usePwaInstall();
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (standalone || dismissed) return null;
  if (!canPrompt && !ios) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-amber-500/30 bg-[#0f2744] p-4 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Install UPSC Hub</p>
          <p className="mt-0.5 text-xs text-slate-300">
            {ios
              ? "Add to your Home Screen for a full-screen study app (works offline after first visit)."
              : "Install as a standalone app for quick access and offline study."}
          </p>
          {showIosHelp && (
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-amber-100">
              <li>Tap the Share button in Safari</li>
              <li>Scroll and tap &quot;Add to Home Screen&quot;</li>
              <li>Tap Add — then open UPSC Hub from your Home Screen</li>
            </ol>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={dismissBanner}
            className="rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={async () => {
              if (ios && !canPrompt) {
                if (showIosHelp) {
                  dismissBanner();
                } else {
                  setShowIosHelp(true);
                }
                return;
              }
              await promptInstall();
            }}
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-[#0f2744] hover:bg-amber-400"
          >
            {ios && !canPrompt
              ? showIosHelp
                ? "Got it"
                : "How to install"
              : "Install app"}
          </button>
        </div>
      </div>
    </div>
  );
}
