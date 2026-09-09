import Disclaimer from "@/components/Disclaimer";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">How we estimate likelihood</h1>
        <p className="mt-2 text-slate-600">
          Transparent heuristics for study prioritisation — not a prediction engine.
        </p>
      </div>

      <Disclaimer />

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Signals we use</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Historical weightage:</strong> Topics that appear almost every year in Prelims/Mains
            (e.g., Polity institutions, Environment conventions) get higher baseline %.
          </li>
          <li>
            <strong>Recurring themes:</strong> Themes that cycle every 2–3 years (certain culture or
            world-history clusters) stay Medium–High.
          </li>
          <li>
            <strong>Neglected rebound:</strong> Areas quiet for a stretch sometimes return — modest
            uplift vs pure “recent frequency only”.
          </li>
          <li>
            <strong>Static vs dynamic:</strong> Dynamic areas (CA, IR, schemes, S&T missions) score
            higher closer to the exam window conceptually; static cores remain evergreen High.
          </li>
          <li>
            <strong>Paper role:</strong> CSAT comprehension / GS4 case studies are structurally
            unavoidable → very high estimates.
          </li>
        </ol>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Labels</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>High (~70%+):</strong> Prioritise early and revise often.
          </li>
          <li>
            <strong>Medium (~45–69%):</strong> Cover solidly; don’t skip.
          </li>
          <li>
            <strong>Low (&lt;45%):</strong> Still syllabus — schedule lighter passes; UPSC can surprise.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">What this is not</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Not affiliated with UPSC or any coaching institute.</li>
          <li>Not a guarantee of questions in the next paper.</li>
          <li>Not a substitute for reading standard books, newspapers, and official PYQs.</li>
        </ul>
        <p className="pt-2">
          Use estimates to <em>sequence</em> study, then expand to full coverage. Consistency beats
          prediction.
        </p>
      </section>
    </div>
  );
}
