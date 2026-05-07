// Ch.08 — The Human Appears. 300,000 years ago. A blink.
//
// Scroll-locked accelerating timeline: ticks compress exponentially toward "now",
// then a violent flash on "YOU ARE HERE". The visitor feels the smallness of the
// human window in cosmic time.

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell, Eyebrow } from './_shell';

const TICKS = [
  { label: 'Big Bang',     t: '13.8 Ga', pos: 0.0 },
  { label: 'Earth forms',  t: '4.5 Ga',  pos: 0.67 },
  { label: 'Life',         t: '3.8 Ga',  pos: 0.72 },
  { label: 'Cambrian',     t: '540 Ma',  pos: 0.96 },
  { label: 'Mammals',      t: '200 Ma',  pos: 0.985 },
  { label: 'Primates',     t: '60 Ma',   pos: 0.995 },
  { label: 'You',          t: '300 ka',  pos: 1.0 },
];

export default function Ch08_HumanAppears() {
  const sweepRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#chapter-8',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => setProgress(self.progress),
      });

      // Flash + youRef appear at the end
      gsap.set([flashRef.current, youRef.current], { opacity: 0 });
      ScrollTrigger.create({
        trigger: '#chapter-8',
        start: 'bottom 60%',
        once: true,
        onEnter: () => {
          gsap.timeline()
            .to(flashRef.current, { opacity: 1, duration: 0.13, ease: 'power2.out' })
            .to(flashRef.current, { opacity: 0, duration: 0.55, ease: 'power2.out' })
            .to(youRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '-=0.21');
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={8} background="#0A0A0A" withGrain={false}>
      <div style={{ height: '200vh' }}>
        <div className="sticky top-0 left-0 w-full" style={{ height: '100vh' }}>
          <div className="relative z-10 min-h-screen flex flex-col justify-center" style={{ paddingInline: 34 }}>
            <Eyebrow>Chapter 08 · The Human Appears</Eyebrow>
            <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987, lineHeight: 1.05 }}>
              300,000 years ago.<br /><span style={{ color: '#D4AF37' }}>A blink.</span>
            </h2>

            {/* Timeline — ticks compress toward the right */}
            <div className="relative" style={{ marginTop: 89, maxWidth: 1597, height: 144 }}>
              <div style={{ height: 1, background: 'rgba(212,175,55,0.34)', position: 'absolute', top: 55, left: 0, right: 0 }} />
              {/* Sweep — gold vertical line travelling from left to right */}
              <div
                ref={sweepRef}
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 21,
                  left: `${progress * 100}%`,
                  width: 1,
                  height: 89,
                  background: '#D4AF37',
                  boxShadow: '0 0 21px rgba(212,175,55,0.89)',
                  transition: 'left 0.13s linear',
                }}
              />
              {TICKS.map((tk) => (
                <div
                  key={tk.label}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${tk.pos * 100}%`,
                    top: 0,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span style={{ width: 1, height: 21, background: tk.label === 'You' ? '#D4AF37' : 'rgba(212,175,55,0.55)' }} />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 13,
                      color: tk.label === 'You' ? '#D4AF37' : 'rgba(250,250,247,0.55)',
                      letterSpacing: '0.21em',
                      marginTop: 8,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tk.t}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 13,
                      color: tk.label === 'You' ? '#D4AF37' : 'rgba(250,250,247,0.34)',
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      marginTop: 8,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tk.label}
                  </span>
                </div>
              ))}
            </div>

            <div ref={youRef} style={{ marginTop: 89, opacity: 0, transform: 'translateY(21px)' }}>
              <p
                className="font-display"
                style={{
                  fontSize: 144,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: '#D4AF37',
                  lineHeight: 1,
                  textShadow: '0 0 89px rgba(212,175,55,0.55)',
                }}
              >
                You are here.
              </p>
              <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 21, maxWidth: 610 }}>
                If the history of the universe were one day, your species
                arrived in the last quarter of the last second.
              </p>
            </div>
          </div>

          {/* Cosmic flash on arrival */}
          <div
            ref={flashRef}
            aria-hidden
            className="fixed inset-0 z-30 pointer-events-none"
            style={{ background: '#D4AF37', mixBlendMode: 'screen' }}
          />
        </div>
      </div>
    </ChapterShell>
  );
}
