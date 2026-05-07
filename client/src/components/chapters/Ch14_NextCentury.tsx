// Ch.14 — The Next Century. 100 years from now.
// Warm contrast to the cosmic chapters around it: a procedural wheat field at
// sunset, wind rippling through. The first chapter after the choice; tone is
// projection, not fear.

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import WheatField from '../three/WheatField';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch14_NextCentury() {
  return (
    <ChapterShell index={14} background="#0A0303" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 1.3, 5], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#1F0A03']} />
          <ambientLight intensity={0.55} color="#FF6B35" />
          <WheatField />
          <EffectComposer>
            <Bloom intensity={0.55} luminanceThreshold={0.55} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 14 · Acceleration begins</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987, lineHeight: 1.05 }}>
          The next <span style={{ color: '#D4AF37' }}>hundred years</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.89)', marginTop: 34, maxWidth: 610 }}>
          In one hundred years, none of us will be here.<br />
          But the choice you make now ripples forward.
        </p>
      </div>
    </ChapterShell>
  );
}
