// Persistent fullscreen <Canvas> at z-index -1.
// One WebGL context for the entire site. Scenes are SELECTED here based on
// BackgroundContext, but the actual rich per-chapter visuals (BigBang particles,
// EarthGlobe, etc.) live INSIDE each chapter component so they can be driven by
// scroll progress and own their props. This BackgroundCanvas only renders ambient
// backdrops that don't need props (StarField), or nothing for chapters that draw
// their own foreground.
//
// Sprint 2-4 will progressively wire scene-specific shaders here.

import { Canvas } from '@react-three/fiber';
import { useBackground } from '@/lib/backgroundContext';
import StarField from './StarField';

function ActiveScene() {
  const { scene } = useBackground();

  switch (scene) {
    // Chapters that own their own foreground visuals — BG stays transparent.
    case 'void':
    case 'splitscreen':
    case 'pixel':
    case 'bigbang':
    case 'galaxy':
    case 'earth':
    case 'vesalius':
    case 'mirror':
    case 'civilization':
    case 'red-giant':
    case 'blackhole':
    case 'evaporation':
    case 'convergence':
      return null;

    // Chapters that benefit from a star backdrop while their foreground is sparse.
    case 'foreshadow':
    case 'nebula':
    case 'tribal':
    case 'human':
    case 'brain':
    case 'wheat':
    case 'cosmic-zoom':
    case 'dark':
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
