export default function ProjectVisual({
  slug,
  large = false,
}: {
  slug: string;
  large?: boolean;
}) {
  if (slug === "the-united-states-of-autism")
    return (
      <div className={`project-art film-art ${large ? "large" : ""}`}>
        <img
          src="/images/united-states-of-autism.webp"
          alt="The United States of Autism documentary poster"
          loading="lazy"
        />
        <span className="art-corner">A FILM BY RICHARD EVERTS</span>
      </div>
    );
  if (slug === "deep-siml-labs")
    return (
      <div
        className={`project-art siml-art ${large ? "large" : ""}`}
        aria-hidden="true"
      >
        <div className="siml-orbits">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="art-center">
          SIML<span>SIMULATION · INTELLIGENCE · DISCOVERY</span>
        </span>
        <span className="art-corner">DEEP SIML LABS / 2025—</span>
        <span className="art-plus">+</span>
      </div>
    );
  if (slug === "bestie-bot")
    return (
      <div
        className={`project-art bestie-art ${large ? "large" : ""}`}
        aria-hidden="true"
      >
        <div className="thermal-field" />
        <div className="sensor-frame" />
        <span className="art-center">
          bestie<span>INTELLIGENCE THAT CARES.</span>
        </span>
        <span className="art-corner">COMPUTER VISION / HUMAN CONTEXT</span>
        <span className="art-plus">+</span>
      </div>
    );
  if (slug === "psychic-unicorn")
    return (
      <div
        className={`project-art unicorn-art ${large ? "large" : ""}`}
        aria-hidden="true"
      >
        <div className="zodiac-ring" />
        <span className="unicorn-star">✧</span>
        <span className="art-bottom">
          Psychic Unicorn<span>A LITTLE CURIOSITY. A NEW INTERFACE.</span>
        </span>
        <span className="art-corner">CONVERSATIONAL AI / 2025</span>
      </div>
    );
  return (
    <div
      className={`project-art erana-art ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      <div className="world-grid" />
      <span className="art-center">
        erana<span>AN EXPLORATION IN PERSISTENT AGENTS</span>
      </span>
      <span className="art-corner">HISTORICAL PROJECT / 2026</span>
    </div>
  );
}
