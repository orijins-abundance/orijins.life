// Ch.11 — The Mirror. Who is watching?
// Webcam optional — opt-in only. (TODO: wire navigator.mediaDevices flow.)

import { ChapterShell, Eyebrow } from './_shell';

export default function Ch11_Mirror() {
  return (
    <ChapterShell index={11} background="#0A0A0A">
      <div className="relative z-10 min-h-screen flex items-center justify-center text-center" style={{ paddingInline: 34 }}>
        <div style={{ maxWidth: 800 }}>
          <Eyebrow>Chapter 11 · The Mirror</Eyebrow>
          <h2 className="h-display" style={{ fontSize: 89, marginTop: 21 }}>
            <span style={{ color: 'rgba(250,250,247,0.55)' }}>Who is</span><br />
            <span style={{ color: '#D4AF37' }}>watching?</span>
          </h2>
          <div
            className="font-display italic"
            style={{ fontSize: 34, color: '#FAFAF7', marginTop: 55, lineHeight: 1.34 }}
          >
            “I am the one watching.”
          </div>
          <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 34 }}>
            Behind every thought, a witness.
            Before every word, a presence.
            You are the silent observer of your own machine.
          </p>
        </div>
      </div>
    </ChapterShell>
  );
}
