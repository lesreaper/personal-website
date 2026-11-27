import type { Metadata } from "next";
import Chronology from "../components/Chronology";
import ReadingLink from "../components/ReadingLink";

export const metadata: Metadata = {
  title: "Timeline — One Life. Many Frontiers.",
  description:
    "Richard Everts’ chronology, from software engineering and the 2012 Declaration of Terran Liberty to documentary filmmaking, philosophy, AI, and Deep SIML Labs.",
  alternates: {
    canonical: "/timeline",
    types: { "text/markdown": "/timeline.md" },
  },
};

export default function Timeline() {
  return (
    <section className="arc-section arc-history arc-full-history">
      <div className="arc-side">
        <p className="arc-kicker">Timeline · Richard Everts</p>
        <h1>
          One Life.
          <br />
          <em>Many Frontiers.</em>
        </h1>
        <p>
          Some dates mark a public release. Others mark the start of an
          investigation whose questions took years to come into focus.
        </p>
        <ReadingLink href="/about">Read the biography</ReadingLink>
      </div>
      <Chronology />
    </section>
  );
}
