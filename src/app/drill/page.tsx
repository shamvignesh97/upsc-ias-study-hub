import type { Metadata } from "next";
import DrillClient from "@/components/drill/DrillClient";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Daily Drill",
  description: "Daily GS1 drill (10) or CSAT quants (5) from Loop high-chance themes, with streak tracking.",
};

export default function DrillPage() {
  return (
    <div className="space-y-6">
      <DrillClient />
      <Disclaimer />
    </div>
  );
}
