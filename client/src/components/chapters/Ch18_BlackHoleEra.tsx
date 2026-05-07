// Ch.18 — Black Hole Era. 10⁴⁰ years.
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch18_BlackHoleEra() {
  return (
    <ChapterShell index={18} background="#000000" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#000000']} />
          {/* Accretion disk hint — torus + bloom */}
          <mesh rotation={[1.3, 0, 0]}>
            <torusGeometry args={[2.1, 0.34, 21, 89]} />
            <meshBasicMaterial color="#5B2D8C" />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.3, 55, 55]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <EffectComposer>
            <Bloom intensity={1.3} luminanceThreshold={0.13} luminanceSmoothing={0.55} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end text-center" style={{ paddingBottom: 89, paddingInline: 21 }}>
        <Eyebrow>Chapter 18 · 10⁴⁰ years</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 1100 }}>
          Black holes <span style={{ color: '#5B2D8C' }}>consume</span> what remains.
        </h2>
      </div>
    </ChapterShell>
  );
}
