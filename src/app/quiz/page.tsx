import Link from "next/link";
import { getQuizCountsSummary, getTracksByPaper, quizTracks } from "@/data/quizzes";

const sections = [
  {
    id: "prelims-gs",
    title: "Prelims GS Paper I",
    blurb: "Large MCQ banks across History, Geography, Polity, Economy, Environment, S&T, Culture & CA themes.",
  },
  {
    id: "prelims-csat",
    title: "Prelims Paper II (CSAT)",
    blurb: "Comprehension, reasoning, numeracy and decision-making — qualifying paper practice.",
  },
  {
    id: "mains",
    title: "Mains practice",
    blurb: "Essay + GS I–IV prompts with model answer outlines and key points (not MCQs only).",
  },
] as const;

export default function QuizIndexPage() {
  const summary = getQuizCountsSummary();
  const mainsTracks = quizTracks.filter((t) => t.kind === "mains");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Quiz & test hub</h1>
        <p className="mt-2 text-slate-600">
          Pick a paper, then a subject track. Banks load on demand (lazy) in short sessions for snappy
          navigation. Items are <strong>illustrative study aids</strong>, not verbatim official papers.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          ~{summary.mcq} MCQs · {summary.mains} mains prompts · {summary.tracks} tracks
        </p>
      </div>

      {sections.map((section) => {
        const tracks =
          section.id === "mains"
            ? mainsTracks
            : getTracksByPaper(section.id);
        return (
          <section key={section.id} className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              <p className="text-sm text-slate-600">{section.blurb}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((t) => (
                <Link
                  key={t.id}
                  href={`/quiz/${t.id}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300"
                >
                  <div className="text-2xl">{t.icon}</div>
                  <div className="mt-1 font-semibold">{t.title}</div>
                  <p className="text-sm text-slate-600">{t.description}</p>
                  <p className="mt-2 text-xs font-medium text-amber-800">
                    {t.count} {t.kind === "mains" ? "prompts" : "questions"} ·{" "}
                    {t.kind === "mains" ? "outline drills" : "15-Q sessions"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
