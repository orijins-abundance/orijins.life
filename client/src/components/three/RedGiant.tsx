// Red giant sun — fragment shader fbm noise on a sphere, surface boiling and
// pulsing slowly as the star swells. Bloom-friendly emissive gold-orange-red.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vWorld = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorld;

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
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.55;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.13;
      a *= 0.55;
    }
    return v;
  }

  void main() {
    // Slow boiling surface
    vec3 p = vWorld * 0.55 + vec3(uTime * 0.034);
    float boil = fbm(p);
    float bands = fbm(vWorld * 1.3 + vec3(uTime * 0.013));

    // Color ramp: deep red core → orange surface → yellow flares → gold edge
    vec3 deepRed   = vec3(0.34, 0.05, 0.02);
    vec3 orange    = vec3(0.89, 0.34, 0.13);
    vec3 yellow    = vec3(1.0, 0.89, 0.34);
    vec3 gold      = vec3(0.83, 0.69, 0.21);

    vec3 base = mix(deepRed, orange, boil);
    base = mix(base, yellow, smoothstep(0.55, 0.89, boil + bands * 0.34));
    base = mix(base, gold,   smoothstep(0.89, 1.0, boil + bands * 0.55));

    // Limb darkening: edges go cooler/redder via fresnel
    float fres = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 1.3);
    base = mix(base, deepRed, fres * 0.55);

    gl_FragColor = vec4(base * 1.55, 1.0); // overdrive for bloom to catch
  }
`;

export default function RedGiant() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.013;
      // Slow swelling pulse — Fibonacci 5.5s cycle
      const swell = 1.0 + Math.sin(state.clock.elapsedTime * (Math.PI * 2 / 5.5)) * 0.034;
      meshRef.current.scale.setScalar(swell);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3.4, 89, 89]} />
      <shaderMaterial uniforms={uniforms} vertexShader={VERTEX_SHADER} fragmentShader={FRAGMENT_SHADER} />
    </mesh>
  );
}
