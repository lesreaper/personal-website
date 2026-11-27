import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import matter from "gray-matter";
import {
  formatNumericDate,
  getEntries,
  getMarkdown,
  toHref,
} from "../lib/content.ts";

const profile = JSON.parse(
  await readFile(new URL("../content/profile.json", import.meta.url), "utf8"),
);
const { site, bios, timeline, speakingTopics, operator, externalLinks } =
  profile;
const publicRoot = path.join(process.cwd(), "public");
const entries = getEntries();
const declaration = entries.find(
  (entry) => entry.slug === "declaration-of-terran-liberty",
);
const declarationUrl = site.url + toHref(declaration);
const book = entries.find((entry) => entry.slug === "on-terran-liberty");
const bookUrl = site.url + toHref(book);
const fullBiography = [bios.extended, bios.engineering, bios.research]
  .filter(Boolean)
  .join("\n\n");
const chronology = timeline
  .map(({ year, title, description, href, label }) =>
    [
      `### ${year} — ${title}`,
      description,
      href && `[${label ?? title}](${new URL(href, site.url)})`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  )
  .join("\n\n");
const releaseRecord = [
  declaration.summary,
  `[Read the original declaration](${declarationUrl}).`,
  `[On Terran Liberty](${bookUrl}) develops the ideas of the declaration.`,
  ...declaration.sources.map(({ label, url }) => `- [${label}](${url})`),
].join("\n\n");
const narratives = {};
for (const name of ["archive", "now", "contact", "film", "research"]) {
  const { data, content } = matter(
    await readFile(
      new URL(`../content/pages/${name}.md`, import.meta.url),
      "utf8",
    ),
  );
  narratives[name] = { ...data, body: content.trim() };
}
const narrativeLinks = Object.entries(narratives)
  .filter(([route]) => route !== "research")
  .map(
    ([route, data]) =>
      `- [${data.title}](${site.url}/${route}.md) — ${data.description}`,
  );
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

for (const [name, { title, description, body }] of Object.entries(narratives)) {
  if (name === "research") continue;
  await output(
    `${name}.md`,
    `# ${title}\n\n${description}\n\nCanonical page: ${site.url}/${name}\n\n${body}\n`,
  );
}
await output(
  "timeline.md",
  `# One Life. Many Frontiers.\n\nCanonical chronology: ${site.url}/timeline\n\n${chronology}\n`,
);

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
      ...(category === "research"
        ? [narratives.research.description, "", narratives.research.body]
        : [description]),
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
    "\n## The Day the World Was Supposed to End, I Declared a Beginning.",
    releaseRecord,
    `\n## One Life. Many Frontiers.\n[Read the chronology](${site.url}/timeline.md)`,
    "\n## Explore the work",
    ...narrativeLinks,
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
  fullBiography,
  "\nAlso known as Rich Everts, Richard C. Everts, and The Operator.",
  `\n## The Operator and the SIML Codex\nRichard Everts publishes as The Operator. The [original repository](${operator.repository}) credits this name in its [README](${operator.readme}): “${operator.byline}”. Richard identifies The Operator as his author identity on this website.`,
  "\n## Selected timeline",
  chronology,
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
      biography: fullBiography,
      profiles: { linkedin: site.linkedin, x: site.x, github: site.github },
      authorship: [operator],
      timeline: timeline.map(({ year, title, description, href }) => ({
        year,
        title,
        description,
        ...(href && { url: new URL(href, site.url).href }),
      })),
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
          originalPublication,
          bookEdition,
          related,
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
          bookEdition,
          ...(originalPublication && {
            originalPublication: { ...originalPublication, releaseDate: date },
          }),
          ...(related && {
            relatedWorks: related.map(
              (slug) =>
                site.url + toHref(entries.find((entry) => entry.slug === slug)),
            ),
          }),
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
    "\n## The 2012 declaration",
    releaseRecord,
    "\n## Current research at Deep SIML Labs",
    bios.research,
    `- [Research and results](${site.url}/research.md) — Experiments, methods, and source papers.`,
    ...entries
      .filter((entry) => entry.status.startsWith("Lab benchmark"))
      .map(
        (entry) =>
          `- [${entry.title}](${site.url}${toHref(entry)}.md) — ${entry.dateLabel}. ${entry.status}.`,
      ),
    `- [Current priorities](${site.url}/now.md) — Open questions and experimental directions.`,
    "\n## The Operator — SIML Codex authorship",
    "Richard Everts is The Operator, the author identity used in the SIML Codex. This personal website explicitly identifies Richard Everts with that name.",
    `- [SIML Codex repository](${operator.repository}): The public source repository, credited to The Operator. Its introduction identifies SIML.life as the original publication site.`,
    `- [README authorship credit](${operator.readme}): The repository states “${operator.byline}”.`,
    `- [Deep SIML Labs context](${operator.context}): Describes the Codex as developed with the original Operator during 2024–2025.`,
    `- [Richard’s Codex record](${site.url}/research/siml-codex.md): Connects the author identity with Richard’s wider work.`,
    "\n## Project websites and code",
    ...externalLinks.map(
      (link) => `- [${link.label}](${link.url}): ${link.description}`,
    ),
    "\n## Explore",
    `- [Homepage](${site.url}/index.md): An introduction and selected work.`,
    `- [Timeline](${site.url}/timeline.md): The public chronology.`,
    ...narrativeLinks,
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

const topLevel = [
  "",
  "/about",
  "/timeline",
  "/work",
  "/writing",
  "/speaking",
  ...Object.keys(narratives).map((name) => "/" + name),
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

const identityArt = (
  await readFile(
    path.join(publicRoot, "images/identity/living-intelligence-hero.webp"),
  )
).toString("base64");
await output(
  "social.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="shade"><stop stop-color="#171916"/><stop offset=".52" stop-color="#171916" stop-opacity=".85"/><stop offset="1" stop-color="#171916" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="#171916"/><image href="data:image/webp;base64,${identityArt}" x="340" y="0" width="860" height="630" preserveAspectRatio="xMidYMid slice"/><rect width="1000" height="630" fill="url(#shade)"/><text x="64" y="90" font-family="Georgia,serif" font-size="26" letter-spacing="3" fill="#F4EBDC">RICHARD EVERTS</text><text x="62" y="265" font-family="Georgia,serif" font-size="54" fill="#F4EBDC">Engineering intelligence.</text><text x="62" y="350" font-family="Georgia,serif" font-style="italic" font-size="54" fill="#D7A35D">Exploring life.</text><text x="65" y="420" font-family="Arial,sans-serif" font-size="23" fill="#F4EBDC">Questioning the future.</text><path d="M64 490 H540" stroke="#6F9991"/><text x="65" y="545" font-family="Arial,sans-serif" font-size="22" fill="#D7A35D">richeverts.com</text></svg>`,
);

await output(
  "social.png",
  await sharp(await readFile(path.join(publicRoot, "social.svg")))
    .png()
    .toBuffer(),
);

const declarationCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#151c19"/>
  <g fill="none" stroke="#697d70" stroke-width="1"><circle cx="977" cy="260" r="155"/><ellipse cx="977" cy="260" rx="205" ry="62" transform="rotate(-23 977 260)"/><path d="M680 320L1190 104"/></g>
  <circle cx="835" cy="320" r="7" fill="#d7a35d"/>
  <g font-family="Georgia,serif" fill="#f4ebdc">
    <text x="72" y="101" font-size="28" letter-spacing="3">RICHARD EVERTS</text>
    <text x="70" y="267" font-size="72" fill="#d7a35d">${formatNumericDate(declaration.date)}</text>
    <text x="68" y="377" font-size="55">${escapeXml(declaration.title)}</text>
  </g>
  <path d="M72 456H1128" stroke="#697d70"/>
  <text x="72" y="527" font-family="sans-serif" font-size="24" fill="#f4ebdc">Publicly released ${escapeXml(declaration.dateLabel)} at ${escapeXml(declaration.originalPublication.siteName)}</text>
</svg>`;
await output(
  "declaration-social.png",
  await sharp(Buffer.from(declarationCard)).png().toBuffer(),
);

console.log(
  `Generated ${entries.length} Markdown records, public biography, feeds, sitemap, and social card; resume exports are withdrawn.`,
);
