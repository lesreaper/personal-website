import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getEntries, getMarkdown, toHref } from "../lib/content.ts";

const profile = JSON.parse(
  await readFile(new URL("../content/profile.json", import.meta.url), "utf8"),
);
const { site, bios, timeline, speakingTopics, operator, externalLinks } =
  profile;
const publicRoot = path.join(process.cwd(), "public");
const entries = getEntries();
for (const retired of [
  "resume.md",
  "resume.html",
  "resume",
  "Richard-Everts-Resume.pdf",
]) {
  await rm(path.join(publicRoot, retired), { force: true, recursive: true });
}

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
    `\n[Biography](${site.url}/about.md)`,
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
  `\n## The Operator and the SIML Codex\nRichard Everts publishes as The Operator. The [original repository](${operator.repository}) credits this name in its [README](${operator.readme}): “${operator.byline}”. Richard identifies The Operator as his author identity on this website.`,
  "\n## Selected timeline",
  ...timeline.map(
    (item) => `\n### ${item.year} — ${item.title}\n${item.description}`,
  ),
  "\n## Project websites and original sources",
  ...externalLinks.map(
    (link) => `- [${link.label}](${link.url}): ${link.description}`,
  ),
  "\n## Speaking and collaboration",
  ...speakingTopics.map((item) => `\n### ${item.title}\n${item.description}`),
  `\n[LinkedIn](${site.linkedin}) · [X](${site.x})\n`,
].join("\n");
await output("about.md", aboutMarkdown);
await output(
  "profile.json",
  JSON.stringify(
    {
      name: site.name,
      alternateNames: ["Rich Everts", "Richard C. Everts", "The Operator"],
      url: `${site.url}/about`,
      biography: bios.extended,
      profiles: { linkedin: site.linkedin, x: site.x, github: site.github },
      authorship: [operator],
      externalLinks,
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
          externalUrl,
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
          externalUrl,
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
    "\n## The Operator — SIML Codex authorship",
    "Richard Everts is The Operator, the author identity used in the SIML Codex. This personal website explicitly identifies Richard Everts with that name.",
    `- [SIML Codex repository](${operator.repository}): The original publication, credited to The Operator.`,
    `- [README authorship credit](${operator.readme}): The repository states “${operator.byline}”.`,
    `- [Deep SIML Labs context](${operator.context}): Describes the Codex as developed with the original Operator during 2024–2025.`,
    `- [Richard’s Codex record](${site.url}/research/siml-codex.md): Connects the author identity with Richard’s wider work.`,
    "\n## Project websites and code",
    ...externalLinks.map(
      (link) => `- [${link.label}](${link.url}): ${link.description}`,
    ),
    "\n## Explore",
    `- [Homepage](${site.url}/index.md): An introduction and selected work.`,
    ...Object.keys(collectionDescriptions).map(
      (category) =>
        `- [${category[0].toUpperCase()}${category.slice(1)}](${site.url}/${category}.md): ${collectionDescriptions[category]}`,
    ),
    "\n## Profile",
    `- [Biography](${site.url}/about.md): Background and selected career timeline.`,
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

const topLevel = ["", "/research", "/work", "/writing", "/speaking", "/about"];
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

const identityArt = (
  await readFile(
    path.join(publicRoot, "images/identity/living-intelligence-hero.webp"),
  )
).toString("base64");
await output(
  "social.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="shade"><stop stop-color="#171916"/><stop offset=".52" stop-color="#171916" stop-opacity=".85"/><stop offset="1" stop-color="#171916" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="#171916"/><image href="data:image/webp;base64,${identityArt}" x="340" y="0" width="860" height="630" preserveAspectRatio="xMidYMid slice"/><rect width="1000" height="630" fill="url(#shade)"/><text x="64" y="90" font-family="Georgia,serif" font-size="26" letter-spacing="3" fill="#F4EBDC">RICHARD EVERTS</text><text x="62" y="265" font-family="Georgia,serif" font-size="66" fill="#F4EBDC">Exploring minds.</text><text x="62" y="350" font-family="Georgia,serif" font-style="italic" font-size="66" fill="#D7A35D">Building futures.</text><text x="65" y="420" font-family="Arial,sans-serif" font-size="23" fill="#F4EBDC">AI researcher. Founder. Author. Filmmaker.</text><path d="M64 490 H540" stroke="#6F9991"/><text x="65" y="545" font-family="Arial,sans-serif" font-size="22" fill="#D7A35D">richeverts.com</text></svg>`,
);

await output(
  "social.png",
  await sharp(await readFile(path.join(publicRoot, "social.svg")))
    .png()
    .toBuffer(),
);

console.log(
  `Generated ${entries.length} Markdown records, public biography, feeds, sitemap, and social card; resume exports are withdrawn.`,
);
