// Live countdown to 2027-11-06 23:59 UTC, shown above the seam in Ch.13.
import { useEffect, useState } from 'react';

const TARGET_MS = Date.UTC(2027, 10, 6, 23, 59, 0);

function compute(now: number) {
  const diff = Math.max(0, TARGET_MS - now);
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  return { days, hours, minutes };
}

export default function Countdown() {
  const [t, setT] = useState(() => compute(Date.now()));

  useEffect(() => {
    const id = setInterval(() => setT(compute(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const Cell = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center" style={{ gap: 8 }}>
      <span
        className="font-mono"
        style={{
          fontSize: 55,
          color: '#D4AF37',
          letterSpacing: '0.05em',
          textShadow: '0 0 21px rgba(212,175,55,0.34)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(value).padStart(label === 'days' ? 3 : 2, '0')}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: 13, letterSpacing: '0.21em', color: 'rgba(250,250,247,0.55)', textTransform: 'uppercase' }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="flex items-end justify-center"
      style={{ gap: 34 }}
      aria-label="Countdown to November 6, 2027 23:59 UTC"
    >
      <Cell value={t.days} label="days" />
      <span style={{ color: 'rgba(212,175,55,0.34)', fontSize: 34, paddingBottom: 21 }}>·</span>
      <Cell value={t.hours} label="hours" />
      <span style={{ color: 'rgba(212,175,55,0.34)', fontSize: 34, paddingBottom: 21 }}>·</span>
      <Cell value={t.minutes} label="minutes" />
    </div>
  );
}
