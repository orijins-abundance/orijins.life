// Shared scaffolding for every chapter — pinning anchor, header label, and a few
// editorial primitives. Keeps every chapter consistent in skeleton.

import type { ReactNode } from 'react';
import { CHAPTER_TITLES } from '@/lib/audioManifest';

interface ChapterShellProps {
  index: number;          // 1..21
  background?: string;    // CSS background override
  children: ReactNode;
  withGrain?: boolean;
  withVignette?: boolean;
  className?: string;
  fullBleed?: boolean;
}

export function ChapterShell({
  index,
  background = '#0A0A0A',
  children,
  withGrain = true,
  withVignette = true,
  className = '',
  fullBleed = false,
}: ChapterShellProps) {
  const meta = CHAPTER_TITLES[index];
  return (
    <section
      id={`chapter-${index}`}
      data-chapter={index}
      className={`chapter ${withGrain ? 'grain' : ''} ${withVignette ? 'vignette' : ''} ${className}`}
      style={{ background }}
    >
      {!fullBleed && (
        <header
          className="absolute z-10 select-none"
          style={{ top: 34, left: 34 }}
        >
          <div className="flex items-center" style={{ gap: 13 }}>
            <span
              className="font-mono"
              style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.21em' }}
            >
              {String(index).padStart(2, '0')} / 21
            </span>
            <span className="gold-arc" />
            <span
              className="font-mono"
              style={{ color: 'rgba(250,250,247,0.55)', fontSize: 13, letterSpacing: '0.21em', textTransform: 'uppercase' }}
            >
              {meta?.title}
            </span>
          </div>
        </header>
      )}
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      className="font-mono"
      style={{ color: '#D4AF37', fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase' }}
    >
      {children}
    </div>
  );
}

export function Title({ children, size = 89 }: { children: ReactNode; size?: number }) {
  return (
    <h2
      className="h-display"
      style={{ fontSize: size, fontWeight: 500, letterSpacing: '-0.02em' }}
    >
      {children}
    </h2>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-sans"
      style={{ fontSize: 21, lineHeight: 1.55, color: 'rgba(250,250,247,0.75)', maxWidth: 610 }}
    >
      {children}
    </p>
  );
}
