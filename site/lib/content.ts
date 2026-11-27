import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export const categories = ["research", "work", "writing", "speaking"] as const;
export type Category = (typeof categories)[number];
export type Source = { label: string; url: string };
export type Entry = {
  title: string;
  slug: string;
  category: Category;
  kind: string;
  date: string;
  dateLabel: string;
  status: string;
  summary: string;
  topics: string[];
  role: string;
  authors: string[];
  sources: Source[];
  featured?: boolean;
  videoId?: string;
  related?: string[];
  externalUrl?: string;
  cover?: string;
  originalPublication?: {
    siteName: string;
    url: string;
  };
  bookEdition?: { isbn: string; publisher: string; pages: number };
  body: string;
  html: string;
};

const contentRoot = path.join(process.cwd(), "content");

function loadCategory(category: Category): Entry[] {
  return readdirSync(path.join(contentRoot, category))
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const parsed = matter(
        readFileSync(path.join(contentRoot, category, file), "utf8"),
      );
      const data = parsed.data as Omit<Entry, "body" | "html">;
      if (
        data.category !== category ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)
      ) {
        throw new Error(`Invalid category or slug in ${category}/${file}`);
      }
      return {
        ...data,
        body: parsed.content.trim(),
        html: marked.parse(parsed.content, { async: false }),
      };
    });
}

export function getEntries(category?: Category): Entry[] {
  const entries = category
    ? loadCategory(category)
    : categories.flatMap(loadCategory);
  return entries.sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );
}

export function getEntry(category: Category, slug: string): Entry | undefined {
  return getEntries(category).find((entry) => entry.slug === slug);
}

export function toHref(entry: Pick<Entry, "category" | "slug">): string {
  return `/${entry.category}/${entry.slug}`;
}

/** Display full publication dates in US order, retaining year-only precision. */
export function formatNumericDate(date: string): string {
  return date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$2-$3-$1");
}

export function getMarkdown(entry: Entry): string {
  return (
    [
      `# ${entry.title}`,
      `\n${entry.summary}`,
      `\nDate: ${entry.dateLabel}\nType: ${entry.kind}\nStatus: ${entry.status}\nCredit: ${entry.role}\nAuthors: ${entry.authors.join(", ")}`,
      ...(entry.originalPublication
        ? [
            `\nPublicly released ${entry.dateLabel}, at ${entry.originalPublication.siteName}`,
            `Current archival location: https://richeverts.com${toHref(entry)}`,
            `Associated work: [On Terran Liberty: Volume 1](https://richeverts.com/writing/on-terran-liberty)`,
          ]
        : []),
      `\n${entry.body}`,
      ...(entry.externalUrl
        ? [`\nOriginal site: [${entry.title}](${entry.externalUrl})`]
        : []),
      "\n## Sources",
      ...entry.sources.map((source) => `- [${source.label}](${source.url})`),
    ].join("\n") + "\n"
  );
}
