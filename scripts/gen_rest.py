from pathlib import Path
import json
ROOT = Path("src/data/quizzes")

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

def emit_mcq(path, export_name, questions):
    lines = ['import type { QuizQuestion } from "@/types";', "", f"export const {export_name}: QuizQuestion[] = ["]
    for q in questions:
        lines.append("  {")
        for k, v in q.items():
            if isinstance(v, str):
                lines.append(f"    {k}: {ts_str(v)},")
            elif isinstance(v, bool):
                lines.append(f"    {k}: {'true' if v else 'false'},")
            elif isinstance(v, list):
                lines.append(f"    {k}: [{', '.join(ts_str(x) for x in v)}],")
            else:
                lines.append(f"    {k}: {v},")
        lines.append("  },")
    lines.append("];\n")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))
    return len(questions)

def emit_mains(path, export_name, prompts):
    lines = ['import type { MainsPrompt } from "@/types";', "", f"export const {export_name}: MainsPrompt[] = ["]
    for q in prompts:
        lines.append("  {")
        for k, v in q.items():
            if isinstance(v, str):
                lines.append(f"    {k}: {ts_str(v)},")
            elif isinstance(v, bool):
                lines.append(f"    {k}: {'true' if v else 'false'},")
            elif isinstance(v, list):
                lines.append(f"    {k}: [{', '.join(ts_str(x) for x in v)}],")
            else:
                lines.append(f"    {k}: {v},")
        lines.append("  },")
    lines.append("];\n")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))
    return len(prompts)

def Q(i, prefix, subjectId, paperId, question, options, correctIndex, explanation, topicId=None, yearTag=None):
    d = dict(id=f"q-{prefix}-{i}", subjectId=subjectId, paperId=paperId, question=question, options=options,
             correctIndex=correctIndex, explanation=explanation, illustrative=True)
    if topicId: d["topicId"] = topicId
    if yearTag: d["yearTag"] = yearTag
    return d

def build(prefix, subjectId, paperId, rows):
    return [Q(i, prefix, subjectId, paperId, *r) for i, r in enumerate(rows, 1)]

# Load banks from JSON for reliability
banks = json.loads(Path("scripts/quiz_data.json").read_text())
for key, meta in banks["mcq"].items():
    n = emit_mcq(ROOT / meta["path"], meta["export"], build(meta["prefix"], meta["subjectId"], meta["paperId"], [tuple(x) for x in meta["rows"]]))
    print(key, n)
for key, meta in banks["mains"].items():
    prompts = []
    for i, p in enumerate(meta["rows"], 1):
        d = dict(id=f"m-{meta['prefix']}-{i}", subjectId=p["subjectId"], paperId=meta["paperId"], question=p["question"],
                 tags=p["tags"], marksHint=p["marksHint"], modelOutline=p["modelOutline"], keyPoints=p["keyPoints"], illustrative=True)
        if p.get("topicId"): d["topicId"] = p["topicId"]
        if p.get("yearTag"): d["yearTag"] = p["yearTag"]
        prompts.append(d)
    n = emit_mains(ROOT / meta["path"], meta["export"], prompts)
    print(key, n)
print("ALL OK")
