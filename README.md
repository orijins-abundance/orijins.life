# orijins.life — Human Technology

> Everyone should know the vehicle they're in.

A 21-chapter Ouroboros scroll experience by ORIJINS — from the breath to the cosmos and back. Built for the Awwwards Site of the Day quality bar.

## Stack

- **Vite 7** + **React 19** + **TypeScript strict**
- **Three.js** + **@react-three/fiber** + **drei** + **postprocessing** (custom GLSL shaders)
- **GSAP** + **ScrollTrigger** (scroll-driven cinematic timelines)
- **Lenis** (smooth scroll, lerp 0.13)
- **Howler.js** (22-track audio orchestration with Fibonacci crossfades)
- **Tailwind v4** + **shadcn/ui** (Radix primitives, void/ink/gold tokens)
- **wouter** (single-page routing)
- **Framer Motion** (UI micro-interactions)

## Run locally

```bash
pnpm install
pnpm dev    # http://localhost:3700
```

## Build

```bash
pnpm build       # static output in dist/
pnpm preview     # serve dist/ locally
```

## Quality gates

Every commit must pass:

```bash
pnpm check               # TypeScript strict
pnpm lint                # ESLint flat v9
pnpm test                # Vitest unit suite
pnpm check:fibonacci     # Fibonacci spine lint
pnpm build               # full production build
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs all of the above on every PR and on push to `main`. **`pnpm check:fibonacci -- --strict` blocks merges** if any non-Fibonacci numeric value sneaks into `client/src/`.

## Architecture

- [CLAUDE.md](CLAUDE.md) — context for AI agents working on this repo
- [client/src/lib/sound.ts](client/src/lib/sound.ts) — Howler-based SoundManager (chapter switching, Ch.13 stereo split, heartbeat layer)
- [client/src/lib/heartbeat.ts](client/src/lib/heartbeat.ts) — Web Audio synthesized 60 BPM heartbeat
- [client/src/lib/scroll.ts](client/src/lib/scroll.ts) — Lenis ↔ GSAP ScrollTrigger bridge
- [client/src/lib/loop.ts](client/src/lib/loop.ts) — Ouroboros loop counter (`#loop-N` hash)
- [client/src/lib/fibonacci.ts](client/src/lib/fibonacci.ts) — design tokens (`FIB`, `FIB_TYPE`, `FIB_SPACE`, `FIB_DUR`)
- [client/src/lib/audioManifest.ts](client/src/lib/audioManifest.ts) — 22-track manifest (ORIJINS Studio CDN)
- [client/src/lib/backgroundContext.tsx](client/src/lib/backgroundContext.tsx) — persistent R3F scene context
- [client/src/components/three/BackgroundCanvas.tsx](client/src/components/three/BackgroundCanvas.tsx) — single fullscreen `<Canvas>` at z-index -1
- [client/src/components/overlay/ConsentGate.tsx](client/src/components/overlay/ConsentGate.tsx) — first-run "Press to begin" gate
- [client/src/components/overlay/CustomCursor.tsx](client/src/components/overlay/CustomCursor.tsx) — gold cursor 8→21px lerp 0.21
- [client/src/components/chapters/](client/src/components/chapters/) — 21 chapter components + shared `ChapterShell`

## Deployment

- **Hosting**: Vercel (team `gaia-1537s-projects`)
- **Domain**: `orijins.life` (registered on GoDaddy → DNS A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`)
- **Audio CDN**: `orijins-studio.vercel.app` (proprietary library)
- **Outbound CTA** (Ch.13 only): `gaia.orijins.com`

## License

UNLICENSED. © ORIJINS, 2026.
