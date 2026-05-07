// Howler.js audio manager for Human Technology.
// Responsibilities:
//   - Per-chapter ambient track with 2.1s ease-in-out crossfade (Fibonacci timing).
//   - Persistent 60 BPM heartbeat layer at -12 dB under chapters 1-12 and 14-19,
//     muted on Ch.13 (stereo mix takes over), Ch.20 (silence), Ch.21 (L'INFINI takes over).
//   - Ch.13 split stereo: left + right tracks, both volume 1.0, only stereo pan shifts
//     based on mouseX (0..1) → left pan = -1 + 2*(1-x), right pan = -1 + 2*x.
//   - Ch.19→Ch.20: 8s crossfade (Fibonacci) — Galaxy v4 Shepard tone literally becomes
//     the planet's Schumann signal.
//   - Ch.20→Ch.21: 5 seconds of total silence, then fade-in L'INFINI as pixel grows.
//   - Loop close (Ch.21→Ch.1): crossfade L'INFINI into Le Souffle over 3.4s.
//   - Sound toggle: master mute persisted in localStorage. Default ON, but autoplay is
//     gated by a one-time consent click (browsers block autoplay without a gesture).

import { Howl, Howler } from 'howler';
import { CHAPTER_AUDIO } from './audioManifest';
import { FIB_DUR } from './fibonacci';
import { heartbeat } from './heartbeat';

type Pool = Map<string, Howl>;
type Active = { howl: Howl; volume: number };

const FADE_MS = FIB_DUR.slow * 1000;        // 2.1s default crossfade
const FADE_19_20_MS = 8 * 1000;             // 8s — Ch.19 → Ch.20
const FADE_LOOP_CLOSE_MS = FIB_DUR.long * 1000; // 3.4s — Ch.21 → Ch.1
const HEARTBEAT_VOLUME = 0.25;              // ≈ -12 dB target
const SILENCE_KEY_LS = 'orijins.muted';
const CONSENT_KEY_LS = 'orijins.consent';

interface SoundSnapshot { muted: boolean; consented: boolean }

class SoundManager {
  private pool: Pool = new Map();
  private active: Active | null = null;       // currently playing chapter (single track or null)
  private split: { left: Howl; right: Howl } | null = null; // Ch.13 stereo
  private heartbeatActive = false;
  private masterMuted: boolean = false;
  private consented: boolean = false;
  private currentChapter: number = 1;
  private listeners = new Set<() => void>();
  private snapshot: SoundSnapshot = { muted: false, consented: false };

  constructor() {
    if (typeof window !== 'undefined') {
      this.masterMuted = window.localStorage.getItem(SILENCE_KEY_LS) === '1';
      this.consented = window.localStorage.getItem(CONSENT_KEY_LS) === '1';
      Howler.mute(this.masterMuted);
    }
    this.snapshot = { muted: this.masterMuted, consented: this.consented };
  }

  // -------- Subscriptions (so React UI can reflect mute state) --------
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }
  getSnapshot(): SoundSnapshot { return this.snapshot; }
  private refreshSnapshot() {
    this.snapshot = { muted: this.masterMuted, consented: this.consented };
  }
  private emit() {
    this.refreshSnapshot();
    this.listeners.forEach((f) => f());
  }

  isMuted() { return this.masterMuted; }
  hasConsented() { return this.consented; }

  giveConsent() {
    this.consented = true;
    if (typeof window !== 'undefined') window.localStorage.setItem(CONSENT_KEY_LS, '1');
    // Resume audio context (Howler manages this internally on play).
    this.replay();
    this.emit();
  }

  toggleMute() {
    this.masterMuted = !this.masterMuted;
    Howler.mute(this.masterMuted);
    // Heartbeat lives outside Howler — fade it manually.
    heartbeat.fadeTo(this.masterMuted ? 0 : (this.heartbeatActive ? HEARTBEAT_VOLUME : 0), 233);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SILENCE_KEY_LS, this.masterMuted ? '1' : '0');
    }
    this.emit();
  }

  // -------- Pool management --------
  private getOrCreate(src: string, opts: Partial<{ loop: boolean; volume: number }> = {}): Howl {
    let h = this.pool.get(src);
    if (!h) {
      h = new Howl({
        src: [src],
        html5: true,           // stream — files can be 8+ MB
        loop: opts.loop ?? true,
        volume: opts.volume ?? 0,
        preload: true,
      });
      this.pool.set(src, h);
    }
    return h;
  }

  // -------- Heartbeat layer --------
  // Web Audio synthesized 60 BPM heartbeat (kick + soft dub).
  // Lives outside Howler so it stays sample-accurate and zero-asset.
  // Sprint 1.2 may swap this for a real recorded sample if Sam delivers one from ORIJINS Studio.
  private setHeartbeat(on: boolean) {
    if (on && !this.heartbeatActive) {
      heartbeat.setVolume(0);
      heartbeat.start();
      heartbeat.fadeTo(this.masterMuted ? 0 : HEARTBEAT_VOLUME, FADE_MS);
      this.heartbeatActive = true;
    } else if (!on && this.heartbeatActive) {
      heartbeat.fadeTo(0, FADE_MS);
      window.setTimeout(() => heartbeat.stop(), FADE_MS + 50);
      this.heartbeatActive = false;
    }
  }

  // -------- Chapter switching --------
  private fadeOutAndStop(h: Howl, ms: number) {
    h.fade(h.volume(), 0, ms);
    setTimeout(() => { try { h.stop(); } catch {} }, ms + 50);
  }

  private clearSplit(ms = FADE_MS) {
    if (this.split) {
      const { left, right } = this.split;
      this.fadeOutAndStop(left, ms);
      this.fadeOutAndStop(right, ms);
      this.split = null;
    }
  }

  private clearActive(ms = FADE_MS) {
    if (this.active) {
      this.fadeOutAndStop(this.active.howl, ms);
      this.active = null;
    }
  }

  /** Play chapter `n` with proper crossfade + heartbeat layering. */
  setChapter(n: number) {
    if (n === this.currentChapter && (this.active || this.split)) return;
    const prev = this.currentChapter;
    this.currentChapter = n;

    // Pick fade timing per the brief.
    let fadeMs = FADE_MS;
    if (prev === 19 && n === 20) fadeMs = FADE_19_20_MS;
    if (prev === 21 && n === 1) fadeMs = FADE_LOOP_CLOSE_MS;

    // Clear what was playing
    this.clearSplit(fadeMs);

    if (n === 13) {
      // Stereo split — Ch.13 masterpiece
      this.clearActive(fadeMs);
      this.setHeartbeat(false);
      const split = CHAPTER_AUDIO[13] as { left: string; right: string };
      const left = this.getOrCreate(split.left, { loop: true, volume: 0 });
      const right = this.getOrCreate(split.right, { loop: true, volume: 0 });
      try { if (!left.playing()) left.play(); } catch {}
      try { if (!right.playing()) right.play(); } catch {}
      // Both volumes ramp to 1.0; pan starts centered.
      left.fade(left.volume(), 1.0, fadeMs);
      right.fade(right.volume(), 1.0, fadeMs);
      try { (left as Howl).stereo(-0.5); (right as Howl).stereo(0.5); } catch {}
      this.split = { left, right };
      return;
    }

    // Standard single-track chapters
    const src = CHAPTER_AUDIO[n] as string | undefined;
    if (!src) { this.clearActive(fadeMs); return; }

    // Fade out previous active
    const prevActive = this.active;

    const next = this.getOrCreate(src, { loop: true, volume: 0 });
    try { if (!next.playing()) next.play(); } catch {}
    next.fade(next.volume(), 1.0, fadeMs);
    this.active = { howl: next, volume: 1.0 };

    if (prevActive && prevActive.howl !== next) {
      this.fadeOutAndStop(prevActive.howl, fadeMs);
    }

    // Heartbeat layering per the brief:
    //   ON  for Ch.1-12 and Ch.14-19
    //   OFF for Ch.13 (stereo split takes over), Ch.20 (silence), Ch.21 (L'INFINI)
    // The synthesized heartbeat is on a separate audio path (not a Howler track), so
    // it can safely run under Ch.1 (Le Souffle) without doubling the same sample.
    const heartbeatOn = (n >= 1 && n <= 12) || (n >= 14 && n <= 19);
    this.setHeartbeat(heartbeatOn);
  }

  /** Mute everything (used by Ch.20 → Ch.21 silence gap). */
  silence(durationMs = 250) {
    this.clearActive(durationMs);
    this.clearSplit(durationMs);
    this.setHeartbeat(false);
  }

  /** Replay current chapter (used after consent). */
  private replay() {
    const cur = this.currentChapter;
    this.currentChapter = -1;
    this.setChapter(cur);
  }

  // -------- Ch.13 stereo mix from mouseX (0..1) --------
  setStereoMix(mouseX: number) {
    if (!this.split) return;
    const x = Math.max(0, Math.min(1, mouseX));
    // LEFT track: when mouse is at left (x=0) → pan -1 (full left). When mouse moves right, pan moves toward +1.
    const leftPan  = -1 + 2 * (1 - x);  // x=0 → +1; x=1 → -1
    // RIGHT track: opposite
    const rightPan = -1 + 2 * x;        // x=0 → -1; x=1 → +1
    // Per the brief: LEFT pan = -1 + 2*(1 - x), RIGHT pan = -1 + 2*x — matches what we want:
    // When mouse fully right (x=1): left pan = -1 (left ear), right pan = +1 (right ear). Wait, re-read:
    // "LEFT track stereo-pan = -1 + 2 * (1 - mouseX)" → at x=1, left pan = -1. So Chaos drifts to left ear when mouse is right.
    // "RIGHT track stereo-pan = -1 + 2 * mouseX" → at x=1, right pan = +1. Résonance fully in right ear.
    // Net effect: as mouse moves right, the user *favors* the right ear with Aurora resonance.
    try {
      this.split.left.stereo(leftPan);
      this.split.right.stereo(rightPan);
    } catch {}
  }
}

export const sound = new SoundManager();

// Hook helper for React UI components
import { useSyncExternalStore } from 'react';
const SERVER_SNAPSHOT: SoundSnapshot = { muted: false, consented: false };
export function useSoundState(): SoundSnapshot {
  return useSyncExternalStore(
    (cb) => sound.subscribe(cb),
    () => sound.getSnapshot(),
    () => SERVER_SNAPSHOT,
  );
}
