// Ch.11 — The Mirror. Who is watching?
//
// A gold-framed circular surface at center. On hover/movement, an SVG silhouette
// shifts subtle parallax. The mouse trail leaves a slow gold echo, suggesting
// "the witness sees itself watching." No webcam in MVP — a generic silhouette in
// gold that gently breathes, plus the mouse-driven echo.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch11_Mirror() {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const silRef = useRef<SVGSVGElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(mirrorRef.current, { opacity: 0, scale: 0.89 });
      ScrollTrigger.create({
        trigger: '#chapter-11',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(mirrorRef.current, { opacity: 1, scale: 1, duration: 2.1, ease: 'power2.out' });
        },
      });

      // Mouse-driven silhouette parallax
      const onMove = (e: MouseEvent) => {
        if (!silRef.current || !echoRef.current) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        gsap.to(silRef.current, { x: dx * 13, y: dy * 13, duration: 0.89, ease: 'power2.out' });
        // Echo follows the mouse with delay
        gsap.to(echoRef.current, { x: e.clientX, y: e.clientY, duration: 1.3, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={11} background="#0A0A0A" withGrain withVignette>
      <div className="relative z-10 min-h-screen flex items-center justify-center text-center" style={{ paddingInline: 34 }}>
        {/* Mouse-following echo */}
        <div
          ref={echoRef}
          aria-hidden
          className="fixed pointer-events-none"
          style={{
            top: 0,
            left: 0,
            width: 144,
            height: 144,
            marginTop: -72,
            marginLeft: -72,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0) 70%)',
            mixBlendMode: 'screen',
            zIndex: 1,
          }}
        />

        <div className="grid items-center" style={{ gap: 89, gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', maxWidth: 1597 }}>
          {/* Mirror */}
          <div className="flex justify-center">
            <div
              ref={mirrorRef}
              className="relative ch11-mirror"
              style={{
                width: 377,
                height: 377,
                borderRadius: '50%',
                border: '1px solid #D4AF37',
                boxShadow: '0 0 144px rgba(212,175,55,0.34), inset 0 0 89px rgba(0,0,0,0.89)',
                background: 'radial-gradient(circle at 30% 30%, rgba(212,175,55,0.13) 0%, rgba(0,0,0,1) 70%)',
                overflow: 'hidden',
              }}
            >
              <svg ref={silRef} viewBox="0 0 233 377" width="100%" height="100%" fill="none" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" style={{ display: 'block' }}>
                {/* Stylized human silhouette — head, shoulders, torso */}
                <ellipse cx="117" cy="89" rx="34" ry="34" fill="rgba(212,175,55,0.13)" />
                <path d="M55 233 Q55 165 117 144 Q179 165 179 233 L155 377 L79 377 Z" fill="rgba(212,175,55,0.08)" />
                {/* Inner heart */}
                <circle cx="117" cy="200" r="13" fill="#D4AF37" opacity="0.55" className="ch11-heart" />
              </svg>
            </div>
          </div>

          {/* Copy */}
          <div className="text-left">
            <Eyebrow>Chapter 11 · The Mirror</Eyebrow>
            <h2 className="h-display" style={{ fontSize: 89, marginTop: 21, lineHeight: 1.05 }}>
              <span style={{ color: 'rgba(250,250,247,0.55)' }}>Who is</span><br />
              <span style={{ color: '#D4AF37' }}>watching?</span>
            </h2>
            <div
              className="font-display italic"
              style={{ fontSize: 34, color: '#FAFAF7', marginTop: 55, lineHeight: 1.34 }}
            >
              &ldquo;I am the one watching.&rdquo;
            </div>
            <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.55)', marginTop: 34, maxWidth: 610 }}>
              Behind every thought, a witness.<br />
              Before every word, a presence.<br />
              You are the silent observer of your own machine.
            </p>
            <div
              className="font-mono"
              style={{ marginTop: 34, fontSize: 13, color: '#D4AF37', letterSpacing: '0.34em', textTransform: 'uppercase' }}
            >
              Move &middot; The mirror responds
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ch11-heart { animation: ch11-heart 1s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes ch11-heart {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.13); opacity: 1; }
        }
        .ch11-mirror { animation: ch11-breathe 5.5s ease-in-out infinite; }
        @keyframes ch11-breathe {
          0%, 100% { box-shadow: 0 0 144px rgba(212,175,55,0.34), inset 0 0 89px rgba(0,0,0,0.89); }
          50%      { box-shadow: 0 0 233px rgba(212,175,55,0.55), inset 0 0 89px rgba(0,0,0,0.89); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ch11-heart, .ch11-mirror { animation: none; }
        }
      `}</style>
    </ChapterShell>
  );
}
