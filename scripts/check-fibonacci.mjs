#!/usr/bin/env node
/* eslint-disable */
// check-fibonacci.mjs
// Greps client/src for hardcoded numeric CSS values that violate the Fibonacci spine.
// Allowed values: 0, 1, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597
// Plus a small set of structural exceptions: 100% / 100vw / 100vh / 0px / 1px / 2px (border) / 50% (radii).
//
// This is a *signal*, not a *blocker* by default. CI runs with --strict.
// Run locally:  node scripts/check-fibonacci.mjs
// Run strict:   node scripts/check-fibonacci.mjs --strict

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = new URL('../client/src/', import.meta.url).pathname;
const STRICT = process.argv.includes('--strict');
const ALLOWED = new Set([0, 1, 2, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597]);
const STRUCTURAL_VALUES = new Set([100, 50]); // % values for full-bleed and radius
const PROPERTIES = ['padding', 'margin', 'gap', 'top', 'right', 'bottom', 'left', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'fontSize', 'lineHeight', 'borderRadius', 'rowGap', 'columnGap'];

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (['.tsx', '.ts', '.css'].includes(extname(p))) scanFile(p);
  }
}

function scanFile(file) {
  const code = readFileSync(file, 'utf8');
  const lines = code.split('\n');
  lines.forEach((line, i) => {
    // Skip comment lines
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;

    // Pattern 1: CSS-in-JS object — `padding: 24` or `padding: '24px'`
    const objRe = new RegExp(`(${PROPERTIES.join('|')})\\s*:\\s*['\"]?(\\d+)(?:px|%)?['\"]?[,;\\s]`, 'g');
    let m;
    while ((m = objRe.exec(line)) !== null) {
      const prop = m[1];
      const value = parseInt(m[2], 10);
      if (ALLOWED.has(value)) continue;
      if (line.includes('%') && STRUCTURAL_VALUES.has(value)) continue;
      violations.push({ file: relative(ROOT, file), line: i + 1, prop, value, raw: line.trim() });
    }

    // Pattern 2: Tailwind arbitrary values — `p-[24px]` etc.
    const twRe = /(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|w|h|top|right|bottom|left|text|leading|rounded)-\[(\d+)(?:px|%)?\]/g;
    while ((m = twRe.exec(line)) !== null) {
      const value = parseInt(m[1], 10);
      if (ALLOWED.has(value)) continue;
      if (line.includes('%') && STRUCTURAL_VALUES.has(value)) continue;
      violations.push({ file: relative(ROOT, file), line: i + 1, prop: 'tailwind', value, raw: line.trim() });
    }
  });
}

walk(ROOT);

if (violations.length === 0) {
  console.log('✓ Fibonacci spine clean — no violations in client/src/.');
  process.exit(0);
}

console.log(`Found ${violations.length} non-Fibonacci value(s):\n`);
for (const v of violations.slice(0, 50)) {
  console.log(`  ${v.file}:${v.line}  ${v.prop}=${v.value}  →  ${v.raw}`);
}
if (violations.length > 50) console.log(`  ... and ${violations.length - 50} more`);

if (STRICT) {
  console.log('\nFAIL: --strict mode, exiting with code 1.');
  process.exit(1);
} else {
  console.log('\nWarning only (run with --strict to enforce).');
}
