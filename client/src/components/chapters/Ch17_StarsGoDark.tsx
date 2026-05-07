// Ch.17 — Stars Go Dark. 10¹⁴ years. Degenerate Era.
// Stars literally fade out one by one over the chapter lifetime — the visitor
// watches the cosmic boneyard form in real time.

import { Canvas } from '@react-three/fiber';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch17_StarsGoDark() {
  return (
    <ChapterShell index={17} background="#020203" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 21], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#020203']} />
          <StarField count={1597} radius={89} speed={0.005} color="#FAFAF7" decay decayDuration={21} />
          <StarField count={233} radius={89} speed={0.003} color="#5B2D8C" />
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 17 · 10¹⁴ years from now</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987, lineHeight: 1.05 }}>
          The last red dwarfs <span style={{ color: '#5B2D8C' }}>go out</span>.
        </h2>
        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 34, maxWidth: 610 }}>
          One by one, the stars exhaust their fuel. A cosmic boneyard
          of stellar remnants drifts in the dark.
        </p>
      </div>
    </ChapterShell>
  );
}
