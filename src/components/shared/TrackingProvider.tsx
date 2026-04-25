"use client";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  useVisitorTracking();
  return <>{children}</>;
}
