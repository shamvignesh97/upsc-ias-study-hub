"use client";

import Link from "next/link";
import { topics, getHighProbabilityTopics } from "@/data/topics";
import { getQuizCountsSummary } from "@/data/quizzes";
import { useProgress } from "@/hooks/useClientStore";
import ProgressRing from "./ProgressRing";
import LikelihoodBadge from "./LikelihoodBadge";
import Disclaimer from "./Disclaimer";

export default function DashboardClient() {
  const { progress, studiedCount, ready } = useProgress();
  const focus = getHighProbabilityTopics(8);
  const quizSummary = getQuizCountsSummary();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-gradient-to-br from-[#0f2744] to-[#1a3d66] p-6 text-white shadow-lg">
          <p className="text-sm text-amber-300">Study · Focus · Practice</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">UPSC IAS Study Hub</h1>
          <p className="mt-3 max-w-xl text-sm text-slate-200">
            Read full syllabus notes in-app, prioritise with plain-language next-exam chances from PYQ
            patterns, then practise — without leaving the app.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/study" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]">
              Start studying
            </Link>
            <Link href="/syllabus" className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold">
              Syllabus & chances
            </Link>
            <Link href="/quiz" className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold">
              Practice quizzes
            </Link>
            <Link href="/mock" className="rounded-lg border border-amber-300/50 bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-100">
              Prelims mocks
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-300">
            {topics.length} study topics · ~{quizSummary.mcq} MCQs · {quizSummary.mains} mains prompts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Your progress</h2>
          {ready ? (
            <ProgressRing value={studiedCount} total={topics.length} label="topics studied" />
          ) : (
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
          )}
          <p className="mt-3 text-xs text-slate-500">Saved locally in your browser (localStorage).</p>
          <Link href="/study" className="mt-4 inline-block text-sm font-medium text-amber-800 underline">
            Continue in Study mode →
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href: "/study",
            title: "1. Study",
            desc: "Paper → subject → topic notes, cards, next/prev path",
            primary: true,
          },
          {
            href: "/syllabus",
            title: "2. Focus",
            desc: "Sort by chance % · High/Med/Low · PYQ rationale",
            primary: false,
          },
          {
            href: "/quiz",
            title: "3. Practice",
            desc: "Prelims MCQs, CSAT, Mains prompts — lazy-loaded",
            primary: false,
          },
          {
            href: "/mock",
            title: "4. Mock",
            desc: "Full GS1 & CSAT papers · timer · scorecard · A/B/C sets",
            primary: false,
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={
              c.primary
                ? "rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm"
                : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-300"
            }
          >
            <div className="font-semibold text-slate-900">{c.title}</div>
            <div className="text-sm text-slate-600">{c.desc}</div>
          </Link>
        ))}
      </section>

      <Disclaimer />

      <section>
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Focus for next exam</h2>
            <p className="text-sm text-slate-600">
              Ranked by PYQ frequency + recency. Big % = plain-language chance estimate.
            </p>
          </div>
          <Link href="/methodology" className="text-sm font-medium text-amber-800 underline">
            Methodology
          </Link>
        </div>
        <div className="space-y-3">
          {focus.map((t, i) => (
            <Link
              key={t.id}
              href={`/topic/${t.id}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 sm:flex-row sm:items-center"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{t.title}</h3>
                  {progress[t.id] ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      Studied
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{t.chanceLabel}</p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Why: </span>
                  {t.shortWhy ?? t.whyBlurb}
                </p>
              </div>
              <div className="w-full shrink-0 sm:w-44">
                <LikelihoodBadge
                  likelihood={t.likelihood}
                  probability={t.probability}
                  chanceLabel={t.chanceLabel}
                  trend={t.pyqAnalysis?.trend}
                  compact
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
