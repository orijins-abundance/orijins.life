// Ch.19 — Evaporation. 10⁹⁶ years. Last black hole evaporates. Single flash of light.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch19_Evaporation() {
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(flashRef.current, { opacity: 0, scale: 0.5 });
      gsap.timeline({
        scrollTrigger: { trigger: '#chapter-19', start: 'top 30%', toggleActions: 'play none none reverse' },
      })
        .to(flashRef.current, { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' })
        .to(flashRef.current, { opacity: 0, scale: 1.3, duration: 2.1, ease: 'power2.in' }, '+=0.55');
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={19} background="#000000" withGrain={false}>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 19 · 10⁹⁶ years</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987 }}>
          A single <span style={{ color: '#FAFAF7' }}>flash</span>.
        </h2>
        <div
          ref={flashRef}
          aria-hidden
          style={{
            marginTop: 89,
            width: 89, height: 89,
            borderRadius: '50%',
            background: '#FAFAF7',
            boxShadow: '0 0 144px 55px rgba(250,250,247,0.55)',
          }}
        />
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 89, maxWidth: 610 }}>
          The last black hole has evaporated.
        </p>
      </div>
    </ChapterShell>
  );
}
