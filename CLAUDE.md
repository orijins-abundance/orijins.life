# CLAUDE.md — orijins.life (Human Technology)

> **Maintenance rule (read first, every time):**
> Any agent — human or AI — that modifies one of the following must update this file
> in the same commit and bump the version:
> - any new chapter component or change to chapter ordering
> - any change to `lib/sound.ts`, `lib/heartbeat.ts`, `lib/scroll.ts`, `lib/loop.ts`, `lib/audioManifest.ts`
> - any change to `BackgroundCanvas`, `BackgroundProvider`, or new background scene
> - any change to the design palette, fonts, or Fibonacci spine tokens (`lib/fibonacci.ts`)
> - any new top-level dependency in `package.json`
> - any change to `vite.config.ts`, `vercel.json`, or CI

> **Version**: 0.1.0 · **Last updated**: 2026-05-07 · **Sprint**: 0 (Foundation)

---

## 1. Product

**Human Technology** is a 21-chapter Ouroboros scrollytelling experience at `orijins.life`, built by ORIJINS as the public flagship of the Constellation Orijins ecosystem.

**Founding line (non-negotiable, displayed in Ch.1)**: *"Everyone should know the vehicle they're in."*
French variant Sam uses orally: *"On aurait tous dû apprendre la base de la vie."*

**The principle**: this is not a dashboard, not a brochure — **a mirror**. The site speaks to the visitor about THEIR body. The cosmos is only a backdrop to reveal that the visitor is themselves a cosmos. Every text passes the "is this about the visitor?" filter — we use second person constantly, and numbers are about *their* day, *their* breaths, *their* atoms.

**Quality bar**: Awwwards Site of the Day. References — Active Theory, Resn, Lusion. Anti-references — Linear, Vercel marketing, any clean-but-cold SaaS.

## 2. The 21 chapters (Ouroboros)

Five narrative phases:

- **Phase 1 — Origins** (Ch.1-8): Breath → Foreshadow → Big Bang → Stardust → Spiral → Gaia → Evolution → Human Appears
- **Phase 2 — Vehicle** (Ch.9-12): Twenty Watts → The Day (VESALIUS moment) → Mirror → Civilization
- **Phase 3 — Choice** (Ch.13): The Choice — split-screen Elysium/Aurora, mouseX stereo mix, countdown to 2027-11-06 23:59 UTC, **the only outbound CTA** (`gaia.orijins.com`)
- **Phase 4 — Acceleration** (Ch.14-20): Next Century → Ten Thousand → Sun Dies → Stars Go Dark → Black Hole Era → Evaporation → Heat Death (5s of total silence)
- **Phase 5 — Rebirth** (Ch.21): convergence + auto-loop back to Ch.1

Loop: after 3 complete loops without clicking Ch.13's CTA, a subtle "Or take the bridge →" fades in (component `LoopBridge`).

## 3. The 4 pivot chapters (Sprint 1)

The mega-prompt orders us to nail these 4 first, in order, with Sam's GO between each:

1. **Ch.1 The Breath** — fragment shader radial pulse 60 BPM + audio sync + GSAP timeline. The emotional door.
2. **Ch.10 The Day (VESALIUS)** — heart GLTF + lungs + blood flow + scroll-locked 34s. The corporeal summit.
3. **Ch.13 The Choice** — polish only (already wired). The decision.
4. **Ch.21 Rebirth** — convergence shader + WebGL crossfade BG. The closure.

## 4. Non-negotiable design rules

- **Fibonacci spine**: every padding, margin, gap, font-size, animation duration MUST live on `[8, 13, 21, 34, 55, 89, 144]` or a derived ratio (`0.5s, 0.8s, 1.3s, 2.1s, 3.4s, 5.5s` for durations). Use `FIB_*` tokens from [client/src/lib/fibonacci.ts](client/src/lib/fibonacci.ts). The script `scripts/check-fibonacci.mjs` blocks CI on violations.
- **Strict palette**: `--color-void #0A0A0A`, `--color-ink #FAFAF7`, `--color-gold #D4AF37`, with rare contextual accents `--color-gaia #FF3D8B` (life/blood), `--color-synapse #00D9FF` (neural sparks Ch.9), `--color-cosmos #5B2D8C` (distant galaxies). Black + gold alone = forbidden ("cheap luxury watch ad"). Always mix ink + gold + a contextual accent.
- **Typography**: Playfair Display (titles, weight 500, letter-spacing -0.02em) · DM Sans (body/UI) · JetBrains Mono (data/eyebrows/timestamps, ALWAYS uppercase + letter-spacing 0.21em or 0.34em). Sizes only on the Fibonacci scale: 13, 21, 34, 55, 89, 144.
- **Audio is sacred**: SoundToggle visible top-right always. Consent gate at first load. Heartbeat layer at -12 dB on Ch.1-12 and Ch.14-19; muted on Ch.13 (stereo mix), Ch.20 (silence), Ch.21 (L'INFINI). Crossfade 2.1s default. Mobile preload chapter ± 2 only.
- **Site language is English.** Sam writes/talks in French; UI text and copy are in English.

## 5. Architecture

```
orijins-life/
├── client/
│   ├── index.html                                 # SEO + preload Ch.1-3 audio + OG meta
│   └── src/
│       ├── main.tsx, App.tsx
│       ├── pages/Home.tsx                         # composes 21 chapters in linear scroll
│       ├── pages/NotFound.tsx
│       ├── components/
│       │   ├── chapters/Ch01..Ch21.tsx + _shell.tsx
│       │   ├── three/                             # BackgroundCanvas + scenes + shaders
│       │   ├── overlay/ConsentGate.tsx, CustomCursor.tsx
│       │   ├── ui/                                # SoundToggle, ProgressDots, Countdown, AcceleratingTimer, LoopBridge + shadcn/ui
│       │   └── ErrorBoundary.tsx
│       ├── contexts/ThemeContext.tsx              # always dark, kept for shadcn compatibility
│       ├── hooks/                                 # useComposition, useMobile, usePersistFn
│       ├── lib/
│       │   ├── sound.ts                           # Howler SoundManager
│       │   ├── heartbeat.ts                       # Web Audio synthesized 60 BPM
│       │   ├── scroll.ts                          # Lenis + ScrollTrigger bridge
│       │   ├── loop.ts                            # #loop-N counter
│       │   ├── fibonacci.ts                       # FIB / FIB_TYPE / FIB_SPACE / FIB_DUR tokens
│       │   ├── audioManifest.ts                   # 22 ORIJINS Studio URLs
│       │   ├── backgroundContext.tsx              # SceneKey context
│       │   └── utils.ts
│       └── index.css                              # Tailwind v4 + tokens + design system
├── scripts/check-fibonacci.mjs                    # Fibonacci spine lint
├── .github/workflows/ci.yml                       # tsc + lint + test + fib-strict + build
├── vite.config.ts, tsconfig.json, vitest.config.ts, eslint.config.js
├── vercel.json
├── package.json
├── README.md, CLAUDE.md
```

## 6. Hard rules / gotchas

- **Never push to `main` without a clean local `pnpm build`** — Vercel auto-deploys to production.
- **Audio**: chapters call `sound.setChapter(N)`, never Howler directly.
- **Three.js**: use `useFrame((state, delta) => ...)`, never raw `requestAnimationFrame`.
- **GSAP**: always `gsap.context()` + cleanup `ctx.revert()` and `ScrollTrigger.refresh()`.
- **No `console.log`** in committed code (lint warns).
- **No magic numbers** — everything goes through Fibonacci tokens.
- **The CTA `gaia.orijins.com` exists ONLY in Ch.13.** No other chapter links out.
- **Site is permanently dark** — no light theme, no toggle.

## 7. External resources

- **Audio CDN**: `https://orijins-studio.vercel.app/` (22 mp3 tracks, public)
- **Outbound CTA destination** (Ch.13 only): `https://gaia.orijins.com/` (login-gated)
- **Vercel team**: `gaia-1537s-projects`
- **Domain**: `orijins.life` (registered on GoDaddy)
- **Visual reference for Ch.14-20 (acceleration phase)**: melodysheep — *Timelapse of the Future* (https://youtu.be/uD4izuDMUQA)

## 8. Sprint plan (current state)

| Sprint | Status | Content |
|---|---|---|
| -1 | ✅ done | Bootstrap from Manus skeleton, clean Manus-ware, scripts/CI/lint |
| 0  | ✅ done | Foundation polish: BackgroundCanvas, ConsentGate, CustomCursor, Lenis tuning, Web Audio heartbeat, check-fibonacci |
| 1.1 | next | Ch.1 The Breath — radial pulse fragment shader |
| 1.2 | pending | Ch.10 The Day Vesalius — heart GLTF + lungs + blood flow |
| 1.3 | pending | Ch.13 polish |
| 1.4 | pending | Ch.21 polish |
| 2 | pending | Ch.2-8 cosmic origins |
| 3 | pending | Ch.14-19 acceleration (melodysheep grammar) |
| 4 | pending | Ch.9, 11, 12, 20 intimes |
| 5 | pending | Audio mastering & sync |
| 6 | pending | Awwwards polish — Lighthouse 95+, code-split, mobile, OG image |
| 7 | pending | Submission & launch — Vercel prod, GoDaddy DNS cutover, Awwwards package |
