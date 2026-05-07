// Ch.10 — The Day · VESALIUS moment.
//
// Scroll-locked pin chapter that takes the visitor through 4 beats of their own
// vehicle in 34 Fibonacci seconds:
//
//   Beat 1 — Heart: anatomical heart pulses at 60 BPM, "100,800 times today"
//   Beat 2 — Lungs: bronchial form breathes 16 cycles/min, "23,040 times"
//   Beat 3 — Blood: particle flow on a coiled artery, "every cell, every minute"
//   Beat 4 — Synthesis: triptyque, founding line returns
//
// All visuals are procedural shaders (HeartAnatomical, LungsBronchial, BloodFlow).
// No GLTF assets required. The chapter owns its own <Canvas> at full bleed —
// BackgroundCanvas yields ('vesalius' returns null).

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeartAnatomical from '../three/HeartAnatomical';
import LungsBronchial from '../three/LungsBronchial';
import BloodFlow from '../three/BloodFlow';
import { ChapterShell } from './_shell';

type Beat = 'heart' | 'lungs' | 'blood' | 'synthesis';

const COPY: Record<Beat, { primary: string; secondary: string; kicker: string }> = {
  heart: {
    kicker: 'In one day',
    primary: 'Your heart beats 100,800 times.',
    secondary: 'You don’t have to ask.',
  },
  lungs: {
    kicker: 'In one day',
    primary: 'You breathe 23,040 times.',
    secondary: 'You don’t have to remember.',
  },
  blood: {
    kicker: 'In one minute',
    primary: 'Your blood reaches every cell.',
    secondary: 'You are not driving the vehicle. You are the vehicle.',
  },
  synthesis: {
    kicker: 'And tomorrow',
    primary: 'It will all start again.',
    secondary: 'Everyone should know the vehicle they’re in.',
  },
};

export default function Ch10_TheDay() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState<Beat>('heart');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#chapter-10',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          // Split 0..1 into 4 quarters
          if (p < 0.21) setBeat('heart');
          else if (p < 0.5) setBeat('lungs');
          else if (p < 0.79) setBeat('blood');
          else setBeat('synthesis');
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  const copy = COPY[beat];

  return (
    <ChapterShell index={10} background="#0A0A0A" withGrain withVignette fullBleed>
      <div ref={wrapRef} style={{ height: '300vh', position: 'relative' }}>
        <div className="sticky top-0 left-0 w-full" style={{ height: '100vh', overflow: 'hidden' }}>
          {/* Header label */}
          <div className="absolute z-10" style={{ top: 34, left: 34 }}>
            <div className="flex items-center" style={{ gap: 13 }}>
              <span className="font-mono" style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em' }}>
                10 / 21
              </span>
              <span className="gold-arc" />
              <span className="font-mono" style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em', textTransform: 'uppercase' }}>
                The Day
              </span>
            </div>
          </div>

          {/* WebGL canvas — only one of the 3 organ visuals at a time */}
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 55 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ambientLight intensity={0.13} />
            <pointLight position={[5, 5, 5]} intensity={0.55} color="#D4AF37" />
            {beat === 'heart' && <HeartAnatomical progress={1} />}
            {beat === 'lungs' && <LungsBronchial progress={1} />}
            {beat === 'blood' && <BloodFlow count={2584} progress={1} />}
            {beat === 'synthesis' && (
              <group>
                <group position={[-2.1, 0, 0]} scale={0.55}><HeartAnatomical progress={1} /></group>
                <group position={[0, 0, 0]} scale={0.55}><LungsBronchial progress={1} /></group>
                <group position={[2.1, 0, 0]} scale={0.55}><BloodFlow count={1597} progress={1} /></group>
              </group>
            )}
            <EffectComposer>
              <Bloom intensity={0.55} luminanceThreshold={0.34} luminanceSmoothing={0.55} mipmapBlur />
            </EffectComposer>
          </Canvas>

          {/* Copy overlay — bottom-aligned, never covers the visual */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ left: 0, right: 0, bottom: 89, padding: '0 55px', textAlign: 'center' }}
          >
            <div
              key={beat + '-kicker'}
              className="font-mono ch10-fade"
              style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase' }}
            >
              {copy.kicker}
            </div>
            <h2
              key={beat + '-primary'}
              className="h-display ch10-fade"
              style={{
                fontSize: 89,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: beat === 'synthesis' ? '#D4AF37' : '#FAFAF7',
                marginTop: 21,
                lineHeight: 1.05,
              }}
            >
              {copy.primary}
            </h2>
            <p
              key={beat + '-secondary'}
              className="font-display italic ch10-fade"
              style={{
                fontSize: 34,
                color: 'rgba(250,250,247,0.75)',
                marginTop: 21,
                maxWidth: 987,
                marginInline: 'auto',
              }}
            >
              {copy.secondary}
            </p>
          </div>

          {/* Progress dots — 4 beats */}
          <div
            className="absolute z-20"
            style={{ top: '50%', right: 34, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 13 }}
          >
            {(['heart', 'lungs', 'blood', 'synthesis'] as Beat[]).map((b) => (
              <span
                key={b}
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: b === beat ? '#D4AF37' : 'rgba(212,175,55,0.21)',
                  boxShadow: b === beat ? '0 0 13px rgba(212,175,55,0.55)' : 'none',
                  transition: 'all 0.55s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ch10-fade { animation: ch10-fade 0.89s ease-out; }
        @keyframes ch10-fade {
          from { opacity: 0; transform: translateY(13px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ch10-fade { animation: none; }
        }
      `}</style>

      <span className="sr-only">Scroll progress: {Math.round(progress * 100)}%</span>
    </ChapterShell>
  );
}
