# UPSC IAS Study Hub

A polished Next.js study companion for the Indian Civil Services (IAS/UPSC) exam — **study notes in-app**, **plain-language next-exam chances**, and **practice**.

## Features

- **Study mode** — Paper → Subject → Topic sequential reading with next/prev, progress tracking, revision cards
- **Rich topic notes** — key concepts, definitions, must-remember boxes, tables, common traps, subtopics (original notes; not verbatim NCERT/UPSC papers)
- **Chance next exam** — big % + plain language (e.g. “~82% chance in next Prelims GS Paper I”) + High/Med/Low + trend + years appeared + short why (PYQ-frequency formula)
- **Focus lists** — dashboard ranked list; syllabus sort/filter by chance
- **Full syllabus navigation** — Prelims GS & CSAT, Mains Essay + GS I–IV, Optional, Interview
- **Quiz / tests hub** — Prelims GS, CSAT, Mains prompts (lazy-loaded)
- **Prelims mocks** — full GS Paper I (100 Q) & CSAT (80 Q) with timer, negative marking, scorecard; Papers A–F from high-prob PYQ themes; Practice mode shows correct answer + explanation on wrong click
- **Weak-area coach** — post-mock ranked weak topics (wrong + unattempted) with Study links and “Rebuild my 7-day plan” (high-prob + weak mix in localStorage)
- **Daily Drill** — `/drill` · 10 GS1-weighted high-chance Qs/day · stable seed · streak + best streak
- **Attempt analytics** — `/analytics` · scores over time, GS1 vs CSAT, subject averages, cutoff proximity
- **Coach tips** — Focus cards & topic pages: why the theme appears + 20-min revise plan
- **PYQ-style practice**, planner, bookmarks, search
- **PWA** — installable; offline shell after first visit

> Probabilities are **estimates for study prioritisation**, not official UPSC predictions.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Client-side data (TS modules) — no backend required
- PWA via `@serwist/turbopack`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — Study / Focus / Practice |
| `/study` | Study mode hub |
| `/study/[paperId]/[subjectId]` | Sequential subject study (+ `?topic=`) |
| `/syllabus` | Focus browser (sort/filter by chance) |
| `/topic/[topicId]` | Topic notes, chance meter, revision cards |
| `/quiz` | Practice hub |
| `/mock` | Prelims mock tests (GS1 + CSAT) |
| `/mock/exam/[kind]/[paperKey]` | Full-screen mock exam |
| `/drill` | Daily 10-Q high-chance drill + streak |
| `/analytics` | Mock attempt analytics & cutoff proximity |
| `/pyq` | PYQ-style practice |
| `/planner` | Study planner |
| `/optional` | Optional subjects |
| `/interview` | Interview tips |
| `/methodology` | How chance % is derived |

## License

Educational MVP for personal study use.
