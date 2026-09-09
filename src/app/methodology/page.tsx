import Disclaimer from "@/components/Disclaimer";
import { ANALYSIS_YEARS, NEXT_EXAM_YEAR } from "@/lib/pyq-probability";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">How we estimate next-exam likelihood</h1>
        <p className="mt-2 text-slate-600">
          Probabilities are derived from a structured multi-year PYQ theme-frequency dataset
          ({ANALYSIS_YEARS[0]}–{ANALYSIS_YEARS[ANALYSIS_YEARS.length - 1]}), not vague placeholders.
          Target framing: prioritising study for ~{NEXT_EXAM_YEAR} papers.
        </p>
      </div>

      <Disclaimer />

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Data we use</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Topic-wise year counts:</strong> approximate theme/question appearances for each
            syllabus topic across the last ~10 Prelims/Mains cycles (educational synthesis of widely
            discussed PYQ weightage patterns — not scraped verbatim papers).
          </li>
          <li>
            <strong>Syllabus weight (1–5):</strong> structural importance in the official syllabus
            even when recent frequency dips.
          </li>
          <li>
            <strong>CSAT note:</strong> Paper II is qualifying (~33%). Likelihood here means
            skill-necessity / structural presence, not GS merit ranking.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Formula (transparent heuristic)</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Frequency score:</strong> sum of yearly theme counts with <em>recency weights</em>{" "}
            (newer years count more), scaled to 0–100 against a calibrated maximum.
          </li>
          <li>
            <strong>Recency adjustment:</strong> compare last-3 vs previous-3 year totals (rising /
            softening). Small <em>neglected-rebound</em> uplift if a syllabus-important topic was quiet
            for 2–4 years.
          </li>
          <li>
            <strong>Syllabus boost:</strong> up to +10 from syllabus weight.
          </li>
          <li>
            <strong>Combine & clamp:</strong>{" "}
            <code className="rounded bg-slate-100 px-1">
              probability ≈ 0.72×frequencyScore + syllabusBoost + recencyAdj
            </code>{" "}
            then clamp to 8–96.
          </li>
          <li>
            <strong>Trend label:</strong> rising / stable / falling from early-window vs late-window
            averages.
          </li>
          <li>
            <strong>Likelihood band:</strong> High ≥70, Medium 45–69, Low &lt;45 (CSAT uses the same
            bands with a higher floor for core skill blocks).
          </li>
        </ol>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">What you see on topics</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Plain-language chance line (e.g. “~82% chance in next Prelims GS Paper I”) plus
            High/Medium/Low band
          </li>
          <li>Big % meter, trend (rising / stable / falling), years appeared</li>
          <li>Short “why this score” from PYQ notes + frequency</li>
          <li>Full rationale blurb and frequency score on topic pages</li>
        </ul>
        <p className="pt-2">
          Dashboard <strong>Focus for next exam</strong> ranks topics by this computed probability
          (excluding Optional/Interview).
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">What this is not</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Not affiliated with UPSC or any coaching institute.</li>
          <li>Not an official prediction of questions in the next paper.</li>
          <li>Not a substitute for reading standard books, newspapers, and official PYQs.</li>
          <li>
            Quiz/PYQ practice items marked <em>illustrative</em> paraphrase themes — they are not
            copyrighted full papers reproduced verbatim.
          </li>
        </ul>
        <p className="pt-2">
          Use estimates to <em>sequence</em> study, then expand to full coverage. Consistency beats
          prediction.
        </p>
      </section>
    </div>
  );
}
