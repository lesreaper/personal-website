import Arrow from "./Arrow";
import { site } from "../../lib/profile";
export default function Footer() {
  return (
    <footer className="footer" id="connect">
      <div className="footer-main">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> OPEN TO INTERESTING CONVERSATIONS
          </p>
          <h2>
            Let’s ask
            <br />
            <em>better questions.</em>
          </h2>
          <p className="footer-description">
            Research collaborations. Speaking engagements.
            <br />
            Ambitious things worth building.
          </p>
        </div>
        <div className="contact-links">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            Connect on LinkedIn <Arrow diagonal />
          </a>
          <a href={site.x} target="_blank" rel="noopener noreferrer">
            Follow the conversation on X <Arrow diagonal />
          </a>
          <a href="/about">
            About Richard <Arrow />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <a href="/" className="footer-name">
          Richard Everts<span>Researcher. Builder. Human.</span>
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
