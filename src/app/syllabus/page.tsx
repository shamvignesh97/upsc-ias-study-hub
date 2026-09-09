import Link from "next/link";
import { papers, subjects } from "@/data/papers";
import SyllabusFilters from "@/components/SyllabusFilters";
import Disclaimer from "@/components/Disclaimer";

export default function SyllabusPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Syllabus browser</h1>
        <p className="mt-2 text-slate-600">
          Navigate Paper → Subject → Topic. Filter by likelihood to prioritise revision.
        </p>
      </div>
      <Disclaimer />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Papers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((p) => {
            const count = subjects.filter((s) => s.paperId === p.id).length;
            return (
              <Link
                key={p.id}
                href={`/syllabus/${p.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-300"
              >
                <div className="text-xs font-semibold uppercase text-amber-700">{p.stage}</div>
                <div className="mt-1 font-semibold text-slate-900">{p.shortTitle}</div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.description}</p>
                <p className="mt-2 text-xs text-slate-500">{count} subjects</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">All topics with filters</h2>
        <SyllabusFilters />
      </section>
    </div>
  );
}
