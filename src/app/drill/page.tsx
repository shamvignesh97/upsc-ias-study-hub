import type { Metadata } from "next";
import DrillClient from "@/components/drill/DrillClient";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Daily Drill",
  description: "10 high next-exam-chance Prelims GS1 questions every day with streak tracking.",
};

export default function DrillPage() {
  return (
    <div className="space-y-6">
      <DrillClient />
      <Disclaimer />
    </div>
  );
}
