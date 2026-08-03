"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export function Magnetic({
  children,
  className = "",
  strength = 25,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !ref.current) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } =
        ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({
        x: (middleX / width) * strength * 1.5,
        y: (middleY / height) * strength * 1.5,
      });
    },
    [strength, disabled]
  );

  const reset = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
