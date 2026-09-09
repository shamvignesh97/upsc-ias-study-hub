import Link from "next/link";
import { notFound } from "next/navigation";
import { subjects } from "@/data/papers";
import { getQuizSubjects, getQuizzesBySubject } from "@/data/quizzes";
import QuizPlayer from "@/components/QuizPlayer";

export function generateStaticParams() {
  return getQuizSubjects().map((subjectId) => ({ subjectId }));
}

export default async function QuizSubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const subject = subjects.find((s) => s.id === subjectId);
  const questions = getQuizzesBySubject(subjectId);
  if (!subject || !questions.length) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/quiz" className="text-sm text-amber-800 underline">
          ← All quizzes
        </Link>
        <h1 className="mt-2 text-3xl font-bold">
          {subject.icon} {subject.title} Quiz
        </h1>
      </div>
      <QuizPlayer questions={questions} />
    </div>
  );
}
