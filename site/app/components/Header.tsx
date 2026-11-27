"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
const links = [
  ["Timeline", "/timeline"],
  ["Research", "/research"],
  ["Writing", "/writing"],
  ["About", "/about"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="header">
      <a className="wordmark" href="/" aria-label="Richard Everts home">
        RICHARD EVERTS
      </a>
      <span className="header-rule" aria-hidden="true" />
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <nav
        id="main-navigation"
        className={open ? "navigation open" : "navigation"}
        aria-label="Main navigation"
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            aria-current={pathname?.startsWith(href) ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
