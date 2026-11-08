import type { Entry } from "../../lib/content";
const toHref = (entry: Entry) => `/${entry.category}/${entry.slug}`;
import Arrow from "./Arrow";
export default function EntryCard({
  entry,
  number,
}: {
  entry: Entry;
  number?: number;
}) {
  return (
    <article className={`entry-card ${entry.category}`}>
      <div className="entry-card-meta">
        <span>
          {number === undefined
            ? entry.kind
            : String(number).padStart(2, "0") + " / " + entry.kind}
        </span>
        <span>{entry.dateLabel}</span>
      </div>
      <h3>
        <a href={toHref(entry)}>{entry.title}</a>
      </h3>
      <p>{entry.summary}</p>
      <div className="entry-card-bottom">
        <span className="tag">{entry.status}</span>
        <a
          className="circle-link"
          href={toHref(entry)}
          aria-label={`Read ${entry.title}`}
        >
          <Arrow />
        </a>
      </div>
    </article>
  );
}
