// Ch.09 — Twenty Watts. You run on a lightbulb.
//
// Live brain visualization: 987 neurons firing on an ellipsoidal point cloud,
// synapse-cyan when at rest, gold when firing, additive blending so the firing
// neurons read as living electricity. Side panel: 20 W counter that pulses
// to the same rhythm.

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import BrainSparks from '../three/BrainSparks';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch09_TwentyWatts() {
  const wattRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(wattRef.current, {
        textShadow: '0 0 55px rgba(212,175,55,0.55)',
        scale: 1.034,
        duration: 1.3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <ChapterShell index={9} background="#0A0A0A" withGrain={false}>
      {/* Brain Canvas — left side, half-bleed */}
      <div className="absolute" style={{ top: 0, right: 0, width: '55%', height: '100%' }}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 55 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.13} />
          <BrainSparks count={1597} />
          <EffectComposer>
            <Bloom intensity={1.34} luminanceThreshold={0.21} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="relative z-10 min-h-screen flex items-center" style={{ paddingInline: 55 }}>
        <div style={{ maxWidth: 610 }}>
          <Eyebrow>Chapter 09 · Twenty Watts</Eyebrow>
          <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, lineHeight: 1.05 }}>
            You run on a<br /><span style={{ color: '#D4AF37' }}>lightbulb</span>.
          </h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 13, marginTop: 55 }}>
            <span ref={wattRef} className="font-display" style={{ fontSize: 144, color: '#D4AF37', lineHeight: 1, display: 'inline-block' }}>
              20
            </span>
            <span className="font-mono" style={{ fontSize: 21, color: '#D4AF37', letterSpacing: '0.13em' }}>W</span>
          </div>
          <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34 }}>
            86 billion neurons. 100 trillion synapses.<br />
            The most complex object in the known universe &mdash;
            running on less than a household lightbulb.
          </p>
          <div className="font-mono" style={{ marginTop: 34, color: 'rgba(250,250,247,0.55)', fontSize: 13, letterSpacing: '0.21em' }}>
            86,000,000,000 neurons · 100,000,000,000,000 synapses
          </div>
          <div className="font-mono" style={{ marginTop: 21, color: '#00D9FF', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase' }}>
            For comparison · GPT-4 training: ~50,000,000 W
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
