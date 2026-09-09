import { Paper, Subject } from "@/types";

export const papers: Paper[] = [
  {
    id: "prelims-gs",
    title: "Prelims — General Studies Paper I",
    shortTitle: "Prelims GS-I",
    description:
      "Objective paper covering History, Geography, Polity, Economy, Environment, S&T, Art & Culture, and Current Affairs.",
    stage: "Prelims",
  },
  {
    id: "prelims-csat",
    title: "Prelims — CSAT (Paper II)",
    shortTitle: "CSAT",
    description:
      "Qualifying aptitude paper: comprehension, reasoning, numeracy, decision-making. 33% required to qualify.",
    stage: "Prelims",
  },
  {
    id: "mains-essay",
    title: "Mains — Essay",
    shortTitle: "Essay",
    description:
      "Two essays from multiple topics. Tests structure, depth, balance, and articulation.",
    stage: "Mains",
  },
  {
    id: "mains-gs1",
    title: "Mains — GS Paper I",
    shortTitle: "GS-I",
    description:
      "Indian Heritage & Culture, History, Geography of the World & Society.",
    stage: "Mains",
  },
  {
    id: "mains-gs2",
    title: "Mains — GS Paper II",
    shortTitle: "GS-II",
    description:
      "Governance, Constitution, Polity, Social Justice, International Relations.",
    stage: "Mains",
  },
  {
    id: "mains-gs3",
    title: "Mains — GS Paper III",
    shortTitle: "GS-III",
    description:
      "Technology, Economic Development, Biodiversity, Environment, Security, Disaster Management.",
    stage: "Mains",
  },
  {
    id: "mains-gs4",
    title: "Mains — GS Paper IV (Ethics)",
    shortTitle: "GS-IV Ethics",
    description:
      "Ethics, Integrity, Aptitude — theory, case studies, and application to public service.",
    stage: "Mains",
  },
  {
    id: "optional",
    title: "Optional Subjects",
    shortTitle: "Optional",
    description:
      "One optional subject (2 papers). Choose based on interest, overlap with GS, and scoring trends.",
    stage: "Optional",
  },
  {
    id: "interview",
    title: "Personality Test / Interview",
    shortTitle: "Interview",
    description:
      "275 marks. Assesses personality, awareness, integrity, and suitability for civil services.",
    stage: "Interview",
  },
];

export const subjects: Subject[] = [
  // Prelims GS
  {
    id: "hist",
    title: "History",
    paperId: "prelims-gs",
    description: "Ancient, Medieval, Modern India and freedom struggle.",
    icon: "📜",
  },
  {
    id: "geo",
    title: "Geography",
    paperId: "prelims-gs",
    description: "Physical, Indian, and World Geography; maps and resources.",
    icon: "🌍",
  },
  {
    id: "polity",
    title: "Polity",
    paperId: "prelims-gs",
    description: "Constitution, governance, rights, Parliament, judiciary.",
    icon: "⚖️",
  },
  {
    id: "economy",
    title: "Economy",
    paperId: "prelims-gs",
    description: "Indian economy, budgeting, banking, schemes, indicators.",
    icon: "📈",
  },
  {
    id: "env",
    title: "Environment & Ecology",
    paperId: "prelims-gs",
    description: "Biodiversity, climate, pollution, conservation, conventions.",
    icon: "🌿",
  },
  {
    id: "sci",
    title: "Science & Technology",
    paperId: "prelims-gs",
    description: "Space, defence, biotech, IT, health, emerging tech.",
    icon: "🔬",
  },
  {
    id: "ca",
    title: "Current Affairs",
    paperId: "prelims-gs",
    description: "National & international events linked to static syllabus.",
    icon: "📰",
  },
  {
    id: "culture",
    title: "Art & Culture",
    paperId: "prelims-gs",
    description: "Architecture, dance, music, literature, religion, heritage.",
    icon: "🎭",
  },
  // CSAT
  {
    id: "csat-comp",
    title: "Comprehension",
    paperId: "prelims-csat",
    description: "Passage-based reading and inference.",
    icon: "📖",
  },
  {
    id: "csat-lr",
    title: "Logical Reasoning",
    paperId: "prelims-csat",
    description: "Analytical reasoning, syllogisms, puzzles.",
    icon: "🧩",
  },
  {
    id: "csat-quant",
    title: "Numeracy & Data",
    paperId: "prelims-csat",
    description: "Basic maths, DI, percentages, ratios.",
    icon: "🔢",
  },
  {
    id: "csat-dm",
    title: "Decision Making",
    paperId: "prelims-csat",
    description: "Situational judgement (no negative marking historically).",
    icon: "✅",
  },
  // Essay
  {
    id: "essay",
    title: "Essay Writing",
    paperId: "mains-essay",
    description: "Themes, structure, philosophical and socio-political essays.",
    icon: "✍️",
  },
  // Mains GS1
  {
    id: "gs1-culture",
    title: "Indian Heritage & Culture",
    paperId: "mains-gs1",
    description: "Art forms, literature, architecture from ancient to modern.",
    icon: "🏛️",
  },
  {
    id: "gs1-hist",
    title: "Modern Indian History & World History",
    paperId: "mains-gs1",
    description: "Freedom struggle, post-independence, world wars, revolutions.",
    icon: "🕰️",
  },
  {
    id: "gs1-society",
    title: "Indian Society",
    paperId: "mains-gs1",
    description: "Diversity, women, poverty, urbanization, communalism.",
    icon: "👥",
  },
  {
    id: "gs1-geo",
    title: "Geography (Mains)",
    paperId: "mains-gs1",
    description: "Physical geography, resources, geophysical phenomena.",
    icon: "🗺️",
  },
  // Mains GS2
  {
    id: "gs2-polity",
    title: "Constitution & Polity",
    paperId: "mains-gs2",
    description: "Constitutional provisions, federalism, institutions.",
    icon: "📜",
  },
  {
    id: "gs2-gov",
    title: "Governance & Social Justice",
    paperId: "mains-gs2",
    description: "Schemes, NGOs, welfare, vulnerable sections.",
    icon: "🏛️",
  },
  {
    id: "gs2-ir",
    title: "International Relations",
    paperId: "mains-gs2",
    description: "Bilateral, regional, global groupings and diaspora.",
    icon: "🌐",
  },
  // Mains GS3
  {
    id: "gs3-econ",
    title: "Economic Development",
    paperId: "mains-gs3",
    description: "Planning, growth, agriculture, industry, infrastructure.",
    icon: "💹",
  },
  {
    id: "gs3-tech",
    title: "Science, Tech & Environment",
    paperId: "mains-gs3",
    description: "S&T applications, biodiversity, climate, EIA.",
    icon: "🧪",
  },
  {
    id: "gs3-sec",
    title: "Security & Disaster Management",
    paperId: "mains-gs3",
    description: "Internal security, border, cyber, disasters.",
    icon: "🛡️",
  },
  // Ethics
  {
    id: "gs4-ethics",
    title: "Ethics & Human Interface",
    paperId: "mains-gs4",
    description: "Ethics foundations, values, emotional intelligence.",
    icon: "💡",
  },
  {
    id: "gs4-attitude",
    title: "Attitude, Aptitude & Integrity",
    paperId: "mains-gs4",
    description: "Civil service values, integrity, impartiality.",
    icon: "🧭",
  },
  {
    id: "gs4-cases",
    title: "Case Studies",
    paperId: "mains-gs4",
    description: "Applied ethics dilemmas in administration.",
    icon: "📋",
  },
  // Optional hub subject (topics point to optionals)
  {
    id: "opt-hub",
    title: "Common Optionals",
    paperId: "optional",
    description: "Browse popular optional subjects and focus one.",
    icon: "📚",
  },
  // Interview
  {
    id: "interview-prep",
    title: "Interview Preparation",
    paperId: "interview",
    description: "DAF, current affairs, hobbies, mock strategies.",
    icon: "🎤",
  },
];
