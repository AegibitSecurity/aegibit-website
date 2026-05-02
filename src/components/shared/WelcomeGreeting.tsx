"use client";

import { useEffect, useState } from "react";

export function WelcomeGreeting() {
  const [phase, setPhase] = useState<"hidden" | "show" | "fade">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("aegibit-welcomed")) return;

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.body.style.overflow = "hidden";
    setPhase("show");

    const fadeTimer = setTimeout(() => setPhase("fade"), 2200);
    const endTimer = setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = "";
      localStorage.setItem("aegibit-welcomed", "1");
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        background: "#000",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        className="greeting-write"
        style={{
          fontFamily: "'Pacifico', cursive",
          fontSize: "clamp(56px, 10vw, 132px)",
          color: "#F97316",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          paddingBottom: "0.15em",
        }}
      >
        Welcome.
      </div>
    </div>
  );
}
