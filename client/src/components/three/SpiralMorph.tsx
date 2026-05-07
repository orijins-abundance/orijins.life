// Spiral that morphs through scales — galactic arm, hurricane, nautilus, DNA, cochlea.
// Single golden-angle spiral parameterized by `phase` (0..1), where phase drives
// the radius modulation and pitch (z-extrusion). The same Fibonacci grammar at
// every scale; only the visual character changes.
//
// Used by Ch.5 The Spiral. Auto-cycles through 5 phases over 21s.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?: number;
  scale?: number;
}

export default function SpiralMorph({ count = 1597, scale = 1 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, indices, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const indices = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      indices[i] = i;
      sizes[i] = Math.random() * 0.55 + 0.21;
      // Initial flat spiral — vertex shader will displace based on phase
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }
    return { positions, indices, sizes };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uCount: { value: count },
    uPhase: { value: 0 }, // 0..1 morph through scales
  }), [count]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // Morph through 5 phases over 21s loop
    uniforms.uPhase.value = (state.clock.elapsedTime % 21) / 21;
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.08;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aIndex" args={[indices, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aIndex;
          attribute float aSize;
          uniform float uTime;
          uniform float uCount;
          uniform float uPhase;
          varying float vAlpha;

          void main() {
            float t = aIndex / uCount;
            // Golden angle spiral
            float angle = aIndex * 137.5 * 0.01745329 + uTime * 0.13;
            // Phase 0: galaxy (large, flat). Phase 0.25: hurricane (dense). Phase 0.5: nautilus (spaced). Phase 0.75: DNA (z-stretched). Phase 1: cochlea (tight + z).
            float baseR = sqrt(t) * 13.0;
            float pitch = 0.0;

            float p = uPhase;
            // Hurricane ⇒ tighter
            if (p > 0.21 && p < 0.38) baseR *= 0.55;
            // Nautilus ⇒ logarithmic spread
            if (p > 0.38 && p < 0.55) baseR = exp(t * 2.13) * 1.3;
            // DNA ⇒ extrude z
            if (p > 0.55 && p < 0.79) {
              baseR *= 0.34;
              pitch = (t - 0.5) * 13.0;
            }
            // Cochlea ⇒ tight + z
            if (p >= 0.79) {
              baseR = sqrt(t) * 5.5;
              pitch = (t - 0.5) * 8.9;
            }

            vec3 pos = vec3(cos(angle) * baseR, sin(angle) * baseR, pitch);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * (300.0 / -mv.z);
            vAlpha = 0.55 + 0.34 * sin(t * 21.0 + uTime);
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float r = length(c);
            if (r > 0.5) discard;
            float a = smoothstep(0.5, 0.0, r) * vAlpha;
            gl_FragColor = vec4(0.83, 0.69, 0.21, a);
          }
        `}
      />
    </points>
  );
}
