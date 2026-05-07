// Ch.01 — The Breath. The site begins with one inhale.
// Black screen, slow heartbeat sound, founding line fades in (Playfair, 89px, gold).

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell } from './_shell';

export default function Ch01_Breath() {
  const lineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([lineRef.current, subRef.current, cueRef.current], { opacity: 0, y: 21 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#chapter-1',
          start: 'top 80%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
        },
      });
      tl.to(lineRef.current, { opacity: 1, y: 0, duration: 2.1, ease: 'power2.out' })
        .to(subRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '-=0.8')
        .to(cueRef.current, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '-=0.5');

      // Subtle gold breathing pulse on the founding line
      gsap.to(lineRef.current, {
        textShadow: '0 0 34px rgba(212,175,55,0.34)',
        duration: 2.1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={1} background="#0A0A0A">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <div ref={lineRef} className="h-display" style={{ fontSize: 89, color: '#D4AF37', maxWidth: 1000, lineHeight: 1.05 }}>
          Everyone should know the<br />vehicle they’re in.
        </div>
        <div ref={subRef} className="font-sans" style={{ marginTop: 34, fontSize: 21, color: 'rgba(250,250,247,0.55)', letterSpacing: '0.05em' }}>
          One breath in. One breath out.
        </div>
        <div ref={cueRef} className="font-mono" style={{ marginTop: 89, color: '#D4AF37', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase' }}>
          Scroll to begin →
        </div>
      </div>
    </ChapterShell>
  );
}
