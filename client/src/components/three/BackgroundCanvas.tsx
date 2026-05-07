// Persistent fullscreen <Canvas> at z-index -1.
// One WebGL context for the entire site. Scenes swap based on BackgroundContext.
// Chapter components render their foreground content on top; only Ch.13 owns its
// own dedicated <Canvas> for the split-screen WebGL (it sets scene='splitscreen'
// here so the background dims out of the way).

import { Canvas } from '@react-three/fiber';
import { Suspense, lazy } from 'react';
import { useBackground } from '@/lib/backgroundContext';
import StarField from './StarField';

// Lazy-load heavy scenes to keep initial JS bundle minimal.
const BigBangParticles = lazy(() => import('./BigBangParticles'));
const SpiralMorph      = lazy(() => import('./SpiralMorph'));
const EarthGlobe       = lazy(() => import('./EarthGlobe'));

function ActiveScene() {
  const { scene } = useBackground();

  switch (scene) {
    case 'void':
    case 'splitscreen':
    case 'pixel':
      return null; // these chapters provide their own visuals on top
    case 'bigbang':
      return <Suspense fallback={null}><BigBangParticles /></Suspense>;
    case 'galaxy':
      return <Suspense fallback={null}><SpiralMorph /></Suspense>;
    case 'earth':
      return <Suspense fallback={null}><EarthGlobe /></Suspense>;
    case 'foreshadow':
    case 'nebula':
    case 'tribal':
    case 'human':
    case 'brain':
    case 'vesalius':
    case 'mirror':
    case 'civilization':
    case 'wheat':
    case 'cosmic-zoom':
    case 'red-giant':
    case 'dark':
    case 'blackhole':
    case 'evaporation':
    case 'convergence':
      // Default backdrop while individual scenes are still TBD (Sprint 2-4).
      return <StarField />;
  }
}

export default function BackgroundCanvas() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: '#0A0A0A',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 55 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ActiveScene />
      </Canvas>
    </div>
  );
}
