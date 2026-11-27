import Arrow from "./Arrow";
import { site } from "../../lib/profile";
export default function Footer() {
  return (
    <footer className="footer" id="connect">
      <div className="footer-main">
        <div>
          <p className="eyebrow">Connect</p>
          <h2>
            Get in <em>touch.</em>
          </h2>
          <p className="footer-description">
            For research correspondence, speaking, and collaborations.
          </p>
        </div>
        <div className="contact-links">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            Connect on LinkedIn <Arrow diagonal />
          </a>
          <a href={site.x} target="_blank" rel="noopener noreferrer">
            Follow the conversation on X <Arrow diagonal />
          </a>
          <a href="/contact">
            Contact and publications <Arrow />
          </a>
        </div>
      </div>
      <nav className="arc-footer-nav" aria-label="Explore the site">
        <a href="/timeline">Timeline</a>
        <a href="/research">Research</a>
        <a href="/work">Projects</a>
        <a href="/writing">Writing</a>
        <a href="/film">Film</a>
        <a href="/speaking">Talks</a>
        <a href="/archive">Codex archive</a>
        <a href="/now">Now</a>
        <a href="/about">Biography</a>
      </nav>
      <div className="footer-bottom">
        <a href="/" className="footer-name">
          Richard Everts<span>The Long Arc</span>
        </a>
        <p>© {new Date().getUTCFullYear()} Richard Everts</p>
        <div>
          <a href="/llms.txt">For AI & agents</a>
          <a href="/feed.xml">RSS</a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub <Arrow diagonal />
          </a>
        </div>
      </div>
    </footer>
  );
}
