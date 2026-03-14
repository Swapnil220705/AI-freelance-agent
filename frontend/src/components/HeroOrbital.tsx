"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box, Line } from "@react-three/drei";
import * as THREE from "three";

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial color="#FF3366" emissive="#FF3366" emissiveIntensity={0.5} wireframe />
    </Box>
  );
}

function Orbit({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 6;
      groupRef.current.rotation.z -= speed;
    }
  });

  return (
    <group ref={groupRef}>
      <Line points={points} color="rgba(255,51,102,0.2)" lineWidth={1} dashed dashSize={0.5} gapSize={0.2} />
      <Box ref={meshRef} args={[0.4, 0.4, 0.4]} position={[radius, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </Box>
    </group>
  );
}

export function HeroOrbital() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen">
      <Canvas camera={{ position: [0, 8, 12], fov: 40 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF3366" />
        <Core />
        <Orbit radius={4} speed={0.005} color="#00FF9D" />
        <Orbit radius={6} speed={0.003} color="#FFD600" />
        <Orbit radius={9} speed={0.001} color="#FF3366" />
      </Canvas>
    </div>
  );
}
