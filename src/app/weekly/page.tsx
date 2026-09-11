import type { Metadata } from "next";
import WeeklyPackClient from "@/components/weekly/WeeklyPackClient";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Weekly high-prob pack",
  description:
    "25 Prelims GS1 MCQs from Loop high-chance portions (≥70%) with practice feedback and saved score.",
};

export default function WeeklyPage() {
  return (
    <div className="space-y-6">
      <WeeklyPackClient />
      <Disclaimer />
    </div>
  );
}
