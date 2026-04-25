"use client";
import { useEffect, useState } from "react";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.round((window.scrollY / total) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}
