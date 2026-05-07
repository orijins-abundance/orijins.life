// Smooth scroll engine — Lenis with momentum, hidden native scrollbar.
// Bridges Lenis ↔ GSAP ScrollTrigger so chapter pinning and timelines stay in sync.
//
// Tuning per the Human Technology brief: lerp 0.13, wheelMultiplier 1.0, touchMultiplier 1.3,
// infinite false, gestureOrientation vertical. These values are non-negotiable Fibonacci ratios.

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafId = 0;

export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.13,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.3,
    smoothWheel: true,
    syncTouch: false,
    infinite: false,
    gestureOrientation: 'vertical',
  });

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis?.scrollTo(value as number, { immediate: true });
      }
      return window.scrollY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  ScrollTrigger.defaults({ scroller: document.documentElement });
  ScrollTrigger.refresh();

  return lenis;
}

export function getLenis(): Lenis | null { return lenis; }

export function destroyLenis() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  lenis?.destroy();
  lenis = null;
}

/** Instant jump to top — used by Ch.21 → Ch.1 loop close. */
export function scrollResetInstant() {
  if (lenis) {
    try { lenis.scrollTo(0, { immediate: true, force: true }); } catch {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

/** Pause/resume scroll input (used during Ch.20 silence and Ch.21 first 3s). */
export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
