// Ch.12 — Civilization. Where we are now. Bridge to Ch.13.

import { ChapterShell, Eyebrow } from './_shell';

const STATS = [
  { v: '8.1B',   l: 'humans alive' },
  { v: '~620 EJ', l: 'energy / yr' },
  { v: '+1.5°C', l: 'warming since 1850' },
  { v: '10²⁵',  l: 'AI training FLOPs' },
  { v: '~7,000', l: 'living languages' },
  { v: '12,500', l: 'nuclear warheads' },
];

export default function Ch12_Civilization() {
  return (
    <ChapterShell index={12} background="#0A0A0A">
      <div className="relative z-10 min-h-screen flex flex-col justify-center" style={{ paddingInline: 34 }}>
        <Eyebrow>Chapter 12 · Civilization</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 1200 }}>
          Where you are<br /><span style={{ color: '#D4AF37' }}>standing now</span>.
        </h2>

        <div
          className="grid"
          style={{ marginTop: 55, gap: 21, gridTemplateColumns: 'repeat(auto-fit, minmax(233px, 1fr))' }}
        >
          {STATS.map((s) => (
            <div key={s.l} style={{ padding: 21, borderLeft: '1px solid rgba(212,175,55,0.34)' }}>
              <div className="h-display" style={{ fontSize: 55, color: '#FAFAF7' }}>{s.v}</div>
              <div className="font-mono" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', letterSpacing: '0.21em', textTransform: 'uppercase', marginTop: 8 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="font-display italic" style={{ fontSize: 34, color: '#D4AF37', marginTop: 89, maxWidth: 800 }}>
          A choice is at the door.
        </div>
      </div>
    </ChapterShell>
  );
}
