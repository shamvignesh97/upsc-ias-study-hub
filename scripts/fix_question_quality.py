#!/usr/bin/env python3
"""Patch GS1 mock pools/papers and quiz banks: full AR stems + rich explanations."""
from __future__ import annotations
import re
import sys
from pathlib import Path
from collections import defaultdict

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
ROOT = SCRIPTS.parent
MOCKS = ROOT / "src/data/mocks"
QUIZZES = ROOT / "src/data/quizzes/prelims-gs"

from question_quality import (
    to_full_sentence,
    enrich_fact_explanation,
    ar_explanation,
    statements_explanation,
    linkage_explains,
    correct_text,
    STUB_FULL,
    make_variants,
)

PARSE = re.compile(
    r'\{\s*id:\s*"(?P<id>[^"]+)",\s*subjectId:\s*"(?P<subjectId>[^"]+)",\s*paperId:\s*"(?P<paperId>[^"]+)",\s*question:\s*"(?P<question>(?:\\.|[^"\\])*)",\s*options:\s*\[(?P<options>.*?)\],\s*correctIndex:\s*(?P<correctIndex>\d+),\s*explanation:\s*"(?P<explanation>(?:\\.|[^"\\])*)",\s*illustrative:\s*true,\s*topicId:\s*"(?P<topicId>[^"]+)",\s*nextExamChance:\s*(?P<nextExamChance>\d+)(?:,\s*section:\s*"(?P<section>[^"]+)")?\s*,?\s*\}',
    re.S,
)

QUIZ_PARSE = re.compile(
    r'\{\s*id:\s*"(?P<id>[^"]+)",\s*subjectId:\s*"(?P<subjectId>[^"]+)",\s*paperId:\s*"(?P<paperId>[^"]+)",\s*question:\s*"(?P<question>(?:\\.|[^"\\])*)",\s*options:\s*\[(?P<options>.*?)\],\s*correctIndex:\s*(?P<correctIndex>\d+),\s*explanation:\s*"(?P<explanation>(?:\\.|[^"\\])*)",\s*illustrative:\s*true,\s*topicId:\s*"(?P<topicId>[^"]+)",\s*yearTag:\s*(?P<yearTag>\d+)\s*,?\s*\}',
    re.S,
)


def unesc(s: str) -> str:
    """Decode TS escapes; repair over-escaped newlines (\n, \\n, \\\n → newline)."""
    out: list[str] = []
    i = 0
    n = len(s)
    while i < n:
        if s[i] == "\\":
            j = i
            while j < n and s[j] == "\\":
                j += 1
            run = j - i
            if j < n and s[j] == "n":
                out.append("\n")
                i = j + 1
                continue
            if j < n and s[j] == '"':
                out.append('"')
                i = j + 1
                continue
            # preserve unpaired backslashes reduced
            out.append("\\" * max(1, run // 2) if run > 1 else "\\")
            i = j
            continue
        out.append(s[i])
        i += 1
    return "".join(out)


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def parse_qs(path: Path):
    text = path.read_text()
    items = []
    for m in PARSE.finditer(text):
        d = m.groupdict()
        d["options"] = [unesc(x) for x in re.findall(r'"((?:\\.|[^"\\])*)"', d["options"])]
        d["correctIndex"] = int(d["correctIndex"])
        d["nextExamChance"] = int(d["nextExamChance"])
        d["question"] = unesc(d["question"])
        d["explanation"] = unesc(d["explanation"])
        items.append(d)
    return items


def fmt_q(q: dict) -> str:
    opts = ", ".join(f'"{esc(o)}"' for o in q["options"])
    lines = [
        "  {",
        f'    id: "{q["id"]}",',
        f'    subjectId: "{q["subjectId"]}",',
        f'    paperId: "{q["paperId"]}",',
        f'    question: "{esc(q["question"])}",',
        f"    options: [{opts}],",
        f'    correctIndex: {q["correctIndex"]},',
        f'    explanation: "{esc(q["explanation"])}",',
        "    illustrative: true,",
        f'    topicId: "{q["topicId"]}",',
        f'    nextExamChance: {q["nextExamChance"]},',
    ]
    if q.get("section"):
        lines.append(f'    section: "{q["section"]}",')
    lines.append("  },")
    return "\n".join(lines)


def write_export(path: Path, name: str, items: list):
    body = "\n".join(fmt_q(q) for q in items)
    path.write_text(
        f'import type {{ MockQuestion }} from "@/types";\n\nexport const {name}: MockQuestion[] = [\n{body}\n];\n'
    )


def is_variant(q: dict) -> str | None:
    """Detect auto-generated thin variants only (not handcrafted multi-statement MCQs)."""
    qu = q["question"]
    if qu.startswith("Assertion (A):"):
        return "ar"
    # Auto-gen form has NO "about …" clause between "statements" and the colon.
    if qu.startswith("Consider the following statements:\n1.") or qu.startswith(
        "Consider the following statements:\n1."
    ):
        if "Which of the statements given above is/are correct?" in qu:
            return "consider"
    # Also match if newlines were not yet normalized (defensive)
    if qu.startswith("Consider the following statements:") and "\n1." in qu:
        # Exclude "statements about X:"
        head = qu.split("\n", 1)[0]
        if head == "Consider the following statements:" and "Which of the statements given above is/are correct?" in qu:
            return "consider"
    if qu.startswith("With reference to ") and "which one of the following is correct?" in qu:
        opts = q["options"]
        if opts and (
            opts[1].startswith("Opposite of:")
            or opts[1].startswith("It is incorrect that:")
        ):
            return "withref"
    return None


def build_indexes(base_facts: list[dict]):
    by_correct: dict[str, list] = defaultdict(list)
    by_frag: dict[str, list] = defaultdict(list)
    for f in base_facts:
        c = correct_text(f)
        by_correct[c].append(f)
        by_correct[c.rstrip(".")].append(f)
        # also index explanation stubs like "Article 280."
        exp = f.get("explanation", "").strip().rstrip(".")
        if exp:
            by_frag[exp].append(f)
        # numeric-only / short keys
        if re.fullmatch(r"\d+[A-Za-z]?", c) or len(c.split()) <= 4:
            by_frag[c].append(f)
    return by_correct, by_frag


def resolve_stub(stub: str, subject: str, by_correct, by_frag, base_facts: list | None = None) -> tuple[str, str, dict | None]:
    """Return (full_sentence, explanation, fact_or_None) for a stub stem."""
    s = stub.strip().rstrip(".")
    # Already a decent sentence?
    if len(s.split()) >= 8 and not re.fullmatch(r"[\dA-Za-z.\-'' ]{1,20}", s):
        sent = s if s.endswith(".") else s + "."
        return sent, sent, None

    if s in STUB_FULL:
        full = STUB_FULL[s]
        return full, full, None
    for key, full in STUB_FULL.items():
        if s.lower() == key.lower():
            return full, full, None

    candidates = by_correct.get(s, []) + by_correct.get(s + ".", []) + by_frag.get(s, [])
    seen = set()
    uniq = []
    for f in candidates:
        if f["id"] in seen:
            continue
        seen.add(f["id"])
        uniq.append(f)
    same = [f for f in uniq if f["subjectId"] == subject]
    pick = (same or uniq)[0] if (same or uniq) else None
    if pick:
        c = correct_text(pick)
        sent = to_full_sentence(pick["question"], c, pick.get("explanation", ""))
        exp = enrich_fact_explanation(pick["question"], c, pick.get("explanation", ""), pick["subjectId"])
        return sent, exp, pick

    # Context from multi-statement questions that contain this fragment
    if base_facts:
        for f in base_facts:
            if f.get("subjectId") != subject:
                continue
            qtext = f.get("question", "")
            if s not in qtext:
                continue
            m = re.search(r"statements about ([^:\n]+)", qtext)
            topic = m.group(1).strip() if m else ""
            low = s.lower()
            if topic and low.startswith("they are "):
                sent = f"{topic} are {s[9:]}."
            elif topic and low.startswith("it is "):
                sent = f"Regarding {topic}: {s}."
            elif topic:
                sent = f"Regarding {topic}: {s}."
            else:
                sent = to_full_sentence(qtext.split("\n")[0], s, f.get("explanation", ""))
            exp = enrich_fact_explanation(qtext, s, f.get("explanation", ""), subject)
            return sent if sent.endswith(".") else sent + ".", exp, f

    if re.fullmatch(r"\d+[A-Za-z]?", s):
        sent = f"Article {s} is a constitutionally significant provision tested in Prelims."
        return sent, sent, None
    # Last resort: grammatical join without meta filler
    sent = s if s.endswith(".") else s + "."
    return sent, sent, None



def parse_ar_stems(question: str) -> tuple[str, str] | None:
    m = re.match(
        r"Assertion \(A\):\s*(.+?)\nReason \(R\):\s*(.+?)\nSelect the correct option:\s*$",
        question,
        re.S,
    )
    if not m:
        # try with literal \n still present
        m = re.match(
            r"Assertion \(A\):\s*(.+?)\\nReason \(R\):\s*(.+?)\\nSelect the correct option:\s*$",
            question,
            re.S,
        )
    if not m:
        return None
    return m.group(1).strip(), m.group(2).strip()


def parse_consider_stems(question: str) -> tuple[str, str] | None:
    m = re.match(
        r"Consider the following statements:\n1\.\s*(.+?)\n2\.\s*(.+?)\nWhich of the statements",
        question,
        re.S,
    )
    if not m:
        return None
    return m.group(1).strip(), m.group(2).strip()


def fix_question(q: dict, by_correct, by_frag, base_facts: list | None = None) -> dict:
    q = dict(q)
    kind = is_variant(q)
    sub = q["subjectId"]

    if kind == "ar":
        stems = parse_ar_stems(q["question"])
        if stems:
            a_stub, r_stub = stems
            sa, ea, fa = resolve_stub(a_stub, sub, by_correct, by_frag, base_facts)
            sr, er, fr = resolve_stub(r_stub, sub, by_correct, by_frag, base_facts)
            topic_a = fa["topicId"] if fa else q.get("topicId", "")
            topic_b = fr["topicId"] if fr else q.get("topicId", "")
            explains = linkage_explains(topic_a, topic_b, sa, sr)
            q["question"] = f"Assertion (A): {sa}\nReason (R): {sr}\nSelect the correct option:"
            q["correctIndex"] = 0 if explains else 1
            q["explanation"] = ar_explanation(sa, sr, ea, er, explains)
        return q

    if kind == "consider":
        stems = parse_consider_stems(q["question"])
        if stems:
            s1, s2 = stems
            sa, ea, _ = resolve_stub(s1, sub, by_correct, by_frag, base_facts)
            sb, eb, _ = resolve_stub(s2, sub, by_correct, by_frag, base_facts)
            q["question"] = (
                f"Consider the following statements:\n1. {sa}\n2. {sb}\n"
                "Which of the statements given above is/are correct?"
            )
            q["correctIndex"] = 2
            q["explanation"] = statements_explanation(sa, sb, ea, eb)
        return q

    if kind == "withref":
        # Expand option 0 (and option 1 mirror)
        ca = q["options"][0]
        # Strip "Opposite of: " / old form
        stub = ca
        sa, ea, _ = resolve_stub(stub, sub, by_correct, by_frag, base_facts)
        q["options"] = [
            sa,
            f"It is incorrect that: {sa}",
            "This theme has no relevance to the Indian polity, economy or environment syllabus.",
            "The fact applies only outside India with no domestic constitutional or policy link.",
        ]
        q["correctIndex"] = 0
        q["explanation"] = ea
        return q

    # Base MCQ — enrich thin explanations
    c = correct_text(q)
    q["explanation"] = enrich_fact_explanation(q["question"], c, q.get("explanation", ""), sub)
    return q


def export_name_for(path: Path) -> str:
    # gs1-pool.ts -> gs1MockPool; gs1-paper-e.ts -> gs1PaperE
    name = path.stem
    if name == "gs1-pool":
        return "gs1MockPool"
    if name == "csat-pool":
        return "csatMockPool"
    m = re.match(r"(gs1|csat)-paper-([a-f])$", name)
    if m:
        return f"{m.group(1)}Paper{m.group(2).upper()}"
    raise SystemExit(f"Unknown export for {path}")


def fix_mocks():
    pool_path = MOCKS / "gs1-pool.ts"
    pool = parse_qs(pool_path)
    base = [q for q in pool if not is_variant(q)]
    by_correct, by_frag = build_indexes(base)
    print(f"GS1 pool {len(pool)} base={len(base)}")

    fixed_pool = [fix_question(q, by_correct, by_frag, base) for q in pool]
    write_export(pool_path, "gs1MockPool", fixed_pool)

    # Spot-check 280 / Eighth
    for q in fixed_pool:
        if "Finance Commission" in q["question"] and "Eighth Schedule" in q["question"] and q["question"].startswith("Assertion"):
            print("--- SAMPLE AR ---")
            print(q["question"])
            print(q["explanation"][:500])
            break

    for key in "abcdef":
        p = MOCKS / f"gs1-paper-{key}.ts"
        if not p.exists():
            continue
        items = parse_qs(p)
        # Also index paper's own base facts
        paper_base = [q for q in items if not is_variant(q)]
        bc, bf = build_indexes(base + paper_base)
        fixed = [fix_question(q, bc, bf, base + paper_base) for q in items]
        write_export(p, f"gs1Paper{key.upper()}", fixed)
        ar_n = sum(1 for q in fixed if q["question"].startswith("Assertion"))
        filler = sum(1 for q in fixed if "illustrative AR" in q["explanation"])
        print(f"paper {key}: {len(fixed)} AR={ar_n} filler_left={filler}")


def parse_quiz(path: Path):
    text = path.read_text()
    items = []
    for m in QUIZ_PARSE.finditer(text):
        d = m.groupdict()
        d["options"] = [unesc(x) for x in re.findall(r'"((?:\\.|[^"\\])*)"', d["options"])]
        d["correctIndex"] = int(d["correctIndex"])
        d["yearTag"] = int(d["yearTag"])
        d["question"] = unesc(d["question"])
        d["explanation"] = unesc(d["explanation"])
        items.append(d)
    return items


def fmt_quiz(q: dict) -> str:
    opts = ", ".join(f'"{esc(o)}"' for o in q["options"])
    return "\n".join([
        "  {",
        f'    id: "{q["id"]}",',
        f'    subjectId: "{q["subjectId"]}",',
        f'    paperId: "{q["paperId"]}",',
        f'    question: "{esc(q["question"])}",',
        f"    options: [{opts}],",
        f'    correctIndex: {q["correctIndex"]},',
        f'    explanation: "{esc(q["explanation"])}",',
        "    illustrative: true,",
        f'    topicId: "{q["topicId"]}",',
        f'    yearTag: {q["yearTag"]},',
        "  },",
    ])


def quiz_export_name(path: Path) -> str:
    # polity.ts -> polityQuestions
    return f"{path.stem}Questions"


def fix_quizzes():
    for path in sorted(QUIZZES.glob("*.ts")):
        items = parse_quiz(path)
        if not items:
            print(f"skip quiz {path.name} (parse 0)")
            continue
        fixed = []
        for q in items:
            c = correct_text(q)
            nq = dict(q)
            nq["explanation"] = enrich_fact_explanation(
                q["question"], c, q.get("explanation", ""), q["subjectId"]
            )
            fixed.append(nq)
        body = "\n".join(fmt_quiz(q) for q in fixed)
        # Preserve import type name from file
        export = quiz_export_name(path)
        # Check existing export const name
        m = re.search(r"export const (\w+)", path.read_text())
        if m:
            export = m.group(1)
        path.write_text(
            f'import type {{ QuizQuestion }} from "@/types";\n\nexport const {export}: QuizQuestion[] = [\n{body}\n];\n'
        )
        avg = sum(len(q["explanation"]) for q in fixed) / len(fixed)
        print(f"quiz {path.name}: {len(fixed)} avg_expl={avg:.0f}")


def main():
    fix_mocks()
    fix_quizzes()
    print("done")


if __name__ == "__main__":
    main()
