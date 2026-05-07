// Procedural lungs — twin elongated forms that expand and contract in sync with a
// 16 cycles/min respiratory rhythm (4s inhale, 4s exhale, sinusoidal). Same Vesalius
// gold-leaf surface treatment as the heart, with subtle bronchial veining drawn by
// noise modulation on the fragment shader.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uCycleSec;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vLocal;

  void main() {
    // Respiration: sin curve over uCycleSec, peak at +3.4% scale.
    float phase = mod(uTime, uCycleSec) / uCycleSec;     // 0..1
    float breath = sin(phase * 3.14159);                  // 0..1..0
    float scale = 1.0 + 0.034 * breath;
    vec3 displaced = position * scale;

    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(-mv.xyz);
    vLocal = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uGold;
  uniform vec3 uInk;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vLocal;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.1);
    float bronchi = noise(vLocal * 13.0);

    vec3 base = mix(uInk * 0.08, uGold * 0.34, bronchi * 0.89);
    vec3 rim  = uGold * fres * 0.89;
    gl_FragColor = vec4(base + rim, 1.0);
  }
`;

interface Props {
  /** 0..1 — entry fade controlled by chapter scroll. */
  progress?: number;
}

export default function LungsBronchial({ progress = 1 }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(() => ({
    uTime:     { value: 0 },
    uCycleSec: { value: 4.0 },
    uGold:     { value: new THREE.Color('#D4AF37') },
    uInk:      { value: new THREE.Color('#FAFAF7') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.08;
      const s = 0.55 + progress * 0.45;
      groupRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Two ellipsoid lobes */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0, 0]} scale={[0.55, 0.89, 0.55]}>
          <icosahedronGeometry args={[1, 4]} />
          <shaderMaterial uniforms={uniforms} vertexShader={VERTEX_SHADER} fragmentShader={FRAGMENT_SHADER} />
        </mesh>
      ))}
    </group>
  );
}
