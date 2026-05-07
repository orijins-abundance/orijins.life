// Ch.15 — Ten Thousand. 10,000 years.
import { Canvas } from '@react-three/fiber';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch15_TenThousand() {
  return (
    <ChapterShell index={15} background="#06060A" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 21], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#06060A']} />
          <StarField count={1597} radius={89} speed={0.055} />
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 15 · Ten thousand years</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987 }}>
          Constellations <span style={{ color: '#D4AF37' }}>wander</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34, maxWidth: 610 }}>
          Monuments erode. Languages dissolve. Continents drift like slow ships.
        </p>
      </div>
    </ChapterShell>
  );
}
