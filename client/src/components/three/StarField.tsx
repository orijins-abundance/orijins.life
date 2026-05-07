// Distant star backdrop. Cheap. Reused as a quiet bed beneath several chapters.
//
// Optional `decay` prop fades stars OUT one by one over time — used by Ch.17
// "Stars Go Dark" so the visitor literally watches the cosmic boneyard form.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?: number;
  radius?: number;
  speed?: number;
  color?: string;
  /** When true, stars progressively fade to black over the chapter lifetime. */
  decay?: boolean;
  /** When `decay` is true, controls how fast they go out (seconds for full die-off). */
  decayDuration?: number;
}

export default function StarField({
  count = 1597,
  radius = 55,
  speed = 0.013,
  color = '#FAFAF7',
  decay = false,
  decayDuration = 21,
}: Props) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const startTime = useRef(0);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.55 + Math.random() * 0.45);
      positions[i * 3]     = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      positions[i * 3 + 2] = Math.cos(phi) * r;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count, radius]);

  const uniforms = useMemo(() => ({
    uTime:     { value: 0 },
    uColor:    { value: new THREE.Color(color) },
    uDecay:    { value: decay ? 1 : 0 },
    uDuration: { value: decayDuration },
  }), [color, decay, decayDuration]);

  useFrame((state) => {
    if (!startTime.current) startTime.current = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * speed;
    uniforms.uTime.value = state.clock.elapsedTime - startTime.current;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aSeed;
          uniform float uTime;
          uniform float uDuration;
          uniform float uDecay;
          varying float vAlpha;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (0.34 + aSeed * 1.55) * (200.0 / -mv.z);
            // If decay is on, each star dies at t = uDuration * aSeed.
            float dieAt = uDuration * aSeed;
            float alive = uDecay > 0.5 ? (uTime < dieAt ? 1.0 : 0.0) : 1.0;
            vAlpha = alive * 0.55;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float r = length(c);
            if (r > 0.5) discard;
            float a = smoothstep(0.5, 0.0, r) * vAlpha;
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </points>
  );
}
