// Builds the downloadable resume (.docx) from the website's resume page,
// so app/resume/page.tsx stays the single source of truth.
// Usage: npm run resume:pdf  (Windows + Microsoft Word for the PDF step)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType,
  LevelFormat, BorderStyle, TabStopType,
} from "docx";

const here = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.resolve(here, "../../app/resume/page.tsx");
const outDir = path.join(here, "out");
const outFile = path.join(outDir, "jose-paulo-timbang-resume.docx");

const src = fs.readFileSync(pagePath, "utf8");
const grab = (name) => {
  const start = src.indexOf(`const ${name} = [`);
  if (start < 0) throw new Error(`missing ${name}`);
  let i = src.indexOf("[", start), depth = 0, j = i;
  for (; j < src.length; j++) {
    if (src[j] === "[") depth++;
    else if (src[j] === "]" && --depth === 0) break;
  }
  return Function(`return ${src.slice(i, j + 1)}`)();
};
const experience = grab("experience");
const skills = grab("skills");
const certifications = grab("certifications");
const summary = src
  .match(/Professional Summary<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/)[1]
  .replace(/\s+/g, " ").trim();

const ACCENT = "1F4E79";
const MUTED = "595959";
const FONT = "Calibri";
const dash = (s) => s.replace(/ - /g, " – ");

const heading = (text) => new Paragraph({
  spacing: { before: 200, after: 80 },
  keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 2 } },
  children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: ACCENT, characterSpacing: 20 })],
});

const children = [];
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 0 },
  children: [new TextRun({ text: "JOSE PAULO TIMBANG", bold: true, size: 40, color: ACCENT })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [new TextRun({ text: "Full-Stack Developer", size: 24, color: MUTED })],
}));
const link = (text, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text, size: 19, color: ACCENT })] });
const plain = (text) => new TextRun({ text, size: 19, color: MUTED });
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 0 },
  children: [
    plain("Stittsville, ON, Canada  •  (613) 890-9037  •  "),
    link("contactme@josepaulotimbang.com", "mailto:contactme@josepaulotimbang.com"),
  ],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [
    link("josepaulotimbang.com", "https://josepaulotimbang.com"),
    plain("  •  "),
    link("linkedin.com/in/josepaulotimbang", "https://linkedin.com/in/josepaulotimbang"),
  ],
}));

children.push(heading("Professional Summary"));
children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: summary, size: 21 })] }));

children.push(heading("Experience"));
experience.forEach((job, idx) => {
  children.push(new Paragraph({
    keepNext: true, spacing: { before: idx ? 140 : 40, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 10080 }],
    children: [
      new TextRun({ text: job.role, bold: true, size: 22 }),
      new TextRun({ text: `\t${dash(job.period)}`, size: 20, color: MUTED }),
    ],
  }));
  children.push(new Paragraph({
    keepNext: true, spacing: { after: 40 },
    children: [new TextRun({ text: `${job.company}  ·  ${job.type}`, italics: true, size: 20, color: ACCENT })],
  }));
  job.points.forEach((pt) => children.push(new Paragraph({
    numbering: { reference: "bullets", level: 0 }, spacing: { after: 20 },
    children: [new TextRun({ text: dash(pt), size: 20 })],
  })));
  if (job.tech.length) children.push(new Paragraph({
    spacing: { before: 20, after: 0 },
    children: [
      new TextRun({ text: "Tech: ", bold: true, size: 18, color: MUTED }),
      new TextRun({ text: job.tech.join(", "), size: 18, color: MUTED }),
    ],
  }));
});

children.push(heading("Technical Skills"));
skills.forEach((g) => children.push(new Paragraph({
  spacing: { after: 30 },
  children: [
    new TextRun({ text: `${g.category}: `, bold: true, size: 20 }),
    new TextRun({ text: g.items.join(", "), size: 20 }),
  ],
})));

children.push(heading("Certifications"));
certifications.forEach((c) => children.push(new Paragraph({
  numbering: { reference: "bullets", level: 0 }, spacing: { after: 20 },
  children: [
    new TextRun({ text: c.name, bold: true, size: 20 }),
    new TextRun({ text: ` – ${c.issuer} (${c.year})`, size: 20 }),
  ],
})));

children.push(heading("Education"));
children.push(new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: 10080 }],
  children: [
    new TextRun({ text: "Bachelor of Science in Information Technology", bold: true, size: 21 }),
    new TextRun({ text: "\t2011", size: 20, color: MUTED }),
  ],
}));
children.push(new Paragraph({
  children: [new TextRun({ text: "AMA Computer College, Philippines", italics: true, size: 20, color: ACCENT })],
}));

const doc = new Document({
  creator: "Jose Paulo Timbang",
  title: "Jose Paulo Timbang – Resume",
  styles: { default: { document: { run: { font: FONT, size: 21 } } } },
  numbering: { config: [{ reference: "bullets", levels: [{
    level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360, hanging: 240 } } },
  }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1008, bottom: 1008, left: 1080, right: 1080 } } },
    children,
  }],
});
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, await Packer.toBuffer(doc));
console.log("wrote", path.relative(process.cwd(), outFile));
