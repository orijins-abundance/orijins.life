// Ch.16 — The Sun Dies. 5 billion years.
// A red giant, rendered with a fbm shader that boils slowly. Earth's seas evaporate.

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RedGiant from '../three/RedGiant';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch16_SunDies() {
  return (
    <ChapterShell index={16} background="#0A0303" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 13], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#0A0303']} />
          <ambientLight intensity={0.13} />
          <RedGiant />
          <StarField count={987} radius={89} color="#FAFAF7" />
          <EffectComposer>
            <Bloom intensity={2.1} luminanceThreshold={0.21} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end text-center" style={{ paddingBottom: 89, paddingInline: 21 }}>
        <Eyebrow>Chapter 16 · 5 billion years from now</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987, lineHeight: 1.05 }}>
          The Sun <span style={{ color: '#FF6B35' }}>swells</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34, maxWidth: 610 }}>
          A red giant, larger than Earth&rsquo;s orbit. The oceans boil away.
          The blue marble vanishes &mdash; quietly, completely.
        </p>
      </div>
    </ChapterShell>
  );
}
