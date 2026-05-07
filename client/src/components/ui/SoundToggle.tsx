// Persistent sound toggle (top-right, gold).
// On first interaction shows a one-time consent prompt — autoplay requires a user gesture.

import { useEffect, useState } from 'react';
import { sound, useSoundState } from '@/lib/sound';

export default function SoundToggle() {
  const { muted, consented } = useSoundState();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (!consented) {
      const t = setTimeout(() => setShowConsent(true), 800);
      return () => clearTimeout(t);
    }
    setShowConsent(false);
  }, [consented]);

  const accept = () => {
    sound.giveConsent();
    setShowConsent(false);
  };
  const decline = () => {
    sound.giveConsent();
    sound.toggleMute(); // keeps mute on
    setShowConsent(false);
  };

  return (
    <>
      <button
        onClick={() => sound.toggleMute()}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        className="fixed z-40 group"
        style={{ top: 21, right: 21, padding: 13 }}
      >
        <span
          className="block transition-opacity"
          style={{
            width: 21, height: 21,
            color: '#D4AF37',
            opacity: muted ? 0.4 : 1,
          }}
        >
          {muted ? <SpeakerOff /> : <SpeakerOn />}
        </span>
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 mr-[13px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#D4AF37', letterSpacing: '0.21em' }}
        >
          {muted ? 'sound · off' : 'sound · on'}
        </span>
      </button>

      {showConsent && (
        <div
          className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="pointer-events-auto"
            style={{
              padding: 34,
              border: '1px solid rgba(212,175,55,0.34)',
              background: 'rgba(10,10,10,0.89)',
              backdropFilter: 'blur(8px)',
              maxWidth: 610,
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 34, lineHeight: 1.1, color: '#FAFAF7', marginBottom: 21 }}
            >
              Sound is part of the journey.
            </p>
            <p
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(250,250,247,0.55)', marginBottom: 34, letterSpacing: '0.05em' }}
            >
              Heartbeat, breath, dissonance and resonance — designed by ORIJINS Studio.
              Headphones recommended.
            </p>
            <div className="flex" style={{ gap: 13 }}>
              <button
                onClick={accept}
                style={{
                  padding: '13px 21px',
                  background: '#D4AF37',
                  color: '#0A0A0A',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  letterSpacing: '0.21em',
                  textTransform: 'uppercase',
                }}
              >
                Begin with sound
              </button>
              <button
                onClick={decline}
                style={{
                  padding: '13px 21px',
                  background: 'transparent',
                  color: '#FAFAF7',
                  border: '1px solid rgba(250,250,247,0.21)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  letterSpacing: '0.21em',
                  textTransform: 'uppercase',
                }}
              >
                Continue silently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="100%" height="100%">
      <path d="M3 10v4h4l5 4V6L7 10H3z" />
      <path d="M16 8c1.5 1.2 1.5 6.8 0 8" />
      <path d="M19 5c3 2.5 3 11.5 0 14" />
    </svg>
  );
}
function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="100%" height="100%">
      <path d="M3 10v4h4l5 4V6L7 10H3z" />
      <line x1="16" y1="9" x2="22" y2="15" />
      <line x1="22" y1="9" x2="16" y2="15" />
    </svg>
  );
}
