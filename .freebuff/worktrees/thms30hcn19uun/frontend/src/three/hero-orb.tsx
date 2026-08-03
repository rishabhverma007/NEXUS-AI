"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.4}>
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.4}
        speed={2.5}
        roughness={0.1}
        metalness={0.8}
        emissive="#1d4ed8"
        emissiveIntensity={0.6}
        wireframe={true}
      />
    </Sphere>
  );
}

export function HeroOrbCanvas() {
  return (
    <div className="h-[450px] w-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} color="#06b6d4" intensity={2} />
        <FloatingOrb />
      </Canvas>
    </div>
  );
}
