// 404 — keep it on-brand. Void background, gold accent, founding-line whisper.

import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center text-center"
      style={{ background: '#0A0A0A', color: '#FAFAF7', padding: 34 }}
    >
      <p
        className="font-mono"
        style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase' }}
      >
        404 · Lost in the void
      </p>

      <h1
        className="font-display"
        style={{ fontSize: 89, marginTop: 21, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.02em' }}
      >
        This door doesn&rsquo;t open.
      </h1>

      <p
        className="font-sans"
        style={{ marginTop: 21, fontSize: 21, color: 'rgba(250,250,247,0.55)', maxWidth: 610 }}
      >
        Every constellation has its dark spaces. The chapter you&rsquo;re looking for is somewhere else.
      </p>

      <button
        onClick={() => setLocation('/')}
        className="cursor-pointer transition-colors"
        style={{
          marginTop: 55,
          padding: '21px 34px',
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
        Begin again →
      </button>
    </main>
  );
}
