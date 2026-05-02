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
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(249,115,22,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="greeting-write"
        style={{
          fontFamily: "'Pacifico', cursive",
          fontSize: "clamp(56px, 10vw, 132px)",
          color: "#fff",
          letterSpacing: "0.01em",
          textShadow:
            "0 0 60px rgba(249,115,22,0.30), " +
            "0 0 120px rgba(249,115,22,0.12), " +
            "0 8px 24px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
          background:
            "linear-gradient(90deg, #ffffff 0%, #ffd9bf 45%, #f97316 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          paddingBottom: "0.15em",
        }}
      >
        Welcome.
      </div>
    </div>
  );
}
