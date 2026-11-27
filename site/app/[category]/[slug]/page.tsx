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
import Declaration from "../../components/Declaration";
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
  const shareImage = entry.originalPublication
    ? "/declaration-social.png"
    : entry.kind === "Book"
      ? `/images/${entry.slug}.webp`
      : entry.slug === "the-united-states-of-autism"
        ? "/images/united-states-of-autism.webp"
        : "/social.png";
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: toHref(entry) },
    openGraph: {
      title: entry.title,
      description: entry.summary,
      url: toHref(entry),
      type: "article",
      images: [shareImage],
      ...(entry.originalPublication
        ? { publishedTime: entry.date, authors: [`${site.url}/about`] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.summary,
      images: [shareImage],
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
    writing: entry.kind === "Book" ? "Book" : "CreativeWork",
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
    ...(entry.kind === "Book"
      ? { image: `${site.url}/images/${entry.slug}.webp` }
      : {}),
    ...(entry.bookEdition
      ? {
          isbn: entry.bookEdition.isbn,
          numberOfPages: entry.bookEdition.pages,
          publisher: {
            "@type": "Organization",
            name: entry.bookEdition.publisher,
          },
          bookFormat: "https://schema.org/Paperback",
        }
      : {}),
    ...(entry.slug === "on-terran-liberty"
      ? {
          isBasedOn: {
            "@id": `${site.url}/writing/declaration-of-terran-liberty#work`,
          },
        }
      : {}),
    ...(entry.originalPublication
      ? {
          inLanguage: "en",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${site.url}${toHref(entry)}`,
          },
          publication: {
            "@type": "PublicationEvent",
            name: `Public release at ${entry.originalPublication.siteName}`,
            startDate: entry.date,
            location: {
              "@type": "VirtualLocation",
              url: entry.originalPublication.url,
            },
          },
          isPartOf: {
            "@type": "WebSite",
            name: entry.originalPublication.siteName,
            url: entry.originalPublication.url,
          },
          subjectOf: {
            "@type": "Book",
            "@id": `${site.url}/writing/on-terran-liberty#work`,
            name: "On Terran Liberty: Volume 1",
          },
        }
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
      {entry.originalPublication ? (
        <Declaration entry={entry} />
      ) : (
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
          ) : entry.kind === "Book" ? (
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
          {entry.externalUrl ? (
            <a
              className="text-link detail-external-link"
              href={entry.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.category === "work"
                ? "Visit project website"
                : "Open original source"}
              <Arrow diagonal />
            </a>
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
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label}
                    <Arrow diagonal />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      )}
      {related.length && !entry.originalPublication ? (
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
