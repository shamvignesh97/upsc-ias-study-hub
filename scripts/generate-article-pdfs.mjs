/**
 * Build-time PDF generator for high-probability reading articles.
 * Bundles src/data/articles via esbuild, then writes public/articles/{topicId}/{slug}.pdf
 * plus a combined high-prob-portions.pdf per topic.
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

function writeArticlePdf(filePath, article, topicTitle) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      info: {
        Title: article.title,
        Author: "UPSC IAS Study Hub",
        Subject: `High-chance portion notes — ${topicTitle || article.topicId}`,
      },
    });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(8).fillColor("#666").text("UPSC IAS Study Hub · Original study notes (not NCERT/UPSC verbatim)", {
      align: "left",
    });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#0f172a").text(article.title, { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#334155").text(article.blurb);
    doc.moveDown(0.4);
    doc.fontSize(9).fillColor("#92400e").text(`Portion focus ~${article.portionChance}% · Topic: ${topicTitle || article.topicId}`);
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor("#475569").text(`PYQ themes: ${article.pyqThemes.join(" · ")}`);
    doc.moveDown(0.8);

    doc.fontSize(12).fillColor("#0f172a").text("Why UPSC asks this");
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#1e293b").text(article.whyUpscAsks, { align: "justify" });
    doc.moveDown(0.8);

    for (const section of article.sections) {
      doc.fontSize(12).fillColor("#0f172a").text(section.heading);
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#1e293b").text(section.body, { align: "justify" });
      doc.moveDown(0.7);
    }

    if (article.mapFacts?.length) {
      doc.fontSize(12).fillColor("#0f172a").text("Map / list facts");
      doc.moveDown(0.3);
      for (const f of article.mapFacts) {
        doc.fontSize(10).fillColor("#1e293b").text(`• ${f}`);
      }
      doc.moveDown(0.7);
    }

    doc.fontSize(12).fillColor("#0f172a").text("Must remember");
    doc.moveDown(0.3);
    for (const m of article.mustRemember) {
      doc.fontSize(10).fillColor("#1e293b").text(`• ${m}`);
    }
    doc.moveDown(1);
    doc.fontSize(8).fillColor("#64748b").text(
      "Educational prioritisation heuristic — not an official UPSC prediction. © UPSC IAS Study Hub original notes.",
    );

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function writeCombinedPdf(filePath, articles, topicId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).fillColor("#0f172a").text(`High-chance portions — ${topicId}`);
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#475569").text(
      "Combined original study articles for this topic’s highest-probability PYQ themes.",
    );
    doc.moveDown(1);

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      if (i > 0) doc.addPage();
      doc.fontSize(14).fillColor("#0f172a").text(article.title);
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#92400e").text(`~${article.portionChance}% · ${article.pyqThemes.join(" · ")}`);
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#1e293b").text(article.blurb);
      doc.moveDown(0.5);
      doc.fontSize(11).text("Why UPSC asks this");
      doc.fontSize(10).text(article.whyUpscAsks, { align: "justify" });
      doc.moveDown(0.5);
      for (const section of article.sections) {
        doc.fontSize(11).fillColor("#0f172a").text(section.heading);
        doc.moveDown(0.2);
        doc.fontSize(10).fillColor("#1e293b").text(section.body, { align: "justify" });
        doc.moveDown(0.5);
      }
      doc.fontSize(11).fillColor("#0f172a").text("Must remember");
      for (const m of article.mustRemember) {
        doc.fontSize(10).fillColor("#1e293b").text(`• ${m}`);
      }
    }

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// Clear & regenerate
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
console.log(`Generated ${count} article PDFs + ${byTopic.size} combined topic PDFs → public/articles/`);
