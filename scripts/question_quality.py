#!/usr/bin/env python3
"""Shared helpers: full AR/statement stems + teaching explanations for GS1 banks."""
from __future__ import annotations
import re
from collections import defaultdict
from typing import Any

# Curated expansions for common stub answers (article nos, schedules, keywords).
STUB_FULL: dict[str, str] = {
    "280": "Article 280 of the Constitution provides for a Finance Commission to recommend Centre–State financial distribution.",
    "263": "Article 263 provides for an Inter-State Council to inquire into and advise on inter-State disputes and coordination.",
    "312": "Article 312 empowers Parliament to create All-India Services common to the Union and the States.",
    "315": "Article 315 provides for Public Service Commissions for the Union and the States.",
    "148": "Article 148 provides for the Comptroller and Auditor-General of India (CAG).",
    "76": "Article 76 provides for the Attorney-General of India.",
    "324": "Article 324 vests superintendence of elections in the Election Commission of India.",
    "123": "Article 123 empowers the President to promulgate ordinances when Parliament is not in session.",
    "356": "Article 356 deals with failure of constitutional machinery in a State (President's Rule).",
    "72": "Article 72 empowers the President to grant pardons and related mercies.",
    "143": "Article 143 empowers the President to seek the Supreme Court's advisory opinion.",
    "108": "Article 108 provides for a joint sitting of both Houses of Parliament to resolve certain deadlocks on Bills.",
    "368": "Article 368 lays down the procedure for amending the Constitution.",
    "61": "Article 61 lays down the procedure for impeachment of the President.",
    "21A": "Article 21A makes free and compulsory education a Fundamental Right for children aged 6–14.",
    "19": "Article 19 protects certain freedoms such as speech, assembly, association, movement, residence and profession.",
    "32": "Article 32 guarantees the right to move the Supreme Court for enforcement of Fundamental Rights.",
    "51A": "Article 51A enumerates the Fundamental Duties of citizens.",
    "Eighth Schedule": "The Eighth Schedule lists the languages recognised by the Constitution of India.",
    "Seventh": "The Seventh Schedule distributes legislative subjects among the Union, State and Concurrent Lists.",
    "Seventh Schedule": "The Seventh Schedule distributes legislative subjects among the Union, State and Concurrent Lists.",
    "Ninth": "The Ninth Schedule was originally meant to protect certain laws from Fundamental Rights challenges.",
    "Ninth Schedule": "The Ninth Schedule was originally meant to protect certain laws from Fundamental Rights challenges.",
    "Tenth": "The Tenth Schedule contains anti-defection provisions for legislators.",
    "Tenth Schedule": "The Tenth Schedule contains anti-defection provisions for legislators.",
    "Eleventh": "The Eleventh Schedule lists subjects for Panchayats (73rd Amendment).",
    "Sixth Schedule": "The Sixth Schedule provides for administration of tribal areas in Assam, Meghalaya, Tripura and Mizoram.",
    "Part III": "Part III of the Constitution (Articles 12–35) contains the Fundamental Rights.",
    "Part II": "Part II of the Constitution deals with citizenship.",
    "Part IV": "Part IV of the Constitution contains the Directive Principles of State Policy.",
    "Part IV-A": "Part IV-A of the Constitution contains the Fundamental Duties.",
    "Part IX": "Part IX of the Constitution deals with Panchayats (73rd Amendment).",
    "Part VIII": "Part VIII of the Constitution deals with Union Territories.",
    "Part X": "Part X of the Constitution deals with Scheduled and Tribal Areas.",
    "Part VI": "Part VI of the Constitution deals with the States.",
    "Lok Sabha": "The Lok Sabha is the House of the People; Money Bills can be introduced only there.",
    "Rajya Sabha": "The Rajya Sabha is the Council of States in Parliament.",
    "Speaker of Lok Sabha": "The Speaker of the Lok Sabha finally decides whether a Bill is a Money Bill under Article 110(3).",
    "Quo warranto": "Quo warranto is the writ used to question a person's legal right to hold a public office.",
    "Mandamus": "Mandamus is a writ commanding a public authority to perform a public duty.",
    "Certiorari": "Certiorari is a writ by which a higher court quashes an order of a lower court or tribunal.",
    "Prohibition": "Prohibition is a writ restraining a lower court or tribunal from exceeding its jurisdiction.",
    "Habeas Corpus": "Habeas Corpus requires production of a detained person before a court to examine the legality of detention.",
    "Producing a detained person before court": "Habeas Corpus requires producing a detained person before a court to examine the legality of detention.",
    "61st": "The 61st Constitutional Amendment reduced the voting age from 21 to 18 years.",
    "42nd": "The 42nd Amendment (1976) made far-reaching changes, including adding Fundamental Duties.",
    "44th": "The 44th Amendment (1978) reversed several Emergency-era changes and strengthened safeguards.",
    "52nd Amendment": "The 52nd Amendment inserted the Tenth Schedule (anti-defection law).",
    "73rd": "The 73rd Amendment constitutionalised Panchayati Raj (Part IX and Eleventh Schedule).",
    "86th Amendment": "The 86th Amendment inserted Article 21A (Right to Education).",
    "Articles 105 and 194": "Articles 105 and 194 provide parliamentary privileges for Parliament and State legislatures.",
    "Constitutional body": "A constitutional body is one created directly by the Constitution (e.g. ECI, CAG, UPSC, Finance Commission).",
    "Traffic in human beings and forced labour": "Articles 23–24 (Right against Exploitation) prohibit traffic in human beings and forced labour, and child labour in hazardous work.",
    "Failure of constitutional machinery in a State": "Article 356 addresses failure of constitutional machinery in a State, enabling President's Rule.",
    "Repo is a key policy rate": "The repo rate is a key monetary policy rate at which RBI lends to banks against eligible securities.",
    "MPC decides the policy rate": "The Monetary Policy Committee (MPC) decides the policy repo rate framework in India.",
    "CAD reflects external imbalance": "The Current Account Deficit (CAD) reflects an external imbalance when current payments exceed current receipts.",
    "Forex reserves are managed by RBI": "India's foreign exchange reserves are managed by the Reserve Bank of India.",
    "They are justiciable": "Fundamental Rights are justiciable and enforceable in courts.",
    "They are non-justiciable": "Directive Principles of State Policy are non-justiciable.",
    "They aim to establish a welfare state": "Directive Principles aim to establish a welfare state.",
    "It is a permanent House": "The Rajya Sabha is a permanent House and is not subject to dissolution.",
    "One-third members retire every second year": "One-third of Rajya Sabha members retire every second year.",
    "It is a court of record": "The Supreme Court is a court of record.",
    "Its precedents bind all courts under Art. 141": "Supreme Court precedents bind all courts in India under Article 141.",
    "India has a dual polity": "India has a dual polity — a Union of States with federal features.",
    "Residuary powers vest in the Union": "Residuary legislative powers vest in the Union Parliament.",
    "Article 32 is itself a Fundamental Right": "Article 32 (constitutional remedies) is itself a Fundamental Right.",
    "Budget is presented by Finance Minister": "The Union Budget is presented by the Finance Minister.",
    "Fiscal deficit is a key indicator": "Fiscal deficit is a key indicator of the government's borrowing requirement.",
    "RBI is the lender of last resort": "The RBI acts as lender of last resort for banks.",
    "CPI is used for targeting": "CPI is the nominal anchor used for India's inflation targeting framework.",
    "Green hydrogen uses renewables": "Green hydrogen is produced using renewable energy (typically electrolysis).",
    "Nuclear PHWRs are part of India programme": "Pressurised Heavy Water Reactors (PHWRs) are a core part of India's nuclear power programme.",
}


def _clean(s: str) -> str:
    return " ".join(s.replace("\\n", "\n").split())


def correct_text(fact: dict[str, Any]) -> str:
    opts = fact["options"]
    idx = int(fact.get("correctIndex", 0))
    if idx < 0 or idx >= len(opts):
        idx = 0
    return opts[idx].strip()


def to_full_sentence(question: str, correct: str, explanation: str = "") -> str:
    """Build a complete declarative sentence from an MCQ fact."""
    q = _clean(question)
    c = correct.strip().rstrip(".")
    exp = _clean(explanation) if explanation else ""

    if c in STUB_FULL:
        return STUB_FULL[c]
    # Exact key variants
    for key, full in STUB_FULL.items():
        if c.lower() == key.lower():
            return full

    # Already a full clause
    words = c.split()
    if len(words) >= 8 or (len(words) >= 5 and c[0].isupper() and any(w.lower() in {"is", "are", "was", "were", "provides", "means", "includes", "deals", "contains"} for w in words)):
        return c if c.endswith(".") else c + "."

    if q.endswith(":"):
        head = q[:-1].strip()
        # "Finance Commission is under Article:" + "280"
        sent = f"{head} {c}."
        return sent[0].upper() + sent[1:]

    stem = q[:-1].strip() if q.endswith("?") else q

    # Prefer a decent explanation as the sentence when stubby correct
    if exp and len(exp) >= 35 and "illustrative AR" not in exp and "Prelims-relevant" not in exp:
        # If explanation is only "Article 280." try STUB or combine
        if exp.rstrip(".") in STUB_FULL:
            return STUB_FULL[exp.rstrip(".")]
        if len(exp) >= 45:
            return exp if exp.endswith(".") else exp + "."

    m = re.match(r"^(Which|Who|What|Whose|Where|When)\s+(.+)$", stem, re.I)
    if m:
        rest = m.group(2).strip()
        # "Which Part of the Constitution contains Fundamental Rights?" + Part III
        # → "Part III is the Part of the Constitution that contains Fundamental Rights."
        rest_l = rest[0].lower() + rest[1:] if rest else rest
        # Avoid "is the which"
        if rest_l.startswith(("of the ", "one of ", "among ")):
            return f"Regarding '{stem}', the correct fact is that it is {c}."
        return f"{c} is the {rest_l}."

    if stem.lower().startswith("with reference"):
        return f"{c}." if len(c) > 40 else f"The correct statement is: {c}."

    # "Rowlatt Act year:" / "1919" → "The Rowlatt Act was enacted in 1919."
    if stem.lower().endswith(" year") or stem.lower().endswith(" year:"):
        topic = stem[: -len(" year")].rstrip(":").strip()
        return f"The {topic} was in {c}."
    if " year" in stem.lower() and len(c) <= 6 and c.replace(".", "").isdigit():
        topic = stem.replace(" year", "").replace("Year", "").strip(" :?")
        return f"The {topic} dates to {c}."

    # Avoid meta "Prelims-relevant fact is" when we can join stem + correct
    if len(c.split()) <= 6:
        # "Qutub Minar is in:" style already handled by colon branch
        return f"{stem} {c}." if not stem.endswith(c) else (c if c.endswith(".") else c + ".")

    return f"{stem}: {c}."


def enrich_fact_explanation(question: str, correct: str, explanation: str, subject: str = "") -> str:
    """2–5 sentence teaching explanation for a standard MCQ."""
    exp = _clean(explanation or "")
    sentence = to_full_sentence(question, correct, exp)
    bad_filler = (
        not exp
        or "illustrative AR" in exp
        or exp.lower().startswith("both statements plausible")
        or len(exp) < 28
    )
    if not bad_filler and len(exp) >= 90:
        # Already rich enough; ensure it teaches the fact
        if sentence.lower()[:40] not in exp.lower():
            return f"Why the correct option is right: {exp} In short: {sentence}"
        return exp if exp.endswith(".") else exp + "."

    bits = [
        f"Why the correct option is right: {sentence}",
    ]
    if exp and exp not in sentence and "illustrative" not in exp.lower() and len(exp) >= 8:
        # Keep any useful fragment
        frag = exp if exp.endswith(".") else exp + "."
        if frag.lower() not in sentence.lower():
            bits.append(frag)
    sub = subject or "this Prelims theme"
    bits.append(
        f"Wrong options typically mix up neighbouring {sub} facts (similar articles, schedules, institutions or definitions) — eliminate by matching the precise constitutional/economic meaning asked."
    )
    return " ".join(bits)


def _about_clause(sent: str, exp: str) -> str:
    """Prefer a clean factual clause for About A / About R (not a full MCQ wrap)."""
    e = (exp or "").strip()
    # Strip leading "Why the correct option is right:" wrappers
    e = re.sub(r"^Why the correct option is right:\s*", "", e, flags=re.I)
    # Take first sentence if the rest is generic wrong-option advice
    if "Wrong options typically" in e:
        e = e.split("Wrong options typically")[0].strip()
    if e and len(e) > 25 and "illustrative" not in e.lower():
        return e if e.endswith(".") else e + "."
    return sent if sent.endswith(".") else sent + "."


def ar_explanation(sent_a: str, sent_r: str, exp_a: str, exp_r: str, explains: bool) -> str:
    """Rich AR explanation evaluating A, R, and linkage."""
    about_a = _about_clause(sent_a, exp_a)
    about_r = _about_clause(sent_r, exp_r)

    if explains:
        why = (
            "Why A is correct: Both Assertion and Reason are true, and Reason correctly explains Assertion — "
            "R supplies the constitutional/economic rationale for A."
        )
        link = f"Linkage: {sent_r.rstrip('.')} is the reason why {sent_a.rstrip('.')}."
        letter = "A"
    else:
        why = (
            "Why B is correct: Both Assertion (A) and Reason (R) are true as stand-alone facts, "
            "but R does not explain A — they address different topics."
        )
        link = (
            f"Linkage: A concerns ({sent_a.rstrip('.')}), while R concerns ({sent_r.rstrip('.')}). "
            "These are independent Prelims facts, so R is not the explanation of A."
        )
        letter = "B"
    return (
        f"{why}\n\n"
        f"About A: {about_a}\n\n"
        f"About R: {about_r}\n\n"
        f"{link}"
    )


def statements_explanation(sent1: str, sent2: str, exp1: str, exp2: str) -> str:
    e1 = exp1 if exp1 and len(exp1) > 20 else sent1
    e2 = exp2 if exp2 and len(exp2) > 20 else sent2
    if not e1.endswith("."):
        e1 += "."
    if not e2.endswith("."):
        e2 += "."
    return (
        "Why C is correct: Both statements are true on standard Prelims facts.\n\n"
        f"Statement 1: {e1}\n\n"
        f"Statement 2: {e2}\n\n"
        "Neither statement is false; do not reject a true fact merely because it sits beside an unrelated true fact."
    )


def linkage_explains(topic_a: str, topic_b: str, sent_a: str, sent_r: str) -> bool:
    """Heuristic: only mark R explains A when topics match closely and text overlaps."""
    if topic_a and topic_b and topic_a == topic_b:
        wa = set(re.findall(r"[a-z0-9]+", sent_a.lower()))
        wr = set(re.findall(r"[a-z0-9]+", sent_r.lower()))
        stop = {"the", "a", "an", "of", "and", "or", "to", "in", "for", "is", "are", "on", "by", "as", "that", "with"}
        wa -= stop
        wr -= stop
        if len(wa & wr) >= 3:
            return True
    return False


def make_variants(facts: list[dict], start: int = 1) -> list[dict]:
    """Create Consider / With-reference / Assertion–Reason variants with full stems."""
    out: list[dict] = []
    n = start
    by: dict[str, list] = defaultdict(list)
    for f in facts:
        by[f["subjectId"]].append(f)
    for sub, flist in by.items():
        for i in range(0, len(flist) - 1, 2):
            a, b = flist[i], flist[i + 1]
            ca, cb = correct_text(a), correct_text(b)
            sa = to_full_sentence(a["question"], ca, a.get("explanation", ""))
            sb = to_full_sentence(b["question"], cb, b.get("explanation", ""))
            ea = enrich_fact_explanation(a["question"], ca, a.get("explanation", ""), sub)
            eb = enrich_fact_explanation(b["question"], cb, b.get("explanation", ""), sub)

            out.append({
                "id": f"tmp-{n}", "subjectId": sub, "paperId": "prelims-gs",
                "question": (
                    f"Consider the following statements:\n1. {sa}\n2. {sb}\n"
                    "Which of the statements given above is/are correct?"
                ),
                "options": ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
                "correctIndex": 2,
                "explanation": statements_explanation(sa, sb, ea, eb),
                "illustrative": True, "topicId": a["topicId"],
                "nextExamChance": max(76, min(a["nextExamChance"], b["nextExamChance"]) - 2),
            })
            n += 1

            out.append({
                "id": f"tmp-{n}", "subjectId": sub, "paperId": "prelims-gs",
                "question": f"With reference to {sub}, which one of the following is correct?",
                "options": [
                    sa,
                    f"It is incorrect that: {sa}",
                    "This theme has no relevance to the Indian polity, economy or environment syllabus.",
                    "The fact applies only outside India with no domestic constitutional or policy link.",
                ],
                "correctIndex": 0,
                "explanation": ea,
                "illustrative": True,
                "topicId": a["topicId"],
                "nextExamChance": max(75, a["nextExamChance"] - 3),
            })
            n += 1

            explains = linkage_explains(a.get("topicId", ""), b.get("topicId", ""), sa, sb)
            out.append({
                "id": f"tmp-{n}", "subjectId": sub, "paperId": "prelims-gs",
                "question": f"Assertion (A): {sa}\nReason (R): {sb}\nSelect the correct option:",
                "options": [
                    "Both A and R true and R explains A",
                    "Both A and R true but R does not explain A",
                    "A true, R false",
                    "A false, R true",
                ],
                "correctIndex": 0 if explains else 1,
                "explanation": ar_explanation(sa, sb, ea, eb, explains),
                "illustrative": True, "topicId": a["topicId"],
                "nextExamChance": max(74, min(a["nextExamChance"], b["nextExamChance"]) - 4),
            })
            n += 1
    return out
