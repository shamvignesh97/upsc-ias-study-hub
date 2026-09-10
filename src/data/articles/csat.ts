import type { StudyArticle } from "./types";

export const csatArticles: StudyArticle[] = [
  {
    "slug": "comprehension-strategy",
    "topicId": "csat-reading",
    "title": "CSAT Comprehension Strategy",
    "blurb": "Accuracy-first reading approach for the largest CSAT block.",
    "portionChance": 50,
    "pyqThemes": [
      "RC accuracy",
      "Inference vs fact"
    ],
    "whyUpscAsks": "Comprehension drives qualifying margin every year.",
    "mustRemember": [
      "Answer only from passage",
      "Eliminate extreme options",
      "33% qualifying — attempt smart"
    ],
    "sections": [
      {
        "heading": "Method",
        "body": "Preview question stems; read actively for structure; mark line references mentally; distrust outside knowledge."
      },
      {
        "heading": "Traps",
        "body": "Half-right options; scope shifts; absolute words. Practice timed sets weekly."
      }
    ]
  },
  {
    "slug": "reasoning-patterns",
    "topicId": "csat-logic",
    "title": "Logical Reasoning Patterns",
    "blurb": "Syllogism, seating, puzzles and statement–assumption patterns.",
    "portionChance": 48,
    "pyqThemes": [
      "Syllogism",
      "Puzzles",
      "Critical reasoning"
    ],
    "whyUpscAsks": "Structurally unavoidable in Paper II.",
    "mustRemember": [
      "Venn discipline for syllogisms",
      "Do not assume unstated facts",
      "Skip time-sink puzzles early"
    ],
    "sections": [
      {
        "heading": "Pattern drill",
        "body": "Maintain error log by pattern. Learn when to abandon a set."
      },
      {
        "heading": "Critical reasoning",
        "body": "Strengthen/weaken; assumption; inference — map to RC logic."
      }
    ]
  },
  {
    "slug": "numeracy-di",
    "topicId": "csat-math",
    "title": "Numeracy & Data Interpretation",
    "blurb": "Arithmetic speed and DI accuracy for CSAT qualifying.",
    "portionChance": 48,
    "pyqThemes": [
      "Arithmetic",
      "DI sets",
      "Speed"
    ],
    "whyUpscAsks": "Consistent share; speed separates qualifiers.",
    "mustRemember": [
      "Percent, ratio, average, time-work, speed basics",
      "Read DI legends carefully",
      "Approximation skills"
    ],
    "sections": [
      {
        "heading": "Syllabus focus",
        "body": "Class X arithmetic + interpretation. Formula sheet revision weekly."
      },
      {
        "heading": "Exam tactics",
        "body": "Order attempts by comfort; protect accuracy near cutoff."
      }
    ]
  },
  {
    "slug": "decision-making",
    "topicId": "csat-decision",
    "title": "Decision-Making Questions",
    "blurb": "Ethical–administrative judgement items — attempt carefully.",
    "portionChance": 28,
    "pyqThemes": [
      "Situation judgement"
    ],
    "whyUpscAsks": "Fewer items historically; quality over quantity.",
    "mustRemember": [
      "Prefer lawful, transparent, citizen-centric options",
      "Avoid extreme/personal bias choices"
    ],
    "sections": [
      {
        "heading": "Approach",
        "body": "Identify stakeholders; legality; fairness; feasibility. Eliminate vindictive or rule-breaking options."
      }
    ]
  }
];
