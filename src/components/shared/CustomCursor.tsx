"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    // Desktop only
    if (window.innerWidth < 768) return;

    function move(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsPointer(
        el !== null &&
        ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) ||
        window.getComputedStyle(el as Element).cursor === "pointer"
      );
    }

    function leave() { setVisible(false); }

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [visible, cursorX, cursorY]);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isPointer ? 1.5 : 1, opacity: visible ? 1 : 0 }}
        transition={{ scale: { duration: 0.15 } }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF6A00] z-[9999] pointer-events-none mix-blend-normal"
      />
      {/* Ring */}
      <motion.div
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isPointer ? 2 : 1, opacity: visible ? 0.4 : 0 }}
        transition={{ scale: { duration: 0.2 } }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#FF6A00] z-[9998] pointer-events-none"
      />
    </>
  );
}
