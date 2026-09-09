import type { Metadata } from "next";
import MockHubClient from "@/components/mock/MockHubClient";

export const metadata: Metadata = {
  title: "Prelims Mock Tests",
  description: "Full GS Paper I and CSAT mock exams with scoring, timer, and high-prob theme mix.",
};

export default function MockPage() {
  return <MockHubClient />;
}
