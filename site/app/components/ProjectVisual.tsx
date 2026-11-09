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
          alt="The United States of Autism documentary artwork"
          width="1200"
          height="675"
          loading="lazy"
        />
        <span className="art-corner">A film by Richard Everts</span>
      </div>
    );
  const artwork: Record<string, string> = {
    "deep-siml-labs": "work-siml",
    "bestie-bot": "work-bestie",
    "psychic-unicorn": "work-talks",
    eranaos: "work-bestie",
  };
  return (
    <div className={`project-art ${large ? "large" : ""}`}>
      <img
        className="identity-project-image"
        src={`/images/identity/${artwork[slug] || "work-siml"}.webp`}
        alt=""
        width="720"
        height="405"
        loading="lazy"
      />
    </div>
  );
}
