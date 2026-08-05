"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.25;
    }
    if (shellRef.current) {
      shellRef.current.rotation.x = -t * 0.1;
      shellRef.current.rotation.y = t * 0.18;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12;
    }
  });

  return (
    <group>
      {/* Core distorted sphere — aurora gradient */}
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
        <Sphere ref={meshRef} args={[1, 96, 96]} scale={1.55}>
          <MeshDistortMaterial
            color="#312e81"
            attach="material"
            distort={0.45}
            speed={2.2}
            roughness={0.08}
            metalness={0.9}
            emissive="#1e1b4b"
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* Wireframe shell */}
        <Sphere ref={shellRef} args={[2.15, 24, 24]}>
          <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.14} />
        </Sphere>
      </Float>

      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.5, 0.012, 16, 120]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>

      {/* Orbiting node */}
      <mesh position={[2.5, 0.4, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#a78bfa" />
      </mesh>
      <mesh position={[-2.5, -0.5, 0.2]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
    </group>
  );
}

export function HeroOrbCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pause the WebGL render loop when the orb is scrolled out of view (perf)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-[460px] w-full relative">
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 5.6], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.6} />
        <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={3} />
        <pointLight position={[6, 4, 6]} color="#a78bfa" intensity={2} />
        <FloatingOrb />
        <Stars radius={40} depth={40} count={1400} factor={3.2} saturation={0} fade speed={0.6} />
      </Canvas>
    </div>
  );
}
