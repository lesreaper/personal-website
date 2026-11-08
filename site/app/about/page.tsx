import type { Metadata } from "next";
import { bios, timeline, resume, person, site } from "../../lib/profile";
import Arrow from "../components/Arrow";
export const metadata: Metadata = {
  title: "About",
  description:
    "Richard Everts is an AI researcher, engineer, filmmaker, and author. Explore his background, career, and work connecting intelligence with human agency.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <>
      <section className="page-intro about-intro">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> THE PERSON BEHIND THE WORK
          </p>
          <h1>
            Always
            <br />
            <em>curious.</em>
          </h1>
          <p>
            Researcher. Engineer. Filmmaker. Author.
            <br />A few ways of asking what comes next.
          </p>
          <a className="text-link" href="/resume">
            Experience & resume <Arrow diagonal />
          </a>
        </div>
        <figure className="portrait">
          <img
            src="/images/portrait.webp"
            alt="Richard Everts"
            width="460"
            height="460"
          />
          <figcaption>RICHARD EVERTS / ALSO KNOWN AS THE OPERATOR</figcaption>
        </figure>
      </section>
      <section className="section about-story">
        <p className="section-number">A CONNECTED PRACTICE</p>
        <div className="prose">
          <h2>
            Intelligence is a technical question.
            <br />
            <em>And a human one.</em>
          </h2>
          <p>{bios.extended}</p>
          <p>
            The thread running through this work is human agency: how people
            understand the world, how systems can help, and where the decisions
            still belong to us. An engineering project, a film, and a book can
            be different ways of investigating that same thread.
          </p>
          <p>
            I publish as Richard Everts, Rich Everts, Richard C. Everts, and The
            Operator. This site brings that record together, with links to the
            original work and the people involved.
          </p>
          <a className="text-link" href="/research/siml-codex">
            The Operator & the SIML Codex <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="section timeline-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOW THE THREAD UNFOLDED</p>
            <h2>
              A continuing <em>exploration.</em>
            </h2>
          </div>
          <a className="text-link" href="/resume">
            Full professional experience <Arrow diagonal />
          </a>
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <article key={`${item.year}-${item.title}`}>
              <span>{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section credentials">
        <div>
          <p className="eyebrow">FOUNDATIONS</p>
          <h2>
            Thinking deeply.
            <br />
            <em>Building practically.</em>
          </h2>
        </div>
        <div>
          {resume.education.map((item) => (
            <article key={item.institution}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              <p>{item.detail}</p>
            </article>
          ))}
          <article>
            <h3>Research, invention & recognition</h3>
            <ul>
              {resume.recognition.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <a className="text-link" href="/resume">
            Explore the experience <Arrow diagonal />
          </a>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: `${site.url}/about`,
            mainEntity: person,
          }).replace(/</g, "\u003c"),
        }}
      />
    </>
  );
}
