// Background scene context.
// A single persistent <Canvas> at z-index -1 mounts once via <BackgroundCanvas />
// and switches its rendered scene based on the current chapter.
// This avoids 21× mount/unmount of WebGL contexts and enables fluid WebGL crossfades
// between chapters (space → nebula → galaxy → earth → tribal → human → ... → convergence).

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

export type SceneKey =
  | 'void'         // Ch.1 — black + heartbeat pulse
  | 'foreshadow'   // Ch.2 — drift particles
  | 'bigbang'      // Ch.3
  | 'nebula'       // Ch.4
  | 'galaxy'       // Ch.5
  | 'earth'        // Ch.6
  | 'tribal'       // Ch.7
  | 'human'        // Ch.8
  | 'brain'        // Ch.9
  | 'vesalius'     // Ch.10
  | 'mirror'       // Ch.11
  | 'civilization' // Ch.12
  | 'splitscreen'  // Ch.13 (handled inline by Ch.13, BG dims)
  | 'wheat'        // Ch.14
  | 'cosmic-zoom'  // Ch.15
  | 'red-giant'    // Ch.16
  | 'dark'         // Ch.17
  | 'blackhole'    // Ch.18
  | 'evaporation'  // Ch.19
  | 'pixel'        // Ch.20
  | 'convergence'; // Ch.21

const CHAPTER_TO_SCENE: Record<number, SceneKey> = {
  1: 'void', 2: 'foreshadow', 3: 'bigbang', 4: 'nebula', 5: 'galaxy',
  6: 'earth', 7: 'tribal', 8: 'human', 9: 'brain', 10: 'vesalius',
  11: 'mirror', 12: 'civilization', 13: 'splitscreen', 14: 'wheat',
  15: 'cosmic-zoom', 16: 'red-giant', 17: 'dark', 18: 'blackhole',
  19: 'evaporation', 20: 'pixel', 21: 'convergence',
};

interface BackgroundContextValue {
  scene: SceneKey;
  setSceneByChapter: (n: number) => void;
  setScene: (s: SceneKey) => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<SceneKey>('void');
  const value = useMemo<BackgroundContextValue>(() => ({
    scene,
    setScene,
    setSceneByChapter: (n: number) => {
      const next = CHAPTER_TO_SCENE[n] ?? 'void';
      setScene(next);
    },
  }), [scene]);
  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
}

export function useBackground(): BackgroundContextValue {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackground must be used within <BackgroundProvider>');
  return ctx;
}
