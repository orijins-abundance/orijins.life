// Shared between Ch.3 (Big Bang) and Ch.21 (Rebirth).
// The literal reuse is the whole point — proves the loop is real.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  /** 0..1 — explosion progress (0 = single point, 1 = fully expanded). */
  progress: number;
  /** Multiplier applied to particle radial speed; default 1. */
  intensity?: number;
  /** Rotation around z-axis in radians. */
  rotation?: number;
  /** Particle count — default 8000 for performance. */
  count?: number;
}

export default function BigBangParticles({
  progress,
  intensity = 1,
  rotation = 0,
  count = 8000,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, directions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const directions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const goldA = new THREE.Color('#D4AF37');
    const goldB = new THREE.Color('#FBBF24');
    const cyan = new THREE.Color('#00D9FF');
    const violet = new THREE.Color('#5B2D8C');
    const magenta = new THREE.Color('#FF3D8B');
    const palette = [goldA, goldB, cyan, violet, magenta];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Sphere — uniform on the unit sphere.
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.sin(phi) * Math.sin(theta);
      const dz = Math.cos(phi);
      directions[i3] = dx;
      directions[i3 + 1] = dy;
      directions[i3 + 2] = dz;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      sizes[i] = Math.random() * 1.3 + 0.5;
    }
    return { positions, directions, colors, sizes };
  }, [count]);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uIntensity: { value: 1 },
  }), []);

  useFrame((state) => {
    uniforms.uProgress.value = progress;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uIntensity.value = intensity;
    if (pointsRef.current) {
      pointsRef.current.rotation.z = rotation + state.clock.elapsedTime * 0.013;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-direction" args={[directions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute vec3 direction;
          attribute vec3 color;
          attribute float size;
          uniform float uProgress;
          uniform float uTime;
          uniform float uIntensity;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            // Radial expansion with eased acceleration; some randomness per-particle.
            float p = pow(uProgress, 1.3);
            float spread = 21.0 * p * uIntensity;
            float jitter = sin(uTime * 0.55 + size * 8.9) * 0.21;
            vec3 pos = direction * (spread + jitter * p);
            // Fade-in then slight fade-out at the edge of the explosion.
            vAlpha = smoothstep(0.0, 0.13, p) * (1.0 - smoothstep(0.89, 1.0, p) * 0.34);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = size * 3.4 * (300.0 / -mv.z);
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d) * vAlpha;
            gl_FragColor = vec4(vColor, a);
          }
        `}
      />
    </points>
  );
}
