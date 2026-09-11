import { getArticle } from "@/data/articles";
import { getPortionById, type RankedPortion } from "@/data/portion-frequency";
import { getTopicById } from "@/data/topics";

export type BattleCardDef = {
  id: string;
  portionId: string;
  topicId: string;
  articleSlug: string;
  title: string;
  emoji: string;
  /** Extra densest one-liners beyond article mustRemember */
  denseFacts: string[];
};

/** Loop battle cards — top Prelims magnets for rapid revision (in-app, not PDFs). */
export const battleCardDefs: BattleCardDef[] = [
  {
    id: "climate",
    portionId: "climate-unfccc-paris",
    topicId: "env-climate",
    articleSlug: "climate-unfccc-paris",
    title: "Climate · UNFCCC & Paris",
    emoji: "🌡️",
    denseFacts: [
      "Enhanced GH effect ≠ ozone hole; Montreal Protocol ≠ UNFCCC family",
      "CO₂ long-lived; CH₄ higher GWP, shorter life; N₂O + F-gases",
      "Kyoto: Annex-I top-down; Paris: near-universal bottom-up NDCs + GST",
      "Paris aim: well below 2°C, pursue 1.5°C; Stocktake every 5 years",
      "Mitigation = cut/sink GHGs; Adaptation = live with impacts; L&D = residual harm",
      "CBDR-RC: common but differentiated responsibilities + respective capabilities",
      "India: update NDC numbers before exam; net-zero ≠ overnight zero emissions",
    ],
  },
  {
    id: "fr-dpsp",
    portionId: "fundamental-rights-dpsp",
    topicId: "polity-const",
    articleSlug: "fundamental-rights-dpsp",
    title: "FRs · DPSPs & Interplay",
    emoji: "⚖️",
    denseFacts: [
      "Part III Arts 12–35 FRs; Part IV Arts 36–51 DPSPs (non-justiciable)",
      "Golden triangle: Arts 14, 19, 21 — most litigated Prelims cluster",
      "Art 19 only for citizens; Arts 14/21 for persons (incl. non-citizens)",
      "Art 32 = SC remedies (Ambedkar: heart & soul); HC writs Art 226",
      "Five writs: habeas, mandamus, prohibition, certiorari, quo warranto",
      "Minerva Mills: FR–DPSP harmony; DPSPs not enforceable like FRs",
      "Reasonable restrictions on Art 19 — grounds are exhaustive, not open-ended",
    ],
  },
  {
    id: "inflation",
    portionId: "inflation-monetary",
    topicId: "econ-basics",
    articleSlug: "inflation-monetary",
    title: "Inflation & Monetary Policy",
    emoji: "📈",
    denseFacts: [
      "CPI = consumer basket (policy target); WPI = wholesale — different baskets",
      "Headline vs core (ex food & fuel); base effect can distort YoY prints",
      "Demand-pull vs cost-push; stagflation = slow growth + high inflation",
      "Disinflation = falling inflation rate; deflation = falling price level",
      "MPC sets repo; RBI implements; transmission has lag via banks/markets",
      "Repo / SDF / MSF / CRR / SLR — know direction of liquidity impact",
      "Flexible inflation targeting (~4% ±2% CPI) is the India policy frame",
    ],
  },
  {
    id: "protected-areas",
    portionId: "protected-areas-wpa",
    topicId: "env-biodiversity",
    articleSlug: "protected-areas-wpa",
    title: "Protected Areas · WPA & Species",
    emoji: "🐅",
    denseFacts: [
      "NP: highest protection; WLS: regulated; BR: core–buffer–transition (UNESCO Man & Biosphere)",
      "Tiger Reserve = Critical Tiger Habitat + buffer (WPA + Project Tiger admin)",
      "In situ (habitat) vs ex situ (zoo/seed bank) — Prelims loves the contrast",
      "WPA Schedules: higher schedule ≈ stricter protection (refresh latest list)",
      "IUCN Red List ≠ Indian legal schedules — never equate casually",
      "Corridors connect populations; flagship species ↔ habitat matching is high-yield",
      "CITES (trade), CMS (migratory), CBD (biodiversity) — purpose one-liners",
    ],
  },
  {
    id: "parliament",
    portionId: "parliament-procedures",
    topicId: "polity-institutions",
    articleSlug: "parliament-procedures",
    title: "Parliament · Devices & Law-Making",
    emoji: "🏛️",
    denseFacts: [
      "Money Bill Art 110 — only LS; Speaker’s certificate final; RS limited role",
      "Adjournment pauses sitting; prorogation ends session; dissolution ends LS",
      "Joint sitting (Art 108) for ordinary bills deadlock — NOT Money Bills / Const. Am.",
      "Starred = oral + supplementaries; Unstarred = written; Short Notice = urgent",
      "Zero Hour ≠ Question Hour; Calling Attention / Adjournment motion nuances",
      "Ordinance Art 123 — temporary; cannot bypass permanent constitutional limits",
      "Budget / Appropriation / Finance Bill — sequence and privilege matters",
    ],
  },
  {
    id: "schemes",
    portionId: "national-schemes-institutions",
    topicId: "ca-national",
    articleSlug: "national-schemes-institutions",
    title: "Schemes & Institutions in News",
    emoji: "📋",
    denseFacts: [
      "Scheme anatomy: ministry, objective, beneficiary, funding (CSS vs central sector), KPI",
      "Constitutional bodies (EC/CAG/UPSC/FC) ≠ statutory (NHRC/CBI/NITI) ≠ executive",
      "Revise last 12–18 months CA + static anchors (Articles/Acts behind schemes)",
      "Report ↔ publisher ↔ theme matching beats rote scheme-name lists",
      "Centrally Sponsored = Centre+State share; Central Sector = fully Centre",
      "Index traps: who publishes (NITI/MoSPI/RBI/UN) and what it measures",
      "Link schemes to FR/DPSP/Directive themes for Prelims elimination",
    ],
  },
  {
    id: "isro",
    portionId: "isro-space-defence",
    topicId: "sci-space-defence",
    articleSlug: "isro-space-defence",
    title: "ISRO · Space & Defence Tech",
    emoji: "🚀",
    denseFacts: [
      "PSLV: workhorse polar/SSO; GSLV/LVM3: heavier / GTO-class — don’t mix casually",
      "NavIC = India’s regional nav; applications > memorising every acronym",
      "Chandrayaan / Gaganyaan / Aditya — refresh mission status before exam",
      "Remote sensing + disaster + agri + cartography = Prelims application angle",
      "Missile families: role/range class (SRBM/MRBM/IRBM/ICBM, cruise vs ballistic)",
      "ASAT / SSA / debris — strategic + space environment awareness themes",
      "Prefer concept (orbit type, payload purpose) over vanity launch dates alone",
    ],
  },
  {
    id: "monsoon",
    portionId: "monsoon-climatology",
    topicId: "geo-physical",
    articleSlug: "monsoon-climatology",
    title: "Monsoon & Climatology",
    emoji: "🌧️",
    denseFacts: [
      "SW monsoon: Arabian Sea + Bay of Bengal branches; orography shapes rain",
      "Onset Kerala ~June; retreat sequential; jet / Tibetan heat / ITCZ narrative",
      "ENSO: El Niño ↔ weaker SW monsoon is probabilistic, not automatic failure",
      "NE monsoon: Oct–Dec — critical for Tamil Nadu / SE coast",
      "Western Disturbances → NW India winter precip / western Himalayan snow",
      "Rain-shadow (e.g. Deccan leeward) vs windward Western Ghats contrast",
      "Köppen India map basics + local names (Mango showers, Kalbaisakhi) help MCQs",
    ],
  },
];

export type BattleCardView = BattleCardDef & {
  rank: RankedPortion;
  mustRemember: string[];
  traps: string[];
  table?: { title: string; headers: string[]; rows: string[][] };
  studyHref: string;
  articleHref: string;
  pdfHref: string;
  drillHref: string;
};

export function getBattleCard(cardId: string): BattleCardView | undefined {
  const def = battleCardDefs.find((c) => c.id === cardId);
  if (!def) return undefined;
  const rank = getPortionById(def.portionId);
  if (!rank) return undefined;
  const article = getArticle(def.topicId, def.articleSlug);
  const mustRemember = [
    ...(article?.mustRemember ?? []),
    ...def.denseFacts,
  ].filter(Boolean);
  // de-dupe loosely
  const seen = new Set<string>();
  const unique = mustRemember.filter((line) => {
    const key = line.toLowerCase().slice(0, 48);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    ...def,
    rank,
    mustRemember: unique.slice(0, 14),
    traps: (article?.commonTraps ?? []).slice(0, 5),
    table: article?.tables?.[0],
    studyHref: `/study/prelims-gs/${getTopicById(def.topicId)?.subjectId ?? topicToSubject(def.topicId)}?topic=${encodeURIComponent(def.topicId)}`,
    articleHref: `/article/${def.topicId}/${def.articleSlug}`,
    pdfHref: `/articles/${def.topicId}/${def.articleSlug}.pdf`,
    drillHref: `/drill`,
  };
}

function topicToSubject(topicId: string): string {
  if (topicId.startsWith("env")) return "env";
  if (topicId.startsWith("polity")) return "polity";
  if (topicId.startsWith("econ")) return "economy";
  if (topicId.startsWith("geo")) return "geo";
  if (topicId.startsWith("sci")) return "sci";
  if (topicId.startsWith("ca")) return "ca";
  if (topicId.startsWith("hist")) return "hist";
  return "env";
}

export function getAllBattleCards(): BattleCardView[] {
  return battleCardDefs
    .map((d) => getBattleCard(d.id))
    .filter((c): c is BattleCardView => !!c)
    .sort((a, b) => b.rank.probability - a.rank.probability);
}
