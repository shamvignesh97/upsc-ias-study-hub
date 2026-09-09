import type { PyqTopicFrequency } from "@/types";

/** Educational synthesis of topic-wise PYQ appearance patterns (approx. theme counts), 2016–2025.
 *  Not scraped verbatim papers — counts reflect widely discussed UPSC weightage patterns for study prioritisation.
 */
export const pyqFrequency: PyqTopicFrequency[] = [
  // —— Prelims GS ——
  {
    topicId: "hist-ancient",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 1, "2018": 2, "2019": 1, "2020": 2, "2021": 1, "2022": 2, "2023": 1, "2024": 2, "2025": 1 },
    syllabusWeight: 3,
    notes: "IVC sites, Buddhism/Jainism, Maurya–Gupta culture recur most years at moderate depth.",
  },
  {
    topicId: "hist-medieval",
    paper: "prelims-gs",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 1, "2020": 1, "2021": 2, "2022": 1, "2023": 1, "2024": 1, "2025": 2 },
    syllabusWeight: 3,
    notes: "Bhakti–Sufi, Sultanate/Mughal admin & architecture appear cyclically.",
  },
  {
    topicId: "hist-modern",
    paper: "prelims-gs",
    yearCounts: { "2016": 5, "2017": 4, "2018": 5, "2019": 4, "2020": 5, "2021": 4, "2022": 5, "2023": 4, "2024": 5, "2025": 4 },
    syllabusWeight: 5,
    notes: "Highest history weightage — Acts, Congress sessions, movements, personalities almost every paper.",
  },
  {
    topicId: "geo-physical",
    paper: "prelims-gs",
    yearCounts: { "2016": 3, "2017": 4, "2018": 3, "2019": 3, "2020": 4, "2021": 3, "2022": 4, "2023": 3, "2024": 4, "2025": 3 },
    syllabusWeight: 4,
    notes: "Climatology, geomorphology, oceanography staples; map/location skills yearly.",
  },
  {
    topicId: "geo-india",
    paper: "prelims-gs",
    yearCounts: { "2016": 3, "2017": 3, "2018": 4, "2019": 3, "2020": 3, "2021": 4, "2022": 3, "2023": 4, "2024": 3, "2025": 3 },
    syllabusWeight: 4,
    notes: "Physiography, drainage, resources, agriculture geography asked steadily.",
  },
  {
    topicId: "geo-world",
    paper: "prelims-gs",
    yearCounts: { "2016": 1, "2017": 1, "2018": 2, "2019": 1, "2020": 1, "2021": 1, "2022": 2, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 2,
    notes: "Lower volume than Indian/physical; regional resources and mapping occasionally.",
  },
  {
    topicId: "polity-const",
    paper: "prelims-gs",
    yearCounts: { "2016": 5, "2017": 5, "2018": 4, "2019": 5, "2020": 4, "2021": 5, "2022": 5, "2023": 4, "2024": 5, "2025": 5 },
    syllabusWeight: 5,
    notes: "FRs, DPSPs, amendment, basic structure — perennial high weightage.",
  },
  {
    topicId: "polity-institutions",
    paper: "prelims-gs",
    yearCounts: { "2016": 4, "2017": 4, "2018": 5, "2019": 4, "2020": 5, "2021": 4, "2022": 4, "2023": 5, "2024": 4, "2025": 4 },
    syllabusWeight: 5,
    notes: "Parliament, judiciary, constitutional bodies tested almost every year.",
  },
  {
    topicId: "polity-governance",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 2, "2018": 1, "2019": 2, "2020": 2, "2021": 2, "2022": 1, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 3,
    notes: "RTI, local bodies, rights issues — moderate but consistent.",
  },
  {
    topicId: "econ-basics",
    paper: "prelims-gs",
    yearCounts: { "2016": 4, "2017": 4, "2018": 5, "2019": 4, "2020": 5, "2021": 4, "2022": 5, "2023": 5, "2024": 4, "2025": 5 },
    syllabusWeight: 5,
    notes: "Inflation, banking/monetary, budget deficits, national income — core every year.",
  },
  {
    topicId: "econ-schemes",
    paper: "prelims-gs",
    yearCounts: { "2016": 3, "2017": 3, "2018": 3, "2019": 4, "2020": 3, "2021": 4, "2022": 3, "2023": 4, "2024": 4, "2025": 3 },
    syllabusWeight: 4,
    notes: "Schemes, agri/industry, external sector — mix of static concepts + CA link.",
  },
  {
    topicId: "env-biodiversity",
    paper: "prelims-gs",
    yearCounts: { "2016": 4, "2017": 5, "2018": 4, "2019": 5, "2020": 4, "2021": 5, "2022": 5, "2023": 4, "2024": 5, "2025": 4 },
    syllabusWeight: 5,
    notes: "Protected areas, species, WPA, hotspots — among highest Prelims weightage.",
  },
  {
    topicId: "env-climate",
    paper: "prelims-gs",
    yearCounts: { "2016": 3, "2017": 3, "2018": 4, "2019": 4, "2020": 3, "2021": 4, "2022": 4, "2023": 5, "2024": 4, "2025": 5 },
    syllabusWeight: 5,
    notes: "UNFCCC/Paris/COP and climate science — rising with global agenda.",
  },
  {
    topicId: "env-pollution",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 3, "2020": 2, "2021": 2, "2022": 3, "2023": 2, "2024": 3, "2025": 2 },
    syllabusWeight: 3,
    notes: "Air/water pollution, waste, wetlands — regular supporting block.",
  },
  {
    topicId: "sci-space-defence",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 3, "2020": 2, "2021": 3, "2022": 3, "2023": 4, "2024": 3, "2025": 4 },
    syllabusWeight: 4,
    notes: "ISRO missions, missiles, nuclear — rising with India's space/defence profile.",
  },
  {
    topicId: "sci-bio-it",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 1, "2018": 2, "2019": 2, "2020": 3, "2021": 3, "2022": 2, "2023": 3, "2024": 3, "2025": 3 },
    syllabusWeight: 3,
    notes: "Biotech, health, AI/IT basics — pandemic years lifted health/tech themes.",
  },
  {
    topicId: "ca-national",
    paper: "prelims-gs",
    yearCounts: { "2016": 4, "2017": 4, "2018": 4, "2019": 5, "2020": 4, "2021": 5, "2022": 4, "2023": 5, "2024": 5, "2025": 4 },
    syllabusWeight: 4,
    notes: "Schemes, reports, institutions in news — high but ephemeral; revise last 12–18 months.",
  },
  {
    topicId: "ca-intl",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 3, "2018": 2, "2019": 3, "2020": 2, "2021": 3, "2022": 3, "2023": 3, "2024": 4, "2025": 3 },
    syllabusWeight: 3,
    notes: "Orgs, summits, geopolitics linked to static IR/economy.",
  },
  {
    topicId: "culture-arch",
    paper: "prelims-gs",
    yearCounts: { "2016": 2, "2017": 1, "2018": 2, "2019": 2, "2020": 1, "2021": 2, "2022": 2, "2023": 1, "2024": 2, "2025": 2 },
    syllabusWeight: 3,
    notes: "Temple/Indo-Islamic architecture cycles with culture block.",
  },
  {
    topicId: "culture-perf",
    paper: "prelims-gs",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 1, "2020": 2, "2021": 1, "2022": 1, "2023": 2, "2024": 1, "2025": 1 },
    syllabusWeight: 2,
    notes: "Classical dance/music — intermittent but syllabus-important.",
  },
  {
    topicId: "culture-lit",
    paper: "prelims-gs",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 2, "2020": 1, "2021": 1, "2022": 2, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 2,
    notes: "Philosophy, literature, religion — lower count, high surprise potential.",
  },
  {
    topicId: "culture-modern",
    paper: "prelims-gs",
    yearCounts: { "2016": 0, "2017": 1, "2018": 1, "2019": 0, "2020": 1, "2021": 1, "2022": 0, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 2,
    notes: "Cultural institutions & modern heritage — lighter Prelims footprint.",
  },

  // —— CSAT (qualifying) ——
  {
    topicId: "csat-reading",
    paper: "prelims-csat",
    yearCounts: { "2016": 8, "2017": 8, "2018": 9, "2019": 8, "2020": 8, "2021": 9, "2022": 8, "2023": 9, "2024": 8, "2025": 8 },
    syllabusWeight: 5,
    notes: "Largest CSAT block every year — comprehension accuracy drives qualifying margin.",
  },
  {
    topicId: "csat-logic",
    paper: "prelims-csat",
    yearCounts: { "2016": 6, "2017": 7, "2018": 6, "2019": 6, "2020": 7, "2021": 6, "2022": 7, "2023": 6, "2024": 7, "2025": 6 },
    syllabusWeight: 5,
    notes: "Reasoning patterns structurally unavoidable in Paper II.",
  },
  {
    topicId: "csat-math",
    paper: "prelims-csat",
    yearCounts: { "2016": 6, "2017": 5, "2018": 6, "2019": 6, "2020": 5, "2021": 6, "2022": 6, "2023": 5, "2024": 6, "2025": 6 },
    syllabusWeight: 5,
    notes: "Numeracy + DI — consistent share; speed separates qualifiers.",
  },
  {
    topicId: "csat-decision",
    paper: "prelims-csat",
    yearCounts: { "2016": 2, "2017": 1, "2018": 2, "2019": 1, "2020": 0, "2021": 1, "2022": 1, "2023": 0, "2024": 1, "2025": 1 },
    syllabusWeight: 2,
    notes: "Fewer items historically; attempt carefully when present.",
  },

  // —— Mains Essay ——
  {
    topicId: "essay-structure",
    paper: "mains-essay",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Two essays every year — structure/technique is always decisive for marks.",
  },
  {
    topicId: "essay-themes",
    paper: "mains-essay",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 5,
    notes: "Philosophical + socio-political themes rotate; prepare both baskets.",
  },

  // —— Mains GS1 ——
  {
    topicId: "gs1-culture-art",
    paper: "mains-gs1",
    yearCounts: { "2016": 1, "2017": 2, "2018": 1, "2019": 1, "2020": 2, "2021": 1, "2022": 1, "2023": 2, "2024": 1, "2025": 1 },
    syllabusWeight: 3,
    notes: "Art & culture mains questions intermittent but scoring with examples.",
  },
  {
    topicId: "gs1-hist-freedom",
    paper: "mains-gs1",
    yearCounts: { "2016": 2, "2017": 2, "2018": 3, "2019": 2, "2020": 2, "2021": 2, "2022": 2, "2023": 2, "2024": 2, "2025": 2 },
    syllabusWeight: 4,
    notes: "Freedom struggle & post-independence — reliable GS1 history core.",
  },
  {
    topicId: "gs1-world-hist",
    paper: "mains-gs1",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 2, "2020": 1, "2021": 1, "2022": 1, "2023": 1, "2024": 1, "2025": 1 },
    syllabusWeight: 3,
    notes: "Industrial Revolution, world wars, decolonisation — 1–2 themes most years.",
  },
  {
    topicId: "gs1-society-diversity",
    paper: "mains-gs1",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 3, "2020": 2, "2021": 3, "2022": 2, "2023": 3, "2024": 2, "2025": 3 },
    syllabusWeight: 4,
    notes: "Women, diversity, urbanisation, communalism — rising social themes.",
  },
  {
    topicId: "gs1-geo-mains",
    paper: "mains-gs1",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 3, "2021": 2, "2022": 2, "2023": 2, "2024": 3, "2025": 2 },
    syllabusWeight: 4,
    notes: "Geophysical phenomena & resources — consistent GS1 geography share.",
  },

  // —— Mains GS2 ——
  {
    topicId: "gs2-polity-fed",
    paper: "mains-gs2",
    yearCounts: { "2016": 3, "2017": 3, "2018": 2, "2019": 3, "2020": 3, "2021": 2, "2022": 3, "2023": 3, "2024": 2, "2025": 3 },
    syllabusWeight: 5,
    notes: "Federalism, constitutional issues, separation of powers — GS2 anchor.",
  },
  {
    topicId: "gs2-gov-schemes",
    paper: "mains-gs2",
    yearCounts: { "2016": 3, "2017": 3, "2018": 3, "2019": 3, "2020": 4, "2021": 3, "2022": 3, "2023": 4, "2024": 3, "2025": 3 },
    syllabusWeight: 5,
    notes: "Governance, welfare, vulnerable sections — heavy analytical weightage.",
  },
  {
    topicId: "gs2-ir-bilateral",
    paper: "mains-gs2",
    yearCounts: { "2016": 2, "2017": 3, "2018": 2, "2019": 3, "2020": 2, "2021": 3, "2022": 3, "2023": 3, "2024": 3, "2025": 3 },
    syllabusWeight: 4,
    notes: "Neighbourhood + major powers + multilateral — steady IR demand.",
  },

  // —— Mains GS3 ——
  {
    topicId: "gs3-econ-growth",
    paper: "mains-gs3",
    yearCounts: { "2016": 3, "2017": 3, "2018": 4, "2019": 3, "2020": 4, "2021": 3, "2022": 4, "2023": 3, "2024": 4, "2025": 3 },
    syllabusWeight: 5,
    notes: "Growth, agri, infra, inclusive development — largest GS3 economy block.",
  },
  {
    topicId: "gs3-tech-env",
    paper: "mains-gs3",
    yearCounts: { "2016": 2, "2017": 3, "2018": 2, "2019": 3, "2020": 3, "2021": 3, "2022": 3, "2023": 3, "2024": 4, "2025": 3 },
    syllabusWeight: 4,
    notes: "S&T applications + environment/biodiversity mains — rising tech angle.",
  },
  {
    topicId: "gs3-sec-internal",
    paper: "mains-gs3",
    yearCounts: { "2016": 2, "2017": 2, "2018": 2, "2019": 2, "2020": 2, "2021": 2, "2022": 3, "2023": 2, "2024": 2, "2025": 3 },
    syllabusWeight: 4,
    notes: "Extremism, border, cyber, organised crime — regular security themes.",
  },
  {
    topicId: "gs3-sec-disaster",
    paper: "mains-gs3",
    yearCounts: { "2016": 1, "2017": 1, "2018": 1, "2019": 2, "2020": 1, "2021": 1, "2022": 1, "2023": 2, "2024": 1, "2025": 1 },
    syllabusWeight: 3,
    notes: "DM Act/NDMA frameworks — usually 1 question; high syllabus importance.",
  },

  // —— Mains GS4 ——
  {
    topicId: "gs4-ethics-basics",
    paper: "mains-gs4",
    yearCounts: { "2016": 4, "2017": 4, "2018": 4, "2019": 4, "2020": 4, "2021": 4, "2022": 4, "2023": 4, "2024": 4, "2025": 4 },
    syllabusWeight: 5,
    notes: "Theory section always present — definitions, thinkers, EI, attitude.",
  },
  {
    topicId: "gs4-integrity",
    paper: "mains-gs4",
    yearCounts: { "2016": 3, "2017": 3, "2018": 3, "2019": 3, "2020": 3, "2021": 3, "2022": 3, "2023": 3, "2024": 3, "2025": 3 },
    syllabusWeight: 5,
    notes: "Civil service values & integrity — structural GS4 demand every year.",
  },
  {
    topicId: "gs4-cases-app",
    paper: "mains-gs4",
    yearCounts: { "2016": 6, "2017": 6, "2018": 6, "2019": 6, "2020": 6, "2021": 6, "2022": 6, "2023": 6, "2024": 6, "2025": 6 },
    syllabusWeight: 5,
    notes: "Case studies dominate paper marks — practice is non-negotiable.",
  },
];

export function getFrequencyByTopicId(topicId: string): PyqTopicFrequency | undefined {
  return pyqFrequency.find((e) => e.topicId === topicId);
}
