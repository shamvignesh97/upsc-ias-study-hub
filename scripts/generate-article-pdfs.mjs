/**
 * Build-time PDF generator for high-probability reading articles.
 * Bundles src/data/articles via esbuild, then writes public/articles/{topicId}/{slug}.pdf
 * plus a combined high-prob-portions.pdf per topic.
 * Deep articles aim for multi-page (≈5–12) A4 output.
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

function addFooter(doc, pageNum) {
  const bottom = doc.page.height - 40;
  doc.fontSize(8).fillColor("#94a3b8").text(
    `UPSC IAS Study Hub · Original notes · Page ${pageNum}`,
    50,
    bottom,
    { width: doc.page.width - 100, align: "center" },
  );
}

function ensureSpace(doc, state, need = 80) {
  if (doc.y > doc.page.height - need) {
    addFooter(doc, state.page);
    doc.addPage();
    state.page += 1;
  }
}

function writeParagraph(doc, state, text, opts = {}) {
  ensureSpace(doc, state, 60);
  doc.fontSize(opts.size || 10).fillColor(opts.color || "#1e293b").text(text, {
    align: opts.align || "justify",
    lineGap: 2,
  });
  doc.moveDown(opts.after ?? 0.55);
}

function writeHeading(doc, state, text) {
  ensureSpace(doc, state, 100);
  doc.moveDown(0.2);
  doc.fontSize(12).fillColor("#0f172a").text(text, { align: "left" });
  doc.moveDown(0.35);
}

function writeBullets(doc, state, items, bullet = "•") {
  for (const item of items) {
    ensureSpace(doc, state, 50);
    doc.fontSize(10).fillColor("#1e293b").text(`${bullet} ${item}`, { lineGap: 1.5 });
    doc.moveDown(0.25);
  }
  doc.moveDown(0.35);
}

function writeTable(doc, state, table) {
  writeHeading(doc, state, table.title || "Table");
  const headers = table.headers || [];
  const rows = table.rows || [];
  const usable = doc.page.width - 100;
  const colW = usable / Math.max(headers.length, 1);

  ensureSpace(doc, state, 40 + rows.length * 18);
  doc.fontSize(9).fillColor("#0f172a");
  let x0 = 50;
  const y0 = doc.y;
  headers.forEach((h, i) => {
    doc.text(String(h), x0 + i * colW, y0, { width: colW - 6, continued: false });
  });
  doc.moveDown(0.4);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor("#cbd5e1").stroke();
  doc.moveDown(0.3);

  for (const row of rows) {
    ensureSpace(doc, state, 36);
    const y = doc.y;
    let maxH = 0;
    row.forEach((cell, i) => {
      const h = doc.heightOfString(String(cell), { width: colW - 6 });
      if (h > maxH) maxH = h;
      doc.fontSize(9).fillColor("#1e293b").text(String(cell), 50 + i * colW, y, {
        width: colW - 6,
      });
    });
    doc.y = y + maxH + 6;
  }
  doc.moveDown(0.6);
}

function writeArticleBody(doc, state, article) {
  if (article.chanceNote) {
    writeHeading(doc, state, "Why this article (PYQ probability)");
    writeParagraph(doc, state, article.chanceNote, { color: "#92400e" });
    if (article.yearsAppeared?.length) {
      writeParagraph(
        doc,
        state,
        `Years appeared (synthesis): ${article.yearsAppeared.join(", ")}`,
        { size: 9, color: "#64748b", after: 0.4 },
      );
    }
  }

  writeHeading(doc, state, "Why UPSC asks this");
  writeParagraph(doc, state, article.whyUpscAsks);

  for (const section of article.sections) {
    writeHeading(doc, state, section.heading);
    writeParagraph(doc, state, section.body);
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
    writeBullets(doc, state, article.commonTraps, "✗");
  }

  writeHeading(doc, state, "Must remember");
  writeBullets(doc, state, article.mustRemember || []);

  if (article.quickRevision?.length) {
    writeHeading(doc, state, "Quick revision checklist");
    writeBullets(doc, state, article.quickRevision, "☐");
  }

  ensureSpace(doc, state, 60);
  doc.fontSize(8).fillColor("#64748b").text(
    "Educational prioritisation heuristic — not an official UPSC prediction. © UPSC IAS Study Hub original notes.",
  );
}

function writeArticlePdf(filePath, article, topicTitle) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      bufferPages: true,
      info: {
        Title: article.title,
        Author: "UPSC IAS Study Hub",
        Subject: `High-chance portion notes — ${topicTitle || article.topicId}`,
      },
    });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    const state = { page: 1 };

    doc.fontSize(8).fillColor("#666").text(
      "UPSC IAS Study Hub · Original study notes (not NCERT/UPSC verbatim) · Multi-page depth edition",
    );
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#0f172a").text(article.title, { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#334155").text(article.blurb);
    doc.moveDown(0.4);
    doc
      .fontSize(9)
      .fillColor("#92400e")
      .text(
        `Portion focus ~${article.portionChance}% · Topic: ${topicTitle || article.topicId}`,
      );
    doc.moveDown(0.3);
    doc
      .fontSize(9)
      .fillColor("#475569")
      .text(`PYQ themes: ${(article.pyqThemes || []).join(" · ")}`);
    doc.moveDown(0.8);

    writeArticleBody(doc, state, article);

    // footer on all pages
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(pages.start + i);
      addFooter(doc, i + 1);
    }

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function writeCombinedPdf(filePath, articles, topicId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    const state = { page: 1 };

    doc.fontSize(18).fillColor("#0f172a").text(`High-chance portions — ${topicId}`);
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#475569").text(
      "Combined original study articles for this topic’s highest-probability PYQ themes (deep edition).",
    );
    doc.moveDown(1);

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      if (i > 0) {
        addFooter(doc, state.page);
        doc.addPage();
        state.page += 1;
      }
      doc.fontSize(14).fillColor("#0f172a").text(article.title);
      doc.moveDown(0.3);
      doc
        .fontSize(9)
        .fillColor("#92400e")
        .text(`~${article.portionChance}% · ${(article.pyqThemes || []).join(" · ")}`);
      doc.moveDown(0.4);
      writeArticleBody(doc, state, article);
    }

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(pages.start + i);
      addFooter(doc, i + 1);
    }

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
