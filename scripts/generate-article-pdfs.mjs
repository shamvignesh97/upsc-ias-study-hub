/**
 * Build-time PDF generator for high-probability reading articles.
 * Bundles src/data/articles via esbuild, then writes public/articles/{topicId}/{slug}.pdf
 * plus a combined high-prob-portions.pdf per topic.
 * Renders real article body only — clean typography, Unicode via DejaVu, no padding pages.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import * as esbuild from "esbuild";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outRoot = path.join(root, "public", "articles");
const bundlePath = path.join(root, "scripts", ".articles-bundle.cjs");

const FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
const FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";

await esbuild.build({
  entryPoints: [path.join(root, "src/data/articles/index.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: bundlePath,
  logLevel: "error",
});

const require = createRequire(import.meta.url);
const { allArticles } = require(bundlePath);

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

/** Normalize punctuation so PDF text stays readable even if a glyph is missing. */
function cleanText(s) {
  return String(s ?? "")
    .replace(/\uFEFF/g, "")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, " - ")
    .replace(/\u2026/g, "...")
    .replace(/[\u2190\u2192\u2194\u21D2\u21D4]/g, " -> ")
    .replace(/↔/g, " <-> ")
    .replace(/→/g, " -> ")
    .replace(/≠/g, " != ")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/°/g, " deg ")
    .replace(/\s+/g, " ")
    .trim();
}

function registerFonts(doc) {
  if (fs.existsSync(FONT_REG)) {
    doc.registerFont("Body", FONT_REG);
    doc.registerFont("Heading", fs.existsSync(FONT_BOLD) ? FONT_BOLD : FONT_REG);
  } else {
    doc.registerFont("Body", "Helvetica");
    doc.registerFont("Heading", "Helvetica-Bold");
  }
}

function addFooter(doc, pageNum) {
  // Writing inside the bottom margin without clearing it makes PDFKit spawn blank pages
  const prevBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.font("Body").fontSize(8).fillColor("#94a3b8").text(
    `UPSC IAS Study Hub · Original notes · Page ${pageNum}`,
    50,
    doc.page.height - 40,
    { width: doc.page.width - 100, align: "center", lineBreak: false },
  );
  doc.page.margins.bottom = prevBottom;
}

function ensureSpace(doc, state, need = 72) {
  const limit = doc.page.height - 56;
  if (doc.y > limit - need) {
    doc.addPage();
    state.page += 1;
  }
}

function writeParagraph(doc, state, text, opts = {}) {
  const t = cleanText(text);
  if (!t) return;
  ensureSpace(doc, state, 56);
  doc.font("Body").fontSize(opts.size || 10).fillColor(opts.color || "#1e293b").text(t, {
    align: opts.align || "justify",
    lineGap: 2.5,
  });
  doc.moveDown(opts.after ?? 0.5);
}

function writeHeading(doc, state, text) {
  const t = cleanText(text);
  if (!t) return;
  ensureSpace(doc, state, 88);
  doc.moveDown(0.15);
  doc.font("Heading").fontSize(12).fillColor("#0f172a").text(t, { align: "left" });
  doc.moveDown(0.3);
}

function writeBullets(doc, state, items, bullet = "•") {
  for (const item of items) {
    const t = cleanText(item);
    if (!t) continue;
    ensureSpace(doc, state, 44);
    doc.font("Body").fontSize(10).fillColor("#1e293b").text(`${bullet} ${t}`, {
      lineGap: 1.5,
      paragraphGap: 2,
    });
    doc.moveDown(0.2);
  }
  doc.moveDown(0.3);
}

function writeTable(doc, state, table) {
  writeHeading(doc, state, table.title || "Table");
  const headers = (table.headers || []).map(cleanText);
  const rows = (table.rows || []).map((r) => r.map(cleanText));
  if (!headers.length) return;

  // Flow-based rows avoid absolute-position drawing that can spawn blank PDFKit pages
  ensureSpace(doc, state, 48);
  doc.font("Heading").fontSize(9).fillColor("#0f172a").text(headers.join(" | "), { lineGap: 1 });
  doc.moveDown(0.15);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor("#cbd5e1").lineWidth(0.5).stroke();
  doc.moveDown(0.3);

  for (const row of rows) {
    ensureSpace(doc, state, 40);
    doc.font("Body").fontSize(9).fillColor("#1e293b").text(row.join(" -- "), { lineGap: 1.5 });
    doc.moveDown(0.22);
  }
  doc.moveDown(0.45);
}

function writeArticleBody(doc, state, article) {
  if (article.chanceNote) {
    writeHeading(doc, state, "Why this portion (PYQ lens)");
    writeParagraph(doc, state, article.chanceNote, { color: "#92400e" });
    if (article.yearsAppeared?.length) {
      writeParagraph(
        doc,
        state,
        `Years appeared (synthesis): ${article.yearsAppeared.join(", ")}`,
        { size: 9, color: "#64748b", after: 0.35 },
      );
    }
  }

  writeHeading(doc, state, "Why UPSC asks this");
  writeParagraph(doc, state, article.whyUpscAsks);

  for (const section of article.sections || []) {
    writeHeading(doc, state, section.heading);
    // Support multi-paragraph bodies separated by blank lines
    const parts = String(section.body || "").split(/\n\s*\n/);
    for (const part of parts) writeParagraph(doc, state, part);
  }

  if (article.tables?.length) {
    for (const t of article.tables) writeTable(doc, state, t);
  }

  if (article.mapFacts?.length) {
    writeHeading(doc, state, "Map / list facts");
    writeBullets(doc, state, article.mapFacts);
  }

  if (article.commonTraps?.length) {
    writeHeading(doc, state, "Common traps");
    writeBullets(doc, state, article.commonTraps, "x");
  }

  writeHeading(doc, state, "Must remember");
  writeBullets(doc, state, article.mustRemember || []);

  if (article.quickRevision?.length) {
    writeHeading(doc, state, "Quick revision checklist");
    writeBullets(doc, state, article.quickRevision, "[ ]");
  }

  ensureSpace(doc, state, 40);
  doc
    .font("Body")
    .fontSize(8)
    .fillColor("#64748b")
    .text(
      "Educational prioritisation heuristic - not an official UPSC prediction. (c) UPSC IAS Study Hub original notes.",
    );
}

function finalizeFooters(doc) {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(pages.start + i);
    addFooter(doc, i + 1);
  }
}

function writeArticlePdf(filePath, article, topicTitle) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      bufferPages: true,
      autoFirstPage: true,
      info: {
        Title: article.title,
        Author: "UPSC IAS Study Hub",
        Subject: `High-chance portion notes - ${topicTitle || article.topicId}`,
      },
    });
    registerFonts(doc);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    const state = { page: 1 };

    doc
      .font("Body")
      .fontSize(8)
      .fillColor("#666")
      .text("UPSC IAS Study Hub · Original study notes (not NCERT/UPSC verbatim)");
    doc.moveDown(0.45);
    doc.font("Heading").fontSize(16).fillColor("#0f172a").text(cleanText(article.title), {
      align: "left",
    });
    doc.moveDown(0.25);
    doc.font("Body").fontSize(10).fillColor("#334155").text(cleanText(article.blurb));
    doc.moveDown(0.35);
    doc
      .font("Body")
      .fontSize(9)
      .fillColor("#92400e")
      .text(
        `Portion focus ~${article.portionChance}% · Topic: ${topicTitle || article.topicId}`,
      );
    doc.moveDown(0.25);
    doc
      .font("Body")
      .fontSize(9)
      .fillColor("#475569")
      .text(`PYQ themes: ${(article.pyqThemes || []).map(cleanText).join(" · ")}`);
    doc.moveDown(0.7);

    writeArticleBody(doc, state, article);
    finalizeFooters(doc);

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function writeCombinedPdf(filePath, articles, topicId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
    registerFonts(doc);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    const state = { page: 1 };

    doc.font("Heading").fontSize(18).fillColor("#0f172a").text(`High-chance portions - ${topicId}`);
    doc.moveDown(0.3);
    doc
      .font("Body")
      .fontSize(10)
      .fillColor("#475569")
      .text(
        "Combined original study articles for this topic's highest-probability PYQ themes.",
      );
    doc.moveDown(0.9);

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      if (i > 0) {
        doc.addPage();
        state.page += 1;
      }
      doc.font("Heading").fontSize(14).fillColor("#0f172a").text(cleanText(article.title));
      doc.moveDown(0.25);
      doc
        .font("Body")
        .fontSize(9)
        .fillColor("#92400e")
        .text(
          `~${article.portionChance}% · ${(article.pyqThemes || []).map(cleanText).join(" · ")}`,
        );
      doc.moveDown(0.4);
      writeArticleBody(doc, state, article);
    }

    finalizeFooters(doc);
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

if (fs.existsSync(outRoot)) {
  fs.rmSync(outRoot, { recursive: true, force: true });
}
ensureDir(outRoot);

const byTopic = new Map();
for (const a of allArticles) {
  if (!byTopic.has(a.topicId)) byTopic.set(a.topicId, []);
  byTopic.get(a.topicId).push(a);
}

let count = 0;
for (const [topicId, articles] of byTopic) {
  const dir = path.join(outRoot, topicId);
  ensureDir(dir);
  const sorted = [...articles].sort((a, b) => b.portionChance - a.portionChance);
  for (const a of sorted) {
    await writeArticlePdf(path.join(dir, `${a.slug}.pdf`), a, topicId);
    count++;
  }
  await writeCombinedPdf(path.join(dir, "high-prob-portions.pdf"), sorted, topicId);
}

fs.unlinkSync(bundlePath);
console.log(
  `Generated ${count} article PDFs + ${byTopic.size} combined topic PDFs → public/articles/`,
);
