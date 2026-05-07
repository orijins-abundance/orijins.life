// Home — composes the 21 chapters into a single linear scroll.
// Detects the current visible chapter via IntersectionObserver and drives audio
// through `sound.setChapter`. Manages the Ch.20 → Ch.21 → Ch.1 Ouroboros loop.

import { useEffect, useMemo, useRef, useState } from 'react';
import { initLenis, destroyLenis } from '@/lib/scroll';
import { sound } from '@/lib/sound';
import { ensureInitialLoopHash } from '@/lib/loop';
import { useBackground } from '@/lib/backgroundContext';
import ProgressDots from '@/components/ui/ProgressDots';
import SoundToggle from '@/components/ui/SoundToggle';
import LoopBridge from '@/components/ui/LoopBridge';
import AcceleratingTimer from '@/components/ui/AcceleratingTimer';

import Ch01_Breath from '@/components/chapters/Ch01_Breath';
import Ch02_Foreshadow from '@/components/chapters/Ch02_Foreshadow';
import Ch03_BigBang from '@/components/chapters/Ch03_BigBang';
import Ch04_Stardust from '@/components/chapters/Ch04_Stardust';
import Ch05_Spiral from '@/components/chapters/Ch05_Spiral';
import Ch06_Gaia from '@/components/chapters/Ch06_Gaia';
import Ch07_Evolution from '@/components/chapters/Ch07_Evolution';
import Ch08_HumanAppears from '@/components/chapters/Ch08_HumanAppears';
import Ch09_TwentyWatts from '@/components/chapters/Ch09_TwentyWatts';
import Ch10_TheDay from '@/components/chapters/Ch10_TheDay';
import Ch11_Mirror from '@/components/chapters/Ch11_Mirror';
import Ch12_Civilization from '@/components/chapters/Ch12_Civilization';
import Ch13_Choice from '@/components/chapters/Ch13_Choice';
import Ch14_NextCentury from '@/components/chapters/Ch14_NextCentury';
import Ch15_TenThousand from '@/components/chapters/Ch15_TenThousand';
import Ch16_SunDies from '@/components/chapters/Ch16_SunDies';
import Ch17_StarsGoDark from '@/components/chapters/Ch17_StarsGoDark';
import Ch18_BlackHoleEra from '@/components/chapters/Ch18_BlackHoleEra';
import Ch19_Evaporation from '@/components/chapters/Ch19_Evaporation';
import Ch20_HeatDeath from '@/components/chapters/Ch20_HeatDeath';
import Ch21_Rebirth from '@/components/chapters/Ch21_Rebirth';

const CHAPTER_COUNT = 21;

export default function Home() {
  const [current, setCurrent] = useState(1);
  const [rebirthActive, setRebirthActive] = useState(false);
  const accelerationRef = useRef<HTMLDivElement>(null);
  const [accelProgress, setAccelProgress] = useState(0);
  const { setSceneByChapter } = useBackground();

  // Init Lenis + loop hash once.
  useEffect(() => {
    ensureInitialLoopHash();
    initLenis();
    return () => destroyLenis();
  }, []);

  // Detect current chapter via IntersectionObserver.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('section[data-chapter]'));
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the chapter with the largest intersection ratio.
        let best: { idx: number; ratio: number } | null = null;
        entries.forEach((e) => {
          const idx = parseInt((e.target as HTMLElement).dataset.chapter || '0', 10);
          if (!idx) return;
          if (!best || e.intersectionRatio > best.ratio) best = { idx, ratio: e.intersectionRatio };
        });
        if (best && (best as { idx: number; ratio: number }).ratio > 0.34) {
          const next = (best as { idx: number; ratio: number }).idx;
          setCurrent((prev) => {
            if (prev !== next) {
              // Don't auto-switch into Ch.21 — that's driven by Ch.20's silence callback.
              if (next !== 21) {
                sound.setChapter(next);
                setSceneByChapter(next);
              }
              return next;
            }
            return prev;
          });
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [setSceneByChapter]);

  // Acceleration timer progress (Ch.14 start → Ch.20 start).
  useEffect(() => {
    const onScroll = () => {
      const start = document.getElementById('chapter-14');
      const end = document.getElementById('chapter-20');
      if (!start || !end) return;
      const a = start.getBoundingClientRect().top + window.scrollY;
      const b = end.getBoundingClientRect().top + window.scrollY;
      const y = window.scrollY + window.innerHeight * 0.5;
      const p = (y - a) / Math.max(1, b - a);
      setAccelProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSilenceEnd = useMemo(
    () => () => setRebirthActive(true),
    [],
  );

  const onLoopClose = useMemo(
    () => () => {
      setRebirthActive(false);
      // After return to Ch.1, sound.setChapter(1) was already called inside Ch21.
      setCurrent(1);
    },
    [],
  );

  return (
    <div className="relative" style={{ background: '#0A0A0A' }}>
      <SoundToggle />
      <ProgressDots current={current} />
      <LoopBridge />
      <AcceleratingTimer progress={accelProgress} visible={current >= 14 && current <= 20} />

      <Ch01_Breath />
      <Ch02_Foreshadow />
      <Ch03_BigBang />
      <Ch04_Stardust />
      <Ch05_Spiral />
      <Ch06_Gaia />
      <Ch07_Evolution />
      <Ch08_HumanAppears />
      <Ch09_TwentyWatts />
      <Ch10_TheDay />
      <Ch11_Mirror />
      <Ch12_Civilization />
      <Ch13_Choice />
      <div ref={accelerationRef}>
        <Ch14_NextCentury />
        <Ch15_TenThousand />
        <Ch16_SunDies />
        <Ch17_StarsGoDark />
        <Ch18_BlackHoleEra />
        <Ch19_Evaporation />
        <Ch20_HeatDeath onSilenceEnd={onSilenceEnd} />
      </div>
      <Ch21_Rebirth active={rebirthActive} onLoopClose={onLoopClose} />

      <noscript>
        <div style={{ padding: 34, color: '#FAFAF7', fontFamily: 'DM Sans, sans-serif' }}>
          Human Technology requires JavaScript. Please enable it to begin the journey.
        </div>
      </noscript>
      <span className="sr-only">Total chapters: {CHAPTER_COUNT}</span>
    </div>
  );
}
