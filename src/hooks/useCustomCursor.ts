"use client";
import { useEffect, useRef } from "react";

export function useCustomCursor() {
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    function move(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener("mousemove", move, { passive: true });
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return pos;
}
