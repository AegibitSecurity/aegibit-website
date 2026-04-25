"use client";
import { useEffect, useState } from "react";

export function useExitIntent(minScore = 0, onTrigger?: () => void) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exit_intent_shown")) return;

    function handle(e: MouseEvent) {
      if (e.clientY <= 10 && !triggered) {
        setTriggered(true);
        sessionStorage.setItem("exit_intent_shown", "1");
        onTrigger?.();
      }
    }

    const t = setTimeout(() => document.addEventListener("mouseleave", handle), 8000);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseleave", handle);
    };
  }, [triggered, onTrigger]);

  return triggered;
}
