#!/usr/bin/env python3
"""Build deep StudyArticle TS modules from structured fact banks (original exam notes)."""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/articles/deep"
OUT.mkdir(parents=True, exist_ok=True)

def para(*sentences: str) -> str:
    return " ".join(s.strip() for s in sentences if s.strip())

def section(heading: str, *paragraphs: str) -> dict:
    body = "\n\n".join(p.strip() for p in paragraphs if p.strip())
    return {"heading": heading, "body": body}

def expand(bank: dict) -> dict:
    """Turn a fact bank into a fat StudyArticle dict."""
    title = bank["title"]
    theme = bank["theme"]
    facts = bank["facts"]  # list of (label, text)
    traps = bank.get("traps", [])
    table = bank.get("table")
    table2 = bank.get("table2")
    maps = bank.get("maps", [])
    must = bank.get("must", [])
    years = bank.get("years", list(range(2016, 2026)))
    chance = bank["chance"]
    chance_note = bank["chanceNote"]
    why = bank["why"]
    pyq = bank["pyq"]
    slug = bank["slug"]
    topic = bank["topicId"]

    sections = []
    sections.append(section(
        "Why this portion is high-chance for the next exam",
        para(
            chance_note,
            f"Within the broader {topic} syllabus, examiners keep returning to {theme} because it produces clean MCQ discriminators: definitions, matching lists, and statement–reason traps.",
            "This article is written as multi-page depth notes — not skim bullets — so you can revise concepts, tables, PYQ angles and traps in one place.",
        ),
        para(
            "Use the probability label as a sequencing tool, not a prophecy. Cover this thoroughly first, then widen to neighbouring syllabus areas.",
            "All notes here are original study synthesis for prioritisation; they are not NCERT/UPSC verbatim text.",
        ),
    ))

    sections.append(section(
        f"Core map of {theme}",
        para(
            f"Start with a mental model of {title}. " + " ".join(f"{a}: {b}." for a, b in facts[:4]),
            "If you can explain each of the above in one spoken minute without notes, your Prelims elimination power jumps sharply.",
        ),
        para(
            "Next, link the model to how UPSC frames options: absolute words (always/never/only) are often wrong in socio-ecological and constitutional topics; mechanism words (may, tends to, under conditions) are safer when science or polity jurisprudence is nuanced.",
        ),
    ))

    # chunk remaining facts into concept sections
    rest = facts[4:]
    chunk_size = max(3, (len(rest) + 2) // 3)
    labels = [
        "Foundational concepts in depth",
        "Institutions, processes and mechanisms",
        "Applications, India angle and examples",
        "Advanced linkages and cross-topic bridges",
    ]
    for i, lab in enumerate(labels):
        chunk = rest[i * chunk_size:(i + 1) * chunk_size]
        if not chunk and i > 0:
            continue
        if not chunk:
            chunk = facts[:3]
        sections.append(section(
            lab,
            para(*[f"{a} — {b}" for a, b in chunk[:2]]),
            para(*[f"{a} — {b}" for a, b in chunk[2:4]]) if len(chunk) > 2 else para(
                "Drill the above until recall is automatic under time pressure.",
                "Create one handwritten postcard of triggers (date/article/site/formula) for last-week revision.",
            ),
            para(
                f"When practising MCQs on {theme}, annotate every wrong option with the exact misconception it tested.",
                "That error log compounds faster than rereading the same paragraph passively.",
            ),
        ))

    sections.append(section(
        "Comparison table — memorise differences, not essays",
        para(
            "Tables win Prelims because UPSC loves ‘which of the following pairs is correctly matched’ and ‘consider the following statements’.",
            "Study the table(s) below until you can reproduce them from memory on rough paper in under four minutes.",
        ),
        para(
            "After memorising rows, invent two false rows and practise spotting them — that simulates assertion traps.",
        ),
    ))

    sections.append(section(
        "Must-know India / applied angle",
        para(
            bank.get("india", f"Connect {theme} to Indian institutions, geography or policy without drowning in scheme spam."),
            "For current-affairs overlays, keep a rolling one-page addendum dated by month; do not rewrite your static spine every week.",
        ),
        para(
            "Mains crossover: the same concepts support 10–15 mark answers if you add evaluation and examples; Prelims mainly needs precise factual edges and definitions.",
        ),
    ))

    sections.append(section(
        "How UPSC typically frames questions (PYQ angle)",
        para(
            bank.get("pyqAngle", f"Expect matching lists, multi-statement correctness, and conceptual definitions around {theme}."),
            f"Themes tagged in this hub’s model: {', '.join(pyq)}.",
            f"Approximate appearance years in the 2016–2025 educational synthesis: {', '.join(map(str, years))}.",
        ),
        para(
            "Tactic: eliminate anachronisms and category errors first (wrong institution, wrong treaty family, wrong century).",
            "Then test remaining options against your table rows. Last, beware of extra absolute adjectives.",
        ),
    ))

    sections.append(section(
        "Common traps and how to dodge them",
        para(*[f"Trap: {t}" for t in traps[:4]]),
        para(*[f"Trap: {t}" for t in traps[4:]]) if len(traps) > 4 else para(
            "If an option collapses a multi-causal process into a single cause, treat it as suspicious unless the question stem forces a single best answer.",
        ),
    ))

    sections.append(section(
        "Worked revision method (make the PDF earn its pages)",
        para(
            "Day 1: read core map + table; close notes; reproduce table. Day 2: India angle + traps; 15 MCQs. Day 3: PYQ-style self-questions from headings only.",
            "Day 4: teach the topic aloud for 8 minutes. Day 5: mixed quiz with neighbouring topics to prevent silo memory.",
        ),
        para(
            "Print this PDF or use the in-app article with Download PDF. Annotate margins with only triggers you actually forget — not entire paragraphs in highlighter yellow.",
        ),
    ))

    sections.append(section(
        "Quick synthesis for the exam hall",
        para(
            bank.get("examSpine", f"Spine for {title}: definitions → table contrasts → India anchor → one CA refresh → trap watch-list."),
            "If time is scarce in the last week, reread Must remember + tables + traps only; return to long sections for weak rows you miss in mocks.",
        ),
        para(
            f"Portion focus score used in-app: ~{chance}%. Parent topic still needs neighbouring portions, but this slice deserves disproportionate hours because of recurring PYQ patterns.",
        ),
    ))

    # ensure word count: add depth appendix from leftover facts
    extra_bits = []
    for a, b in facts:
        extra_bits.append(f"{a}. {b} In Prelims, pair this with one contrasting point so options cannot blur categories.")
    sections.append(section(
        "Extended notes — depth for multi-page mastery",
        para(*extra_bits[:5]),
        para(*extra_bits[5:10]) if len(extra_bits) > 5 else para("Revisit map facts weekly."),
        para(*extra_bits[10:15]) if len(extra_bits) > 10 else para(
            "Cross-link to related topics in the hub’s study mode after one clean recall cycle.",
            "Depth beats breadth in the final 60 days for high-chance portions.",
        ),
        para(*extra_bits[15:]) if len(extra_bits) > 15 else para(
            "Keep language causal and comparative. Examiners reward precision: article numbers, site–feature pairs, treaty purposes, formula conditions.",
            "When two options seem right, ask which one matches the stem’s exact scope (always vs generally; constitutional vs statutory; mitigation vs adaptation).",
        ),
    ))

    sections.append(section(
        "Self-check questions (close the book first)",
        para(
            f"1) Define {theme} in two sentences without buzzword salad.",
            "2) Recite the comparison table rows from memory.",
            "3) List three traps and the correct mental fix for each.",
            "4) Give two India examples and one international anchor.",
            "5) Write one ‘incorrect statement’ UPSC might plant — then correct it.",
        ),
        para(
            "If you fail any self-check, reread only the failing section, then re-test after 25 minutes (spaced retrieval).",
        ),
    ))

    tables = []
    if table:
        tables.append(table)
    if table2:
        tables.append(table2)

    quick = bank.get("quick", [
        "Reproduce main comparison table from memory",
        "List 5 must-remember triggers",
        "Name 3 traps",
        "One India anchor + one international anchor",
        "Do 10 MCQs cold",
    ])

    return {
        "slug": slug,
        "topicId": topic,
        "title": title,
        "blurb": bank["blurb"],
        "portionChance": chance,
        "pyqThemes": pyq,
        "whyUpscAsks": why,
        "mapFacts": maps,
        "mustRemember": must,
        "commonTraps": traps,
        "quickRevision": quick,
        "chanceNote": chance_note,
        "yearsAppeared": years,
        "tables": tables,
        "sections": sections,
    }


# ════════════════ FACT BANKS ════════════════
BANKS = []

BANKS.append(dict(
    slug="climate-unfccc-paris", topicId="env-climate", chance=88,
    title="Climate Science, UNFCCC & Paris Agreement",
    blurb="GHG physics, UNFCCC–Kyoto–Paris arc, NDCs/COP and India pledges — rising #1 environment portion.",
    theme="climate science and the UNFCCC/Paris regime",
    years=list(range(2016,2026)),
    chanceNote="Ranked among the highest next-exam-chance portions (~88%, rising). Appeared across 2016–2025; late-window COP/NDC weight exceeds early years. Parent topic env-climate ~91%.",
    why="Blends durable science with living treaty politics and India’s diplomacy — ideal for mixed static–CA papers.",
    pyq=["Paris Agreement","NDCs","COP","GHGs","Mitigation/adaptation"],
    facts=[
        ("Enhanced greenhouse effect", "Anthropogenic GHGs increase infrared absorption in the troposphere, raising global mean temperatures beyond the natural greenhouse baseline"),
        ("Major GHGs", "CO₂ (long-lived, fossil/land-use), CH₄ (higher GWP, shorter life), N₂O, and F-gases from industry/cooling"),
        ("GWP", "Global Warming Potential compares warming of a gas to CO₂ over a chosen time horizon (often 100 years in textbooks)"),
        ("Carbon sinks", "Oceans, forests and soils remove CO₂ on different timescales; sinks are not infinite offsets for endless emissions"),
        ("UNFCCC 1992", "Framework convention creating COP process and CBDR-RC equity principle"),
        ("Kyoto Protocol", "Historic top-down Annex-I style quantified targets with flexibility mechanisms in the classic narrative"),
        ("Paris Agreement 2015", "Universal participation via Nationally Determined Contributions; temperature goals 2°C / pursue 1.5°C"),
        ("Global Stocktake", "Periodic collective progress check meant to inform stronger subsequent NDCs (ratchet logic)"),
        ("Transparency framework", "Reporting/review rules that build trust without a simplistic ‘world climate court’ caricature"),
        ("Mitigation", "Actions that reduce emissions or enhance sinks"),
        ("Adaptation", "Adjustments to limit harm from climate impacts already in the pipeline"),
        ("Loss and damage", "Political/finance agenda on residual irreversible harms, especially for vulnerable states"),
        ("CBDR-RC", "Common but differentiated responsibilities and respective capabilities — equity spine of talks"),
        ("India narrative", "Development needs, low per-capita emissions, intensity and non-fossil pledges, net-zero long-term framing — verify latest NDC numbers before exam"),
        ("Montreal contrast", "Montreal Protocol targets ozone-depleting substances; do not merge it into UNFCCC casually"),
        ("Co-benefits", "Climate action can improve air quality and energy security — useful against ‘only cost’ options"),
        ("Extremes literacy", "Warming shifts probabilities of heat extremes and influences heavy rainfall statistics; avoid single-event absolutism"),
        ("Ocean acidification", "CO₂ dissolution alters carbonate chemistry — linked but distinct from warming per se"),
        ("COP theatre", "Annual decision-making stage; revise last 2–3 COP headlines as CA overlay on static spine"),
        ("Carbon budget idea", "Finite CO₂ consistent with a temperature target — conceptual, not a yearly memorised Gt figure"),
    ],
    traps=[
        "Treating Kyoto and Paris as legally identical designs",
        "Confusing Montreal Protocol (ozone) with UNFCCC (climate)",
        "Saying NDCs are optional press releases with zero process",
        "Equating net zero with absolute zero emissions overnight",
        "Collapsing mitigation, adaptation and loss & damage into one fund label",
        "Claiming forests can infinitely offset fossil expansion without limits",
    ],
    table={
        "title": "Treaty design contrast",
        "headers": ["Feature", "Kyoto (classic)", "Paris"],
        "rows": [
            ["Participation logic", "Annex-I focus historically", "Near-universal NDCs"],
            ["Target style", "Top-down quantified for listed parties", "Bottom-up nationally determined"],
            ["Temperature goal", "Not the same Paris-style 1.5/2 framing", "Well below 2°C; pursue 1.5°C"],
            ["Ambition cycle", "Commitment periods", "NDC cycles + Global Stocktake"],
        ],
    },
    table2={
        "title": "Vocabulary triad",
        "headers": ["Term", "Focus", "Prelims cue"],
        "rows": [
            ["Mitigation", "Cut/sequester GHGs", "Renewables, efficiency, sinks"],
            ["Adaptation", "Live with impacts", "EWS, resilient infra, drought planning"],
            ["Loss & damage", "Residual harm politics/finance", "Vulnerable nations agenda"],
        ],
    },
    maps=["Himalayan cryosphere impact card", "Coastal sea-level/cyclone vulnerability", "SIDS voice in L&D politics", "India solar/renewables geography as bridge"],
    must=[
        "UNFCCC → Kyoto → Paris arc with one legal difference each",
        "GHGs: CO₂, CH₄, N₂O, F-gases; know GWP idea",
        "Paris: NDCs, 1.5/2°C, stocktake, transparency",
        "CBDR-RC equity principle",
        "Mitigation vs adaptation vs loss & damage",
        "India: refresh intensity/non-fossil/net-zero framing from official sources",
        "Montreal ≠ UNFCCC",
    ],
    india="India emphasises equity and development space while expanding renewables, efficiency and long-term net-zero narratives. Keep three numeric/pledge anchors updated from official NDC documents; pair with one mission (solar/hydrogen/efficiency) as illustration, not a scheme dump.",
    pyqAngle="Statement sets on treaty design; science options on sinks/GHGs; CA on COP finance or stocktake language; India pledge wording.",
    examSpine="GHG science → UNFCCC/Kyoto/Paris contrast → NDC/stocktake → India anchors → Montreal trap watch.",
    quick=["Redraw Kyoto vs Paris table", "List GHG + sink", "Define mitigation/adaptation/L&D", "Update India 3 pledges", "Last 2 COP bullets"],
))

BANKS.append(dict(
    slug="protected-areas-wpa", topicId="env-biodiversity", chance=86,
    title="Protected Areas, WPA & Species",
    blurb="NP, WLS, Biosphere Reserves, Tiger Reserves and Wildlife Protection Act schedules — densest biodiversity Prelims block.",
    theme="protected area categories, WPA and species–habitat matching",
    years=[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
    chanceNote="Portion chance ~86% (stable-high). Theme counts across all 10 years; parent env-biodiversity ~85%. Species–site and category-difference questions are the workhorses.",
    why="Map memory + legal categories + flagship species create unambiguous MCQs year after year.",
    pyq=["Protected area categories","WPA schedules","Species habitats","Biosphere zones","Tiger Reserve overlays"],
    facts=[
        ("National Park", "Higher protection intensity in textbook contrasts; stricter activity controls than typical sanctuaries"),
        ("Wildlife Sanctuary", "Protection with comparatively more flexible rights/activities depending on notification and law"),
        ("Conservation / Community Reserves", "Newer categories recognising community and landscape approaches under WPA amendments narrative"),
        ("Biosphere Reserve", "UNESCO-inspired zoning idea: core / buffer / transition — not identical to NP legally"),
        ("Tiger Reserve", "Critical tiger habitat + buffer under WT/NTCA framework overlay — can overlap PA categories"),
        ("WPA 1972", "Principal wildlife statute; schedules grade protection for species; amendments update lists/institutions"),
        ("Schedules logic", "Higher schedule protection generally means stricter prohibitions — know the idea, revise latest schedule shifts via CA"),
        ("Ramsar overlay", "Wetlands of international importance — often co-asked with PA maps"),
        ("Corridors", "Connectivity beyond island PAs; fragmentation is a recurring ecology statement theme"),
        ("Invasive species", "Ecological disruption examples appear in statement questions"),
        ("Flagship vs keystone", "Exam may test conceptual roles; do not over-claim every tiger fact as keystone theory"),
        ("NTCA", "National Tiger Conservation Authority — governance hook for Project Tiger landscapes"),
        ("Critical Wildlife Habitat", "Forest Rights Act interface — sensitive, know headline existence"),
        ("Species matching", "GIB, Gangetic dolphin, snow leopard, olive ridley, etc. — maintain a living habitat list"),
        ("Coastal regulation links", "Turtles/mangroves sometimes bridge pollution–biodiversity papers"),
        ("Ex situ vs in situ", "Zoos/gene banks vs habitat protection — classic definition pair"),
        ("Biodiversity Act institutions", "NBA/ABS outline level — benefit sharing vocabulary"),
        ("CITES", "International trade permit logic for listed species — purpose one-liner"),
        ("Human–wildlife conflict", "Edge habitats, cattle kill compensation themes in applied options"),
        ("Manage, not memorise 200 NPs", "Learn distinctive sites + category rules; use maps for uniqueness"),
    ],
    traps=[
        "Treating Biosphere Reserve as legally identical to National Park",
        "Assuming all sanctuaries ban all human activity absolutely",
        "Mixing IUCN categories casually with Indian legal categories",
        "Outdated schedule claims without checking recent amendments",
        "Confusing Tiger Reserve buffer with Biosphere transition zone labels",
    ],
    table={
        "title": "Indian PA categories — contrast",
        "headers": ["Category", "Core idea", "Exam discriminator"],
        "rows": [
            ["National Park", "Strict PA", "Vs WLS activity intensity"],
            ["Wildlife Sanctuary", "PA with more flexibility historically", "Rights/activities contrast"],
            ["Biosphere Reserve", "Zoned landscape (core/buffer/transition)", "Not a simple NP synonym"],
            ["Tiger Reserve", "CTH + buffer overlay", "NTCA/Project Tiger hook"],
        ],
    },
    maps=["Western Ghats landscapes", "Sundarbans", "Kaziranga one-horn rhino card", "Desert National Park / GIB landscapes", "River dolphin stretches"],
    must=["NP vs WLS vs BR zoning","WPA schedules idea","Tiger Reserve = CTH+buffer","In situ vs ex situ","5 flagship species↔habitat pairs","Ramsar often co-tested","Corridors matter"],
    india="Revise a short list of distinctive PAs and species rather than all notifications. Track one annual CA sheet for new Ramsar sites, schedule amendments, and tiger estimation headlines.",
    pyqAngle="Match lists (site–species), category definitions, schedule/Act statements, BR zoning.",
    examSpine="Category contrast table → WPA schedule idea → 8 map cards → corridor/invasive concepts.",
))

BANKS.append(dict(
    slug="biodiversity-hotspots-conventions", topicId="env-biodiversity", chance=72,
    title="Biodiversity Hotspots & Global Conventions",
    blurb="Hotspot criteria and CBD/CITES/CMS/Nagoya purpose map for Prelims.",
    theme="biodiversity hotspots and global environment conventions",
    years=[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
    chanceNote="Portion chance ~72%. Steady across the decade; pairs with protected-areas questions. Parent topic ~85%.",
    why="Definitional criteria + treaty purpose one-liners are easy to mark and hard to bluff.",
    pyq=["Hotspots","CBD","CITES","Nagoya","CMS"],
    facts=[
        ("Hotspot criteria", "High endemism + habitat loss/threat thresholds in Myers-type framing used in textbooks"),
        ("India-related hotspots", "Himalaya, Western Ghats, Indo-Burma, Sundaland (Nicobar) commonly listed in Indian prep materials"),
        ("Endemism", "Species restricted to a region — Western Ghats endemics are frequent examples"),
        ("CBD", "Conservation, sustainable use, fair benefit sharing — three objectives"),
        ("Nagoya Protocol", "Access and benefit sharing operational focus under CBD family"),
        ("CITES", "Regulates international trade in listed specimens via permits/appendices logic"),
        ("CMS", "Convention on Migratory Species — migratory wild animals cooperation"),
        ("Cartagena Protocol", "Biosafety/LMOs — distinct from Nagoya ABS; do not merge"),
        ("Aichi to GBF", "Global biodiversity framework evolution — know that targets update; verify CA labels"),
        ("Invasive alien species", "CBD concern; domestic examples appear in GS"),
        ("Protected area ≠ hotspot", "Hotspot is a scientific priority label; PA is a legal/management tool"),
        ("Benefit sharing", "Genetic resources and traditional knowledge ethics/politics"),
        ("Appendices idea", "CITES lists species with different trade strictness"),
        ("Migratory flyways", "Bird migration links CMS and national wetland policies"),
        ("ABS institutions India", "Biodiversity Act architecture awareness at outline level"),
        ("Marine biodiversity", "Beyond forests — reefs, mangroves, EEZ themes rising"),
        ("Community knowledge", "People’s biodiversity registers idea in domestic framework discussions"),
        ("Synthetic biology/digital sequence", "Emerging CA–static edge; only headline awareness needed"),
    ],
    traps=["Calling every Western Ghats forest a ‘hotspot unit’ without criteria","Mixing Cartagena (biosafety) with Nagoya (ABS)","Saying CITES bans all wildlife trade universally","Equating CBD with UNFCCC"],
    table={"title":"Convention purpose sheet","headers":["Instrument","Purpose one-liner"],"rows":[["CBD","Biodiversity objectives triad"],["Nagoya","ABS rules"],["Cartagena","Biosafety/LMOs"],["CITES","International trade regulation"],["CMS","Migratory species"]]},
    maps=["Western Ghats","Eastern Himalaya","Nicobar–Sundaland link","Indo-Burma fringe"],
    must=["Hotspot = richness/endemism + threat","India-related hotspot list","CBD triad","Nagoya≠Cartagena","CITES=trade","CMS=migratory"],
    india="Use Western Ghats endemism examples and Biodiversity Act/NBA outline. Refresh COP-CBD headlines lightly.",
    pyqAngle="Definition of hotspot; match convention↔purpose; India hotspot list statements.",
    examSpine="Criteria → India list → convention purpose table → ABS/biosafety split.",
))

print(f"banks so far {len(BANKS)}")
# Save partial and continue via exec of more banks in same file below
