// Brain neural sparks — for Ch.9 Twenty Watts.
// A grid of glowing nodes with random sparks firing between them.
// Fragment shader on points + vertex animation for the spark trails.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX = `
  attribute float aSeed;
  uniform float uTime;
  varying float vIntensity;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    // Each node fires sporadically: a triangle wave with random phase, mostly off.
    float phase = hash(aSeed) * 6.2831853;
    float t = mod(uTime * 0.55 + phase, 1.0);
    // Sharp spike when t crosses ~0
    float spike = exp(-pow(t * 13.0, 2.0)) + exp(-pow((t - 1.0) * 13.0, 2.0));
    vIntensity = clamp(spike, 0.0, 1.0);

    vec3 pos = position + normal * vIntensity * 0.13;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (3.0 + vIntensity * 8.0) * (300.0 / -mv.z);
  }
`;

const FRAGMENT = `
  uniform vec3 uSynapse;
  uniform vec3 uGold;
  varying float vIntensity;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r) * (0.34 + vIntensity * 0.66);
    vec3 col = mix(uSynapse, uGold, vIntensity);
    gl_FragColor = vec4(col, a);
  }
`;

export default function BrainSparks({ count = 987 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, normals, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Brain-shaped: two ellipsoidal hemispheres
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = Math.sin(phi) * Math.cos(theta) * 1.55;
      const y = Math.sin(phi) * Math.sin(theta) * 1.13;
      const z = Math.cos(phi) * 1.34;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      // Outward normal
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      normals[i * 3] = x / len;
      normals[i * 3 + 1] = y / len;
      normals[i * 3 + 2] = z / len;
      seeds[i] = Math.random() * 100;
    }
    return { positions, normals, seeds };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSynapse: { value: new THREE.Color('#00D9FF') },
    uGold:    { value: new THREE.Color('#D4AF37') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.034;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-normal" args={[normals, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
