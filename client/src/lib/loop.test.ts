import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLoopCount, setLoopCount, incrementLoop, ensureInitialLoopHash } from './loop';

describe('loop counter', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('defaults to 1 on first visit', () => {
    expect(getLoopCount()).toBe(1);
  });

  it('reads the count from a #loop-N hash when present', () => {
    window.history.replaceState(null, '', '/#loop-7');
    expect(getLoopCount()).toBe(7);
  });

  it('persists writes to localStorage', () => {
    setLoopCount(13);
    expect(window.localStorage.getItem('orijins.loops')).toBe('13');
  });

  it('updates the URL hash on write', () => {
    setLoopCount(21);
    expect(window.location.hash).toBe('#loop-21');
  });

  it('incrementLoop adds 1 and returns the new value', () => {
    setLoopCount(2);
    expect(incrementLoop()).toBe(3);
    expect(getLoopCount()).toBe(3);
  });

  it('ensureInitialLoopHash sets the hash if missing', () => {
    expect(window.location.hash).toBe('');
    ensureInitialLoopHash();
    expect(window.location.hash).toBe('#loop-1');
  });

  it('ensureInitialLoopHash leaves a valid hash alone', () => {
    window.history.replaceState(null, '', '/#loop-5');
    ensureInitialLoopHash();
    expect(window.location.hash).toBe('#loop-5');
  });
});
