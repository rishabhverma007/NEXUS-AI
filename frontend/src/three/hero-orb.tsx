"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export function HeroOrbCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    // Wireframe Distorted Sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    // Save original vertex positions so distortion never accumulates
    const origPositions = new Float32Array(geometry.attributes.position.array);

    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.6,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.scale.set(2.4, 2.4, 2.4);
    scene.add(sphere);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      sphere.rotation.x = elapsed * 0.2;
      sphere.rotation.y = elapsed * 0.3;

      // Slight wave distortion via vertex positions (from original, never accumulates)
      const positions = geometry.attributes.position;
      if (positions) {
        const array = positions.array as Float32Array;
        for (let i = 0; i < array.length; i += 3) {
          const ox = origPositions[i];
          const oy = origPositions[i + 1];
          const oz = origPositions[i + 2];
          const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const noise = Math.sin(elapsed * 2.5 - dist * 3) * 0.02;
          const scale = 1 + noise;
          array[i] = ox * scale;
          array[i + 1] = oy * scale;
          array[i + 2] = oz * scale;
        }
        positions.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-[450px] w-full relative" />;
}
