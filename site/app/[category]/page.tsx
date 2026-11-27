import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntries, toHref } from "../../lib/content";
import Archive from "../components/Archive";
import Arrow from "../components/Arrow";
import styles from "../components/NarrativePage.module.css";
import NarrativePage, { pageMetadata } from "../components/NarrativePage";
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
      "Making a film meant listening across a country. At Bestie Bot, listening meant building sensors and understanding what they could miss. These projects show the work I took on, the people I worked with, and what we made.",
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
      "I started explaining computer vision at community meetups in Lancaster. The conversation grew to include simulated worlds, the limits of language models, and what a mind can afford to remember. The recordings and event records follow that progression.",
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
  if (category === "research") return pageMetadata("research");
  return {
    title: data.label,
    description: data.description,
    alternates: {
      canonical: `/${category}`,
      types: { "text/markdown": `/${category}.md` },
    },
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
      {key === "research" ? (
        <NarrativePage name="research" />
      ) : (
        <section className={`page-intro intro-${key}`}>
          <p className="eyebrow">
            <span className="status-dot" />
            {data.eyebrow}
          </p>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <div className="intro-rule">
            <span>
              {String(entries.length).padStart(2, "0")} RECORDS IN THE
              COLLECTION
            </span>
            <span>RICHARD EVERTS</span>
          </div>
          {key === "writing" && (
            <div className={styles.feature}>
              <p className="eyebrow">December 21, 2012</p>
              <h2>
                <a href="/writing/declaration-of-terran-liberty">
                  Declaration of Terran Liberty
                </a>
              </h2>
              <p>
                I publicly released the declaration at TerranLiberty.org as the
                world contemplated the end of an age. Eleven years later,{" "}
                <em>On Terran Liberty</em> returned to its questions of consent,
                authority, and a civilization reaching beyond Earth.
              </p>
              <a
                className="text-link"
                href="/writing/declaration-of-terran-liberty"
              >
                Read the declaration <Arrow diagonal />
              </a>
            </div>
          )}
        </section>
      )}
      <section className="section archive-section">
        {key === "research" && (
          <div className="section-heading">
            <h2>
              Papers and <em>experiments.</em>
            </h2>
          </div>
        )}
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
                  {entry.externalUrl ? (
                    <a
                      className="text-link work-external-link"
                      href={entry.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit project website <Arrow diagonal />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : key === "writing" ? (
          <div className="writing-archive">
            {entries
              .filter((entry) => entry.kind === "Book")
              .map((entry) => (
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
      {key === "speaking" ? (
        <section className="section speaking-kit" id="speaker-kit">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BRING THE CONVERSATION TO YOUR EVENT</p>
              <h2>
                Speaking & <em>collaboration.</em>
              </h2>
            </div>
            <a className="text-link" href="/contact">
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
