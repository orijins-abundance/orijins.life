// Ch.04 — Stardust. You are made of dead stars.
//
// Element grid lights up one at a time as the visitor scrolls — each card
// fades in with a Fibonacci-staggered delay, the symbol pulses gold, then
// settles. The viewer feels the elements being assembled inside them.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

const ELEMENTS = [
  { sym: 'H',  name: 'Hydrogen',   pct: '9.5%',    note: 'water in your cells' },
  { sym: 'O',  name: 'Oxygen',     pct: '65%',     note: 'every breath you take' },
  { sym: 'C',  name: 'Carbon',     pct: '18%',     note: 'every protein in you' },
  { sym: 'N',  name: 'Nitrogen',   pct: '3%',      note: 'your DNA' },
  { sym: 'Ca', name: 'Calcium',    pct: '1.5%',    note: 'your skeleton' },
  { sym: 'P',  name: 'Phosphorus', pct: '1%',      note: 'your energy' },
  { sym: 'Fe', name: 'Iron',       pct: '0.006%',  note: 'your blood' },
  { sym: 'He', name: 'Helium',     pct: 'trace',   note: 'forged in stars' },
];

export default function Ch04_Stardust() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.ch4-card');
      if (!cards) return;
      gsap.set(cards, { opacity: 0, y: 21, scale: 0.89 });
      ScrollTrigger.create({
        trigger: '#chapter-4',
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.89,
            ease: 'power2.out',
            stagger: 0.13,
          });
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={4} background="#040405" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 21], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#040405']} />
          <StarField count={2584} radius={89} speed={0.013} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 04 · Stardust</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 34, maxWidth: 987, lineHeight: 1.05 }}>
          You are made of <span style={{ color: '#D4AF37' }}>dead stars</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 21, maxWidth: 610 }}>
          Every atom in your body heavier than helium was forged inside a star
          that exploded billions of years ago.
        </p>

        <div
          ref={gridRef}
          className="grid"
          style={{
            marginTop: 89,
            gap: 21,
            gridTemplateColumns: 'repeat(auto-fit, minmax(144px, 1fr))',
            maxWidth: 987,
            width: '100%',
          }}
        >
          {ELEMENTS.map((e) => (
            <div
              key={e.sym}
              className="ch4-card flex flex-col items-center"
              style={{
                padding: 21,
                border: '1px solid rgba(212,175,55,0.21)',
                background: 'rgba(10,10,10,0.55)',
                backdropFilter: 'blur(8px)',
                willChange: 'transform, opacity',
              }}
            >
              <span className="font-display" style={{ fontSize: 55, color: '#D4AF37', lineHeight: 1, textShadow: '0 0 21px rgba(212,175,55,0.34)' }}>{e.sym}</span>
              <span className="font-mono" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', letterSpacing: '0.21em', textTransform: 'uppercase', marginTop: 13 }}>
                {e.name}
              </span>
              <span className="font-mono" style={{ fontSize: 13, color: '#FAFAF7', marginTop: 8 }}>{e.pct}</span>
              <span className="font-display italic" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', marginTop: 13, textAlign: 'center', lineHeight: 1.3 }}>
                {e.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
