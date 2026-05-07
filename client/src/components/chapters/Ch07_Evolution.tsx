// Ch.07 — Evolution. From cell to consciousness.
// Side-scrolling timeline cards. Animation can be richer later;
// the structure & rhythm are correct.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell, Eyebrow } from './_shell';

const STAGES = [
  { name: 'Bacteria',     when: '3.8 Ga',      glyph: '·' },
  { name: 'Multicellular', when: '600 Ma',      glyph: '∴' },
  { name: 'Fish',          when: '500 Ma',      glyph: '~' },
  { name: 'Amphibians',    when: '370 Ma',      glyph: '∽' },
  { name: 'Mammals',       when: '200 Ma',      glyph: '⟁' },
  { name: 'Primates',      when: '60 Ma',       glyph: '⟁' },
  { name: 'Humans',        when: '300 ka',      glyph: '✦' },
];

export default function Ch07_Evolution() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const distance = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={7} background="#0A0A0A">
      <div ref={wrapRef} className="relative" style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="absolute z-10" style={{ top: 89, left: 34 }}>
          <Eyebrow>Chapter 07 · Evolution</Eyebrow>
          <h2 className="h-display" style={{ fontSize: 55, marginTop: 21, maxWidth: 610 }}>
            From cell to <span style={{ color: '#D4AF37' }}>consciousness</span>.
          </h2>
        </div>

        <div
          ref={trackRef}
          className="absolute"
          style={{
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: 89,
            paddingLeft: '50vw',
            paddingRight: '50vw',
            willChange: 'transform',
          }}
        >
          {STAGES.map((s) => (
            <div key={s.name} style={{ minWidth: 233 }}>
              <div className="font-mono" style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em', textTransform: 'uppercase' }}>
                {s.when}
              </div>
              <div className="h-display" style={{ fontSize: 144, color: '#D4AF37', lineHeight: 1, marginTop: 13 }}>
                {s.glyph}
              </div>
              <div className="h-display" style={{ fontSize: 34, marginTop: 13 }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
