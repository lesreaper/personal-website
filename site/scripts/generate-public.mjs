import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";
import { getEntries, getMarkdown, toHref } from "../lib/content.ts";

const profile = JSON.parse(
  await readFile(new URL("../content/profile.json", import.meta.url), "utf8"),
);
const { site, bios, resume, timeline, speakingTopics } = profile;
const publicRoot = path.join(process.cwd(), "public");
const entries = getEntries();
// Markdown alternatives in these folders are generated. Remove stale files
// when a source record is renamed or withdrawn.
for (const category of ["research", "work", "writing", "speaking"]) {
  const directory = path.join(publicRoot, category);
  const previous = await readdir(directory).catch((error) =>
    error.code === "ENOENT" ? [] : Promise.reject(error),
  );
  for (const name of previous.filter((name) => name.endsWith(".md")))
    await rm(path.join(directory, name));
}
const escapeXml = (value) =>
  String(value).replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
async function output(relative, value) {
  const file = path.join(publicRoot, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, value);
}

for (const entry of entries)
  await output(`${entry.category}/${entry.slug}.md`, getMarkdown(entry));

const collectionDescriptions = {
  research:
    "Papers, experiments, technical notes, and philosophical foundations. Each record preserves its authorship, sources, and publication status.",
  work: "Selected systems, products, and creative projects, with Richard Everts's role and the evidence behind the work.",
  writing:
    "Books and essays connecting personal experience, philosophy, freedom, and human possibility.",
  speaking:
    "Conference talks, community sessions, and interviews, with verified recordings and source material where available.",
};
for (const [category, description] of Object.entries(collectionDescriptions)) {
  await output(
    `${category}.md`,
    [
      `# ${category[0].toUpperCase()}${category.slice(1)}`,
      "",
      description,
      `\nCanonical collection: ${site.url}/${category}`,
      ...entries
        .filter((entry) => entry.category === category)
        .map(
          (entry) =>
            `\n## [${entry.title}](${site.url}${toHref(entry)}.md)\n\n${entry.summary}\n\n${entry.dateLabel} · ${entry.kind} · ${entry.status}\nCredit: ${entry.role}\nAuthors: ${entry.authors.join(", ")}`,
        ),
      "",
    ].join("\n"),
  );
}
await output(
  "index.md",
  [
    "# Richard Everts",
    "",
    site.description,
    "",
    bios.short,
    `\nCanonical homepage: ${site.url}`,
    "\n## Explore the work",
    ...Object.entries(collectionDescriptions).map(
      ([category, description]) =>
        `- [${category[0].toUpperCase()}${category.slice(1)}](${site.url}/${category}.md): ${description}`,
    ),
    `\n[Biography](${site.url}/about.md) · [Resume](${site.url}/resume.md)`,
    "\n## Selected work",
    ...entries
      .filter((entry) => entry.featured)
      .map(
        (entry) =>
          `- [${entry.title}](${site.url}${toHref(entry)}.md): ${entry.summary}`,
      ),
    `\n## Connect\n[LinkedIn](${site.linkedin}) · [X](${site.x})\n`,
  ].join("\n"),
);

const aboutMarkdown = [
  "# Richard Everts",
  "",
  bios.extended,
  "\nAlso known as Rich Everts, Richard C. Everts, and The Operator.",
  "\n## Selected timeline",
  ...timeline.map(
    (item) => `\n### ${item.year} — ${item.title}\n${item.description}`,
  ),
  "\n## Speaking and collaboration",
  ...speakingTopics.map((item) => `\n### ${item.title}\n${item.description}`),
  `\n[LinkedIn](${site.linkedin}) · [X](${site.x})\n`,
].join("\n");
const resumeMarkdown = [
  `# ${site.name}\n\n${resume.title}\n\n${resume.summary}`,
  `\n[Website](${site.url}) · [LinkedIn](${site.linkedin}) · [X](${site.x}) · [GitHub](${site.github})`,
  "\n## Experience",
  ...resume.experience.map(
    (item) =>
      `\n### ${item.role}\n${item.organization} · ${item.period}\n\n${item.bullets.map((bullet) => `- ${bullet}`).join("\n")}`,
  ),
  "\n## Technical strengths",
  ...resume.strengths.map(
    (item) =>
      `\n### ${item.label}\n${item.items.map((text) => `- ${text}`).join("\n")}`,
  ),
  "\n## Education",
  ...resume.education.map(
    (item) => `\n### ${item.degree}\n${item.institution}\n\n${item.detail}`,
  ),
  "\n## Recognition and certifications",
  ...resume.recognition.map((text) => `- ${text}`),
  "",
].join("\n");
await output("about.md", aboutMarkdown);
await output("resume.md", resumeMarkdown);
await output(
  "profile.json",
  JSON.stringify(
    {
      name: site.name,
      alternateNames: ["Rich Everts", "Richard C. Everts", "The Operator"],
      url: `${site.url}/about`,
      biography: bios.extended,
      profiles: { linkedin: site.linkedin, x: site.x, github: site.github },
      works: entries.map(
        ({
          title,
          category,
          slug,
          kind,
          date,
          dateLabel,
          status,
          summary,
          authors,
          role,
          sources,
          topics,
        }) => ({
          title,
          category,
          kind,
          date,
          dateLabel,
          status,
          summary,
          authors,
          role,
          sources,
          topics,
          url: `${site.url}/${category}/${slug}`,
        }),
      ),
    },
    null,
    2,
  ) + "\n",
);
await output(
  "llms.txt",
  [
    "# Richard Everts",
    "",
    `> ${site.description}`,
    "",
    bios.short,
    "\nIdentity: Richard Everts, Rich Everts, Richard C. Everts, and The Operator refer to the same person on this website. Match affiliations and source links when resolving similarly named people.",
    "\n## Explore",
    `- [Homepage](${site.url}/index.md): An introduction and selected work.`,
    ...Object.keys(collectionDescriptions).map(
      (category) =>
        `- [${category[0].toUpperCase()}${category.slice(1)}](${site.url}/${category}.md): ${collectionDescriptions[category]}`,
    ),
    "\n## Profile",
    `- [Biography](${site.url}/about.md): Background and selected career timeline.`,
    `- [Resume](${site.url}/resume.md): Engineering experience, education, and recognition.`,
    `- [Structured profile](${site.url}/profile.json): Identity and the public work index.`,
    "\n## Collected work",
    ...entries.map(
      (entry) =>
        `- [${entry.title}](${site.url}${toHref(entry)}.md): ${entry.kind}; ${entry.dateLabel}; ${entry.status}. ${entry.summary}`,
    ),
    "\n## Attribution",
    "Research status and authorship are recorded individually. A preprint, reported lab benchmark, commentary, or historical prototype should not be described as independently validated research. Original bylines and source links take precedence over an inference of sole authorship.",
    "\n## Contact",
    `- [LinkedIn](${site.linkedin})`,
    `- [X](${site.x})`,
    "",
  ].join("\n"),
);

const topLevel = [
  "",
  "/research",
  "/work",
  "/writing",
  "/speaking",
  "/about",
  "/resume",
];
const pageUrls = [
  ...topLevel.map((route) => site.url + route),
  ...entries.map((entry) => site.url + toHref(entry)),
];
await output(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pageUrls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join("")}</urlset>\n`,
);
await output(
  "robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
);
await output(
  "feed.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Richard Everts — Collected Work</title><link>${site.url}</link><description>${escapeXml(site.description)}</description><language>en-us</language><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${entries.map((entry) => `<item><title>${escapeXml(entry.title)}</title><link>${site.url}${toHref(entry)}</link><guid isPermaLink="true">${site.url}${toHref(entry)}</guid><description>${escapeXml(entry.summary)}</description><category>${escapeXml(entry.category)}</category>${/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ? `<pubDate>${new Date(`${entry.date}T12:00:00Z`).toUTCString()}</pubDate>` : ""}</item>`).join("")}</channel></rss>\n`,
);

await output(
  "social.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><radialGradient id="g"><stop stop-color="#15373d"/><stop offset="1" stop-color="#0b1114"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/><g fill="none" stroke="#64d8d2" opacity=".25">${Array.from({ length: 16 }, (_, index) => `<ellipse cx="1000" cy="330" rx="${100 + index * 25}" ry="${45 + index * 15}" transform="rotate(-24 1000 330)"/>`).join("")}</g><text x="85" y="132" font-family="monospace" font-size="19" letter-spacing="4" fill="#8ee4df">RESEARCH · ENGINEERING · HUMAN EXPERIENCE</text><text x="80" y="295" font-family="Georgia,serif" font-size="90" fill="#f4f1e9">Richard Everts</text><text x="85" y="370" font-family="Arial,sans-serif" font-size="32" fill="#c9d0d0">Intelligence and human agency.</text><text x="85" y="548" font-family="monospace" font-size="22" fill="#8ee4df">richeverts.com</text></svg>`,
);

await output(
  "social.png",
  await sharp(await readFile(path.join(publicRoot, "social.svg")))
    .png()
    .toBuffer(),
);

// Rebuild a public PDF from approved data. The private source PDF is never read
// or copied here, so invisible redaction remnants cannot enter the download.
const pdf = await PDFDocument.create();
pdf.setTitle("Richard Everts — Public Resume");
pdf.setAuthor("Richard Everts");
pdf.setSubject("AI research and software engineering experience");
pdf.setCreator("richeverts.com");
pdf.setProducer("richeverts.com");
const regular = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const color = rgb(0.08, 0.12, 0.14);
let page;
let y;
function newPage() {
  page = pdf.addPage([612, 792]);
  y = 744;
}
function latin(text) {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7e\n]/g, " ");
}
function line(text, options = {}) {
  const font = options.bold ? bold : regular;
  const size = options.size ?? 10;
  const height = options.height ?? size * 1.4;
  const words = latin(text).split(/\s+/);
  let current = "";
  const draw = (value) => {
    if (y < 54 + height) newPage();
    page.drawText(value, { x: 48, y, size, font, color, maxWidth: 516 });
    y -= height;
  };
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > 516 && current) {
      draw(current);
      current = word;
    } else current = candidate;
  }
  if (current) draw(current);
}
function gap(amount = 8) {
  y -= amount;
}
function heading(text) {
  if (y < 110) newPage();
  gap(10);
  line(text.toUpperCase(), { bold: true, size: 11 });
  gap(4);
}
newPage();
line(site.name, { bold: true, size: 25, height: 32 });
line(resume.title, { size: 12, height: 19 });
line(site.url, { size: 9 });
line(site.linkedin, { size: 9 });
line(site.x, { size: 9 });
line(site.github, { size: 9 });
gap();
line(resume.summary);
heading("Experience");
for (const item of resume.experience) {
  if (y < 120) newPage();
  line(item.organization, { bold: true, size: 11 });
  line(`${item.role} | ${item.period}`, { size: 9 });
  gap(4);
  item.bullets.forEach((text) => line(`- ${text}`, { size: 9.5 }));
  gap();
}
heading("Technical strengths");
for (const item of resume.strengths) {
  line(item.label, { bold: true, size: 10 });
  item.items.forEach((text) => line(text, { size: 9.5 }));
  gap();
}
heading("Education");
for (const item of resume.education) {
  line(item.degree, { bold: true });
  line(item.institution);
  line(item.detail, { size: 9.5 });
}
heading("Recognition and certifications");
resume.recognition.forEach((text) => {
  line(`- ${text}`, { size: 9.5 });
  gap(3);
});
const pdfPages = pdf.getPages();
pdfPages.forEach((sheet, index) => {
  sheet.drawText("Richard Everts | richeverts.com", {
    x: 48,
    y: 27,
    size: 8,
    font: regular,
    color: rgb(0.4, 0.45, 0.46),
  });
  sheet.drawText(`${index + 1} / ${pdfPages.length}`, {
    x: 537,
    y: 27,
    size: 8,
    font: regular,
    color: rgb(0.4, 0.45, 0.46),
  });
});
await output("Richard-Everts-Resume.pdf", await pdf.save());
console.log(
  `Generated ${entries.length} Markdown records, profile, feeds, sitemap, social card, and public resume.`,
);
