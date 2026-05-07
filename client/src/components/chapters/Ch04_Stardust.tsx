// Ch.04 — Stardust. You are made of dead stars.
// Stars + element labels in JetBrains Mono.

import { Canvas } from '@react-three/fiber';
import StarField from '../three/StarField';
import { ChapterShell, Eyebrow } from './_shell';

const ELEMENTS = [
  { sym: 'H', name: 'Hydrogen', pct: '9.5%' },
  { sym: 'O', name: 'Oxygen', pct: '65%' },
  { sym: 'C', name: 'Carbon', pct: '18%' },
  { sym: 'N', name: 'Nitrogen', pct: '3%' },
  { sym: 'Ca', name: 'Calcium', pct: '1.5%' },
  { sym: 'P', name: 'Phosphorus', pct: '1%' },
  { sym: 'Fe', name: 'Iron', pct: '0.006%' },
  { sym: 'He', name: 'Helium', pct: 'trace' },
];

export default function Ch04_Stardust() {
  return (
    <ChapterShell index={4} background="#040405" withGrain={false}>
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 21], fov: 55 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#040405']} />
          <StarField count={2584} radius={89} speed={0.013} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center" style={{ paddingInline: 21 }}>
        <Eyebrow>Chapter 04 · Stardust</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 34, maxWidth: 987, lineHeight: 1.05 }}>
          You are made of <span style={{ color: '#D4AF37' }}>dead stars</span>.
        </h2>

        <div
          className="grid"
          style={{
            marginTop: 89,
            gap: 21,
            gridTemplateColumns: 'repeat(auto-fit, minmax(144px, 1fr))',
            maxWidth: 987,
            width: '100%',
          }}
        >
          {ELEMENTS.map((e) => (
            <div
              key={e.sym}
              className="flex flex-col items-center"
              style={{
                padding: 21,
                border: '1px solid rgba(212,175,55,0.21)',
                background: 'rgba(10,10,10,0.55)',
              }}
            >
              <span className="font-display" style={{ fontSize: 55, color: '#D4AF37', lineHeight: 1 }}>{e.sym}</span>
              <span className="font-mono" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', letterSpacing: '0.21em', textTransform: 'uppercase', marginTop: 13 }}>
                {e.name}
              </span>
              <span className="font-mono" style={{ fontSize: 13, color: '#FAFAF7', marginTop: 8 }}>{e.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
