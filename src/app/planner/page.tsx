import PlannerClient from "@/components/PlannerClient";
import Disclaimer from "@/components/Disclaimer";

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study planner</h1>
        <p className="mt-2 text-slate-600">
          Auto-build a 7-day plan from high-probability topics. Adjust mentally for your weak areas.
        </p>
      </div>
      <Disclaimer />
      <PlannerClient />
    </div>
  );
}
