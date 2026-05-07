// Ch.20 — Heat Death. 10¹⁰⁰ years.
// "Time becomes meaningless." → "Nothing happens." → "Forever."  3.4s apart.
// Then 5 full seconds of pure black, total silence, no scroll possible.
// Triggers Ch.21 automatically (managed by the loop manager in App.tsx).

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setScrollLocked } from '@/lib/scroll';
import { sound } from '@/lib/sound';
import { ChapterShell, Eyebrow } from './_shell';

interface Props {
  /** Called when the 5-second silence has fully elapsed → start Ch.21. */
  onSilenceEnd: () => void;
}

export default function Ch20_HeatDeath({ onSilenceEnd }: Props) {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'fading' | 'silence'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([ref1.current, ref2.current, ref3.current], { opacity: 0, y: 21 });
      gsap.set(blackOverlayRef.current, { opacity: 0 });

      ScrollTrigger.create({
        trigger: '#chapter-20',
        start: 'top 40%',
        once: true,
        onEnter: () => {
          const r1 = ref1.current;
          const r2 = ref2.current;
          const r3 = ref3.current;
          const overlay = blackOverlayRef.current;
          if (!r1 || !r2 || !r3) return;
          setPhase('fading');
          const tl = gsap.timeline({
            onComplete: () => {
              setPhase('silence');
              setScrollLocked(true);
              sound.silence(255);
              if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.55 });
              setTimeout(() => { onSilenceEnd(); }, 5000);
            },
          });
          tl.to(r1, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' })
            .to(r1, { opacity: 0.34, duration: 0.5 }, '+=' + (3.4 - 1.3))
            .to(r2, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' })
            .to(r2, { opacity: 0.34, duration: 0.5 }, '+=' + (3.4 - 1.3))
            .to(r3, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' })
            .to([r1, r2, r3], { opacity: 0, duration: 1.3 }, '+=' + (3.4 - 1.3));
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [onSilenceEnd]);

  return (
    <ChapterShell index={20} background="#000000" withGrain={false} withVignette={false}>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        {phase === 'idle' && <Eyebrow>Chapter 20 · 10¹⁰⁰ years</Eyebrow>}
        <div ref={ref1} className="h-display" style={{ fontSize: 55, marginTop: 21, color: '#FAFAF7' }}>
          Time becomes meaningless.
        </div>
        <div ref={ref2} className="h-display" style={{ fontSize: 55, marginTop: 21, color: 'rgba(250,250,247,0.75)' }}>
          Nothing happens.
        </div>
        <div ref={ref3} className="h-display" style={{ fontSize: 55, marginTop: 21, color: 'rgba(250,250,247,0.34)' }}>
          Forever.
        </div>
      </div>
      {/* Pure black overlay during the 5-second silence */}
      <div
        ref={blackOverlayRef}
        className="fixed inset-0 z-[60] pointer-events-none"
        style={{ background: '#000000' }}
        aria-hidden
      />
    </ChapterShell>
  );
}
