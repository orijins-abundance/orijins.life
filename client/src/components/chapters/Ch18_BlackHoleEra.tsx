// Ch.18 — Black Hole Era. 10⁴⁰ years.
// Procedural accretion disc shader + dark event horizon. Bloom catches the
// brightest swirls and lets them bleed through the void.

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import BlackHoleDisc from '../three/BlackHoleDisc';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch18_BlackHoleEra() {
  return (
    <ChapterShell index={18} background="#000000" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#000000']} />
          <BlackHoleDisc />
          <EffectComposer>
            <Bloom intensity={1.55} luminanceThreshold={0.13} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end text-center" style={{ paddingBottom: 89, paddingInline: 21 }}>
        <Eyebrow>Chapter 18 · 10⁴⁰ years from now</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987, lineHeight: 1.05 }}>
          Black holes <span style={{ color: '#5B2D8C' }}>inherit</span> what remains.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 34, maxWidth: 610 }}>
          The last stars are gone. Only black holes remain &mdash;<br />
          cold, patient, and very, very slow.
        </p>
      </div>
    </ChapterShell>
  );
}
