"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Deterministic pseudo-random (same on server and client — no hydration drift) */
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const CHARS = "QUIVARO∫π√Σ±≈×QUIVARO".split("");

/** Ambient field of drifting brand letters + math glyphs, à la the reference. */
export function GlyphField({ count = 70 }: { count?: number }) {
  const glyphs = Array.from({ length: count }, (_, i) => {
    const r1 = hash(i);
    const r2 = hash(i + 100);
    const r3 = hash(i + 200);
    const r4 = hash(i + 300);
    // keep the centre column clearer so the headline breathes
    const left = r1 * 100;
    const central = left > 28 && left < 72 && r3 > 0.35;
    return {
      char: CHARS[Math.floor(r4 * CHARS.length)],
      left,
      top: r2 * 100,
      size: 11 + Math.floor(r3 * 9),
      gold: r4 > 0.5,
      min: central ? 0.03 : 0.05 + r2 * 0.06,
      max: central ? 0.07 : 0.12 + r3 * 0.08,
      dur: 5 + r1 * 6,
      delay: -(r2 * 8),
    };
  });

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {glyphs.map((g, i) => (
        <span
          key={i}
          className="glyph"
          style={
            {
              left: `${g.left}%`,
              top: `${g.top}%`,
              fontSize: `${g.size}px`,
              color: g.gold ? "var(--color-gold)" : "var(--color-accent)",
              "--g-min": g.min,
              "--g-max": g.max,
              "--g-dur": `${g.dur}s`,
              "--g-delay": `${g.delay}s`,
            } as React.CSSProperties
          }
        >
          {g.char}
        </span>
      ))}
    </div>
  );
}

/** Cycles through words with a rise-in animation. */
export function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span key={i} className="word-rotate">
        {words[i]}
      </span>
    </span>
  );
}

/** Fades children up when they enter the viewport. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** The reference's little squiggle flourish. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="64"
      height="10"
      viewBox="0 0 64 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 6 Q 10 1, 18 6 T 34 6 T 50 6 T 62 5"
        stroke="var(--color-gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
