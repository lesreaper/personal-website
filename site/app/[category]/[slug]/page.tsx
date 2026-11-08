import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getEntries,
  getEntry,
  toHref,
  type Category,
  type Entry,
} from "../../../lib/content";
import { site } from "../../../lib/profile";
import Arrow from "../../components/Arrow";
import ProjectVisual from "../../components/ProjectVisual";
import Video from "../../components/Video";
import EntryCard from "../../components/EntryCard";
export function generateStaticParams() {
  return getEntries().map(({ category, slug }) => ({ category, slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const entry = getEntry(category as Category, slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: toHref(entry) },
    openGraph: {
      title: entry.title,
      description: entry.summary,
      url: toHref(entry),
      type: "article",
    },
  };
}
function structured(entry: Entry) {
  const types: Record<string, string> = {
    research:
      entry.kind.toLowerCase().includes("paper") ||
      entry.status.toLowerCase().includes("preprint")
        ? "ScholarlyArticle"
        : "CreativeWork",
    work:
      entry.slug === "the-united-states-of-autism" ? "Movie" : "CreativeWork",
    writing: "Book",
    speaking: entry.videoId ? "VideoObject" : "CreativeWork",
  };
  const author = entry.authors.map((name) =>
    [
      "Richard Everts",
      "Rich Everts",
      "Richard C. Everts",
      "The Operator",
    ].includes(name)
      ? { "@type": "Person", "@id": `${site.url}/#person`, name }
      : name === "Deep SIML Labs"
        ? { "@type": "Organization", name, url: "https://www.siml.life" }
        : { "@type": "Person", name },
  );
  return {
    "@context": "https://schema.org",
    "@type": types[entry.category],
    "@id": `${site.url}${toHref(entry)}#work`,
    name: entry.title,
    description: entry.summary,
    url: `${site.url}${toHref(entry)}`,
    author,
    datePublished: entry.date,
    keywords: entry.topics.join(", "),
    citation: entry.sources.map((source) => source.url),
    ...(entry.videoId
      ? {
          embedUrl: `https://www.youtube-nocookie.com/embed/${entry.videoId}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`,
        }
      : {}),
    ...(entry.slug === "the-united-states-of-autism"
      ? { director: { "@id": `${site.url}/#person` }, datePublished: "2013" }
      : {}),
    ...(entry.category === "writing"
      ? { image: `${site.url}/images/${entry.slug}.webp` }
      : {}),
  };
}
export default async function DetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const entry = getEntry(category as Category, slug);
  if (!entry) notFound();
  const related = getEntries().filter((other) =>
    entry.related?.includes(other.slug),
  );
  return (
    <>
      <link rel="alternate" type="text/markdown" href={`${toHref(entry)}.md`} />
      <article className={`detail-page detail-${entry.category}`}>
        <header className="detail-intro">
          <a href={`/${entry.category}`} className="back-link">
            ←{" "}
            {entry.category === "speaking"
              ? "Talks & conversations"
              : `${entry.category.charAt(0).toUpperCase()}${entry.category.slice(1)} collection`}
          </a>
          <div className="detail-meta">
            <span className="eyebrow">{entry.kind}</span>
            <span>{entry.dateLabel}</span>
            <span className="tag">{entry.status}</span>
          </div>
          <h1>{entry.title}</h1>
          <p className="detail-summary">{entry.summary}</p>
          <div className="detail-byline">
            <span>{entry.role}</span>
            <span>{entry.authors.join(" · ")}</span>
          </div>
        </header>
        {entry.category === "work" ? (
          <div className="detail-visual">
            <ProjectVisual slug={entry.slug} large />
          </div>
        ) : entry.category === "writing" ? (
          <div
            className={`detail-book book-image ${entry.slug === "on-terran-liberty" ? "terran" : "grind"}`}
          >
            <img
              src={`/images/${entry.slug}.webp`}
              alt={`${entry.title} book cover`}
            />
          </div>
        ) : null}
        {entry.videoId ? (
          <div className="detail-video">
            <Video id={entry.videoId} title={entry.title} />
            <a
              className="text-link"
              href={`https://www.youtube.com/watch?v=${entry.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube <Arrow diagonal />
            </a>
          </div>
        ) : null}
        <div className="detail-body">
          <aside className="detail-sidebar">
            <p className="eyebrow">IN THIS RECORD</p>
            <div className="sidebar-topics">
              {entry.topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
            <a className="text-link" href={`${toHref(entry)}.md`}>
              Read as Markdown <Arrow diagonal />
            </a>
            {entry.category === "speaking" ? (
              <a className="text-link" href="/speaking#speaker-kit">
                Speaking invitations <Arrow diagonal />
              </a>
            ) : null}
          </aside>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: entry.html }}
          />
        </div>
        <section className="sources-block">
          <p className="eyebrow">SOURCES & FURTHER EXPLORATION</p>
          <h2>
            Go to <em>the source.</em>
          </h2>
          <ul>
            {entry.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}
                  <Arrow diagonal />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
      {related.length ? (
        <section className="section related-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CONTINUE THE THREAD</p>
              <h2>
                Connected <em>work.</em>
              </h2>
            </div>
          </div>
          <div className="archive-grid">
            {related.slice(0, 3).map((other) => (
              <EntryCard key={other.slug} entry={other} />
            ))}
          </div>
        </section>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured(entry)).replace(/</g, "\u003c"),
        }}
      />
    </>
  );
}
