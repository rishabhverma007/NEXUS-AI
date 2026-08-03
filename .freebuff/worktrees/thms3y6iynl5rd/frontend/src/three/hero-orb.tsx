"use client";

import { useRef, useMemo, Component, ReactNode } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import {
  Sphere,
  MeshDistortMaterial,
  Float,
  Stars,
  Line,
} from "@react-three/drei";
import * as THREE from "three";

function NexusCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.25;
      meshRef.current.position.y = Math.sin(t * 0.3) * 0.15;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = t * 0.1;
      wireframeRef.current.rotation.y = t * 0.2;
      wireframeRef.current.position.y = Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <group>
      {/* Inner glow sphere */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.8}>
          <MeshDistortMaterial
            color="#7C3AED"
            attach="material"
            distort={0.35}
            speed={3}
            roughness={0.05}
            metalness={0.9}
            emissive="#7C3AED"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>

      {/* Outer wireframe sphere */}
      <Sphere ref={wireframeRef} args={[1.2, 32, 32]} scale={2.2}>
        <MeshDistortMaterial
          color="#38BDF8"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.3}
          metalness={0.5}
          emissive="#38BDF8"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.4}
        />
      </Sphere>

      {/* Orbital rings */}
      <OrbitalRing radius={3} speed={0.3} color="#7C3AED" />
      <OrbitalRing radius={3.5} speed={-0.2} color="#38BDF8" delay={Math.PI} />
      <OrbitalRing
        radius={4}
        speed={0.15}
        color="#A855F7"
        delay={Math.PI / 2}
        tilt={0.8}
      />
    </group>
  );
}

function OrbitalRing({
  radius,
  speed,
  color,
  delay = 0,
  tilt = 0,
}: {
  radius: number;
  speed: number;
  color: string;
  delay?: number;
  tilt?: number;
}) {
  const points = useMemo(() => {
    const p = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      p.push(
        new THREE.Vector3(
          Math.cos(theta) * radius,
          Math.sin(theta) * radius * 0.3,
          Math.sin(theta) * radius * 0.3
        )
      );
    }
    return p;
  }, [radius]);

  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = tilt;
      ref.current.rotation.y = state.clock.getElapsedTime() * speed + delay;
    }
  });

  return (
    <group ref={ref}>
      <Line
        points={points}
        color={color}
        lineWidth={0.5}
        transparent
        opacity={0.3}
      />
    </group>
  );
}

function FloatingParticles({ count = 80 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      pos[i * 3 + 2] = Math.cos(phi) * r;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#38BDF8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

class ThreeErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="h-full w-full flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-nexus-500/20 flex items-center justify-center mx-auto">
                <span className="text-nexus-400 text-xl">✦</span>
              </div>
              <p className="text-sm text-slate-400">
                3D visualization unavailable
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export function HeroOrbCanvas() {
  return (
    <div className="h-[500px] w-full relative">
      <ThreeErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[-5, -5, -5]} color="#7C3AED" intensity={2} />
          <pointLight position={[5, -5, 5]} color="#38BDF8" intensity={1.5} />

          <Stars
            radius={50}
            depth={50}
            count={1000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <FloatingParticles count={100} />
          <NexusCore />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}
