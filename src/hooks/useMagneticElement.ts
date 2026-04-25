"use client";
import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMagneticElement(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width  / 2) * strength);
    y.set((e.clientY - rect.top  - rect.height / 2) * strength);
  }

  function onMouseLeave() { x.set(0); y.set(0); }

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}
