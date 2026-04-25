"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ShieldModel() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const shieldGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.4);
    shape.bezierCurveTo(0.8, 1.4, 1.3, 1.0, 1.3, 0.3);
    shape.bezierCurveTo(1.3, -0.3, 0.9, -0.9, 0, -1.5);
    shape.bezierCurveTo(-0.9, -0.9, -1.3, -0.3, -1.3, 0.3);
    shape.bezierCurveTo(-1.3, 1.0, -0.8, 1.4, 0, 1.4);

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 4,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.2;
    if (innerRef.current) {
      innerRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main shield */}
      <mesh geometry={shieldGeo} position={[0, 0, -0.15]}>
        <meshStandardMaterial
          color="#1a3a8f"
          emissive="#2563EB"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner glow layer */}
      <mesh ref={innerRef} geometry={shieldGeo} position={[0, 0, -0.05]}>
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point lights for glow */}
      <pointLight color="#2563EB" intensity={3} distance={5} position={[0, 0, 2]} />
      <pointLight color="#06B6D4" intensity={2} distance={4} position={[0, 0, -2]} />
    </group>
  );
}
