import type { Topic } from "@/types";

export default function StudyNotes({ topic }: { topic: Topic }) {
  return (
    <div className="space-y-5">
      {topic.keyConcepts && topic.keyConcepts.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Key concepts</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
            {topic.keyConcepts.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic.definitions && topic.definitions.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Definitions</h2>
          <dl className="mt-3 space-y-3">
            {topic.definitions.map((d) => (
              <div key={d.term} className="rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-sm font-semibold text-slate-900">{d.term}</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{d.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {topic.mustRemember && topic.mustRemember.length > 0 ? (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-950">Must remember</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-amber-950">
            {topic.mustRemember.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Study notes</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
          {topic.notes}
        </div>
      </section>

      {topic.tables && topic.tables.length > 0
        ? topic.tables.map((table) => (
            <section key={table.title} className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{table.title}</h2>
              <table className="mt-3 w-full min-w-[280px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {table.headers.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold text-slate-800">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))
        : null}

      {topic.commonTraps && topic.commonTraps.length > 0 ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-rose-950">Common traps</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-rose-950">
            {topic.commonTraps.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic.subtopics.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Subtopics</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.subtopics.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.notes}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
