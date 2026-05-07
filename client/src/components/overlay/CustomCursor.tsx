// Custom cursor — a gold dot 8px that grows to 21px when hovering interactive elements.
// Lerp factor 0.21 (Fibonacci) for the smooth follow.
// Disabled on touch devices and when reduced motion is requested.

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return; // touch device

    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let renderX = mouseX;
    let renderY = mouseY;
    let targetSize = 8;
    let renderSize = 8;
    const lerp = 0.21;

    document.body.style.cursor = 'none';
    dot.style.opacity = '1';

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive =
        t.closest('a, button, [role="button"], input, textarea, select, [data-cursor="grow"]');
      targetSize = interactive ? 21 : 8;
    };

    let raf = 0;
    const loop = () => {
      renderX += (mouseX - renderX) * lerp;
      renderY += (mouseY - renderY) * lerp;
      renderSize += (targetSize - renderSize) * 0.34;
      dot.style.transform = `translate3d(${renderX - renderSize / 2}px, ${renderY - renderSize / 2}px, 0)`;
      dot.style.width = `${renderSize}px`;
      dot.style.height = `${renderSize}px`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: '#D4AF37',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        mixBlendMode: 'difference',
        willChange: 'transform, width, height',
      }}
    />
  );
}
