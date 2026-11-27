import { toHref, type Entry } from "../../lib/content";
import Arrow from "./Arrow";
import "./declaration.css";

export default function Declaration({ entry }: { entry: Entry }) {
  const publication = entry.originalPublication;
  if (!publication) throw new Error("Missing declaration publication record");
  let articles = 0;
  const transcription = entry.html.replace(/<li>/g, () => {
    articles += 1;
    return `<li id="article-${articles}">`;
  });

  return (
    <article className="declaration-reader">
      <header className="document-masthead">
        <a className="back-link" href="/writing">
          ← Writing
        </a>
        <div className="document-dateline">
          <time dateTime={entry.date}>21 · 12 · 2012</time>
          <span className="solstice-rule" aria-hidden="true" />
        </div>
        <h1>{entry.title}</h1>
        <p className="document-byline">
          <a href="/about">{entry.authors.join(", ")}</a>
        </p>
        <p className="document-publication">
          Publicly released {entry.dateLabel}, at {publication.siteName}
        </p>
      </header>
      <div className="document-reading-room">
        <aside className="document-margin">
          <nav aria-label="Declaration articles">
            <p className="eyebrow">Articles</p>
            <ol>
              {Array.from({ length: articles }, (_, index) => (
                <li key={index}>
                  <a
                    href={`#article-${index + 1}`}
                    aria-label={`Article ${index + 1}`}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <a className="text-link" href={`${toHref(entry)}.md`}>
            Read as Markdown <Arrow diagonal />
          </a>
        </aside>
        <div>
          <div
            className="document-transcription"
            dangerouslySetInnerHTML={{ __html: transcription }}
          />
          <section className="document-provenance">
            <h2>About this transcription</h2>
            <p>{publication.transcriptionNote}</p>
            <ul>
              {entry.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>
                    {source.label} <Arrow diagonal />
                  </a>
                </li>
              ))}
            </ul>
            <p>
              Richard returned to these questions in the 2023 book{" "}
              <a href="/writing/on-terran-liberty">
                <i>On Terran Liberty: Volume 1</i>
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
