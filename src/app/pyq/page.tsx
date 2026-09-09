import PyqBrowser from "@/components/PyqBrowser";
import Disclaimer from "@/components/Disclaimer";

export default function PyqPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PYQ-style practice</h1>
        <p className="mt-2 text-slate-600">
          Sample questions tagged by year/topic for practice. Wording may be adapted for study —
          always cross-check with official UPSC papers for authenticity.
        </p>
      </div>
      <Disclaimer compact />
      <PyqBrowser />
    </div>
  );
}
