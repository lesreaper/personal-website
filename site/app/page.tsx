import type { Metadata } from "next";
import { getEntries, toHref } from "../lib/content";
import Arrow from "./components/Arrow";
import EntryCard from "./components/EntryCard";
import ProjectVisual from "./components/ProjectVisual";
import Sensorium from "./components/Sensorium";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  const research = getEntries("research").filter((e) =>
    [
      "stardate-siml",
      "dynamic-causal-geometry",
      "siml-fepgate-vjepa2",
    ].includes(e.slug),
  );
  const projects = getEntries("work").filter((e) =>
    ["deep-siml-labs", "bestie-bot", "psychic-unicorn"].includes(e.slug),
  );
  const talk = getEntries("speaking").find((e) => e.slug === "human-level-ai");
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> INTELLIGENCE. IMAGINATION. IMPACT.
          </p>
          <h1>
            Richard
            <br />
            <em>Everts.</em>
          </h1>
          <div className="hero-introduction">
            <h2>
              Exploring intelligence.
              <br />
              Expanding human possibility.
            </h2>
            <p>
              I build systems, question assumptions, and tell human stories. My
              work connects AI research and engineering with the experience of
              being human.
            </p>
          </div>
          <a className="button" href="/research">
            Explore the research <Arrow diagonal />
          </a>
          <a className="hero-secondary" href="/about">
            A little more about me <Arrow />
          </a>
        </div>
        <Sensorium />
        <div className="hero-bottom">
          <span>RESEARCHER / ENGINEER / FILMMAKER / AUTHOR</span>
          <a href="#selected-work">
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section className="manifesto section" id="selected-work">
        <div className="section-kicker">
          <span className="section-number">01 / THE THROUGHLINE</span>
          <span>DIFFERENT DISCIPLINES. CONNECTED QUESTIONS.</span>
        </div>
        <h2>
          What does it mean
          <br />
          to <em>understand?</em>
        </h2>
        <div className="manifesto-aside">
          <p>
            For a machine. For a society.
            <br />
            For one person trying to be heard.
          </p>
          <p>
            From production AI systems to a documentary across America, I keep
            returning to the same questions: how we make sense of the world, and
            what we choose to do with that understanding.
          </p>
          <a className="text-link" href="/about">
            Follow the thread <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="section research-section">
        <div className="section-heading">
          <div>
            <p className="section-number">02 / AT THE FRONTIER</p>
            <h2>
              Questions into <em>research.</em>
            </h2>
          </div>
          <a className="text-link" href="/research">
            The research collection <Arrow diagonal />
          </a>
        </div>
        <div className="research-grid">
          {research.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} number={index + 1} />
          ))}
        </div>
        <div className="research-note">
          <span className="tiny-cross" aria-hidden="true">
            +
          </span>
          <p>
            Currently at <a href="/work/deep-siml-labs">Deep SIML Labs</a>:
            simulation, recursive systems, and the bridge between models and the
            physical world.
          </p>
          <a href="/research/siml-codex" className="text-link">
            Meet The Operator <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="section work-section">
        <div className="section-heading">
          <div>
            <p className="section-number">03 / IDEAS, MADE REAL</p>
            <h2>
              A practice of <em>building.</em>
            </h2>
          </div>
          <a className="text-link" href="/work">
            Explore the work <Arrow diagonal />
          </a>
        </div>
        <div className="project-grid">
          {projects.map((entry) => (
            <article className="project-card" key={entry.slug}>
              <div>
                <ProjectVisual slug={entry.slug} />
              </div>
              <div className="project-card-heading">
                <h3>
                  <a href={toHref(entry)}>{entry.title}</a>
                </h3>
                <Arrow diagonal />
              </div>
              <p>{entry.summary}</p>
              <div className="project-tags">
                {entry.topics.slice(0, 2).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="film-feature">
        <div className="film-feature-image">
          <img
            src="/images/united-states-of-autism.webp"
            alt="The United States of Autism documentary poster"
            loading="lazy"
          />
          <div className="film-image-shade" />
          <p className="film-caption">
            11,000 MILES. 40 DAYS. A SEARCH FOR UNDERSTANDING.
          </p>
        </div>
        <div className="film-feature-copy">
          <p className="section-number">04 / THE HUMAN STORY</p>
          <h2>
            Before the
            <br />
            models.
            <br />
            <em>The people.</em>
          </h2>
          <p>
            In <i>The United States of Autism</i>, I traveled across America to
            listen to families whose experiences challenged easy answers. The
            film is part of the same curiosity that drives my work today.
          </p>
          <a href="/work/the-united-states-of-autism" className="text-link">
            The story behind the film <Arrow diagonal />
          </a>
          <span className="film-credit">
            DIRECTOR · PRODUCER · EDITOR / 2013
          </span>
        </div>
      </section>
      <section className="section writing-section">
        <div className="section-heading">
          <div>
            <p className="section-number">05 / THINKING ON PAPER</p>
            <h2>
              Ideas beyond <em>the interface.</em>
            </h2>
          </div>
          <a className="text-link" href="/writing">
            Books & writing <Arrow diagonal />
          </a>
        </div>
        <div className="books-grid">
          <a className="book-card" href="/writing/on-terran-liberty">
            <div className="book-image terran">
              <img
                src="/images/on-terran-liberty.webp"
                alt="On Terran Liberty: Volume 1 book cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="eyebrow">POLITICAL PHILOSOPHY / 2023</p>
              <h3>On Terran Liberty</h3>
              <p>Liberty, consent, and the future we might choose.</p>
              <span className="text-link">
                Explore the book <Arrow diagonal />
              </span>
            </div>
          </a>
          <a className="book-card" href="/writing/light-up-the-grind">
            <div className="book-image grind">
              <img
                src="/images/light-up-the-grind.webp"
                alt="Light Up the Grind book cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="eyebrow">MEMOIR & REFLECTION / 2022</p>
              <h3>Light Up the Grind</h3>
              <p>Finding meaning in the work, and the life around it.</p>
              <span className="text-link">
                Explore the book <Arrow diagonal />
              </span>
            </div>
          </a>
        </div>
      </section>
      <section className="section speaking-feature">
        <div>
          <p className="section-number">06 / THINKING OUT LOUD</p>
          <h2>
            Good questions
            <br />
            deserve <em>a room.</em>
          </h2>
          <p>
            Talks on AI, cognitive systems, engineering, and what the future
            asks of us. For technical audiences and curious people.
          </p>
          <a href="/speaking" className="button button-outline">
            Talks & speaking <Arrow diagonal />
          </a>
        </div>
        <div className="featured-talk">
          <span className="eyebrow">FROM THE TALK ARCHIVE</span>
          <div className="talk-graphic" aria-hidden="true">
            <span>AI</span>
            <i />
            <i />
            <i />
          </div>
          <span className="tag">CPOSC / 2019</span>
          <h3>{talk?.title || "How close are we to human level AI?"}</h3>
          <a href="/speaking/human-level-ai" className="text-link">
            Watch the talk <Arrow diagonal />
          </a>
        </div>
      </section>
    </>
  );
}
