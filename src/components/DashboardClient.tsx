"use client";

import Link from "next/link";
import { topics, getHighProbabilityTopics } from "@/data/topics";
import { useProgress } from "@/hooks/useClientStore";
import ProgressRing from "./ProgressRing";
import TopicCard from "./TopicCard";
import Disclaimer from "./Disclaimer";

export default function DashboardClient() {
  const { progress, studiedCount, ready } = useProgress();
  const focus = getHighProbabilityTopics(6);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-gradient-to-br from-[#0f2744] to-[#1a3d66] p-6 text-white shadow-lg">
          <p className="text-sm text-amber-300">Civil Services Study Companion</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">UPSC IAS Study Hub</h1>
          <p className="mt-3 max-w-xl text-sm text-slate-200">
            Navigate the full syllabus — Prelims, Mains, Optional & Interview — with PYQ-trend
            likelihood estimates to prioritise revision without ignoring coverage.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/syllabus" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0f2744]">
              Browse syllabus
            </Link>
            <Link href="/planner" className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold">
              Study planner
            </Link>
            <Link href="/quiz" className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold">
              Take a quiz
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Your progress</h2>
          {ready ? (
            <ProgressRing value={studiedCount} total={topics.length} label="topics studied" />
          ) : (
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
          )}
          <p className="mt-3 text-xs text-slate-500">Saved locally in your browser (localStorage).</p>
        </div>
      </section>

      <Disclaimer />

      <section>
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Focus for next paper</h2>
            <p className="text-sm text-slate-600">Top high-probability topics with short “why” blurbs.</p>
          </div>
          <Link href="/methodology" className="text-sm font-medium text-amber-800 underline">
            Methodology
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {focus.map((t) => (
            <TopicCard key={t.id} topic={t} studied={!!progress[t.id]} showWhy />
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/syllabus", title: "Syllabus browser", desc: "Paper → Subject → Topic" },
          { href: "/pyq", title: "PYQ practice", desc: "Sample questions by year" },
          { href: "/optional", title: "Optional subjects", desc: "Browse & focus one" },
          { href: "/interview", title: "Interview tips", desc: "DAF, CA, mocks" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300"
          >
            <div className="font-semibold text-slate-900">{c.title}</div>
            <div className="text-sm text-slate-600">{c.desc}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
