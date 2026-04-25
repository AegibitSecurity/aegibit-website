"use client";
import { useVisitorStore } from "@/stores/visitor-store";
import type { BehaviorTier } from "@/types/visitor";

export function useBehaviorScore(): { score: number; tier: BehaviorTier } {
  const score = useVisitorStore((s) => s.behaviorScore);
  const tier  = useVisitorStore((s) => s.behaviorTier);
  return { score, tier };
}
