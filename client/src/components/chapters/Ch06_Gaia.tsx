// Ch.06 — Gaia. One blue marble. 4.5 billion years.

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import EarthGlobe from '../three/EarthGlobe';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch06_Gaia() {
  return (
    <ChapterShell index={6} background="#000814" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#000814']} />
          <ambientLight intensity={0.21} />
          <directionalLight position={[5, 3, 5]} intensity={1.3} />
          <StarField count={1597} radius={55} speed={0.008} />
          <EarthGlobe />
          <EffectComposer>
            <Bloom intensity={0.55} luminanceThreshold={0.34} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="relative z-10 flex items-end min-h-screen" style={{ paddingInline: 55, paddingBottom: 89 }}>
        <div style={{ maxWidth: 555 }}>
          <Eyebrow>Chapter 06 · Gaia</Eyebrow>
          <h2 className="h-display" style={{ fontSize: 89, marginTop: 34 }}>
            She has been here<br />since the beginning.
          </h2>
          <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34 }}>
            4.5 billion years. One sphere of water and stone, rotating in silence.
          </p>
        </div>
      </div>
    </ChapterShell>
  );
}
