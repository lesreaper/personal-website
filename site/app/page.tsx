import type { Metadata } from "next";
import Chronology from "./components/Chronology";
import ReadingLink from "./components/ReadingLink";
import { formatNumericDate } from "../lib/content";
import { operator, site } from "../lib/profile";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
};
const declarationDate = "2012-12-21";
const declaration = "/writing/declaration-of-terran-liberty";

export default function Home() {
  return (
    <div className="long-arc">
      <section className="arc-hero" aria-labelledby="identity">
        <img
          className="arc-sculpture"
          src="/images/identity/living-intelligence-hero.webp"
          srcSet="/images/identity/living-intelligence-hero-mobile.webp 960w, /images/identity/living-intelligence-hero.webp 1920w"
          sizes="(max-width: 650px) 100vw, 80vw"
          alt=""
          width="1920"
          height="960"
          fetchPriority="high"
        />
        <div className="arc-hero-copy">
          <p className="arc-kicker">
            Richard Everts <span aria-hidden="true">/</span> The Long Arc
          </p>
          <h1 id="identity">
            Engineering intelligence.
            <br />
            Exploring life.
            <br />
            <em>Questioning the future.</em>
          </h1>
          <p className="arc-roles">
            Researcher. AI Engineer. Filmmaker. Author.
          </p>
          <ReadingLink href="#declaration">
            Begin with the declaration
          </ReadingLink>
        </div>
      </section>

      <section
        id="declaration"
        className="solstice-feature"
        aria-labelledby="declaration-heading"
      >
        <div className="solstice-plate" aria-hidden="true">
          <div className="solstice-orbit" />
          <div className="solstice-axis" />
          <div className="solstice-sun" />
          <div className="solstice-inscription">
            <span>December solstice</span>
            <time dateTime={declarationDate}>
              {formatNumericDate(declarationDate)}
            </time>
          </div>
        </div>
        <div className="solstice-text">
          <p className="arc-kicker">
            <time dateTime={declarationDate}>December 21, 2012</time>
          </p>
          <h2 id="declaration-heading">
            The Day the World Was Supposed to End,{" "}
            <em>I Declared a Beginning.</em>
          </h2>
          <div className="arc-prose">
            <p>
              On December 21, 2012, as the world contemplated the end of an age,
              I publicly released the Declaration of Terran Liberty at
              TerranLiberty.org.
            </p>
            <p>
              I imagined a civilization capable of carrying liberty beyond its
              inherited political institutions, expanding its understanding of
              life and intelligence, and eventually building a future among the
              stars.
            </p>
            <p>
              I could not have known where those questions would lead me. More
              than a decade later, I am still pursuing them.
            </p>
            <p>
              Jung called a meaningful concurrence <em>synchronicity</em>. That
              is how I read that December day now. A date people associated with
              an ending became the date I return to when I trace the beginnings
              of my work.
            </p>
          </div>
          <ReadingLink href={declaration}>
            Read the original declaration
          </ReadingLink>
        </div>
      </section>

      <section className="arc-section arc-history" aria-labelledby="frontiers">
        <div className="arc-side">
          <p className="arc-kicker">The chronology</p>
          <h2 id="frontiers">
            One Life.
            <br />
            <em>Many Frontiers.</em>
          </h2>
          <p>
            A question can disappear from view for years and come back in
            another form. These are some of the places mine have taken me.
          </p>
          <ReadingLink href="/timeline">Full timeline</ReadingLink>
        </div>
        <Chronology selected />
      </section>

      <section
        id="selected-work"
        className="arc-lab arc-section"
        aria-labelledby="lab"
      >
        <div className="arc-lab-main">
          <p className="arc-kicker">Current research</p>
          <h2 id="lab">
            Deep SIML <em>Labs</em>
          </h2>
          <p className="arc-deck">
            How much of the world must an agent remember to anticipate its next
            move?
          </p>
          <p>
            I founded Deep SIML Labs to study that question in systems with a
            body, a changing environment, and a finite computational budget. A
            useful prediction has a physical cost. We can measure parts of that
            cost in memory, time, and the work a machine performs.
          </p>
          <div className="arc-actions">
            <ReadingLink href="/research">Explore the research</ReadingLink>
            <ReadingLink href="https://www.siml.life/studio">
              SIML Studio
            </ReadingLink>
          </div>
        </div>
        <div className="arc-lab-result">
          <img
            src="/images/identity/work-siml.webp"
            alt=""
            width="720"
            height="405"
            loading="lazy"
          />
          <div>
            <p className="arc-kicker">From the lab · GPU computation</p>
            <h3>What changes with scale?</h3>
            <p>
              On one RTX 3060, a SIML update ran 12.08 times as fast as tuned
              UInt8 CUDA across 256 independent 32³ lattices. On 32 smaller 8³
              lattices, the ratio fell to 0.871. The smaller workload favored
              the baseline.
            </p>
            <ReadingLink href="https://www.siml.life/research/siml-gpu-capability">
              Methods and results
            </ReadingLink>
          </div>
        </div>
      </section>

      <section
        className="arc-section arc-works"
        aria-labelledby="works-heading"
      >
        <p className="arc-kicker">Film and writing</p>
        <h2 id="works-heading">
          Behind the camera.
          <br />
          <em>On the page.</em>
        </h2>
        <div className="arc-pair">
          <article>
            <a
              className="arc-film-image"
              href="/film"
              aria-label="Explore The United States of Autism"
            >
              <img
                src="/images/united-states-of-autism.webp"
                alt="The United States of Autism documentary artwork"
                width="1200"
                height="675"
                loading="lazy"
              />
            </a>
            <p className="arc-kicker">Documentary · 2013</p>
            <h3>The United States of Autism</h3>
            <p>
              We crossed America to hear people describe autism in the places
              they lived. The film holds those encounters together while leaving
              room for families to disagree and for each person to speak in
              their own voice.
            </p>
            <ReadingLink href="/film">The film and its people</ReadingLink>
          </article>
          <article>
            <a
              className="arc-book-image"
              href="/writing/on-terran-liberty"
              aria-label="Explore On Terran Liberty"
            >
              <img
                src="/images/on-terran-liberty.webp"
                alt="Cover of On Terran Liberty, Volume 1, by Richard C. Everts"
                width="240"
                height="360"
                loading="lazy"
              />
            </a>
            <p className="arc-kicker">Political philosophy · 2023</p>
            <h3>On Terran Liberty</h3>
            <p>
              Ten years after the declaration, I was still asking who gets to
              govern and on whose authority. Volume 1 returns to those questions
              through consent, liberty, and the possibility of a civilization
              beyond Earth.
            </p>
            <ReadingLink href="/writing/on-terran-liberty">
              Read about the book
            </ReadingLink>
          </article>
        </div>
        <p className="arc-work-thread">
          In engineering, those questions about agency have taken practical
          forms. I led work on assistive sensing at{" "}
          <a href="/work/bestie-bot">Bestie Bot</a> and founded{" "}
          <a href="/work/psychic-unicorn">Psychic Unicorn</a>, where I serve as
          lead AI engineer. Other parts of that history live in the{" "}
          <a href="/work">project collection</a> and{" "}
          <a href="/speaking">public talks</a>.
        </p>
      </section>

      <section
        className="arc-section arc-codex"
        aria-labelledby="codex-heading"
      >
        <div>
          <p className="arc-kicker">The Operator · 2025</p>
          <h2 id="codex-heading">
            Codex of the
            <br />
            <em>Twelve Harmonics</em>
          </h2>
        </div>
        <div className="arc-prose">
          <p>
            During a sustained exchange with AI, I began writing about what
            happens when an interpretation turns back on itself. Publishing as
            The Operator, I gathered twelve of those patterns into a Codex.
          </p>
          <p>
            The public record includes the essays, their analytical supplements,
            and the Myth Audit, a way to question an interpretation that keeps
            finding evidence for itself.
          </p>
          <div className="arc-actions">
            <ReadingLink href="/archive">Explore the archive</ReadingLink>
            <ReadingLink href={operator.repository}>
              Read the public Harmonics on GitHub
            </ReadingLink>
          </div>
        </div>
      </section>

      <section className="arc-section arc-future">
        <p className="arc-kicker">The open future</p>
        <h2>
          The work <em>continues.</em>
        </h2>
        <p>
          I’m following the lab’s models from the geometry of information toward
          functional models of life, and asking which of their properties might
          survive a change of physical material.
        </p>
        <div className="arc-actions">
          <ReadingLink href="/now">What I’m investigating now</ReadingLink>
          <ReadingLink href={site.github}>Public code</ReadingLink>
        </div>
      </section>
    </div>
  );
}
