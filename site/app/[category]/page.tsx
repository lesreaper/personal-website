import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntries, toHref } from "../../lib/content";
import Archive from "../components/Archive";
import Arrow from "../components/Arrow";
import ProjectVisual from "../components/ProjectVisual";
import { speakingTopics, bios } from "../../lib/profile";
const categories = {
  research: {
    label: "Research",
    eyebrow: "THE RESEARCH COLLECTION",
    title: (
      <>
        Questions worth
        <br />
        <em>following.</em>
      </>
    ),
    description:
      "Simulation, intelligence, and the systems that connect them. Papers, technical notes, experiments, and the ideas behind the work.",
  },
  work: {
    label: "Work",
    eyebrow: "SELECTED WORK / 2010—PRESENT",
    title: (
      <>
        Curiosity,
        <br />
        <em>made tangible.</em>
      </>
    ),
    description:
      "Research labs, production systems, consumer AI, and a film across America. Different forms of the same practice: asking a question, then building a way to explore it.",
  },
  writing: {
    label: "Writing",
    eyebrow: "BOOKS & WRITING",
    title: (
      <>
        A life in
        <br />
        <em>questions.</em>
      </>
    ),
    description:
      "Ideas about liberty, human possibility, and finding meaning in the work. Books and writing by Richard Everts.",
  },
  speaking: {
    label: "Speaking",
    eyebrow: "TALKS, WORKSHOPS & CONVERSATIONS",
    title: (
      <>
        Ideas are better
        <br />
        <em>in conversation.</em>
      </>
    ),
    description:
      "A growing collection of talks on intelligence, cognitive systems, engineering, and the human questions beneath the technology.",
  },
};
export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const data = categories[category as keyof typeof categories];
  if (!data) return {};
  return {
    title: data.label,
    description: data.description,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title: `${data.label} — Richard Everts`,
      description: data.description,
      url: `/${category}`,
    },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!(category in categories)) notFound();
  const key = category as keyof typeof categories;
  const data = categories[key];
  const entries = getEntries(key);
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">
          <span className="status-dot" />
          {data.eyebrow}
        </p>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <div className="intro-rule">
          <span>
            {String(entries.length).padStart(2, "0")} RECORDS IN THE COLLECTION
          </span>
          <span>RICHARD EVERTS</span>
        </div>
      </section>
      <section className="section archive-section">
        {key === "work" ? (
          <div className="work-archive">
            {entries.map((entry, index) => (
              <article className="work-row" key={entry.slug}>
                <div>
                  <ProjectVisual slug={entry.slug} />
                </div>
                <div>
                  <span className="section-number">
                    {String(index + 1).padStart(2, "0")} / {entry.dateLabel}
                  </span>
                  <h2>
                    <a href={toHref(entry)}>{entry.title}</a>
                  </h2>
                  <p>{entry.summary}</p>
                  <p className="work-role">{entry.role}</p>
                  <a href={toHref(entry)} className="text-link">
                    Explore the project <Arrow diagonal />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : key === "writing" ? (
          <div className="writing-archive">
            {entries.map((entry) => (
              <article className="writing-row" key={entry.slug}>
                <a
                  href={toHref(entry)}
                  className={`book-image ${entry.slug === "on-terran-liberty" ? "terran" : "grind"}`}
                >
                  <img
                    src={`/images/${entry.slug}.webp`}
                    alt={`${entry.title} book cover`}
                  />
                </a>
                <div>
                  <p className="eyebrow">
                    {entry.kind} / {entry.dateLabel}
                  </p>
                  <h2>
                    <a href={toHref(entry)}>{entry.title}</a>
                  </h2>
                  <p>{entry.summary}</p>
                  <a className="text-link" href={toHref(entry)}>
                    About the book <Arrow diagonal />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Archive entries={entries} label={data.label} />
        )}
      </section>
      {key === "research" ? (
        <section className="section editorial-note">
          <p className="eyebrow">ABOUT THE COLLECTION</p>
          <h2>
            A record that
            <br />
            <em>keeps its context.</em>
          </h2>
          <p>
            Research changes. Each record preserves its source, date, credits,
            and publication status. Historical work stays visible alongside
            current investigations, with the distinction made explicit.
          </p>
          <a className="text-link" href="/research/siml-codex">
            Richard Everts, publishing as The Operator <Arrow diagonal />
          </a>
        </section>
      ) : null}
      {key === "speaking" ? (
        <section className="section speaking-kit" id="speaker-kit">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BRING THE CONVERSATION TO YOUR EVENT</p>
              <h2>
                Speaking & <em>collaboration.</em>
              </h2>
            </div>
            <a className="text-link" href="/about#connect">
              Discuss an invitation <Arrow diagonal />
            </a>
          </div>
          <p className="kit-description">
            Possible topics for a future talk or workshop. These are proposed
            themes, separate from the past events in the archive above.
          </p>
          <div className="topics-grid">
            {speakingTopics.map((topic) => (
              <article key={topic.title}>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </article>
            ))}
          </div>
          <div className="bio-block">
            <p className="eyebrow">SHORT SPEAKER BIO</p>
            <p>{bios.short}</p>
            <a href="/about" className="text-link">
              Extended biography & experience <Arrow diagonal />
            </a>
          </div>
        </section>
      ) : null}
    </>
  );
}
