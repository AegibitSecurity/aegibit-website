"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();
  });

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec2 grid = fract(vUv * 20.0);
        float lineX = step(0.97, grid.x);
        float lineY = step(0.97, grid.y);
        float line = max(lineX, lineY);
        float center = distance(vUv, vec2(0.5));
        float pulse = sin(center * 12.0 - uTime * 1.5) * 0.5 + 0.5;
        float alpha = line * (1.0 - center * 1.8) * (0.3 + pulse * 0.15);
        gl_FragColor = vec4(0.149, 0.388, 0.922, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.2, 0]}
      material={material}
    >
      <planeGeometry args={[30, 30]} />
    </mesh>
  );
}
