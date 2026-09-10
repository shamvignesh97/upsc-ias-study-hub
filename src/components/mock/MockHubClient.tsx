"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MOCK_DISCLAIMER, mockPapers } from "@/data/mocks";
import { getMockHistory, type StoredMockAttempt } from "@/lib/storage";
import { formatTime } from "@/lib/mock-scoring";

export default function MockHubClient() {
  const [history, setHistory] = useState<StoredMockAttempt[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHistory(getMockHistory());
    setReady(true);
  }, []);

  const gs1 = mockPapers.filter((p) => p.kind === "gs1");
  const csat = mockPapers.filter((p) => p.kind === "csat");
  const csatQuants = mockPapers.filter((p) => p.kind === "csat-quants");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Prelims Mock Tests</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Full-length GS Paper I (100 Q, 2 hrs), CSAT Paper II (80 Q, 2 hrs), and dedicated{" "}
          <strong>CSAT Quants</strong> grind papers (40 Q, 60 min) built from high-likelihood PYQ
          themes — meant to help crack Prelims. Papers are lazy-loaded. Default{" "}
          <strong>Practice mode</strong> shows the correct answer and a full explanation as soon as
          you click — including when you are wrong. Switch to <strong>Exam mode</strong> inside a
          paper for timed realism (hide until submit).
        </p>
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {MOCK_DISCLAIMER}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">GS Paper I mocks ({gs1.length})</h2>
        <p className="text-sm text-slate-600">
          Marking: <strong>+2</strong> correct · <strong>−0.66</strong> wrong · <strong>0</strong>{" "}
          unattempted. Mix weighted to Polity, Economy, Environment, History, Geography, S&T,
          Culture & CA high-chance themes.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {gs1.map((p) => (
            <Link
              key={p.id}
              href={`/mock/exam/${p.kind}/${p.key}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-400"
            >
              <div className="text-2xl">📝</div>
              <div className="mt-1 font-semibold text-slate-900">{p.title}</div>
              <p className="text-sm text-slate-600">{p.subtitle}</p>
              <p className="mt-2 text-xs font-medium text-amber-800">Start full-screen exam →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">CSAT Paper II mocks ({csat.length})</h2>
        <p className="text-sm text-slate-600">
          Marking: <strong>+2.5</strong> correct · <strong>−0.83</strong> wrong · qualifying ≈{" "}
          <strong>33%</strong>. Comprehension, reasoning, numeracy & decision-making.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {csat.map((p) => (
            <Link
              key={p.id}
              href={`/mock/exam/${p.kind}/${p.key}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-400"
            >
              <div className="text-2xl">🧠</div>
              <div className="mt-1 font-semibold text-slate-900">{p.title}</div>
              <p className="text-sm text-slate-600">{p.subtitle}</p>
              <p className="mt-2 text-xs font-medium text-amber-800">Start full-screen exam →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">CSAT Quants mocks ({csatQuants.length})</h2>
        <p className="text-sm text-slate-600">
          Dedicated numeracy grind from 10-year high-frequency patterns: percentages, ratio/mixtures,
          averages, time-work, time-distance, SI/CI, number system, DI. Same CSAT marking (+2.5 /
          −0.83). Practice mode shows <strong>full worked steps</strong> on wrong answers.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {csatQuants.map((p) => (
            <Link
              key={p.id}
              href={`/mock/exam/${p.kind}/${p.key}`}
              className="rounded-xl border border-sky-200 bg-sky-50 p-4 shadow-sm transition hover:border-sky-400"
            >
              <div className="text-2xl">🔢</div>
              <div className="mt-1 font-semibold text-slate-900">{p.title}</div>
              <p className="text-sm text-slate-600">{p.subtitle}</p>
              <p className="mt-2 text-xs font-medium text-sky-800">Start quants grind →</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Recent attempts</h2>
        {!ready ? (
          <div className="mt-3 h-20 animate-pulse rounded-lg bg-slate-100" />
        ) : history.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No attempts yet — stored locally after you submit.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.slice(0, 12).map((h) => (
              <li
                key={h.id}
                className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium text-slate-900">{h.paperTitle}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(h.finishedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST ·
                    time {formatTime(h.timeUsedSeconds)}
                  </div>
                </div>
                <div className="font-semibold text-slate-800">
                  {h.rawScore}/{h.maxScore}{" "}
                  <span className={h.passedHeuristic ? "text-emerald-700" : "text-amber-700"}>
                    {h.passedHeuristic ? "· heuristic pass" : "· below heuristic"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
