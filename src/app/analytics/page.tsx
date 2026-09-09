import type { Metadata } from "next";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Mock attempt history — scores, accuracy, subject averages, cutoff proximity.",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AnalyticsClient />
      <Disclaimer />
    </div>
  );
}
