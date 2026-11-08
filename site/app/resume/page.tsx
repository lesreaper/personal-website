import type { Metadata } from "next";
import { resume, site } from "../../lib/profile";
import Arrow from "../components/Arrow";
export const metadata: Metadata = {
  title: "Resume",
  description:
    "Professional experience and resume of Richard Everts: AI engineering, research, full-stack systems, and technical leadership.",
  alternates: { canonical: "/resume" },
};
export default function Resume() {
  return (
    <>
      <section className="page-intro resume-intro">
        <p className="eyebrow">EXPERIENCE & CAPABILITIES</p>
        <h1>
          The work.
          <br />
          <em>The experience.</em>
        </h1>
        <p>{resume.title}</p>
        <div className="resume-actions">
          <a className="button" href="/Richard-Everts-Resume.pdf" download>
            Download resume <Arrow diagonal />
          </a>
          <a
            className="text-link"
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn profile <Arrow diagonal />
          </a>
        </div>
      </section>
      <div className="section resume-body">
        <section>
          <p className="eyebrow">PROFILE</p>
          <h2>Richard Everts</h2>
          <p className="resume-summary">{resume.summary}</p>
        </section>
        <section>
          <p className="eyebrow">CORE STRENGTHS</p>
          <div className="strengths-grid">
            {resume.strengths.map((strength) => (
              <article key={strength.label}>
                <h3>{strength.label}</h3>
                <p>{strength.items.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>
        <section>
          <p className="eyebrow">PROFESSIONAL EXPERIENCE</p>
          <div className="resume-experience">
            {resume.experience.map((item) => (
              <article key={item.organization}>
                <span className="resume-period">{item.period}</span>
                <div>
                  <h3>{item.organization}</h3>
                  <p className="resume-role">{item.role}</p>
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section>
          <p className="eyebrow">EDUCATION</p>
          {resume.education.map((item) => (
            <article className="resume-education" key={item.institution}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>
        <section>
          <p className="eyebrow">SELECTED RECOGNITION & CREDENTIALS</p>
          <ul className="resume-recognition">
            {resume.recognition.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <div className="resume-end">
          <p>
            For research collaborations, speaking invitations, or engineering
            opportunities:
          </p>
          <a className="text-link" href="/about#connect">
            Let’s connect <Arrow diagonal />
          </a>
        </div>
      </div>
    </>
  );
}
