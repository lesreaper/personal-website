import assert from "node:assert/strict";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { getEntries, toHref } from "../lib/content.ts";
import sharp from "sharp";
import { resolveFile } from "./serve.mjs";

const root = path.resolve(process.cwd(), "dist/client");
assert.ok(
  existsSync(root),
  "Build dist/client before running public verification.",
);
const profile = JSON.parse(
  readFileSync(new URL("../content/profile.json", import.meta.url), "utf8"),
);
const origin = profile.site.url;
const entries = getEntries();
assert.ok(entries.length > 0, "The archive must contain real entries.");
const issues = [];
function check(condition, message) {
  if (!condition) issues.push(message);
}
function walk(directory) {
  return readdirSync(directory).flatMap((file) => {
    const absolute = path.join(directory, file);
    const info = lstatSync(absolute);
    check(
      !info.isSymbolicLink(),
      `Symlinks are not allowed in the static output: ${absolute}`,
    );
    if (info.isSymbolicLink()) return [];
    return info.isDirectory() ? walk(absolute) : [absolute];
  });
}
const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?:\+?1[ .-]?)?\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/;
function privacy(text, name, strictPhone = false) {
  check(
    !emailPattern.test(text),
    `${name}: public artifact contains an email address`,
  );
  // Framework protocol tables contain bare "mailto:" and "tel:" strings.
  // Reject an actual URI payload, rather than those inert library literals.
  check(
    !/(?:mailto|tel):[+a-z0-9]/i.test(text),
    `${name}: public artifact contains a private contact link`,
  );
  if (strictPhone)
    check(
      !phonePattern.test(text),
      `${name}: public artifact contains a phone number`,
    );
}

const routes = [
  "/",
  "/research",
  "/work",
  "/writing",
  "/speaking",
  "/about",
  ...entries.map(toHref),
];
function resolveRoute(route) {
  const normalized = route.replace(/^\//, "");
  const candidates = [
    path.join(root, normalized),
    path.join(root, normalized, "index.html"),
    path.join(root, normalized + ".html"),
  ];
  return candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );
}
for (const route of routes) {
  const file = resolveRoute(route);
  check(Boolean(file), `Missing rendered page: ${route}`);
  if (!file) continue;
  const html = readFileSync(file, "utf8");
  check(
    /<html[^>]*lang="en"/.test(html),
    `${route}: English document language missing`,
  );
  check(/<title>[^<]+<\/title>/.test(html), `${route}: title missing`);
  check(
    /<meta\b(?=[^>]*name="description")(?=[^>]*content="[^"]+")[^>]*>/i.test(
      html,
    ),
    `${route}: description missing`,
  );
  const canonical = html.match(
    /<link\b(?=[^>]*rel="canonical")(?=[^>]*href="([^"]+)")[^>]*>/i,
  )?.[1];
  check(
    canonical === origin + (route === "/" ? "" : route) ||
      canonical === origin + route,
    `${route}: canonical missing or incorrect (${canonical})`,
  );
  check(/<h1(?:\s|>)/i.test(html), `${route}: main heading missing`);
  check(
    !/noindex/i.test(html),
    `${route}: public page unexpectedly marked noindex`,
  );
  const structured = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  check(structured.length > 0, `${route}: structured data missing`);
  for (const [, json] of structured) {
    try {
      JSON.parse(json);
    } catch {
      issues.push(`${route}: invalid JSON-LD`);
    }
  }
}

const slugs = new Set();
for (const entry of entries) {
  const key = toHref(entry);
  check(!slugs.has(entry.slug), `Duplicate slug: ${entry.slug}`);
  slugs.add(entry.slug);
  for (const property of [
    "title",
    "slug",
    "kind",
    "date",
    "dateLabel",
    "status",
    "summary",
    "role",
  ])
    check(
      typeof entry[property] === "string" && entry[property].length > 0,
      `${key}: missing ${property}`,
    );
  check(
    /^\d{4}(?:-\d{2}-\d{2})?$/.test(entry.date),
    `${key}: date must retain known precision (year or ISO day)`,
  );
  check(
    Array.isArray(entry.authors) && entry.authors.length > 0,
    `${key}: original authorship required`,
  );
  check(
    Array.isArray(entry.topics) && entry.topics.length > 0,
    `${key}: topic tags required`,
  );
  check(
    Array.isArray(entry.sources) && entry.sources.length > 0,
    `${key}: supporting sources required`,
  );
  check(entry.body.length > 150, `${key}: substantive content required`);
  check(
    !/<script|\son[a-z]+\s*=|javascript:/i.test(entry.body),
    `${key}: executable HTML is not allowed in content`,
  );
  for (const source of entry.sources) {
    try {
      check(
        ["https:", "http:"].includes(new URL(source.url).protocol) &&
          source.label.length > 0,
        `${key}: invalid source`,
      );
    } catch {
      issues.push(`${key}: malformed source URL`);
    }
  }
  if (entry.videoId)
    check(
      /^[A-Za-z0-9_-]{11}$/.test(entry.videoId),
      `${key}: invalid YouTube video ID`,
    );
  for (const related of entry.related ?? [])
    check(
      entries.some((record) => record.slug === related),
      `${key}: unknown related work ${related}`,
    );
  const markdownFile = resolveRoute(`${key}.md`);
  check(Boolean(markdownFile), `${key}: Markdown alternative missing`);
  if (markdownFile)
    check(
      readFileSync(markdownFile, "utf8").includes(entry.body),
      `${key}: Markdown does not match the source record`,
    );
}

const parsedDocuments = new Map(
  htmlFiles.map((file) => [file, readFileSync(file, "utf8")]),
);
for (const [file, html] of parsedDocuments) {
  const relative = path.relative(root, file);
  const sourceRoute =
    relative === "index.html"
      ? "/"
      : relative.endsWith("/index.html")
        ? `/${relative.slice(0, -11)}`
        : `/${relative.slice(0, -5)}`;
  for (const [, rawHref] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = decode(rawHref);
    if (/^(?:data:|blob:)/.test(href)) continue;
    let url;
    try {
      url = new URL(href, origin + sourceRoute);
    } catch {
      issues.push(`${sourceRoute}: malformed URL`);
      continue;
    }
    if (url.origin !== origin) continue;
    let targetPath;
    try {
      targetPath = decodeURIComponent(url.pathname);
    } catch {
      issues.push(`${sourceRoute}: malformed encoded URL`);
      continue;
    }
    const target = resolveRoute(targetPath);
    check(Boolean(target), `${sourceRoute}: broken local link ${href}`);
    if (target && url.hash && target.endsWith(".html")) {
      const targetHtml =
        parsedDocuments.get(target) ?? readFileSync(target, "utf8");
      const fragment = decodeURIComponent(url.hash.slice(1));
      check(
        targetHtml.includes(`id="${fragment}"`) ||
          targetHtml.includes(`name="${fragment}"`) ||
          fragment === "top",
        `${sourceRoute}: missing fragment ${href}`,
      );
    }
  }
}

for (const file of files) {
  const extension = path.extname(file);
  if (
    [".html", ".md", ".json", ".txt", ".xml", ".js", ".css", ".svg"].includes(
      extension,
    )
  )
    privacy(
      readFileSync(file, "utf8"),
      path.relative(root, file),
      [".html", ".md", ".json", ".txt", ".xml"].includes(extension),
    );
  check(
    !/Resume_April_2026|\.env|\.git\/|^docs\//.test(path.relative(root, file)),
    `Private source or checkout file published: ${file}`,
  );
}

for (const privatePath of [
  "/docs/Resume_April_2026.pdf",
  "/Resume_April_2026.pdf",
  "/../docs/Resume_April_2026.pdf",
  "/.git/config",
  "/.env",
  "/../package.json",
  "/%2e%2e/package.json",
  "/%2e%2e%2fpackage.json",
]) {
  check(
    resolveFile(decodeURIComponent(privatePath), root) === null,
    `Private source or traversal path is servable: ${privatePath}`,
  );
}

for (const required of [
  "llms.txt",
  "profile.json",
  "index.md",
  "research.md",
  "work.md",
  "writing.md",
  "speaking.md",
  "about.md",
  "sitemap.xml",
  "feed.xml",
  "robots.txt",
  "social.svg",
  "social.png",
])
  check(
    existsSync(path.join(root, required)),
    `Missing publishing artifact: ${required}`,
  );
const socialPng = path.join(root, "social.png");
if (existsSync(socialPng)) {
  try {
    const image = await sharp(socialPng).metadata();
    check(
      image.format === "png" && image.width === 1200 && image.height === 630,
      "Social PNG must be a valid 1200 × 630 image",
    );
  } catch {
    issues.push("Social PNG cannot be decoded");
  }
}
const profileFile = path.join(root, "profile.json");
if (existsSync(profileFile)) {
  const publicProfile = JSON.parse(readFileSync(profileFile, "utf8"));
  check(
    publicProfile.works.length === entries.length,
    "Public profile work index is out of sync",
  );
  check(
    publicProfile.alternateNames.includes("The Operator"),
    "Operator identity attribution missing",
  );
}
for (const retired of [
  "/resume",
  "/resume.html",
  "/resume/index.html",
  "/resume.md",
  "/Richard-Everts-Resume.pdf",
]) {
  check(
    !resolveRoute(retired),
    `Withdrawn resume artifact is still published: ${retired}`,
  );
}
check(
  !("resume" in profile),
  "A structured resume must not be retained in the public profile source",
);
for (const file of files.filter((file) =>
  [".html", ".md", ".json", ".xml", ".txt", ".rsc"].includes(
    path.extname(file),
  ),
)) {
  check(
    !/\/resume(?:[/.?#"']|$)|Richard-Everts-Resume\.pdf/i.test(
      readFileSync(file, "utf8"),
    ),
    `Withdrawn resume reference in ${path.relative(root, file)}`,
  );
}

if (issues.length) {
  console.error(
    `Public verification failed (${issues.length} issues):\n${issues.map((issue) => `- ${issue}`).join("\n")}`,
  );
  process.exit(1);
}
console.log(
  `Verified ${routes.length} pages, ${entries.length} sourced entries, internal links, JSON-LD, publishing artifacts, and resume withdrawal.`,
);
