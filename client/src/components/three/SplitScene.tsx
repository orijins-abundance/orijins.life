// Ch.13 split-screen WebGL — left = Elysium (crisis red, dissonant glitch),
// right = Aurora (gold + magenta organic flow). The central seam is a vertical
// glow line that "heals" when seamProgress → 1.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  /** 0..1 — controls seam glow + side blends; 1 = healed. */
  seamProgress: number;
  /** 0..1 — mouse X across viewport. 0 = left, 1 = right. */
  mouseX: number;
}

export default function SplitScene({ seamProgress, mouseX }: Props) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSeam: { value: 0 },
    uMouseX: { value: 0.5 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uSeam.value = seamProgress;
    uniforms.uMouseX.value = mouseX;
    uniforms.uResolution.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uSeam;
          uniform float uMouseX;
          uniform vec2 uResolution;

          // 2D hash + value noise — small, cheap.
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main() {
            vec2 uv = vUv;
            // 0 on left, 1 on right
            float side = step(0.5, uv.x);

            // ---------- LEFT (Elysium / dystopia) ----------
            // Ash background with crisis-red glitch bands and cyan tearing.
            vec3 ash = vec3(0.10, 0.085, 0.080);
            float gl1 = step(0.96, hash(vec2(floor(uv.y * 144.0), floor(uTime * 13.0))));
            float gl2 = step(0.97, hash(vec2(floor(uv.y * 233.0 + uTime * 5.0), 1.0)));
            vec3 leftCol = ash;
            leftCol += vec3(1.0, 0.27, 0.27) * gl1 * 0.55;
            leftCol += vec3(0.0, 0.85, 1.0) * gl2 * 0.34;
            // Fractured glass strata
            float strata = noise(vec2(uv.x * 21.0, uv.y * 8.0 + uTime * 0.13));
            leftCol = mix(leftCol, vec3(0.21, 0.13, 0.13), strata * 0.34);
            // Vignette to deepen
            float vL = smoothstep(0.0, 0.5, abs(uv.x - 0.25));
            leftCol *= 1.0 - vL * 0.21;

            // ---------- RIGHT (Aurora / abundance) ----------
            // Void with gold + magenta flowmap spirals.
            float a = atan(uv.y - 0.5, uv.x - 0.75);
            float r = length(vec2((uv.x - 0.75) * 2.0, uv.y - 0.5));
            float spiral = sin(a * 5.0 + r * 21.0 - uTime * 0.55);
            vec3 gold = vec3(0.83, 0.69, 0.21);
            vec3 mag  = vec3(1.0, 0.24, 0.55);
            vec3 rightCol = vec3(0.039);
            rightCol += gold * smoothstep(0.21, 0.55, spiral) * 0.55;
            rightCol += mag  * smoothstep(0.34, 0.89, sin(a * 8.0 - r * 13.0 + uTime * 0.21)) * 0.34;
            // Gentle flow noise
            float flow = noise(vec2(uv.x * 3.0 + uTime * 0.13, uv.y * 3.0 - uTime * 0.08));
            rightCol += vec3(0.13, 0.08, 0.03) * flow;
            // Organic falloff toward the edges
            float vR = smoothstep(0.0, 0.5, abs(uv.x - 0.75));
            rightCol *= 1.0 - vR * 0.13;

            vec3 col = mix(leftCol, rightCol, side);

            // ---------- Seam ----------
            // A vertical seam at uv.x = 0.5. Glow is brightest when seamProgress = 1 (healed).
            float seamDist = abs(uv.x - 0.5);
            float seamGlow = exp(-seamDist * 144.0) * (0.21 + uSeam * 1.0);
            // Healing: as seam progresses, seam gold flooding both sides.
            col += vec3(0.83, 0.69, 0.21) * seamGlow;
            // When healed, also blend both sides toward gold around the seam.
            float bleed = smoothstep(0.21, 0.0, seamDist) * uSeam;
            col = mix(col, vec3(0.83, 0.69, 0.21) * 0.55, bleed * 0.34);

            // Mouse-X subtle weighting cue (the audio mix is the real signal).
            // We brighten the side the user is favoring by ~5%.
            float favor = step(uMouseX, uv.x) * 0.034 + (1.0 - step(uMouseX, uv.x)) * (-0.034);
            col *= 1.0 + favor;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}
