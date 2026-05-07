// Ch.21 — Rebirth. The Ouroboros closes.
// 1. After 5s of black silence, a single white pixel appears at exact center.
// 2. Over 3.4s, it grows into the same BigBangParticles system from Ch.3.
// 3. As it fills the viewport, scrollY is reset to 0 instantly, the WebGL
//    canvas crossfades from Ch.21 → Ch.1, the heartbeat restarts, the hash
//    increments to #loop-N+1. No visible reload.

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import BigBangParticles from '../three/BigBangParticles';
import { ChapterShell } from './_shell';
import { sound } from '@/lib/sound';
import { scrollResetInstant, setScrollLocked } from '@/lib/scroll';
import { incrementLoop } from '@/lib/loop';

interface Props {
  /** Whether Ch.20's silence has finished and Ch.21 should now play out. */
  active: boolean;
  /** Called when the loop has closed and we are back at Ch.1. */
  onLoopClose: () => void;
}

export default function Ch21_Rebirth({ active, onLoopClose }: Props) {
  const pixelRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // BigBang particle progress 0..1
  const [showCanvas, setShowCanvas] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!active) return;
    let aborted = false;

    // Black is already on (from Ch.20). Lock scroll for first 3 seconds.
    setScrollLocked(true);

    const tl = gsap.timeline({
      onComplete: () => {
        if (aborted) return;
        // Loop close.
        setClosing(true);
        // Crossfade L'INFINI → Le Souffle (3.4s) handled inside sound.setChapter(1) (FADE_LOOP_CLOSE_MS).
        sound.setChapter(1);
        scrollResetInstant();
        incrementLoop();
        setTimeout(() => {
          if (aborted) return;
          // Fade the black overlay back out — we are now at Ch.1.
          gsap.to(blackRef.current, { opacity: 0, duration: 1.3, ease: 'power2.out' });
          setScrollLocked(false);
          setShowCanvas(false);
          setProgress(0);
          setClosing(false);
          onLoopClose();
        }, 100);
      },
    });

    // 1) Pixel appears at center
    tl.set(pixelRef.current, { opacity: 0, scale: 1 })
      .to(pixelRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      // 2) Grow the pixel and reveal the WebGL canvas
      .add(() => {
        setShowCanvas(true);
        // Start the L'INFINI track as the explosion grows.
        sound.setChapter(21);
      })
      // 3) Drive BigBangParticles progress 0→1 over 3.4s (Fibonacci)
      .to({ p: 0 }, {
        p: 1,
        duration: 3.4,
        ease: 'power2.in',
        onUpdate() { setProgress(this.targets()[0].p); },
      }, '+=0.21')
      // 4) Brighten the screen white at the peak
      .to(blackRef.current, { background: '#FAFAF7', opacity: 1, duration: 0.55, ease: 'power2.in' }, '-=0.34')
      .to(blackRef.current, { background: '#000000', opacity: 1, duration: 0.5 }); // back to black before reset

    return () => {
      aborted = true;
      tl.kill();
    };
  }, [active, onLoopClose]);

  return (
    <ChapterShell index={21} background="#000000" withGrain={false} withVignette={false} fullBleed>
      <div className="absolute inset-0">
        {showCanvas && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 21], fov: 55 }}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={['#000000']} />
            <BigBangParticles progress={progress} intensity={1.0} />
            <EffectComposer>
              <Bloom intensity={2.1} luminanceThreshold={0.13} luminanceSmoothing={0.55} mipmapBlur />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {/* Single luminous pixel */}
      <div
        ref={pixelRef}
        aria-hidden
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[55] pointer-events-none"
        style={{
          width: 2,
          height: 2,
          background: '#FAFAF7',
          boxShadow: '0 0 21px 3px rgba(250,250,247,0.89)',
          opacity: 0,
        }}
      />

      {/* Black overlay used by Ch.20 → covers the entire viewport during the loop close */}
      <div
        ref={blackRef}
        aria-hidden
        className="fixed inset-0 z-[60] pointer-events-none"
        style={{ background: '#000000', opacity: active ? 1 : 0 }}
      />

      {closing && (
        <div className="absolute inset-0 flex items-center justify-center z-[70]" aria-live="polite">
          <span className="font-mono" style={{ color: '#0A0A0A', fontSize: 13, letterSpacing: '0.34em' }}>
            ↻
          </span>
        </div>
      )}
    </ChapterShell>
  );
}
