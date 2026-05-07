// Lightweight Earth placeholder for Ch.6 — a sphere with a soft fresnel and a slow rotation.
// (TODO: swap in a textured Earth + atmospheric scattering shader, NASA-grade.)

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmRef  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    if (atmRef.current)  atmRef.current.rotation.y  = -state.clock.elapsedTime * 0.05;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.1, 89, 89]} />
        <shaderMaterial
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vWorld;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              vWorld = mv.xyz;
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vWorld;
            void main() {
              vec3 viewDir = normalize(-vWorld);
              float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.1);
              vec3 base = mix(vec3(0.04, 0.13, 0.34), vec3(0.0, 0.85, 1.0), fres);
              base += vec3(0.13, 0.21, 0.34) * (1.0 - fres);
              gl_FragColor = vec4(base, 1.0);
            }
          `}
        />
      </mesh>
      <mesh ref={atmRef} scale={1.13}>
        <sphereGeometry args={[2.1, 55, 55]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{}}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.4);
              gl_FragColor = vec4(0.0, 0.85, 1.0, intensity * 0.55);
            }
          `}
        />
      </mesh>
    </group>
  );
}
