"use client";
import { useEffect } from "react";
import { useVisitorStore } from "@/stores/visitor-store";

interface SmartTriggerConfig {
  onWarm?:  () => void; // score 21-50
  onHot?:   () => void; // score 51-75
  onReady?: () => void; // score 76+
}

export function useSmartTrigger(config: SmartTriggerConfig) {
  const score = useVisitorStore((s) => s.behaviorScore);
  const tier  = useVisitorStore((s) => s.behaviorTier);

  useEffect(() => {
    if (tier === "warm" && config.onWarm)  config.onWarm();
    if (tier === "hot"  && config.onHot)   config.onHot();
    if (tier === "ready"&& config.onReady) config.onReady();
  }, [tier]);

  return { score, tier };
}
