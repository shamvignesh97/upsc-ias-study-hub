"use client";

import { useState } from "react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";

export default function InstallMenuButton({ className }: { className?: string }) {
  const { standalone, canPrompt, ios, promptInstall } = usePwaInstall();
  const [hint, setHint] = useState(false);

  if (standalone) return null;

  return (
    <div className={cn(className)}>
      <button
        type="button"
        onClick={async () => {
          if (canPrompt) {
            await promptInstall();
            return;
          }
          setHint((v) => !v);
        }}
        className="rounded-md border border-amber-400/40 bg-amber-500/15 px-2.5 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/25"
      >
        Install app
      </button>
      {hint && (
        <p className="mt-1 text-[11px] leading-snug text-slate-300">
          {ios
            ? "Safari: Share → Add to Home Screen"
            : canPrompt
              ? "Tap again to install"
              : "Use the install icon in the address bar (Chrome/Edge), or Android menu → Install app"}
        </p>
      )}
    </div>
  );
}
