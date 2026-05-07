// First-run overlay: "Press to begin" with a visible heartbeat pulse.
// Browsers block autoplay without a user gesture — this overlay is the gesture.
// Once the user clicks, we call sound.giveConsent() and the heartbeat starts.
// Subsequent visits skip the gate (consent persisted in localStorage by SoundManager).

import { useState } from 'react';
import { sound, useSoundState } from '@/lib/sound';

export default function ConsentGate() {
  const { consented } = useSoundState();
  const [closing, setClosing] = useState(false);

  if (consented) return null;

  const begin = () => {
    setClosing(true);
    setTimeout(() => sound.giveConsent(), 550); // Fibonacci 0.55s graceful exit
  };

  return (
    <div
      role="dialog"
      aria-label="Begin the journey"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: '#0A0A0A',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.55s ease-out',
        pointerEvents: closing ? 'none' : 'auto',
      }}
    >
      {/* Pulsing gold ring — visual heartbeat at 60 BPM */}
      <div
        aria-hidden
        style={{
          width: 144,
          height: 144,
          marginBottom: 89,
          borderRadius: '50%',
          border: '1px solid #D4AF37',
          boxShadow: '0 0 89px rgba(212,175,55,0.34)',
          animation: 'consent-pulse 1s ease-in-out infinite',
        }}
      />

      <p
        className="font-display"
        style={{
          fontSize: 55,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: '#FAFAF7',
          textAlign: 'center',
          maxWidth: 610,
          lineHeight: 1.13,
          padding: '0 21px',
        }}
      >
        Everyone should know the<br />vehicle they&rsquo;re in.
      </p>

      <button
        onClick={begin}
        className="cursor-pointer transition-transform"
        style={{
          marginTop: 55,
          padding: '21px 55px',
          background: 'transparent',
          color: '#D4AF37',
          border: '1px solid #D4AF37',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.13)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        Press to begin →
      </button>

      <p
        style={{
          marginTop: 89,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          color: 'rgba(250,250,247,0.34)',
          letterSpacing: '0.21em',
          textAlign: 'center',
        }}
      >
        Headphones recommended · 21 chapters · ~13 minutes
      </p>

      <style>{`
        @keyframes consent-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.034); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes consent-pulse { from, to { transform: scale(1); opacity: 0.55; } }
        }
      `}</style>
    </div>
  );
}
