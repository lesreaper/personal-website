import { getEntries, toHref } from "../../lib/content";
import Arrow from "./Arrow";
export default function BuilderWork() {
  const entries = getEntries("work");
  const builds = ["deep-siml-labs", "bestie-bot", "psychic-unicorn"].map(
    (slug) => entries.find((entry) => entry.slug === slug)!,
  );
  return (
    <section
      className="section builder-section"
      aria-labelledby="builder-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">The builder’s work</p>
          <h2 id="builder-heading">
            Ideas into <em>working systems.</em>
          </h2>
        </div>
        <a className="text-link" href="/work">
          All projects <Arrow />
        </a>
      </div>
      <div className="builder-grid">
        {builds.map((entry) => (
          <article key={entry.slug}>
            <p className="eyebrow">{entry.kind}</p>
            <h3>
              <a href={toHref(entry)}>{entry.title}</a>
            </h3>
            <p className="builder-role">{entry.role}</p>
            <p>{entry.summary}</p>
            <div className="outbound-links">
              <a className="text-link" href={toHref(entry)}>
                Project notes <Arrow />
              </a>
              <a
                className="text-link"
                href={entry.externalUrl || entry.sources[0].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.externalUrl ? "Visit website" : "Research profile"}
                <Arrow diagonal />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
