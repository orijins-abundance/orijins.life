// Ch.10 — The Day. 100,000 heartbeats. 23,000 breaths.
// 4-panel split: sleep, breath, heart, food.

import { ChapterShell, Eyebrow } from './_shell';

const PANELS = [
  { label: 'Sleep',   value: '8',       unit: 'hours',  caption: 'a third of your life' },
  { label: 'Breaths', value: '23,040',  unit: 'today',  caption: '16 per minute' },
  { label: 'Heart',   value: '100,800', unit: 'beats',  caption: '70 per minute' },
  { label: 'Energy',  value: '2,000',   unit: 'kcal',   caption: 'fuel for the vehicle' },
];

export default function Ch10_TheDay() {
  return (
    <ChapterShell index={10} background="#0A0A0A">
      <div className="relative z-10 min-h-screen flex flex-col justify-center" style={{ paddingInline: 34 }}>
        <Eyebrow>Chapter 10 · The Day</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 1100 }}>
          One day in the<br />vehicle of <span style={{ color: '#D4AF37' }}>you</span>.
        </h2>

        <div
          className="grid"
          style={{
            marginTop: 89,
            gap: 21,
            gridTemplateColumns: 'repeat(auto-fit, minmax(233px, 1fr))',
          }}
        >
          {PANELS.map((p) => (
            <div
              key={p.label}
              style={{
                padding: 34,
                border: '1px solid rgba(212,175,55,0.21)',
                background: 'rgba(212,175,55,0.034)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className="font-mono" style={{ fontSize: 13, color: '#D4AF37', letterSpacing: '0.34em', textTransform: 'uppercase' }}>
                {p.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 21 }}>
                <span className="h-display" style={{ fontSize: 89, color: '#FAFAF7', lineHeight: 1 }}>{p.value}</span>
                <span className="font-mono" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', letterSpacing: '0.21em' }}>{p.unit}</span>
              </div>
              <div className="font-sans" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', marginTop: 13, letterSpacing: '0.05em' }}>
                {p.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
