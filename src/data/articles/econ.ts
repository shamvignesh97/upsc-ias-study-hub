import type { StudyArticle } from "./types";

export const econArticles: StudyArticle[] = [
  {
    "slug": "inflation-monetary",
    "topicId": "econ-basics",
    "title": "Inflation, Monetary Policy & Banking",
    "blurb": "CPI/WPI, MPC, repo tools and banking basics — core every Prelims.",
    "portionChance": 48,
    "pyqThemes": [
      "Inflation indices",
      "RBI/MPC",
      "Monetary tools",
      "Banking regulation"
    ],
    "whyUpscAsks": "Macro price stability is policy-central and definition-rich for MCQs.",
    "mustRemember": [
      "CPI headline for inflation targeting (4% ±2% flexible IT framework)",
      "Repo, reverse repo, CRR, SLR, OMO",
      "MPC decides policy rate"
    ],
    "sections": [
      {
        "heading": "Inflation literacy",
        "body": "Distinguish CPI vs WPI coverage; headline vs core; demand-pull vs cost-push stories. Know why food/fuel volatility matters for Indian CPI."
      },
      {
        "heading": "Monetary policy",
        "body": "Inflation targeting framework; MPC composition idea; transmission via banks. Liquidity tools beyond repo. Financial inclusion and digital payments as adjacent banking themes."
      }
    ]
  },
  {
    "slug": "fiscal-budget-national-income",
    "topicId": "econ-basics",
    "title": "Fiscal Policy, Budget & National Income",
    "blurb": "Deficits, Budget jargon and GDP/GVA concepts UPSC recycles yearly.",
    "portionChance": 45,
    "pyqThemes": [
      "Fiscal deficit",
      "Budget terms",
      "GDP/GVA"
    ],
    "whyUpscAsks": "Budget documents create a predictable vocabulary test each year.",
    "mustRemember": [
      "Fiscal, revenue, primary deficits — definitions",
      "Capital vs revenue expenditure/receipts",
      "GDP vs GVA; nominal vs real"
    ],
    "sections": [
      {
        "heading": "Deficit grammar",
        "body": "Revenue deficit signals dissaving on revenue account; fiscal deficit is borrowing need; primary deficit strips interest. FRBM spirit — sustainability."
      },
      {
        "heading": "National income",
        "body": "Production/income/expenditure approaches at idea level; base year revisions; limitations of GDP as welfare."
      }
    ]
  },
  {
    "slug": "external-sector",
    "topicId": "econ-schemes",
    "title": "External Sector: BoP, Currency & Trade",
    "blurb": "Current/capital accounts, forex reserves, rupee and trade policy basics.",
    "portionChance": 40,
    "pyqThemes": [
      "Balance of payments",
      "Exchange rate",
      "Trade"
    ],
    "whyUpscAsks": "External vulnerability themes + CA linking (oil, FPI) appear steadily.",
    "mustRemember": [
      "Current account vs capital account",
      "CAD financing via capital inflows",
      "NEER/REER awareness"
    ],
    "sections": [
      {
        "heading": "BoP structure",
        "body": "Trade balance, invisibles, remittances; capital flows (FDI/FPI/ECB). Forex reserves roles."
      },
      {
        "heading": "Trade & policy",
        "body": "WTO basics, FTAs at headline, export competitiveness — link to schemes/PLI when CA-relevant."
      }
    ]
  },
  {
    "slug": "agri-industry-schemes",
    "topicId": "econ-schemes",
    "title": "Agriculture, Industry & Flagship Schemes",
    "blurb": "MSP/markets, industrial policy tools and how to read government schemes for Prelims.",
    "portionChance": 38,
    "pyqThemes": [
      "Agriculture markets",
      "Industrial policy",
      "Schemes"
    ],
    "whyUpscAsks": "Static concepts + scheme objectives/ministries matching.",
    "mustRemember": [
      "MSP & procurement logic; e-NAM idea",
      "Differentiate central sector vs centrally sponsored at high level",
      "Always verify ministry + objective + beneficiary"
    ],
    "sections": [
      {
        "heading": "Agriculture economy",
        "body": "Marketing constraints, price policy, irrigation/credit themes, food security–PDS link."
      },
      {
        "heading": "Industry & schemes",
        "body": "PLI-style incentive logic, MSME definitions awareness, infrastructure financing themes. For schemes: objective–ministry–year launched triad."
      }
    ]
  }
];
