"use client";

import { useState, useEffect, useCallback } from "react";

const GREETING = "Welcome To AEGIBIT Security";

export function WelcomeGreeting() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("aegibit-welcomed")) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const playVoice = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    const speak = () => {
      const utter = new SpeechSynthesisUtterance(GREETING);
      utter.rate = 0.88;
      utter.pitch = 1.35;
      utter.volume = 1;

      const voices = speechSynthesis.getVoices();
      const patterns = [
        /zira/i,
        /samantha/i,
        /karen/i,
        /victoria/i,
        /fiona/i,
        /moira/i,
        /tessa/i,
        /google.*uk.*female/i,
        /google.*female/i,
        /microsoft.*female/i,
        /female/i,
      ];

      let voice: SpeechSynthesisVoice | null = null;
      for (const p of patterns) {
        voice = voices.find((v) => p.test(v.name)) ?? null;
        if (voice) break;
      }
      if (voice) utter.voice = voice;

      speechSynthesis.speak(utter);
    };

    if (speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      speechSynthesis.addEventListener("voiceschanged", speak, { once: true });
    }
  }, []);

  const handleStart = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    localStorage.setItem("aegibit-welcomed", "1");

    playVoice();

    setTimeout(() => {
      setFadeOut(true);
      document.body.style.overflow = "";
    }, 4000);
    setTimeout(() => setVisible(false), 4800);
  }, [animating, playVoice]);

  const handleSkip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      localStorage.setItem("aegibit-welcomed", "1");
      document.body.style.overflow = "";
      setVisible(false);
    },
    [],
  );

  if (!visible) return null;

  return (
    <div
      onClick={handleStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleStart()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        background:
          "radial-gradient(ellipse at 12% 12%, rgba(0,210,160,0.13), transparent 48%), " +
          "radial-gradient(ellipse at 88% 88%, rgba(210,40,50,0.11), transparent 48%), " +
          "#0a1628",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      <div style={{ perspective: "1200px" }}>
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: animating
              ? "rotateX(6deg) rotateY(-4deg) translateZ(40px)"
              : "rotateX(0) rotateY(0) translateZ(0)",
            transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {animating ? (
            <div style={{ position: "relative" }}>
              <div
                className="greeting-write"
                style={{
                  fontFamily: "'Pacifico', cursive",
                  fontSize: "clamp(24px, 5.5vw, 58px)",
                  color: "#fff",
                  textShadow:
                    "0 0 40px rgba(249,115,22,0.35), " +
                    "0 0 80px rgba(249,115,22,0.15), " +
                    "0 8px 16px rgba(0,0,0,0.6), " +
                    "0 2px 4px rgba(0,0,0,0.4)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                {GREETING}
              </div>

              <div
                className="greeting-write"
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%) scaleY(0.15) rotateX(80deg)",
                  fontFamily: "'Pacifico', cursive",
                  fontSize: "clamp(24px, 5.5vw, 58px)",
                  color: "transparent",
                  textShadow: "0 0 30px rgba(249,115,22,0.15)",
                  whiteSpace: "nowrap",
                  filter: "blur(8px)",
                  opacity: 0.4,
                }}
              >
                {GREETING}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div
                className="greeting-pulse"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(249,115,22,0.06)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="rgba(255,255,255,0.6)" />
                </svg>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                TAP TO ENTER
              </p>
            </div>
          )}
        </div>
      </div>

      {!animating && (
        <button
          onClick={handleSkip}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          SKIP
        </button>
      )}
    </div>
  );
}
