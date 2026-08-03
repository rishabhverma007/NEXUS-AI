"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export function TiltCard({
  children,
  className = "",
  intensity = 12,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const rY = (mouseX / width - 0.5) * intensity * 2;
      const rX = (mouseY / height - 0.5) * -intensity * 2;
      setRotateX(rX);
      setRotateY(rY);
      if (glare) {
        setGlarePosition({
          x: (mouseX / width) * 100,
          y: (mouseY / height) * 100,
        });
      }
    },
    [intensity, glare]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.08), transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}
