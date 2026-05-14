"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 2000;

// Lazy initializer for the per-mount particle geometry. `Math.random()` is
// impure and would fail react-hooks/purity if called inside useMemo (whose
// body must be a pure function of the render). useState's initializer
// callback is explicitly allowed to be impure and runs exactly once per
// mount — the canonical React pattern for "compute once, never change."
function buildParticleField(): { positions: Float32Array; colors: Float32Array } {
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const colorBlue = new THREE.Color("#2563EB");
  const colorCyan = new THREE.Color("#06B6D4");

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;

    const t = Math.random();
    const c = colorBlue.clone().lerp(colorCyan, t);
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }
  return { positions, colors };
}

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const [{ positions, colors }] = useState(buildParticleField);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const x = pos[i3];
      const z = pos[i3 + 2];
      pos[i3 + 1] = Math.sin(x * 0.5 + t * 0.4) * Math.cos(z * 0.5 + t * 0.3) * 1.5;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}
