import type { Metadata } from "next";
import FlashRevisionClient from "@/components/revise/FlashRevisionClient";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Revise 10 flash points",
  description: "One-tap flash revision from weak-area must-remember points after mocks.",
};

export default function FlashRevisePage() {
  return (
    <div className="space-y-6">
      <FlashRevisionClient />
      <Disclaimer />
    </div>
  );
}
