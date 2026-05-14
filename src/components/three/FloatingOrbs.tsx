"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ORB_DATA = [
  { radius: 2.4, speed: 0.6,  size: 0.12, color: "#2563EB", yOffset: 0.2 },
  { radius: 3.0, speed: 0.4,  size: 0.08, color: "#06B6D4", yOffset: 0.5 },
  { radius: 1.8, speed: 0.9,  size: 0.10, color: "#60A5FA", yOffset: -0.3 },
  { radius: 3.5, speed: 0.35, size: 0.07, color: "#22D3EE", yOffset: 0.7 },
  { radius: 2.1, speed: 0.7,  size: 0.09, color: "#8B5CF6", yOffset: -0.5 },
  { radius: 2.8, speed: 0.5,  size: 0.06, color: "#10B981", yOffset: 0.1 },
];

function Orb({ radius, speed, size, color, yOffset }: typeof ORB_DATA[0] & { startAngle?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius * 0.6;
    meshRef.current.position.y = yOffset + Math.sin(t * 1.3) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        roughness={0}
        metalness={0.3}
      />
    </mesh>
  );
}

export function FloatingOrbs() {
  return (
    <group>
      {ORB_DATA.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
    </group>
  );
}
