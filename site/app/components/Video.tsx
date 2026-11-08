"use client";
import { useState } from "react";
export default function Video({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="video-player">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)}>
          <span className="play-icon" aria-hidden="true">
            ▶
          </span>
          <span>
            Watch the recording<small>{title}</small>
          </span>
        </button>
      )}
      <noscript>
        <a href={`https://www.youtube.com/watch?v=${id}`}>
          Watch {title} on YouTube
        </a>
      </noscript>
    </div>
  );
}
