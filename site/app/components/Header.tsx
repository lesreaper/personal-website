"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Arrow from "./Arrow";
const links = [
  ["Research", "/research"],
  ["Work", "/work"],
  ["Writing", "/writing"],
  ["Speaking", "/speaking"],
  ["About", "/about"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="header">
      <a className="wordmark" href="/" aria-label="re. — Richard Everts home">
        re<span className="wordmark-dot">.</span>
      </a>
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
        <a
          href="/about#connect"
          className="nav-connect"
          onClick={() => setOpen(false)}
        >
          Let’s connect <Arrow diagonal />
        </a>
      </nav>
    </header>
  );
}
