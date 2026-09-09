import type { QuizTrackMeta } from "@/types";

/** Metadata only — question arrays load on demand via loaders. */
export const quizTracks: QuizTrackMeta[] = [
  // Prelims GS
  { id: "hist", subjectId: "hist", paperId: "prelims-gs", title: "History", icon: "📜", description: "Ancient, Medieval, Modern India MCQs", kind: "mcq", count: 60 },
  { id: "geo", subjectId: "geo", paperId: "prelims-gs", title: "Geography", icon: "🌍", description: "Physical, Indian & World Geography", kind: "mcq", count: 55 },
  { id: "polity", subjectId: "polity", paperId: "prelims-gs", title: "Polity", icon: "⚖️", description: "Constitution, institutions, governance", kind: "mcq", count: 55 },
  { id: "economy", subjectId: "economy", paperId: "prelims-gs", title: "Economy", icon: "📈", description: "Basics, banking, schemes, external sector", kind: "mcq", count: 55 },
  { id: "env", subjectId: "env", paperId: "prelims-gs", title: "Environment & Ecology", icon: "🌿", description: "Biodiversity, climate, pollution", kind: "mcq", count: 55 },
  { id: "sci", subjectId: "sci", paperId: "prelims-gs", title: "Science & Technology", icon: "🔬", description: "Space, defence, biotech, IT", kind: "mcq", count: 50 },
  { id: "culture", subjectId: "culture", paperId: "prelims-gs", title: "Art & Culture", icon: "🎭", description: "Architecture, dance, literature", kind: "mcq", count: 50 },
  { id: "ca", subjectId: "ca", paperId: "prelims-gs", title: "Current Affairs themes", icon: "📰", description: "Static-leaning CA & institutions", kind: "mcq", count: 50 },
  // CSAT
  { id: "csat-comp", subjectId: "csat-comp", paperId: "prelims-csat", title: "Comprehension", icon: "📖", description: "Passages, inference, tone", kind: "mcq", count: 25 },
  { id: "csat-lr", subjectId: "csat-lr", paperId: "prelims-csat", title: "Logical Reasoning", icon: "🧩", description: "Syllogisms, puzzles, series", kind: "mcq", count: 31 },
  { id: "csat-quant", subjectId: "csat-quant", paperId: "prelims-csat", title: "Numeracy & DI", icon: "🔢", description: "Arithmetic, percentages, DI", kind: "mcq", count: 30 },
  { id: "csat-dm", subjectId: "csat-dm", paperId: "prelims-csat", title: "Decision Making", icon: "✅", description: "Situational judgement for CSAT", kind: "mcq", count: 20 },
  // Mains
  { id: "mains-essay", subjectId: "essay", paperId: "mains-essay", title: "Essay practice", icon: "✍️", description: "Themes with model outlines", kind: "mains", count: 12 },
  { id: "mains-gs1", subjectId: "gs1-hist", paperId: "mains-gs1", title: "Mains GS-I drills", icon: "🏛️", description: "Culture, history, society, geography", kind: "mains", count: 12 },
  { id: "mains-gs2", subjectId: "gs2-polity", paperId: "mains-gs2", title: "Mains GS-II drills", icon: "📜", description: "Polity, governance, IR", kind: "mains", count: 12 },
  { id: "mains-gs3", subjectId: "gs3-econ", paperId: "mains-gs3", title: "Mains GS-III drills", icon: "💹", description: "Economy, S&T, security, DM", kind: "mains", count: 12 },
  { id: "mains-gs4", subjectId: "gs4-ethics", paperId: "mains-gs4", title: "Mains GS-IV drills", icon: "💡", description: "Ethics theory & case frameworks", kind: "mains", count: 12 },
];

export function getTrackMeta(id: string): QuizTrackMeta | undefined {
  return quizTracks.find((t) => t.id === id);
}

export function getTracksByPaper(paperId: string): QuizTrackMeta[] {
  return quizTracks.filter((t) => t.paperId === paperId);
}

export function getQuizCountsSummary() {
  const mcq = quizTracks.filter((t) => t.kind === "mcq").reduce((s, t) => s + t.count, 0);
  const mains = quizTracks.filter((t) => t.kind === "mains").reduce((s, t) => s + t.count, 0);
  return { mcq, mains, tracks: quizTracks.length, total: mcq + mains };
}
