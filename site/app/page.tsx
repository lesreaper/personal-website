import type { Metadata } from "next";
import { getEntries } from "../lib/content";
import Arrow from "./components/Arrow";
import EntryCard from "./components/EntryCard";
export const metadata: Metadata = { alternates: { canonical: "/" } };
const selected = [
  {
    title: "Deep SIML Labs",
    href: "/work/deep-siml-labs",
    image: "work-siml",
    description:
      "Embodied artificial life / recursive memory / informational geometry / physical materials",
  },
  {
    title: "Bestie Bot",
    href: "/work/bestie-bot",
    image: "work-bestie",
    description: "Assistive AI for aging and cognitive health",
  },
  {
    title: "Books",
    href: "/writing",
    image: "work-books",
    description: "Light Up the Grind / Terran Liberty",
    literary: true,
  },
  {
    title: "The United States of Autism",
    href: "/work/the-united-states-of-autism",
    image: "work-film",
    description: "Documentary project",
  },
  {
    title: "AI Talks & Leadership",
    href: "/speaking",
    image: "work-talks",
    description: "Ideas, research, and real-world impact",
  },
];
export default function Home() {
  const research = getEntries("research").filter((entry) =>
    [
      "stardate-siml",
      "dynamic-causal-geometry",
      "siml-fepgate-vjepa2",
    ].includes(entry.slug),
  );
  return (
    <>
      <section className="living-hero" aria-labelledby="hero-heading">
        <img
          className="living-sculpture"
          src="/images/identity/living-intelligence-hero.webp"
          srcSet="/images/identity/living-intelligence-hero-mobile.webp 960w, /images/identity/living-intelligence-hero.webp 1920w"
          sizes="(max-width: 650px) 100vw, 80vw"
          alt=""
          width="1920"
          height="960"
          fetchPriority="high"
        />
        <div className="living-hero-copy">
          <h1 id="hero-heading">
            Exploring minds.
            <br />
            <em>Building futures.</em>
          </h1>
          <p>AI researcher. Founder. Author. Filmmaker.</p>
          <a className="living-explore" href="#selected-work">
            Explore the work <Arrow />
          </a>
        </div>
      </section>
      <section
        className="selected-work"
        id="selected-work"
        aria-labelledby="selected-heading"
      >
        <div className="selected-heading">
          <h2 id="selected-heading">Selected work</h2>
          <span aria-hidden="true" />
        </div>
        <div className="selected-columns">
          {selected.map((item) => (
            <article key={item.href} className="selected-project">
              <a
                href={item.href}
                className="selected-image"
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  src={`/images/identity/${item.image}.webp`}
                  alt=""
                  width="720"
                  height="405"
                />
              </a>
              <h3>
                <a href={item.href}>{item.title}</a>
              </h3>
              <p className={item.literary ? "literary" : ""}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="human-story section">
        <div className="human-portrait">
          <img
            src="/images/portrait.webp"
            alt="Richard Everts"
            width="460"
            height="460"
            loading="lazy"
          />
        </div>
        <div>
          <p className="eyebrow">Richard Everts / A connected practice</p>
          <h2>
            A person behind
            <br />
            <em>the questions.</em>
          </h2>
          <p className="human-description">
            I build systems, question assumptions, and tell human stories. From
            assistive AI to a documentary across America, my work keeps
            returning to how we understand the world—and what we choose to do
            with that understanding.
          </p>
          <div className="human-links">
            <a className="text-link" href="/about">
              More about me <Arrow />
            </a>
            <a className="text-link" href="/work">
              Explore all projects <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section className="section research-section">
        <div className="section-heading">
          <div>
            <p className="section-number">Ideas & investigations</p>
            <h2>
              Questions into <em>research.</em>
            </h2>
          </div>
          <a href="/research" className="text-link">
            The research collection <Arrow />
          </a>
        </div>
        <div className="research-grid">
          {research.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} number={index + 1} />
          ))}
        </div>
      </section>
    </>
  );
}
