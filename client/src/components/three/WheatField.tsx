// Wheat field at sunset — procedural displaced plane.
// Used by Ch.14 The Next Century. The brief calls for "champ doré au coucher du soleil",
// a warm contrast to the cold cosmic chapters around it.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vHeight;

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
    vUv = uv;
    // Wind: ridged noise sweeping in one direction
    float wind = noise(position.xy * 1.3 + vec2(uTime * 0.34, 0.0));
    float wave = sin(position.x * 2.13 + uTime * 0.55) * 0.13;
    vec3 displaced = position;
    displaced.z += wind * 0.34 + wave * (1.0 - position.y * 0.5);
    vHeight = displaced.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const FRAGMENT = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vHeight;

  void main() {
    // Sunset sky to wheat field gradient (top → bottom).
    vec3 sky    = vec3(0.55, 0.21, 0.13); // deep orange
    vec3 horiz  = vec3(0.89, 0.55, 0.13); // warm orange
    vec3 wheat  = vec3(0.83, 0.69, 0.21); // gold
    vec3 deep   = vec3(0.34, 0.21, 0.05); // shadow

    vec3 col;
    if (vUv.y > 0.55) {
      float t = (vUv.y - 0.55) / 0.45;
      col = mix(horiz, sky, t);
    } else {
      float t = vUv.y / 0.55;
      col = mix(deep, wheat, t);
      // Highlight peaks
      col += vec3(0.13, 0.08, 0.0) * smoothstep(0.13, 0.34, vHeight);
    }
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function WheatField() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.55, 0, 0]} position={[0, -1.3, 0]}>
      <planeGeometry args={[34, 21, 89, 55]} />
      <shaderMaterial uniforms={uniforms} vertexShader={VERTEX} fragmentShader={FRAGMENT} side={THREE.DoubleSide} />
    </mesh>
  );
}
