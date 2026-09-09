import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrackMeta, quizTracks } from "@/data/quizzes";
import QuizTrackLoader from "@/components/QuizTrackLoader";

export function generateStaticParams() {
  return quizTracks.map((t) => ({ subjectId: t.id }));
}

export default async function QuizSubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const track = getTrackMeta(subjectId);
  if (!track) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/quiz" className="text-sm text-amber-800 underline">
          ← All quizzes
        </Link>
        <h1 className="mt-2 text-3xl font-bold">
          {track.icon} {track.title}
        </h1>
        <p className="mt-1 text-slate-600">{track.description}</p>
        <p className="mt-1 text-xs text-slate-500">
          Bank size: {track.count} ·{" "}
          {track.kind === "mcq"
            ? "Loaded dynamically; each attempt uses a 15-question session."
            : "Mains prompts with model outlines — write first, then reveal."}
        </p>
      </div>
      <QuizTrackLoader track={track} />
    </div>
  );
}
