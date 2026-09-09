# UPSC IAS Study Hub

A polished Next.js study companion for the Indian Civil Services (IAS/UPSC) exam.

## Features

- **Full syllabus navigation** — Prelims GS & CSAT, Mains Essay + GS I–IV, Optional subjects, Interview
- **Likelihood estimates** — High/Medium/Low + % heuristics from PYQ-style trends (with clear disclaimer)
- **Dashboard** — progress, “Focus for next paper”, quick links
- **Topic notes** — summaries, subtopics, related topics, mark studied / bookmarks (localStorage)
- **Quiz mode** — MCQs for Prelims GS subjects
- **PYQ-style practice** — sample questions tagged by year/topic
- **Study planner** — 7-day plan from high-probability topics
- **Methodology page** — how estimates are derived

> Probabilities are **estimates for study prioritisation**, not official UPSC predictions.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Client-side data (TS modules) — no backend required

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
| `/` | Dashboard |
| `/syllabus` | Papers & filtered topic browser |
| `/syllabus/[paperId]` | Paper detail |
| `/syllabus/[paperId]/[subjectId]` | Subject topics |
| `/topic/[topicId]` | Topic notes & progress |
| `/quiz` | Quiz subjects |
| `/quiz/[subjectId]` | Quiz player |
| `/pyq` | PYQ-style practice |
| `/planner` | Study planner |
| `/optional` | Optional subjects |
| `/interview` | Interview tips |
| `/bookmarks` | Saved topics |
| `/search` | Search |
| `/methodology` | Estimation methodology |

## License

Educational MVP for personal study use.
