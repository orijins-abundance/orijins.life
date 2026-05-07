// Ch.03 — Big Bang. 13.8 billion years ago.
// WebGL particle explosion driven by scroll velocity. Reuses BigBangParticles.

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ChapterShell, Eyebrow } from './_shell';
import BigBangParticles from '../three/BigBangParticles';

export default function Ch03_BigBang() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const seen = Math.max(0, Math.min(total, window.innerHeight - rect.top));
      setProgress(Math.max(0, Math.min(1, seen / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ChapterShell index={3} background="#000000" withGrain={false}>
      <div ref={sectionRef} className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 21], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#000000']} />
          <BigBangParticles progress={progress} />
          <EffectComposer>
            <Bloom intensity={1.3} luminanceThreshold={0.13} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-end text-center pointer-events-none" style={{ paddingBottom: 89 }}>
        <Eyebrow>13.8 billion years ago</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, color: '#FAFAF7' }}>
          A single point.<br /><span style={{ color: '#D4AF37' }}>Then everything.</span>
        </h2>
      </div>
    </ChapterShell>
  );
}
