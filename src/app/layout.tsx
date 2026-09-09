import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "UPSC IAS Study Hub",
  description:
    "Complete IAS/UPSC study companion — syllabus, PYQ-trend likelihood estimates, quizzes, planner, and interview tips.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>UPSC IAS Study Hub — educational MVP. Probabilities are estimates, not official predictions.</p>
            <p>Client-side progress · No account required</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
