// Ch.19 — Evaporation. 10⁹⁶ years. The last black hole evaporates.
//
// Visual: a tiny black hole disc that shrinks toward zero scale, then a single
// flash of Hawking radiation. The disc shader is shared with Ch.18, but here it
// runs at much smaller scale — the patient erosion of even the eternal.

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackHoleDisc from '../three/BlackHoleDisc';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch19_Evaporation() {
  const flashRef = useRef<HTMLDivElement>(null);
  const holeWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(flashRef.current, { opacity: 0, scale: 0.21 });
      gsap.set(holeWrapRef.current, { scale: 0.55 });

      ScrollTrigger.create({
        trigger: '#chapter-19',
        start: 'top 60%',
        end: 'bottom 30%',
        scrub: 1.3,
        onUpdate: (self) => {
          // Black hole shrinks with scroll progress
          if (holeWrapRef.current) {
            holeWrapRef.current.style.transform = `scale(${0.55 - self.progress * 0.4})`;
          }
        },
      });

      // Flash on chapter exit
      ScrollTrigger.create({
        trigger: '#chapter-19',
        start: 'bottom 50%',
        once: true,
        onEnter: () => {
          gsap.timeline()
            .to(flashRef.current, { opacity: 1, scale: 1, duration: 0.21, ease: 'power2.out' })
            .to(flashRef.current, { opacity: 0, scale: 1.55, duration: 1.3, ease: 'power2.in' });
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={19} background="#000000" withGrain={false}>
      {/* Shrinking black hole */}
      <div ref={holeWrapRef} className="absolute inset-0" style={{ transformOrigin: 'center', willChange: 'transform' }}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 55 }} gl={{ antialias: true, alpha: true }}>
          <BlackHoleDisc />
          <EffectComposer>
            <Bloom intensity={1.13} luminanceThreshold={0.13} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Hawking flash */}
      <div
        ref={flashRef}
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          style={{
            width: 144,
            height: 144,
            borderRadius: '50%',
            background: '#FAFAF7',
            boxShadow: '0 0 233px 89px rgba(250,250,247,0.89), 0 0 377px 144px rgba(212,175,55,0.34)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end text-center" style={{ paddingBottom: 89, paddingInline: 21 }}>
        <Eyebrow>Chapter 19 · 10⁹⁶ years from now</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987, lineHeight: 1.05 }}>
          A single <span style={{ color: '#FAFAF7' }}>flash</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 34, maxWidth: 610 }}>
          Even black holes evaporate &mdash; one photon at a time.<br />
          The last one is gone. The universe is empty.
        </p>
      </div>
    </ChapterShell>
  );
}
