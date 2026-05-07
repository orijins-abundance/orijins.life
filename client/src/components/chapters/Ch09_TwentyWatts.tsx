// Ch.09 — Twenty Watts. You run on a lightbulb.
// Animated SVG anatomy in gold ink, neuron count, "20 W" pulsing counter.
// Scaffold uses inline SVG; can be swapped for a richer Vesalius treatment later.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterShell, Eyebrow } from './_shell';

export default function Ch09_TwentyWatts() {
  const wattRef = useRef<HTMLSpanElement>(null);
  const pathsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(wattRef.current, {
        textShadow: '0 0 34px rgba(212,175,55,0.55)',
        scale: 1.034,
        duration: 1.3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      const paths = pathsRef.current?.querySelectorAll<SVGPathElement>('path');
      if (paths) {
        paths.forEach((p) => {
          const len = p.getTotalLength?.() ?? 233;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 3.4,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: '#chapter-9', start: 'top 60%', toggleActions: 'play none none reverse' },
          });
        });
      }
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <ChapterShell index={9} background="#0A0A0A">
      <div className="relative z-10 min-h-screen flex items-center" style={{ paddingInline: 55 }}>
        <div className="grid w-full" style={{ gap: 89, gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
          <div>
            <Eyebrow>Chapter 09 · Twenty Watts</Eyebrow>
            <h2 className="h-display" style={{ fontSize: 89, marginTop: 21 }}>
              You run on a<br /><span style={{ color: '#D4AF37' }}>lightbulb</span>.
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 13, marginTop: 55 }}>
              <span ref={wattRef} className="font-display" style={{ fontSize: 144, color: '#D4AF37', lineHeight: 1, display: 'inline-block' }}>
                20
              </span>
              <span className="font-mono" style={{ fontSize: 21, color: '#D4AF37', letterSpacing: '0.13em' }}>W</span>
            </div>
            <p className="font-sans" style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', marginTop: 34, maxWidth: 610 }}>
              86 billion neurons. 100 trillion synapses. The most complex object known —
              powered by less than a household lightbulb.
            </p>
            <div className="font-mono" style={{ marginTop: 34, color: 'rgba(250,250,247,0.55)', fontSize: 13, letterSpacing: '0.21em' }}>
              86,000,000,000 neurons · 100,000,000,000,000 synapses
            </div>
          </div>

          <div className="flex items-center justify-center">
            <svg ref={pathsRef} viewBox="0 0 233 377" width="100%" style={{ maxWidth: 377, height: 'auto' }} fill="none" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              {/* Skull / cortex stylized contour */}
              <path d="M55 130 Q60 60 117 55 Q174 60 178 130 Q180 175 155 200 Q150 230 165 245 Q175 260 165 280 Q170 305 150 320 Q120 340 88 335 Q70 320 75 300 Q70 285 80 265 Q70 245 80 220 Q60 200 55 175 Z" />
              {/* Cortical sulci */}
              <path d="M75 110 Q90 130 110 120 Q130 110 145 130 Q160 145 155 165" />
              <path d="M70 145 Q90 155 105 150 Q125 145 140 160 Q155 170 160 190" />
              <path d="M85 180 Q100 195 115 190 Q130 188 140 200" />
              {/* Brainstem */}
              <path d="M120 240 Q117 265 117 290 Q117 320 110 340" />
              <path d="M107 320 Q117 327 127 320" />
              {/* Vertebrae stack */}
              <path d="M108 350 Q117 354 126 350 M105 360 Q117 365 129 360" />
            </svg>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
