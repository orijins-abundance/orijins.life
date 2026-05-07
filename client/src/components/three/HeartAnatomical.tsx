// Procedural anatomical heart — no GLTF, pure shader + displaced icosahedron.
// Vesalius gold-leaf aesthetic: high-frequency fbm noise on the surface, fresnel
// rim light, gold emissive, subtle vertex displacement that pulses at 60 BPM.
//
// The chapter passes a `progress` 0..1 for entry/exit fades. Mounted inside Ch.10's
// own <Canvas> (the BackgroundCanvas is set to scene='vesalius' which renders nothing).

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uBPM;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorld;

  // Hash + simplex-ish noise for vertex perturbation
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i + vec3(0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  void main() {
    // 60 BPM lub-dub: a sharp lub at t=0, softer dub at t=0.21 of each cycle.
    float t = mod(uTime * uBPM / 60.0, 1.0);
    float lub = exp(-(t / 0.13) * (t / 0.13)) * 1.0;
    float dub = exp(-((t - 0.34) / 0.13) * ((t - 0.34) / 0.13)) * 0.55;
    float beat = lub + dub;

    // Vertex displacement: 3.4% scale on beat + breathing surface noise
    float scale = 1.0 + 0.034 * smoothstep(0.0, 1.0, beat);
    float surface = noise(position * 8.9 + uTime * 0.13) * 0.034;
    vec3 displaced = position * scale + normal * surface;

    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vWorld = mv.xyz;
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uBPM;
  uniform vec3  uGold;
  uniform vec3  uInk;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  varying vec3  vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1, 0)), f.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
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
    float fres = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.1);

    // Vesalius gold-leaf detail
    vec2 uv = vec2(atan(vWorld.z, vWorld.x), vWorld.y * 0.13);
    float details = fbm(uv * 13.0 + uTime * 0.0034);

    // Pulse glow on the inner core
    float t = mod(uTime * uBPM / 60.0, 1.0);
    float beat = exp(-(t / 0.13) * (t / 0.13)) + 0.55 * exp(-((t - 0.34) / 0.13) * ((t - 0.34) / 0.13));

    vec3 base = mix(uInk * 0.13, uGold * 0.55, details * 0.89);
    vec3 rim  = uGold * fres * (0.89 + beat * 0.34);
    vec3 core = uGold * 0.55 * beat;
    vec3 finalColor = base + rim + core;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface Props {
  /** 0..1 — entry fade controlled by chapter scroll. */
  progress?: number;
}

export default function HeartAnatomical({ progress = 1 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBPM:  { value: 60 },
    uGold: { value: new THREE.Color('#D4AF37') },
    uInk:  { value: new THREE.Color('#FAFAF7') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.13;
      const s = 0.55 + progress * 0.45;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* IcosahedronGeometry detail 5 = ~10k triangles, smooth enough for displacement */}
      <icosahedronGeometry args={[1, 5]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </mesh>
  );
}
