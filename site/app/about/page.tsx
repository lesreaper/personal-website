import type { Metadata } from "next";
import { bios, credentials, person, site } from "../../lib/profile";
import ReadingLink from "../components/ReadingLink";

export const metadata: Metadata = {
  title: "Richard Everts — Biography",
  description: bios.short,
  alternates: { canonical: "/about", types: { "text/markdown": "/about.md" } },
};

export default function About() {
  return (
    <>
      <section className="page-intro about-intro">
        <div>
          <p className="arc-kicker">Biography</p>
          <h1>
            Richard
            <br />
            <em>Everts</em>
          </h1>
          <p>Researcher. AI Engineer. Filmmaker. Author.</p>
          <ReadingLink href="/timeline">Follow the timeline</ReadingLink>
        </div>
        <figure className="portrait">
          <img
            src="/images/portrait.webp"
            alt="Richard Everts"
            width="460"
            height="460"
          />
        </figure>
      </section>
      <section className="section about-story arc-bio">
        <p className="arc-kicker">Liberty, life, intelligence, continuity</p>
        <div className="prose">
          <h2>
            A life in <em>questions.</em>
          </h2>
          <p>{bios.extended}</p>
          <ReadingLink href="/writing/declaration-of-terran-liberty">
            Read the 2012 declaration
          </ReadingLink>
          <h3>Listening and building</h3>
          <p>{bios.engineering}</p>
          <p>
            His <a href="/film">documentary work</a>,{" "}
            <a href="/work/bestie-bot">Bestie Bot</a>, and{" "}
            <a href="/work/psychic-unicorn">Psychic Unicorn</a> all put him in
            contact with how differently people interpret the same information.
          </p>
          <h3>Deep SIML Labs</h3>
          <p>{bios.research}</p>
          <p>
            Follow the <a href="/research">published research</a> or explore the{" "}
            <a href="/archive">Codex archive</a>, including the original essays
            and the Myth Audit.
          </p>
          <p>
            Richard Everts, Rich Everts, Richard C. Everts, and The Operator are
            the names used in his public work.
          </p>
        </div>
      </section>
      <section className="section credentials">
        <div>
          <p className="arc-kicker">Education and professional record</p>
          <h2>Foundations</h2>
        </div>
        <div>
          {credentials.education.map((item) => (
            <article key={item.institution}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              <p>{item.detail}</p>
            </article>
          ))}
          <article>
            <h3>Research, invention, and recognition</h3>
            <ul>
              {credentials.recognition.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <ReadingLink href="/work">Explore the projects</ReadingLink>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: site.url + "/about",
            mainEntity: person,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
