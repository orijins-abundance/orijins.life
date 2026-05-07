// Ch.14 — The Next Century. 100 years.
import { Canvas } from '@react-three/fiber';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch14_NextCentury() {
  return (
    <ChapterShell index={14} background="#040405" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 21], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#040405']} />
          <StarField count={2584} radius={89} speed={0.034} />
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 14 · Acceleration begins</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987 }}>
          The next <span style={{ color: '#D4AF37' }}>hundred years</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34, maxWidth: 610 }}>
          Cities rise. Ice caps shift. Satellites multiply. The Earth keeps spinning — faster now.
        </p>
      </div>
    </ChapterShell>
  );
}
