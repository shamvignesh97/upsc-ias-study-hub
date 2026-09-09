# UPSC IAS Study Hub

A polished Next.js study companion for the Indian Civil Services (IAS/UPSC) exam.

## Features

- **Full syllabus navigation** — Prelims GS & CSAT, Mains Essay + GS I–IV, Optional subjects, Interview
- **Likelihood estimates** — High/Medium/Low + % from multi-year PYQ frequency analysis (recency-weighted; clear disclaimer)
- **Dashboard** — progress, “Focus for next paper”, quick links
- **Topic notes** — summaries, subtopics, related topics, mark studied / bookmarks (localStorage)
- **Quiz / tests hub** — Prelims GS Paper I banks, CSAT Paper II sets, and Mains Essay/GS I–IV prompts with model outlines (lazy-loaded sessions)
- **PYQ-style practice** — sample questions tagged by year/topic
- **Study planner** — 7-day plan from high-probability topics
- **Methodology page** — how estimates are derived
- **Progressive Web App** — installable on phone & desktop, offline app shell after first visit

> Probabilities are **estimates for study prioritisation**, not official UPSC predictions.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Client-side data (TS modules) — no backend required
- PWA via `@serwist/turbopack` (service worker + runtime caching)

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

## Install as an app (PWA)

The site is a Progressive Web App. After opening it once online, core pages and static assets are cached for offline study.

| Platform | How to install |
|----------|----------------|
| **Android (Chrome)** | Open the site → tap the browser menu → **Install app** / **Add to Home screen**. Or use the in-app **Install app** banner / nav button when Chrome shows it. |
| **iOS (Safari)** | Open the site in Safari → tap **Share** → **Add to Home Screen** → Add. (Chrome/Firefox on iOS use the same WebKit limitation — install from Safari.) |
| **Desktop (Chrome / Edge / Chromium)** | Look for the **install** icon in the address bar, or use the in-app **Install app** control in the nav. |

Once installed (or when running in standalone display mode), the install banner hides automatically.

**Notes / caveats**

- iOS does not support `beforeinstallprompt`; installation is only via Share → Add to Home Screen.
- Offline works best for routes you have already visited; unvisited dynamic routes fall back to the offline page until cached.
- Progress and bookmarks stay on-device in `localStorage`.

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
