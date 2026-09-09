import type { Metadata } from "next";
import MockExamLoader from "@/components/mock/MockExamLoader";

export const metadata: Metadata = {
  title: "Mock Exam",
  description: "Full-screen Prelims mock exam mode",
};

export default async function MockExamPage({
  params,
}: {
  params: Promise<{ kind: string; paperKey: string }>;
}) {
  const { kind, paperKey } = await params;
  return <MockExamLoader kind={kind} paperKey={paperKey} />;
}
