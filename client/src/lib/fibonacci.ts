// Fibonacci spine — non-negotiable across the site.
// orijins.law: 13 + 21 + 34 = 68 sacred laws.
export const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as const;

export const FIB_TYPE = {
  s: 13,
  m: 21,
  l: 34,
  xl: 55,
  hero: 89,
  display: 144,
} as const;

export const FIB_SPACE = {
  xs: 8,
  s: 13,
  m: 21,
  l: 34,
  xl: 55,
  xxl: 89,
  xxxl: 144,
} as const;

// Animation durations (seconds), Fibonacci-derived.
export const FIB_DUR = {
  flash: 0.5,
  quick: 0.8,
  base: 1.3,
  slow: 2.1,
  long: 3.4,
  epic: 5.5,
} as const;

export const TOTAL_CHAPTERS = 21;

// Golden ratio (used for split layouts)
export const PHI = 1.618033988749895;
