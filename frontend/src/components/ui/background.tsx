"use client";

import { useEffect, useRef, useMemo } from "react";

/* ============================================================
   Stars Background - Animated particle field
   ============================================================ */
export function StarsBackground({ count = 200 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.005,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      time += 0.016;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.3 + 0.7;
        ctx!.beginPath();
        ctx!.arc(
          (star.x / 100) * canvas!.width,
          (star.y / 100) * canvas!.height,
          star.size,
          0,
          Math.PI * 2
        );
        ctx!.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx!.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

/* ============================================================
   Grid Background - Animated grid overlay
   ============================================================ */
export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
        }}
      />
    </div>
  );
}

/* ============================================================
   Aurora Background - Animated ambient light blobs
   ============================================================ */
export function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Primary Aurora Blob */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-30 blur-[120px] animate-aurora"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.3) 0%, rgba(56, 189, 248, 0.15) 40%, transparent 70%)",
        }}
      />

      {/* Secondary Aurora Blob */}
      <div
        className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] animate-aurora-slow"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.25) 0%, rgba(16, 185, 129, 0.1) 40%, transparent 70%)",
        }}
      />

      {/* Tertiary Aurora Blob */}
      <div
        className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] animate-float-slow"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ============================================================
   Noise Overlay - Subtle film grain texture
   ============================================================ */
export function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   Combined Background - Everything together
   ============================================================ */
export function NexusBackground() {
  return (
    <>
      <StarsBackground />
      <GridBackground />
      <AuroraBackground />
      <NoiseOverlay />
    </>
  );
}
