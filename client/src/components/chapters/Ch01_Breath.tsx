// Ch.01 — The Breath. The site begins with one inhale.
//
// The chapter is structured around a single breathing gold ring at the centre.
// The ring pulses at exactly 60 BPM (1s cycle), matching the synthesized heartbeat
// in lib/heartbeat.ts so the visual and audio are sample-accurate to each other.
// A GSAP timeline drips four lines of copy into the void in Fibonacci timing.
//
// Pure CSS for the ring (cheap, GPU-accelerated, accessible) — no Canvas needed
// because the BackgroundCanvas is set to 'void' for this chapter and renders nothing.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell } from './_shell';

export default function Ch01_Breath() {
  const ringRef = useRef<HTMLDivElement>(null);
  const breatheRef = useRef<HTMLDivElement>(null);
  const aliveRef = useRef<HTMLDivElement>(null);
  const beatsRef = useRef<HTMLDivElement>(null);
  const foundingRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [breatheRef.current, aliveRef.current, beatsRef.current, foundingRef.current, cueRef.current],
        { opacity: 0, y: 21 },
      );
      gsap.set(ringRef.current, { opacity: 0, scale: 0.55 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#chapter-1',
          start: 'top 89%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
        },
      });

      tl
        .to(ringRef.current, { opacity: 1, scale: 1, duration: 2.1, ease: 'power2.out' })
        .to(breatheRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '+=0.55')
        .to(breatheRef.current, { opacity: 0, y: -13, duration: 1.3, ease: 'power2.in' }, '+=2.1')
        .to(aliveRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '+=0.21')
        .to(aliveRef.current, { opacity: 0, y: -13, duration: 1.3, ease: 'power2.in' }, '+=2.1')
        .to(beatsRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '+=0.21')
        .to(beatsRef.current, { opacity: 0, y: -13, duration: 1.3, ease: 'power2.in' }, '+=3.4')
        .to(foundingRef.current, { opacity: 1, y: 0, duration: 2.1, ease: 'power2.out' }, '+=0.21')
        .to(cueRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '+=2.1');
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={1} background="#0A0A0A" withGrain withVignette>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ paddingInline: 21 }}
      >
        <div
          ref={ringRef}
          aria-hidden
          className="ch1-ring"
          style={{
            width: 233,
            height: 233,
            marginBottom: 89,
            borderRadius: '50%',
            border: '1px solid #D4AF37',
            boxShadow: '0 0 89px rgba(212,175,55,0.34), inset 0 0 55px rgba(212,175,55,0.21)',
            position: 'relative',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              margin: 'auto',
              width: 21,
              height: 21,
              borderRadius: '50%',
              background: '#D4AF37',
              boxShadow: '0 0 34px #D4AF37',
              animation: 'ch1-dot 1s ease-in-out infinite',
            }}
          />
        </div>

        <div className="relative" style={{ height: 233, width: '100%', maxWidth: 987 }}>
          <div
            ref={breatheRef}
            className="absolute inset-0 flex items-center justify-center font-display"
            style={{ fontSize: 144, fontWeight: 500, letterSpacing: '-0.02em', color: '#D4AF37', lineHeight: 1 }}
          >
            Breathe.
          </div>
          <div
            ref={aliveRef}
            className="absolute inset-0 flex items-center justify-center font-display"
            style={{ fontSize: 89, fontWeight: 500, letterSpacing: '-0.02em', color: '#FAFAF7', lineHeight: 1 }}
          >
            You are alive.
          </div>
          <div
            ref={beatsRef}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ gap: 13 }}
          >
            <span
              className="font-display"
              style={{ fontSize: 55, fontWeight: 500, letterSpacing: '-0.02em', color: '#FAFAF7', lineHeight: 1.13 }}
            >
              100,800 times today,<br />your heart will beat.
            </span>
            <span
              className="font-mono"
              style={{ fontSize: 13, color: 'rgba(212,175,55,0.89)', letterSpacing: '0.34em', textTransform: 'uppercase' }}
            >
              Without you asking
            </span>
          </div>
          <div
            ref={foundingRef}
            className="absolute inset-0 flex items-center justify-center font-display"
            style={{
              fontSize: 89,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#D4AF37',
              lineHeight: 1.05,
              padding: '0 21px',
              textShadow: '0 0 55px rgba(212,175,55,0.34)',
            }}
          >
            Everyone should know the<br />vehicle they&rsquo;re in.
          </div>
        </div>

        <div
          ref={cueRef}
          className="font-mono"
          style={{
            marginTop: 89,
            color: 'rgba(212,175,55,0.55)',
            fontSize: 13,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
          }}
        >
          Scroll to begin →
        </div>
      </div>

      <style>{`
        @keyframes ch1-dot {
          0%, 100% { transform: scale(0.55); opacity: 0.55; box-shadow: 0 0 21px #D4AF37; }
          50%      { transform: scale(1.13); opacity: 1.0; box-shadow: 0 0 55px #D4AF37; }
        }
        .ch1-ring { animation: ch1-ring 1s ease-in-out infinite; }
        @keyframes ch1-ring {
          0%, 100% { transform: scale(1); box-shadow: 0 0 89px rgba(212,175,55,0.34), inset 0 0 55px rgba(212,175,55,0.21); }
          50%      { transform: scale(1.034); box-shadow: 0 0 144px rgba(212,175,55,0.55), inset 0 0 89px rgba(212,175,55,0.34); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ch1-ring { animation: none; }
          @keyframes ch1-dot { from, to { transform: scale(1); opacity: 0.89; } }
        }
      `}</style>
    </ChapterShell>
  );
}
