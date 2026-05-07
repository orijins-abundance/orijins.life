import { describe, it, expect } from 'vitest';
import { FIB, FIB_TYPE, FIB_SPACE, FIB_DUR, TOTAL_CHAPTERS, PHI } from './fibonacci';

describe('fibonacci spine', () => {
  it('FIB starts with the canonical sequence', () => {
    expect(FIB.slice(0, 12)).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);
  });

  it('FIB_TYPE values are all on the spine', () => {
    Object.values(FIB_TYPE).forEach((v) => {
      expect(FIB).toContain(v as number);
    });
  });

  it('FIB_SPACE values are all on the spine', () => {
    Object.values(FIB_SPACE).forEach((v) => {
      expect(FIB).toContain(v as number);
    });
  });

  it('FIB_DUR ratios are Fibonacci-derived (every value × 10 lives near the spine)', () => {
    // 0.5, 0.8, 1.3, 2.1, 3.4, 5.5 → ×10 → 5, 8, 13, 21, 34, 55. All on the spine.
    Object.values(FIB_DUR).forEach((dur) => {
      const x10 = Math.round(dur * 10);
      expect(FIB).toContain(x10);
    });
  });

  it('21 chapters per the Ouroboros architecture', () => {
    expect(TOTAL_CHAPTERS).toBe(21);
  });

  it('PHI is the golden ratio', () => {
    expect(PHI).toBeCloseTo(1.61803398874989, 10);
  });
});
