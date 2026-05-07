// Persistent timer at the bottom of Ch.14-20.
// Starts at 2027 and doubles every 5 seconds of in-section scroll progress.
// Past 1e6, formats in scientific notation per the brief.

import { useEffect, useState } from 'react';

interface Props {
  /** 0..1 — scroll progress across the acceleration phase (Ch.14 start → Ch.20 end). */
  progress: number;
  visible: boolean;
}

const START_YEAR = 2027;
const ACCEL_DURATION_S = 5; // each "5 seconds of scroll" doubles the year
const TOTAL_DOUBLES = 73;   // ≈ 2027 → 1e22 across the phase, capped at 1e100 below.

function formatYear(year: number): string {
  if (year < 1e6) return Math.round(year).toLocaleString('en-US') + ' years';
  // Scientific notation: x.xxx × 10^n
  const exp = Math.floor(Math.log10(year));
  const mantissa = year / Math.pow(10, exp);
  return `${mantissa.toFixed(3)} × 10^${exp} years`;
}

export default function AcceleratingTimer({ progress, visible }: Props) {
  const [year, setYear] = useState(START_YEAR);

  useEffect(() => {
    // Clamp progress and convert to a doubling count.
    const p = Math.max(0, Math.min(1, progress));
    const doubles = p * TOTAL_DOUBLES;
    let y = START_YEAR * Math.pow(2, doubles);
    if (y > 1e100) y = 1e100;
    setYear(y);
    // ACCEL_DURATION_S is referenced in the brief; we don't tick on a clock here because
    // the user controls time via scroll, which is exactly the melodysheep grammar.
    void ACCEL_DURATION_S;
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      style={{ bottom: 34 }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: 21,
          color: '#D4AF37',
          letterSpacing: '0.13em',
          textShadow: '0 0 21px rgba(212,175,55,0.34)',
          fontVariantNumeric: 'tabular-nums',
          padding: '13px 21px',
          background: 'rgba(10,10,10,0.55)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(212,175,55,0.21)',
        }}
      >
        {formatYear(year)}
      </div>
    </div>
  );
}
