import profile from "../content/profile.json";

export const { site, bios, resume, timeline, speakingTopics } = profile;

export const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  alternateName: ["Rich Everts", "Richard C. Everts", "The Operator"],
  url: `${site.url}/about`,
  description: bios.short,
  sameAs: [site.linkedin, site.x, site.github],
  knowsAbout: [
    "Artificial intelligence",
    "Simulation",
    "Software engineering",
    "Documentary filmmaking",
    "Philosophy",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Franklin & Marshall College",
  },
  affiliation: {
    "@type": "Organization",
    name: "Deep SIML Labs",
    url: "https://www.siml.life",
  },
};
