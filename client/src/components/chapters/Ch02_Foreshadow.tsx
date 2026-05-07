// Ch.02 — The Foreshadow. A choice is coming.
//
// Two distant orbs in the void — one warm gold, one cold crisis-red.
// They breathe slowly out of phase with each other, locked behind a hint
// the visitor cannot yet decode. The visitor must earn the question
// (10 chapters of context first) before the choice is offered in Ch.13.

import { useState } from 'react';
import { ChapterShell, Body, Eyebrow } from './_shell';

export default function Ch02_Foreshadow() {
  const [hover, setHover] = useState<'red' | 'gold' | null>(null);

  return (
    <ChapterShell index={2} background="#0A0A0A" withGrain withVignette>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 02 · The Foreshadow</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 34, lineHeight: 1.05 }}>
          A choice is <span style={{ color: '#D4AF37' }}>coming</span>.
        </h2>

        <div className="flex items-center justify-center" style={{ gap: 144, marginTop: 89 }}>
          <Orb
            color="#FF4444"
            shadow="rgba(255,68,68,0.55)"
            label="Crisis"
            phase={0}
            onEnter={() => setHover('red')}
            onLeave={() => setHover(null)}
          />
          <Orb
            color="#D4AF37"
            shadow="rgba(212,175,55,0.55)"
            label="Aurora"
            phase={1}
            onEnter={() => setHover('gold')}
            onLeave={() => setHover(null)}
          />
        </div>

        <div
          className="font-mono"
          style={{
            marginTop: 55,
            color: '#D4AF37',
            fontSize: 13,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            minHeight: 21,
            transition: 'opacity 1.3s ease',
            opacity: hover ? 1 : 0.34,
          }}
        >
          {hover ? 'Not yet · First learn what you are' : 'Not yet'}
        </div>

        <div style={{ marginTop: 55 }}>
          <Body>
            Two paths breathe in the dark.<br />
            The choice is real &mdash; but you must earn the question first.
          </Body>
        </div>
      </div>

      <style>{`
        .ch2-orb { animation: ch2-breath 5.5s ease-in-out infinite; }
        .ch2-orb.phase-1 { animation-delay: -2.75s; }
        @keyframes ch2-breath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.13); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ch2-orb { animation: none; }
        }
      `}</style>
    </ChapterShell>
  );
}

interface OrbProps {
  color: string;
  shadow: string;
  label: string;
  phase: 0 | 1;
  onEnter: () => void;
  onLeave: () => void;
}
function Orb({ color, shadow, label, phase, onEnter, onLeave }: OrbProps) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={label}
      className={`relative ch2-orb${phase === 1 ? ' phase-1' : ''}`}
      style={{ width: 144, height: 144, background: 'transparent', border: 0 }}
    >
      <span
        className="block rounded-full"
        style={{
          width: 144,
          height: 144,
          background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 65%)`,
          boxShadow: `0 0 144px ${shadow}, 0 0 233px ${shadow}`,
        }}
      />
      <span
        className="block rounded-full absolute"
        style={{
          width: 21,
          height: 21,
          top: 55 + 6,
          left: 55 + 6,
          background: color,
          boxShadow: `0 0 55px ${shadow}, 0 0 89px ${shadow}`,
        }}
      />
    </button>
  );
}
