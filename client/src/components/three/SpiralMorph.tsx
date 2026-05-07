// Single Fibonacci spiral that subtly morphs in scale and curl.
// Scaffold visual for Ch.5; can be replaced with a richer morph chain (galaxy → DNA → cochlea) later.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PHI = 1.618033988749895;

interface Props {
  count?: number;
  scale?: number;
}

export default function SpiralMorph({ count = 1597, scale = 1 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      // Logarithmic spiral with golden angle.
      const angle = i * 137.5 * (Math.PI / 180);
      const r = Math.sqrt(t) * 13;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.3;
      sizes[i] = Math.random() * 0.55 + 0.21;
    }
    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.13) * 0.034;
    ref.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    void PHI;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        color="#D4AF37"
        sizeAttenuation
        transparent
        opacity={0.89}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
