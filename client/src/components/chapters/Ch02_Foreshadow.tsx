// Ch.02 — The Foreshadow. A choice is coming.
// Two glowing orbs (red, gold). Hovering reveals a lock message.

import { useState } from 'react';
import { ChapterShell, Body, Eyebrow } from './_shell';

export default function Ch02_Foreshadow() {
  const [hover, setHover] = useState<'red' | 'gold' | null>(null);

  return (
    <ChapterShell index={2} background="#0A0A0A">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 02 · The Foreshadow</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 34 }}>
          A choice is coming.
        </h2>

        <div className="flex items-center justify-center" style={{ gap: 89, marginTop: 89 }}>
          <Orb
            color="#FF4444"
            shadow="rgba(255,68,68,0.55)"
            label="Crisis"
            onEnter={() => setHover('red')}
            onLeave={() => setHover(null)}
          />
          <Orb
            color="#D4AF37"
            shadow="rgba(212,175,55,0.55)"
            label="Aurora"
            onEnter={() => setHover('gold')}
            onLeave={() => setHover(null)}
          />
        </div>

        <div className="font-mono" style={{ marginTop: 55, color: '#D4AF37', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase', minHeight: 21 }}>
          {hover ? 'Not yet. First, learn what you are.' : '\u00A0'}
        </div>

        <div style={{ marginTop: 55 }}>
          <Body>Two paths breathe in the dark. The choice is real — but you must earn the question first.</Body>
        </div>
      </div>
    </ChapterShell>
  );
}

interface OrbProps {
  color: string;
  shadow: string;
  label: string;
  onEnter: () => void;
  onLeave: () => void;
}
function Orb({ color, shadow, label, onEnter, onLeave }: OrbProps) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={label}
      className="relative group"
      style={{ width: 89, height: 89 }}
    >
      <span
        className="block rounded-full transition-transform duration-700 group-hover:scale-110"
        style={{
          width: 89, height: 89,
          background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
          boxShadow: `0 0 89px ${shadow}`,
        }}
      />
      <span
        className="block rounded-full absolute inset-0 m-auto"
        style={{
          width: 21, height: 21, top: 34, left: 34,
          background: color,
          boxShadow: `0 0 34px ${shadow}`,
        }}
      />
    </button>
  );
}
