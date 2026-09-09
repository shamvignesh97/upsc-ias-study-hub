"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import InstallPrompt from "@/components/InstallPrompt";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const examMode = pathname?.startsWith("/mock/exam") ?? false;

  if (examMode) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            UPSC IAS Study Hub — educational MVP. Probabilities are estimates, not official
            predictions.
          </p>
          <p>Client-side progress · Installable PWA · No account required</p>
        </div>
      </footer>
      <InstallPrompt />
    </>
  );
}
