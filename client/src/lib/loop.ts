// Ouroboros loop manager — tracks how many times the user has completed the cycle.
// Hash format: #loop-N (1-indexed; first visit is loop-1).

const KEY = 'orijins.loops';

export function getLoopCount(): number {
  if (typeof window === 'undefined') return 1;
  // Prefer URL hash if it's a loop hash; otherwise fall back to storage; otherwise 1.
  const m = window.location.hash.match(/^#loop-(\d+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n >= 1) return n;
  }
  const stored = window.localStorage.getItem(KEY);
  const n = stored ? parseInt(stored, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function setLoopCount(n: number) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, String(n));
  // Update URL hash without scrolling.
  const url = `${window.location.pathname}#loop-${n}`;
  window.history.replaceState(null, '', url);
}

export function incrementLoop(): number {
  const n = getLoopCount() + 1;
  setLoopCount(n);
  return n;
}

export function ensureInitialLoopHash() {
  if (typeof window === 'undefined') return;
  if (!/^#loop-\d+/.test(window.location.hash)) {
    setLoopCount(getLoopCount());
  }
}
