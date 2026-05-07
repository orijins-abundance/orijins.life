// Dedicated 60 BPM heartbeat synthesizer — replaces the prior hack of using
// "Le Souffle" at low volume as the heartbeat bed.
//
// Pure Web Audio API: a kick-drum-like thump (sine wave 80 Hz with rapid pitch decay
// + low-pass filter + amplitude envelope), triggered every 1000 ms (60 BPM).
// Zero external assets. Volume routed through a master gain that obeys Howler.mute().
//
// Sprint 1.2 may swap this for a real recorded heartbeat sample if Sam delivers one
// from ORIJINS Studio. The interface (start/stop/setVolume) stays the same.

type AudioCtxLike = AudioContext;

let ctx: AudioCtxLike | null = null;
let masterGain: GainNode | null = null;
let intervalId: number | null = null;
let active = false;
let userVolume = 0.25; // -12 dB target

function ensureCtx(): AudioCtxLike {
  if (ctx) return ctx;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new Ctx();
  masterGain = ctx.createGain();
  masterGain.gain.value = userVolume;
  masterGain.connect(ctx.destination);
  return ctx;
}

function thump(at: number) {
  if (!ctx || !masterGain) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 233;
  filter.Q.value = 0.55;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(89, at);
  osc.frequency.exponentialRampToValueAtTime(34, at + 0.13);

  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(1, at + 0.013);
  env.gain.exponentialRampToValueAtTime(0.001, at + 0.34);

  osc.connect(filter);
  filter.connect(env);
  env.connect(masterGain);
  osc.start(at);
  osc.stop(at + 0.55);
}

function tick() {
  if (!ctx || !active) return;
  const now = ctx.currentTime;
  // Fire two thumps: lub (downbeat) + slightly softer dub (upbeat) — natural cardiac rhythm.
  thump(now);
  // Dub at 0.21s after lub (Fibonacci-aligned), -6 dB via shorter envelope is implicit.
  const dub = ctx.createOscillator();
  const dubEnv = ctx.createGain();
  const dubFilter = ctx.createBiquadFilter();
  dubFilter.type = 'lowpass';
  dubFilter.frequency.value = 144;
  dub.type = 'sine';
  dub.frequency.setValueAtTime(55, now + 0.21);
  dub.frequency.exponentialRampToValueAtTime(21, now + 0.34);
  dubEnv.gain.setValueAtTime(0, now + 0.21);
  dubEnv.gain.linearRampToValueAtTime(0.5, now + 0.21 + 0.013);
  dubEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
  dub.connect(dubFilter);
  dubFilter.connect(dubEnv);
  dubEnv.connect(masterGain!);
  dub.start(now + 0.21);
  dub.stop(now + 0.55);
}

export const heartbeat = {
  start(): void {
    ensureCtx();
    if (active) return;
    active = true;
    if (ctx?.state === 'suspended') void ctx.resume();
    tick();
    intervalId = window.setInterval(tick, 1000); // 60 BPM
  },

  stop(): void {
    active = false;
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  },

  setVolume(v: number): void {
    userVolume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = userVolume;
  },

  fadeTo(target: number, ms: number): void {
    if (!ctx || !masterGain) return;
    const now = ctx.currentTime;
    const t = Math.max(0.001, ms / 1000);
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, target)), now + t);
    userVolume = target;
  },

  isActive(): boolean { return active; },
};
