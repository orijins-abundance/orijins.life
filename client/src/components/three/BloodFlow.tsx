// Blood flow — particles travelling along a closed parametric curve in 3D.
// Color gradient gaia (#FF3D8B) → gold along the path. Additive blend for a luminous trail.
// Curve: Lissajous-style coil. The curve is computed inline in the vertex shader to
// avoid GPU-side uniform-array sampling pitfalls.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX_SHADER = `
  attribute float aOffset;
  attribute float aSize;
  uniform float uTime;
  uniform float uSpeed;
  varying float vT;

  void main() {
    float t = mod(aOffset + uTime * uSpeed, 1.0);
    vT = t;
    float angle = t * 6.2831853 * 4.0;     // 4 loops around
    float r = 1.34 + sin(t * 6.2831853) * 0.34;
    vec3 pos = vec3(cos(angle) * r, sin(t * 6.2831853 * 2.0) * 0.55, sin(angle) * r);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (300.0 / -mv.z);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uGaia;
  uniform vec3 uGold;
  varying float vT;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    vec3 col = mix(uGaia, uGold, vT);
    gl_FragColor = vec4(col, a);
  }
`;

interface Props {
  count?: number;
  progress?: number;
}

export default function BloodFlow({ count = 1597, progress = 1 }: Props) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const offsets = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random();
    return arr;
  }, [count]);
  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random() * 1.3 + 0.55;
    return arr;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uSpeed: { value: 0.13 },
    uGaia:  { value: new THREE.Color('#FF3D8B') },
    uGold:  { value: new THREE.Color('#D4AF37') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.08;
      const s = 0.55 + progress * 0.45;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
