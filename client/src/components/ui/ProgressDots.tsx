// 21 Fibonacci-spaced gold dots on the right edge.
// Click to jump to a chapter. The 21st dot connects back to the 1st via a thin spiraling
// arc once the user has completed a loop.

import { useEffect, useState } from 'react';
import { getLenis } from '@/lib/scroll';
import { getLoopCount } from '@/lib/loop';
import { TOTAL_CHAPTERS } from '@/lib/fibonacci';

interface Props {
  current: number;
}

export default function ProgressDots({ current }: Props) {
  const [loop, setLoop] = useState<number>(1);

  useEffect(() => {
    setLoop(getLoopCount());
    const onHash = () => setLoop(getLoopCount());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [current]);

  const handleClick = (n: number) => {
    const target = document.getElementById(`chapter-${n}`);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Chapter navigation"
      className="fixed right-[21px] top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center"
      style={{ gap: 13 }}
    >
      {Array.from({ length: TOTAL_CHAPTERS }, (_, i) => {
        const n = i + 1;
        const reached = n <= current;
        return (
          <button
            key={n}
            onClick={() => handleClick(n)}
            aria-label={`Go to chapter ${n}`}
            className="group relative block"
            style={{ width: 13, height: 13 }}
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: n === current ? 8 : 5,
                height: n === current ? 8 : 5,
                margin: 'auto',
                background: reached ? '#D4AF37' : 'rgba(212,175,55,0.21)',
                boxShadow: n === current ? '0 0 13px rgba(212,175,55,0.55)' : 'none',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
                top: '50%',
                left: '50%',
              }}
            />
            <span
              className="absolute right-[21px] top-1/2 -translate-y-1/2 text-gold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13,
                color: '#D4AF37',
                letterSpacing: '0.21em',
                whiteSpace: 'nowrap',
              }}
            >
              {String(n).padStart(2, '0')}
            </span>
          </button>
        );
      })}
      {loop > 1 && (
        <span
          aria-hidden
          className="mt-[13px] text-gold/60"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: '0.21em' }}
        >
          ↻ {loop}
        </span>
      )}
    </nav>
  );
}
