import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { site } from "../../lib/profile";
import styles from "./NarrativePage.module.css";

type PageName = "archive" | "now" | "film" | "contact" | "research";

function readPage(name: PageName) {
  const file = path.join(process.cwd(), "content", "pages", name + ".md");
  const { data, content } = matter(readFileSync(file, "utf8"));
  return {
    title: String(data.title),
    description: String(data.description),
    eyebrow: String(data.eyebrow),
    sections: content
      .trim()
      .split(/^## /m)
      .slice(1)
      .map((section) => {
        const end = section.indexOf("\n");
        return {
          heading: section.slice(0, end).trim(),
          html: marked.parse(section.slice(end).trim(), { async: false }),
        };
      }),
  };
}

export function pageMetadata(name: PageName): Metadata {
  const page = readPage(name);
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: "/" + name,
      types: { "text/markdown": "/" + name + ".md" },
    },
    openGraph: {
      title: page.title + " — Richard Everts",
      description: page.description,
      url: "/" + name,
      ...(name === "film"
        ? { images: ["/images/united-states-of-autism.webp"] }
        : {}),
    },
  };
}

export default function NarrativePage({ name }: { name: PageName }) {
  const { title, eyebrow, description, sections } = readPage(name);
  const isFilm = name === "film";
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className={styles.lead}>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.deck}>{description}</p>
          {isFilm && (
            <a
              className="text-link"
              href="https://www.youtube.com/watch?v=td1pxNXNjjU"
            >
              Watch the official trailer ↗
            </a>
          )}
        </div>
        {isFilm && (
          <figure className={styles.still}>
            <img
              src="/images/united-states-of-autism.webp"
              alt="The United States of Autism, official documentary artwork"
              width="1200"
              height="675"
            />
            <figcaption>
              Promotional artwork · © 2013 The Tommy Foundation
            </figcaption>
          </figure>
        )}
      </header>
      {sections.map(({ heading, html }) => (
        <section className={styles.section} key={heading}>
          <h2>{heading}</h2>
          <div
            className={styles.prose}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": name === "contact" ? "ContactPage" : "WebPage",
            "@id": site.url + "/" + name + "#page",
            url: site.url + "/" + name,
            name: title,
            description,
            author: { "@id": site.url + "/#person" },
            ...(isFilm
              ? {
                  mainEntity: {
                    "@id": site.url + "/work/the-united-states-of-autism#work",
                  },
                }
              : {}),
            ...(name === "archive"
              ? {
                  mainEntity: { "@id": site.url + "/research/siml-codex#work" },
                }
              : {}),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
