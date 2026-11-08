"use client";
import { useEffect, useRef, useState } from "react";
export default function Sensorium() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d", { alpha: true });
    if (!ctx) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      time = 0,
      last = 0,
      visible = true;
    const pointer = { x: 0, y: 0 };
    const draw = (now: number) => {
      if (now - last < 42 && !media.matches && !paused) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const rect = el.getBoundingClientRect(),
        w = rect.width,
        h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (
        el.width !== Math.round(w * dpr) ||
        el.height !== Math.round(h * dpr)
      ) {
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!paused && !media.matches)
        time += Math.min(now - last || 32, 64) * 0.00008;
      last = now;
      const scale = Math.min(w, h) * 0.36,
        cx = w * 0.5,
        cy = h * 0.49;
      const halo = ctx.createRadialGradient(
        cx,
        cy,
        scale * 0.1,
        cx,
        cy,
        scale * 1.5,
      );
      halo.addColorStop(0, "rgba(65,191,188,.07)");
      halo.addColorStop(1, "rgba(65,191,188,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      // Batch nearby depth values into eight paths instead of issuing a fill
      // and a canvas state change for every point on every frame.
      const bands = Array.from(
        { length: 8 },
        () => [] as { x: number; y: number }[],
      );
      const rings = w < 500 ? 22 : 34,
        segments = w < 500 ? 56 : 80;
      for (let ring = 0; ring < rings; ring++)
        for (let i = 0; i < segments; i++) {
          const theta = (i / segments) * Math.PI * 2,
            phi = (ring / (rings - 1) - 0.5) * Math.PI;
          const noise =
            Math.sin(theta * 3 + phi * 4 + time * 2) * 0.065 +
            Math.cos(theta * 5 - phi * 3 + time) * 0.035;
          const radius = Math.cos(phi) * (1 + noise),
            twist = time + phi * 0.25;
          let x = radius * Math.cos(theta + twist),
            y = Math.sin(phi) * (0.92 + noise),
            z = radius * Math.sin(theta + twist);
          const tilt = -0.29 + pointer.y * 0.06,
            tx =
              x * Math.cos(0.17 + pointer.x * 0.08) -
              y * Math.sin(0.17 + pointer.x * 0.08),
            ty =
              x * Math.sin(0.17 + pointer.x * 0.08) +
              y * Math.cos(0.17 + pointer.x * 0.08);
          x = tx;
          y = ty * Math.cos(tilt) - z * Math.sin(tilt);
          z = ty * Math.sin(tilt) + z * Math.cos(tilt);
          const perspective = 3.4 / (3.4 + z);
          const band = Math.max(0, Math.min(7, Math.floor((1 - z) * 3.5)));
          bands[band].push({
            x: cx + x * scale * perspective,
            y: cy + y * scale * perspective,
          });
        }
      for (const [index, points] of bands.entries()) {
        const opacity = 0.15 + (index / 7) * 0.62;
        const radius = index > 3 ? 1.05 : 0.65;
        ctx.fillStyle = `rgba(114,225,216,${opacity})`;
        ctx.beginPath();
        for (const point of points) {
          ctx.moveTo(point.x + radius, point.y);
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(112,214,206,.13)";
      ctx.lineWidth = 0.6;
      const r = scale * 1.31;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.35, -0.43, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.88, r * 0.58, 0.8, 0, Math.PI * 2);
      ctx.stroke();
      if (visible && !paused && !media.matches)
        frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    observer.observe(el);
    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = (event.clientX - r.left) / r.width - 0.5;
      pointer.y = (event.clientY - r.top) / r.height - 0.5;
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    el.addEventListener("pointermove", move, { passive: true });
    media.addEventListener("change", refresh);
    window.addEventListener("resize", refresh);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("pointermove", move);
      media.removeEventListener("change", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, [paused]);
  return (
    <div className="sensorium">
      <div className="sensorium-grid" aria-hidden="true" />
      <canvas ref={canvas} aria-hidden="true" />
      <div className="orbit-label orbit-research">
        <span /> <a href="/research">Intelligence</a>
      </div>
      <div className="orbit-label orbit-work">
        <span /> <a href="/work">Systems</a>
      </div>
      <div className="orbit-label orbit-writing">
        <span /> <a href="/writing">Human agency</a>
      </div>
      <div className="orbit-label orbit-film">
        <span />{" "}
        <a href="/work/the-united-states-of-autism">Lived experience</a>
      </div>
      <div className="sensorium-caption">
        <span>FIG. 01 — A CONNECTED BODY OF WORK</span>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? "Play visual animation" : "Pause visual animation"
          }
        >
          {paused ? "PLAY" : "PAUSE"}
        </button>
      </div>
    </div>
  );
}
