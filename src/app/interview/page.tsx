import Link from "next/link";
import { getTopicsBySubject } from "@/data/topics";
import TopicCard from "@/components/TopicCard";

export default function InterviewPage() {
  const tips = getTopicsBySubject("interview-prep");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interview / Personality Test</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          The Personality Test (275 marks) assesses suitability for civil services — not rote
          knowledge alone. Master your DAF, stay current, and practise calm, honest communication.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
        <h2 className="font-semibold text-slate-900">Quick tips</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Every DAF line can generate questions — prepare depth, not slogans.</li>
          <li>Opinions should be constitutional, balanced, and evidence-aware.</li>
          <li>Say “I don’t know” when unsure; never bluff facts.</li>
          <li>Know your home district/state: economy, culture, issues, schemes.</li>
          <li>2–4 quality mocks with feedback beat dozens without reflection.</li>
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((t) => (
          <TopicCard key={t.id} topic={t} showWhy />
        ))}
      </div>

      <Link href="/syllabus/interview" className="inline-block text-sm font-medium text-amber-800 underline">
        View interview paper in syllabus →
      </Link>
    </div>
  );
}
