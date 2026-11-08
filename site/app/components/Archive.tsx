"use client";
import { useState } from "react";
import type { Entry } from "../../lib/content";
import EntryCard from "./EntryCard";
export default function Archive({
  entries,
  label,
}: {
  entries: Entry[];
  label: string;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const topics = ["All", ...new Set(entries.flatMap((entry) => entry.topics))];
  const filtered = entries.filter(
    (entry) =>
      (topic === "All" || entry.topics.includes(topic)) &&
      `${entry.title} ${entry.summary} ${entry.topics.join(" ")} ${entry.kind}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="archive-tools">
        <label className="search-label">
          <span>Search {label.toLowerCase()}</span>
          <input
            type="search"
            placeholder={`Find a ${label === "Speaking" ? "talk or topic" : "title, idea, or topic"}…`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div
          className="topic-filters"
          role="group"
          aria-label="Filter by topic"
        >
          {topics.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={topic === item}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="results-count" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "record" : "records"}
        {query ? ` matching “${query}”` : " in the collection"}
      </p>
      <div className="archive-grid">
        {filtered.map((entry, index) => (
          <EntryCard key={entry.slug} entry={entry} number={index + 1} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>No records found.</h2>
          <p>Try another phrase or explore all topics.</p>
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setQuery("");
              setTopic("All");
            }}
          >
            Reset search ↗
          </button>
        </div>
      ) : null}
    </>
  );
}
