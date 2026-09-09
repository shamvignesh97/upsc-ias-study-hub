import Link from "next/link";
import { subjects } from "@/data/papers";
import { getQuizSubjects, getQuizzesBySubject } from "@/data/quizzes";

export default function QuizIndexPage() {
  const ids = getQuizSubjects();
  const list = subjects.filter((s) => ids.includes(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quiz mode</h1>
        <p className="mt-2 text-slate-600">
          MCQs for Prelims GS subjects — practice with explanations. Questions are illustrative
          study aids, not verbatim official papers.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const count = getQuizzesBySubject(s.id).length;
          return (
            <Link
              key={s.id}
              href={`/quiz/${s.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-300"
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <p className="text-sm text-slate-600">{count} questions</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
