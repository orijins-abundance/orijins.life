// Ch.05 — The Spiral. Fibonacci is the architecture of the universe.
// One spiral that morphs across scales: galaxy → hurricane → nautilus → DNA → cochlea.

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import SpiralMorph from '../three/SpiralMorph';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch05_Spiral() {
  return (
    <ChapterShell index={5} background="#0A0A0A" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 21], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <SpiralMorph count={2584} />
          <EffectComposer>
            <Bloom intensity={1.13} luminanceThreshold={0.21} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="relative z-10 flex items-center min-h-screen" style={{ paddingInline: 55 }}>
        <div style={{ maxWidth: 610 }}>
          <Eyebrow>Chapter 05 · The Spiral</Eyebrow>
          <h2 className="h-display" style={{ fontSize: 89, marginTop: 34 }}>
            One shape.<br /><span style={{ color: '#D4AF37' }}>At every scale.</span>
          </h2>
          <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34 }}>
            Galaxy. Hurricane. Nautilus. DNA. The cochlea inside your ear.<br />
            The same Fibonacci spiral, revealed at every scale of the cosmos.
          </p>
          <div className="font-mono" style={{ marginTop: 55, color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em' }}>
            φ = 1.618033988…
          </div>
          <div className="font-mono" style={{ marginTop: 13, color: 'rgba(250,250,247,0.34)', fontSize: 13, letterSpacing: '0.13em', textTransform: 'uppercase' }}>
            golden ratio &middot; orijins.law &middot; 13 + 21 + 34 = 68
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
