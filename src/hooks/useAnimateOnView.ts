"use client";
import { useInView } from "react-intersection-observer";

export function useAnimateOnView(threshold = 0.1, once = true) {
  const [ref, inView] = useInView({ threshold, triggerOnce: once });
  return { ref, inView };
}
