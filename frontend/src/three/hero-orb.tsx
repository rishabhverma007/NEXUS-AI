"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Distorted Sphere */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.2}>
          <MeshDistortMaterial
            color="#7C3AED"
            attach="material"
            distort={0.35}
            speed={2}
            roughness={0.15}
            metalness={0.9}
            emissive="#6D28D9"
            emissiveIntensity={0.4}
            wireframe={false}
            transparent
            opacity={0.9}
          />
        </Sphere>
      </Float>

      {/* Outer Wireframe Sphere */}
      <Sphere args={[1, 32, 32]} scale={2.8}>
        <MeshDistortMaterial
          color="#38BDF8"
          distort={0.15}
          speed={1}
          roughness={0.5}
          metalness={0.3}
          emissive="#0284C7"
          emissiveIntensity={0.15}
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Inner Core Glow */}
      <Sphere args={[1, 16, 16]} scale={1.2}>
        <MeshDistortMaterial
          color="#8B5CF6"
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={0}
          emissive="#7C3AED"
          emissiveIntensity={0.8}
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  );
}

function ParticleRing() {
  const count = 60;
  const ref = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.2 + Math.random() * 0.5;
      temp.push({
        position: [Math.cos(angle) * radius, Math.sin(angle * 0.5) * 0.5, Math.sin(angle) * radius],
        color: i % 3 === 0 ? "#7C3AED" : i % 3 === 1 ? "#38BDF8" : "#10B981",
        size: 0.02 + Math.random() * 0.03,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position as [number, number, number]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingNodes() {
  const count = 12;
  const ref = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 4.5;
      temp.push({
        position: [Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.8, Math.sin(angle) * radius],
        scale: 0.04 + Math.random() * 0.06,
        color: i % 2 === 0 ? "#7C3AED" : "#38BDF8",
        speed: 0.5 + Math.random() * 1,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={0.1} floatIntensity={0.3}>
          <mesh position={node.position as [number, number, number]} scale={node.scale}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function HeroOrbCanvas() {
  return (
    <div className="h-full w-full relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#7C3AED" />
        <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#8B5CF6" />
        <FloatingOrb />
        <ParticleRing />
        <FloatingNodes />
      </Canvas>
    </div>
  );
}
