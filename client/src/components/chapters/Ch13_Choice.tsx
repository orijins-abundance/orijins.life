// Ch.13 — THE CHOICE.
// The first masterpiece. Split-screen WebGL (Elysium / Aurora), live counters,
// live countdown to 2027-11-06 23:59 UTC, mouse-X spatial stereo audio mix,
// scroll-driven healing seam, and the only CTA that escapes the loop.

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitScene from '../three/SplitScene';
import Countdown from '@/components/ui/Countdown';
import { sound } from '@/lib/sound';
import { ChapterShell } from './_shell';

const LEFT_DATA = [
  { glyph: '☢', label: 'Active nuclear warheads', value: '~12,500' },
  { glyph: '⚔', label: 'Active armed conflicts', value: '56' },
  { glyph: '◉', label: 'Surveillance cameras', value: '1B+' },
  { glyph: '$', label: 'Wealth held by top 1%', value: '45.6%' },
];
const RIGHT_DATA = [
  { glyph: '✿', label: 'Trees planted this year', value: '~1.9B' },
  { glyph: '⌥', label: 'Open-source projects', value: '420M+' },
  { glyph: '☀', label: 'Solar capacity 2025', value: '~600 GW' },
  { glyph: '◈', label: 'Languages still alive', value: '~7,000' },
];

export default function Ch13_Choice() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const splitContentRef = useRef<HTMLDivElement>(null);

  const [seam, setSeam] = useState(0);       // 0..1
  const [mouseX, setMouseX] = useState(0.5); // 0..1
  const [healed, setHealed] = useState(false);

  // Track section progress for the healing seam.
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#chapter-13',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Seam stays at 0 until 65% of the chapter, then heals to 1.
          const s = Math.max(0, (p - 0.55) / 0.45);
          setSeam(Math.min(1, s));
          setHealed(s >= 0.97);
        },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  // Mouse-X audio mix.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      setMouseX(x);
      sound.setStereoMix(x);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Final reveal animation when seam fully heals.
  useEffect(() => {
    if (!healed) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        finalRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 2.1, ease: 'power2.out' },
      );
      gsap.to(splitContentRef.current, { opacity: 0.21, duration: 1.3, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, [healed]);

  return (
    <ChapterShell index={13} background="#0A0A0A" withGrain={false} fullBleed>
      {/* The chapter is taller than viewport so it can scrub through. */}
      <div ref={wrapRef} style={{ height: '300vh', position: 'relative' }}>
        <div className="sticky top-0 left-0 w-full" style={{ height: '100vh', overflow: 'hidden' }}>
          {/* WebGL split background */}
          <Canvas
            dpr={[1, 2]}
            orthographic
            camera={{ zoom: 1, position: [0, 0, 1] }}
            gl={{ antialias: true, alpha: false }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SplitScene seamProgress={seam} mouseX={mouseX} />
            <EffectComposer>
              <Bloom intensity={0.55} luminanceThreshold={0.34} luminanceSmoothing={0.55} mipmapBlur />
            </EffectComposer>
          </Canvas>

          {/* Header label */}
          <div className="absolute z-10" style={{ top: 34, left: 34 }}>
            <div className="flex items-center" style={{ gap: 13 }}>
              <span className="font-mono" style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em' }}>
                13 / 21
              </span>
              <span className="gold-arc" />
              <span className="font-mono" style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em', textTransform: 'uppercase' }}>
                The Choice
              </span>
            </div>
          </div>

          {/* SPLIT CONTENT */}
          <div ref={splitContentRef} className="absolute inset-0 grid" style={{ gridTemplateColumns: '1fr 1fr', transition: 'opacity 1.3s ease' }}>
            {/* LEFT — Elysium */}
            <div
              className="relative flex flex-col justify-end"
              style={{ padding: 55, color: '#FAFAF7' }}
            >
              <div className="font-mono" style={{ fontSize: 13, letterSpacing: '0.34em', color: '#FF4444', textTransform: 'uppercase' }}>
                Elysium · Concentration · Separation · Division
              </div>
              <h3 className="h-display" style={{ fontSize: 55, marginTop: 21, color: '#FAFAF7' }}>
                The path of the few.
              </h3>
              <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {LEFT_DATA.map((d) => (
                  <div key={d.label} className="flex items-baseline" style={{ gap: 13 }}>
                    <span style={{ color: '#FF4444', width: 21 }}>{d.glyph}</span>
                    <span className="font-mono" style={{ color: 'rgba(250,250,247,0.75)', fontSize: 13, letterSpacing: '0.13em' }}>
                      {d.label}
                    </span>
                    <span style={{ flex: 1, height: 1, background: 'rgba(255,68,68,0.21)' }} />
                    <span className="font-mono" style={{ color: '#FAFAF7', fontSize: 21, fontVariantNumeric: 'tabular-nums' }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-mono" style={{ fontSize: 13, color: 'rgba(255,68,68,0.55)', marginTop: 21, letterSpacing: '0.13em' }}>
                {/* TODO: live API */}
                // TODO: live API · placeholder data
              </div>
            </div>

            {/* RIGHT — Aurora */}
            <div
              className="relative flex flex-col justify-end"
              style={{ padding: 55, color: '#FAFAF7' }}
            >
              <div className="font-mono" style={{ fontSize: 13, letterSpacing: '0.34em', color: '#D4AF37', textTransform: 'uppercase', textAlign: 'right' }}>
                Aurora · Unity · Consecration · Life · Peace · Abundance
              </div>
              <h3 className="h-display" style={{ fontSize: 55, marginTop: 21, color: '#D4AF37', textAlign: 'right' }}>
                The path of the many.
              </h3>
              <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {RIGHT_DATA.map((d) => (
                  <div key={d.label} className="flex items-baseline" style={{ gap: 13 }}>
                    <span className="font-mono" style={{ color: '#FAFAF7', fontSize: 21, fontVariantNumeric: 'tabular-nums' }}>
                      {d.value}
                    </span>
                    <span style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.34)' }} />
                    <span className="font-mono" style={{ color: 'rgba(250,250,247,0.75)', fontSize: 13, letterSpacing: '0.13em', textAlign: 'right' }}>
                      {d.label}
                    </span>
                    <span style={{ color: '#D4AF37', width: 21, textAlign: 'right' }}>{d.glyph}</span>
                  </div>
                ))}
              </div>
              <div className="font-mono" style={{ fontSize: 13, color: 'rgba(212,175,55,0.55)', marginTop: 21, letterSpacing: '0.13em', textAlign: 'right' }}>
                // TODO: live API · placeholder data
              </div>
            </div>
          </div>

          {/* Center: tagline + countdown above seam */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingInline: 21 }}>
            <div className="font-display italic" style={{ fontSize: 34, color: '#FAFAF7', textAlign: 'center', marginBottom: 21 }}>
              You have 18 months.
            </div>
            <Countdown />
            <div className="font-display italic" style={{ fontSize: 34, color: '#D4AF37', textAlign: 'center', marginTop: 21 }}>
              What will you choose?
            </div>
            <div className="font-mono" style={{ marginTop: 34, color: 'rgba(250,250,247,0.55)', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase', textAlign: 'center' }}>
              {seam < 0.13
                ? 'Move your mouse left and right · feel the mix shift'
                : seam < 0.97
                ? 'The seam is closing'
                : 'I am what I choose'}
            </div>
          </div>

          {/* FINAL REVEAL — heals seam, replaces split copy */}
          {healed && (
            <div
              ref={finalRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ paddingInline: 21, background: 'radial-gradient(ellipse at center, rgba(10,10,10,0) 0%, rgba(10,10,10,0.89) 100%)' }}
            >
              <div className="h-display" style={{ fontSize: 89, color: '#D4AF37', maxWidth: 987, lineHeight: 1.05 }}>
                I am what I choose.
              </div>
              <a
                href="https://gaia.orijins.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-[1.02]"
                style={{
                  marginTop: 55,
                  padding: '21px 34px',
                  background: '#D4AF37',
                  color: '#0A0A0A',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 21,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 89px rgba(212,175,55,0.34)',
                }}
              >
                Continue your journey →
              </a>
              <div className="font-mono" style={{ marginTop: 34, color: 'rgba(250,250,247,0.55)', fontSize: 13, letterSpacing: '0.21em' }}>
                or keep scrolling — at your own peril
              </div>
            </div>
          )}
        </div>
      </div>
    </ChapterShell>
  );
}
