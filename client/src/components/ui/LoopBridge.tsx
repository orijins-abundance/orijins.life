// Persistent subtle prompt that appears at the top after 3 loops without clicking
// the Ch.13 CTA. Links to https://gaia.orijins.com.

import { useEffect, useState } from 'react';
import { getLoopCount } from '@/lib/loop';

export default function LoopBridge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(getLoopCount() >= 3);
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  if (!show) return null;

  return (
    <a
      href="https://gaia.orijins.com"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed left-1/2 -translate-x-1/2 z-40"
      style={{
        top: 21,
        padding: '13px 21px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        letterSpacing: '0.21em',
        color: '#D4AF37',
        textTransform: 'uppercase',
        background: 'rgba(10,10,10,0.55)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(212,175,55,0.21)',
      }}
    >
      Or take the bridge →
    </a>
  );
}
