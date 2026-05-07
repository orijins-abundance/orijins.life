// Ch.08 — The Human Appears. 300,000 years ago. A blink.

import { ChapterShell, Eyebrow } from './_shell';

const TICKS = [
  { label: 'Big Bang', t: '13.8 Ga' },
  { label: 'Earth', t: '4.5 Ga' },
  { label: 'Life', t: '3.8 Ga' },
  { label: 'Cambrian', t: '540 Ma' },
  { label: 'Mammals', t: '200 Ma' },
  { label: 'Primates', t: '60 Ma' },
  { label: 'Humans', t: '300 ka' },
];

export default function Ch08_HumanAppears() {
  return (
    <ChapterShell index={8} background="#0A0A0A">
      <div className="relative z-10 min-h-screen flex flex-col justify-center" style={{ paddingInline: 34 }}>
        <Eyebrow>Chapter 08 · The Human Appears</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, maxWidth: 987 }}>
          300,000 years ago.<br /><span style={{ color: '#D4AF37' }}>A blink.</span>
        </h2>

        {/* Timeline bar */}
        <div className="relative" style={{ marginTop: 89, maxWidth: 1597 }}>
          <div style={{ height: 1, background: 'rgba(212,175,55,0.34)' }} />
          <div className="flex justify-between" style={{ marginTop: 21 }}>
            {TICKS.map((tk, idx) => (
              <div key={tk.label} className="flex flex-col items-start" style={{ minWidth: 89 }}>
                <span style={{ display: 'block', width: 1, height: 21, background: '#D4AF37', marginTop: -34, marginBottom: 13 }} />
                <span className="font-mono" style={{ fontSize: 13, color: '#D4AF37', letterSpacing: '0.21em' }}>
                  {tk.t}
                </span>
                <span className="font-mono" style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', letterSpacing: '0.13em', textTransform: 'uppercase', marginTop: 8 }}>
                  {tk.label}
                </span>
                {idx === TICKS.length - 1 && (
                  <span className="font-display" style={{ fontSize: 21, color: '#FF3D8B', marginTop: 13 }}>
                    you are here
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 89, maxWidth: 610 }}>
          On the cosmic clock, your species arrived in the last second.
          And in that second, you reshaped the planet.
        </p>
      </div>
    </ChapterShell>
  );
}
