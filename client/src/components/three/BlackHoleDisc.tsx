// Black hole accretion disc — a flat torus with shader-driven rotation,
// banded color (cosmos violet → gaia magenta → gold), and a black core.
// Not a true raymarched Schwarzschild lens (way too expensive), but visually
// reads as one: spinning disc, dark sphere on top, bloom for the bright bands.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uA; // inner color
  uniform vec3 uB; // mid color
  uniform vec3 uC; // outer color
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1, 0)), f.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x),
      f.y
    );
  }

  void main() {
    // vUv.x = around the torus, vUv.y = across the band
    float ring = abs(vUv.y - 0.5) * 2.0; // 0 at center band, 1 at edges
    float ang = vUv.x;
    float swirl = noise(vec2(ang * 13.0 - uTime * 0.34, ring * 5.0));

    // Doppler-style brightness — front side brighter
    float dop = 0.55 + 0.45 * sin(ang * 6.2831853);

    vec3 col = mix(uA, uB, ring);
    col = mix(col, uC, ring * ring);
    col *= 1.0 - ring * 0.55;
    col += vec3(swirl) * 0.21;
    col *= dop;

    float alpha = (1.0 - ring) * (0.55 + swirl * 0.34);
    gl_FragColor = vec4(col * 1.34, alpha);
  }
`;

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function BlackHoleDisc() {
  const groupRef = useRef<THREE.Group>(null);
  const discRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uA: { value: new THREE.Color('#D4AF37') }, // gold inner
    uB: { value: new THREE.Color('#FF3D8B') }, // gaia mid
    uC: { value: new THREE.Color('#5B2D8C') }, // cosmos outer
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.x = 1.21;
    if (discRef.current) discRef.current.rotation.z = state.clock.elapsedTime * 0.34;
  });

  return (
    <group ref={groupRef}>
      {/* Accretion disc — flat torus with custom shader */}
      <mesh ref={discRef}>
        <torusGeometry args={[2.55, 0.89, 2, 144]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Black sphere — the event horizon */}
      <mesh>
        <sphereGeometry args={[1.34, 89, 89]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}
