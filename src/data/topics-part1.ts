import { Topic } from "@/types";

/** Prelims GS: History, Geography, Polity, Economy */
export const topicsPart1: Topic[] = [
  // —— HISTORY ——
  {
    id: "hist-ancient",
    title: "Ancient India",
    subjectId: "hist",
    paperId: "prelims-gs",
    likelihood: "Medium",
    probability: 58,
    whyBlurb: "Steady PYQ presence on Indus, Vedic, Buddhism/Jainism, Mauryas/Guptas; map-based sites recur.",
    summary: "From Indus Valley to early medieval polities — culture, polity, economy, religion.",
    notes:
      "Focus on Harappan sites and crafts; Vedic society evolution; Buddhism & Jainism doctrines and councils; Mauryan administration (Ashokan edicts); Gupta age (golden age debates); Sangam literature; temple architecture beginnings. Link art forms to Art & Culture. Prefer NCERT + themes over rote kings lists.",
    subtopics: [
      { id: "hist-ancient-ivc", title: "Indus Valley Civilization", notes: "Urban planning, seals, trade with Mesopotamia, decline theories, major sites (Harappa, Mohenjo-daro, Dholavira, Lothal)." },
      { id: "hist-ancient-vedic", title: "Vedic Period", notes: "Early vs Later Vedic polity, economy, varna, rituals; Vedas and Upanishads." },
      { id: "hist-ancient-religions", title: "Buddhism & Jainism", notes: "Four Noble Truths, Eightfold Path; Tirthankaras, anekantavada; councils; patronage." },
      { id: "hist-ancient-maurya-gupta", title: "Mauryas & Guptas", notes: "Arthashastra, Ashoka Dhamma; Gupta administration, science (Aryabhata), art." },
    ],
    relatedTopicIds: ["culture-arch", "hist-medieval"],
    tags: ["static", "map", "culture"],
  },
  {
    id: "hist-medieval",
    title: "Medieval India",
    subjectId: "hist",
    paperId: "prelims-gs",
    likelihood: "Medium",
    probability: 52,
    whyBlurb: "Bhakti-Sufi, Delhi Sultanate & Mughal administration appear regularly; architecture overlaps culture.",
    summary: "Delhi Sultanate, Mughals, regional kingdoms, Bhakti-Sufi movements.",
    notes:
      "Cover Iqta, Mansabdari, Zabti; Bhakti saints (Kabir, Nanak, Chaitanya) and Sufi silsilas; Vijayanagara & Bahmani; Mughal painting and architecture. Avoid endless battles — focus institutions and culture.",
    subtopics: [
      { id: "hist-med-sultanate", title: "Delhi Sultanate", notes: "Slave, Khalji, Tughlaq, Lodi — administration, market reforms (Alauddin)." },
      { id: "hist-med-mughal", title: "Mughal Empire", notes: "Akbar's policies, land revenue, decline under later Mughals." },
      { id: "hist-med-bhakti", title: "Bhakti & Sufi", notes: "Nirguna/Saguna; Chishti, Suhrawardi; social impact." },
    ],
    relatedTopicIds: ["hist-ancient", "culture-arch", "culture-lit"],
    tags: ["static", "culture"],
  },
  {
    id: "hist-modern",
    title: "Modern India & Freedom Struggle",
    subjectId: "hist",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 78,
    whyBlurb: "Highest history weightage — Congress sessions, Acts, movements, personalities repeatedly asked.",
    summary: "British expansion, socio-religious reform, nationalism, Gandhian era, Independence & Partition.",
    notes:
      "Timeline from Plassey to 1947; Charter Acts & Councils Acts; 1857; Moderates vs Extremists; Swadeshi, Home Rule, Non-Cooperation, Civil Disobedience, Quit India; Revolutionary movements; INA; Cabinet Mission & Mountbatten Plan. Memorize key years and associations carefully.",
    subtopics: [
      { id: "hist-mod-company", title: "Company Rule & Crown", notes: "Dual government, Permanent Settlement, Ryotwari, Mahalwari." },
      { id: "hist-mod-reforms", title: "Socio-Religious Reform", notes: "Brahmo Samaj, Arya Samaj, Aligarh, Ramakrishna Mission, women reformers." },
      { id: "hist-mod-nationalism", title: "National Movement", notes: "INC formation to Independence — phases and strategies." },
      { id: "hist-mod-gandhi", title: "Gandhian Movements", notes: "Satyagraha experiments, Salt March, Round Table Conferences." },
    ],
    relatedTopicIds: ["gs1-hist-freedom", "culture-modern"],
    tags: ["static", "high-weight"],
  },
  // —— GEOGRAPHY ——
  {
    id: "geo-physical",
    title: "Physical Geography",
    subjectId: "geo",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 72,
    whyBlurb: "Climatology, geomorphology, oceanography staples; map skills tested yearly.",
    summary: "Earth systems — landforms, climate, oceans, soils, natural vegetation.",
    notes:
      "GC Leong + NCERT XI: interior of earth, plate tectonics, weathering, monsoons, jet streams, ocean currents, coral reefs. Practice locating latitudes, passes, rivers.",
    subtopics: [
      { id: "geo-phys-geo", title: "Geomorphology", notes: "Tectonics, volcanoes, earthquakes, landforms by agents." },
      { id: "geo-phys-climate", title: "Climatology", notes: "Atmosphere, pressure belts, monsoons, cyclones, El Niño." },
      { id: "geo-phys-ocean", title: "Oceanography", notes: "Currents, tides, EEZ, marine resources." },
    ],
    relatedTopicIds: ["geo-india", "env-climate"],
    tags: ["static", "map"],
  },
  {
    id: "geo-india",
    title: "Indian Geography",
    subjectId: "geo",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 75,
    whyBlurb: "Rivers, soils, crops, minerals, physiography — consistent high-frequency PYQs.",
    summary: "Physiographic divisions, drainage, climate, resources, agriculture, industries.",
    notes:
      "Himalayas & Peninsular blocks; Indus-Ganga-Brahmaputra & Peninsular rivers; black/red/laterite soils; Green Revolution crops; mineral belts; industrial regions; census basics.",
    subtopics: [
      { id: "geo-ind-physio", title: "Physiography & Drainage", notes: "Himalayan ranges, Deccan, coastal plains; Himalayan vs Peninsular rivers." },
      { id: "geo-ind-agri", title: "Agriculture & Resources", notes: "Cropping patterns, irrigation, minerals, energy." },
    ],
    relatedTopicIds: ["geo-physical", "geo-world", "env-biodiversity"],
    tags: ["static", "map", "high-weight"],
  },
  {
    id: "geo-world",
    title: "World Geography",
    subjectId: "geo",
    paperId: "prelims-gs",
    likelihood: "Medium",
    probability: 48,
    whyBlurb: "Occasional map questions on continents, climate regions, strategic locations.",
    summary: "Continents, climatic regions, major resources and geopolitical locations.",
    notes:
      "Köppen climates; major deserts, grasslands; Panama/Suez; Arctic routes; key straits. Tie current affairs (conflicts, trade routes) to maps.",
    subtopics: [
      { id: "geo-world-regions", title: "Regions & Resources", notes: "Major agricultural and mineral regions worldwide." },
    ],
    relatedTopicIds: ["geo-physical", "gs2-ir-bilateral"],
    tags: ["map", "dynamic-link"],
  },
  // —— POLITY ——
  {
    id: "polity-const",
    title: "Constitutional Framework",
    subjectId: "polity",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 82,
    whyBlurb: "Preamble, FRs, DPSPs, amendments, basic structure — perennial high scorers.",
    summary: "Making of Constitution, Preamble, Fundamental Rights, DPSPs, Fundamental Duties, amendments.",
    notes:
      "Laxmikanth core. Schedules; Art. 12–35; Art. 36–51; basic structure (Kesavananda); recent amendments and bills in news. Distinguish justiciable vs non-justiciable.",
    subtopics: [
      { id: "polity-const-fr", title: "Fundamental Rights", notes: "Art. 14–32, reasonable restrictions, writs." },
      { id: "polity-const-dpsp", title: "DPSPs & Duties", notes: "Socialist, Gandhian, Liberal principles; Art. 51A." },
      { id: "polity-const-amend", title: "Amendment Process", notes: "Art. 368; basic structure doctrine." },
    ],
    relatedTopicIds: ["polity-institutions", "gs2-polity-fed"],
    tags: ["static", "high-weight"],
  },
  {
    id: "polity-institutions",
    title: "Union & State Institutions",
    subjectId: "polity",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 80,
    whyBlurb: "Parliament, President, Judiciary, Election Commission — tested every year.",
    summary: "Executive, Legislature, Judiciary; constitutional & statutory bodies.",
    notes:
      "Parliament procedures, money bills vs finance bills; President & Governor powers; Supreme Court & High Courts; CAG, UPSC, EC, Finance Commission; local government (73rd/74th).",
    subtopics: [
      { id: "polity-inst-parliament", title: "Parliament", notes: "Sessions, devices, budget, privileges." },
      { id: "polity-inst-judiciary", title: "Judiciary", notes: "Jurisdiction, PIL, judicial review, appointments." },
      { id: "polity-inst-bodies", title: "Constitutional Bodies", notes: "EC, CAG, UPSC, FC, NHRC (statutory comparison)." },
    ],
    relatedTopicIds: ["polity-const", "gs2-gov-schemes"],
    tags: ["static", "high-weight"],
  },
  {
    id: "polity-governance",
    title: "Governance & Rights Issues",
    subjectId: "polity",
    paperId: "prelims-gs",
    likelihood: "Medium",
    probability: 62,
    whyBlurb: "RTI, e-governance, rights commissions — mixed static + current.",
    summary: "Transparency, accountability, citizen charters, rights of vulnerable groups.",
    notes:
      "RTI Act, Lokpal, whistleblower; Digital India; SC/ST/Women commissions; important SC judgments in news.",
    subtopics: [
      { id: "polity-gov-rti", title: "Transparency Tools", notes: "RTI, citizen charter, social audit." },
    ],
    relatedTopicIds: ["gs2-gov-schemes", "gs4-integrity"],
    tags: ["static", "dynamic-link"],
  },
  // —— ECONOMY ——
  {
    id: "econ-basics",
    title: "Indian Economy Basics",
    subjectId: "economy",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 76,
    whyBlurb: "Inflation, GDP, fiscal/monetary policy, banking — evergreen Prelims favourites.",
    summary: "National income, inflation, banking, monetary & fiscal policy, budget.",
    notes:
      "GDP/GVA concepts; CPI vs WPI; RBI tools (repo, CRR, SLR, OMO); fiscal deficit components; FRBM; financial inclusion (PMJDY). Read Economic Survey highlights + Budget keywords.",
    subtopics: [
      { id: "econ-basics-ni", title: "National Income & Inflation", notes: "Methods of measuring NI; types of inflation; Phillips curve basics." },
      { id: "econ-basics-money", title: "Banking & Monetary Policy", notes: "RBI functions, monetary policy framework, NPA basics." },
      { id: "econ-basics-fiscal", title: "Fiscal Policy & Budget", notes: "Budget documents, deficits, taxation GST basics." },
    ],
    relatedTopicIds: ["econ-schemes", "gs3-econ-growth"],
    tags: ["static", "dynamic", "high-weight"],
  },
  {
    id: "econ-schemes",
    title: "Schemes, Sectors & External Sector",
    subjectId: "economy",
    paperId: "prelims-gs",
    likelihood: "High",
    probability: 74,
    whyBlurb: "Government schemes and BoP/trade frequently appear; neglected rebound on WTO/IMF.",
    summary: "Agriculture, industry, services, schemes, trade, WTO, capital markets.",
    notes:
      "Flagship schemes by ministry; MSP & APMC debates; Make in India / PLI; current account vs capital account; WTO bodies; SEBI basics.",
    subtopics: [
      { id: "econ-sch-agri", title: "Agriculture & Industry", notes: "MSP, e-NAM, industrial policy, MSMEs." },
      { id: "econ-sch-ext", title: "External Sector", notes: "BoP, exchange rates, FTAs, WTO." },
    ],
    relatedTopicIds: ["econ-basics", "ca-national"],
    tags: ["dynamic", "schemes"],
  },
];
