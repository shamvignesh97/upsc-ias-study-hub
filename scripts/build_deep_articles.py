#!/usr/bin/env python3
"""Build deep StudyArticle TS modules from fact banks + handcrafted overrides.

No Micro-drill / page-padding / meta study spam. Output is exam study substance only.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/articles/deep"
OUT.mkdir(parents=True, exist_ok=True)
BANKS_PATH = ROOT / "scripts/article_banks.json"
HAND_PATH = ROOT / "scripts/handcrafted_articles.json"


def para(*sentences: str) -> str:
    return " ".join(s.strip() for s in sentences if s and s.strip())


def section(heading: str, *paragraphs: str) -> dict:
    body = "\n\n".join(p.strip() for p in paragraphs if p and p.strip())
    return {"heading": heading, "body": body}


# Thematic heading templates rotated across banks (substance, not meta).
THEME_HEADINGS = [
    "Core concepts and definitions",
    "Institutions, processes and mechanisms",
    "India angle and applied examples",
    "Comparisons, linkages and discriminators",
]


def facts_to_prose(chunk: list[list[str]]) -> str:
    """Turn label/text fact pairs into readable study paragraphs."""
    if not chunk:
        return ""
    sentences = []
    for label, text in chunk:
        label = str(label).strip().rstrip(".")
        text = str(text).strip().rstrip(".")
        if not text:
            continue
        # If text already starts with label-ish content, don't double.
        if text.lower().startswith(label.lower()):
            sentences.append(text + ".")
        else:
            sentences.append(f"{label}: {text}.")
    # Group into ~2 paragraphs
    if len(sentences) <= 3:
        return " ".join(sentences)
    mid = (len(sentences) + 1) // 2
    return " ".join(sentences[:mid]) + "\n\n" + " ".join(sentences[mid:])


def expand_from_bank(bank: dict) -> dict:
    """Expand a fact bank into a substantive StudyArticle (no filler sections)."""
    title = bank["title"]
    theme = bank["theme"]
    facts = bank["facts"]
    traps = list(bank.get("traps") or [])
    maps = list(bank.get("maps") or [])
    must = list(bank.get("must") or [])
    years = list(bank.get("years") or list(range(2016, 2026)))
    chance = bank["chance"]
    chance_note = bank["chanceNote"]
    why = bank["why"]
    pyq = list(bank["pyq"])
    slug = bank["slug"]
    topic = bank["topicId"]

    sections: list[dict] = []

    sections.append(
        section(
            "Syllabus framing",
            para(
                chance_note,
                f"This portion sits inside {topic} and centres on {theme}.",
                why,
            ),
            para(
                f"Recurring PYQ angles: {', '.join(pyq)}.",
                f"Approximate appearance years in the 2016-2025 educational synthesis: {', '.join(map(str, years))}.",
                "Use the chance percentage only to sequence study hours — it is not an official prediction.",
            ),
        )
    )

    # Opening core from first facts
    head = facts[:4]
    rest = facts[4:]
    sections.append(
        section(
            f"Core map of {theme}",
            facts_to_prose(head),
            para(
                "Hold this core map as your elimination spine before memorising peripheral CA overlays.",
            ),
        )
    )

    # Split remaining facts across thematic headings
    if rest:
        n = min(4, max(1, (len(rest) + 3) // 4))
        chunk_size = max(3, (len(rest) + n - 1) // n)
        for i in range(n):
            chunk = rest[i * chunk_size : (i + 1) * chunk_size]
            if not chunk:
                continue
            heading = THEME_HEADINGS[i] if i < len(THEME_HEADINGS) else f"Further notes ({i + 1})"
            # Prefer first fact label as a sharper heading when chunk is cohesive
            if len(chunk) >= 2:
                heading = THEME_HEADINGS[i % len(THEME_HEADINGS)]
            sections.append(section(heading, facts_to_prose(chunk)))

    # Optional hand-authored extra sections from banks (real prose)
    for es in bank.get("extraSections") or []:
        if es.get("heading") and es.get("body"):
            sections.append(section(str(es["heading"]), str(es["body"])))

    india = bank.get("india")
    if india:
        sections.append(
            section(
                "India angle",
                para(str(india)),
            )
        )

    pyq_angle = bank.get("pyqAngle")
    exam_spine = bank.get("examSpine")
    if pyq_angle or exam_spine:
        sections.append(
            section(
                "Question patterns and exam spine",
                para(str(pyq_angle)) if pyq_angle else "",
                para(f"Revision spine: {exam_spine}") if exam_spine else "",
                para(
                    "Eliminate anachronisms and category errors first, then test remaining options against table rows and must-remember triggers."
                ),
            )
        )

    if traps:
        sections.append(
            section(
                "Trap watch-list (specific)",
                para(" ".join(f"Avoid: {t}." for t in traps)),
            )
        )

    tables = []
    if bank.get("table"):
        tables.append(bank["table"])
    if bank.get("table2"):
        tables.append(bank["table2"])

    quick = list(
        bank.get("quick")
        or [
            "Reproduce main comparison table from memory",
            "List five must-remember triggers",
            "Name three specific traps",
            "One India anchor",
            "Ten mixed MCQs cold",
        ]
    )

    # Enrich thin must/traps/maps from facts if needed
    if len(must) < 4:
        must = must + [f"{a}" for a, _ in facts[:6] if a not in must]
    if len(maps) < 2 and any("map" in str(a).lower() or "site" in str(a).lower() for a, _ in facts):
        maps = maps + [f"{a}: {b}" for a, b in facts if re.search(r"site|map|place|region", a + b, re.I)][:4]

    return {
        "slug": slug,
        "topicId": topic,
        "title": title,
        "blurb": bank["blurb"],
        "portionChance": chance,
        "pyqThemes": pyq,
        "whyUpscAsks": why,
        "mapFacts": maps,
        "mustRemember": must[:10],
        "commonTraps": traps,
        "quickRevision": quick,
        "chanceNote": chance_note,
        "yearsAppeared": years,
        "tables": tables,
        "sections": sections,
    }


def ts_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def emit_article_ts(article: dict, indent: int = 2) -> str:
    """Emit a StudyArticle as TypeScript object literal (JSON-compatible subset)."""
    # JSON is valid TS for our data shape
    return json.dumps(article, ensure_ascii=False, indent=2)


def main() -> None:
    banks = json.loads(BANKS_PATH.read_text(encoding="utf-8"))
    hand = {}
    if HAND_PATH.exists():
        hand = json.loads(HAND_PATH.read_text(encoding="utf-8"))

    articles = []
    for bank in banks:
        slug = bank["slug"]
        if slug in hand:
            articles.append(hand[slug])
        else:
            articles.append(expand_from_bank(bank))

    # Also include any handcrafted not in banks
    bank_slugs = {b["slug"] for b in banks}
    for slug, art in hand.items():
        if slug not in bank_slugs:
            articles.append(art)

    body = ",\n".join(emit_article_ts(a) for a in articles)
    ts = f'''import type {{ StudyArticle }} from "../types";

/** Deep high-chance portion articles — substance only (no padding generators). */
export const deepArticles: StudyArticle[] = [
{body}
];

export function deepArticleKey(topicId: string, slug: string): string {{
  return `${{topicId}}::${{slug}}`;
}}

export const deepArticleMap: Record<string, StudyArticle> = Object.fromEntries(
  deepArticles.map((a) => [deepArticleKey(a.topicId, a.slug), a]),
);
'''
    out_file = OUT / "generated.ts"
    out_file.write_text(ts, encoding="utf-8")
    print(f"Wrote {len(articles)} deep articles → {out_file}")
    for a in articles:
        nsec = len(a.get("sections") or [])
        words = sum(len(str(s.get("body", "")).split()) for s in a.get("sections") or [])
        print(f"  {a['topicId']}/{a['slug']}: {nsec} sections, ~{words} section-words")


if __name__ == "__main__":
    main()
