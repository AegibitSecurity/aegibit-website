"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * WebsiteCarousel3D, an eye-catching rotating 3D cylinder of the websites
 * AEGIBIT has built. Cards sit around a vertical axis and the cylinder
 * spins slowly on its own; visitors can drag to spin it or use the arrows.
 *
 * Behaviour:
 *  - auto-rotates unless hovered, dragged, or the user prefers reduced motion
 *  - drag (pointer) to spin freely; a real drag suppresses the card link click
 *  - every card is still a crawlable <a> with an <img alt>, so SEO is intact
 *
 * Honesty note matches the old grid: framed as "websites we have built".
 * Only OJAS (a live client on its own domain) carries a "Live client" badge.
 */

interface Site {
  name: string;
  category: string;
  url: string;
  img: string;
  live?: boolean;
}

const SITES: Site[] = [
  { name: "Kris Cross Gym", category: "Fitness studio", url: "https://kris-cross-gym.vercel.app/", img: "/work/kris-cross-gym.jpg" },
  { name: "AURELIA", category: "Fine dining", url: "https://aurelia-ebon.vercel.app/", img: "/work/aurelia-ebon.jpg" },
  { name: "Vyom Estates", category: "Luxury real estate", url: "https://vyom-estates.vercel.app/", img: "/work/vyom-estates.jpg" },
  { name: "OJAS Fitness O.9", category: "Fitness studio", url: "https://ojasfitness09.com/", img: "/work/ojas-fitness.jpg", live: true },
  { name: "Burimar Abha Boutique", category: "Boutique and fashion", url: "https://burimar-abha-boutique.vercel.app/", img: "/work/burimar-abha-boutique.jpg" },
];

const N = SITES.length;
const STEP = 360 / N;

export function WebsiteCarousel3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const dragging = useRef(false);
  const paused = useRef(false);
  const lastX = useRef(0);
  const moved = useRef(0);
  const [dims, setDims] = useState({ cardW: 320, cardH: 232, radius: 380 });

  // Responsive card + cylinder radius.
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const cardW = w < 480 ? 220 : w < 768 ? 270 : 320;
      const cardH = Math.round(cardW * 0.72);
      const radius = Math.round((cardW / 2) / Math.tan(Math.PI / N) + cardW * 0.5);
      setDims({ cardW, cardH, radius });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Animation loop (ref-driven, no per-frame React re-render).
  useEffect(() => {
    let raf = 0;
    const reduced = typeof window !== "undefined"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      if (!dragging.current && !paused.current && !reduced) angle.current += 0.12;
      if (stageRef.current) {
        stageRef.current.style.transform = `translateZ(-${dims.radius}px) rotateY(${angle.current}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dims.radius]);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    moved.current = 0;
    // NOTE: deliberately NOT calling setPointerCapture here. Capturing the
    // pointer on this container retargets the synthetic click to the
    // container, so the card <a> never navigates. Pointer-move still
    // bubbles up from the cards for the drag-to-spin, and a real drag is
    // suppressed in the card onClick via the moved threshold.
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    moved.current += Math.abs(dx);
    angle.current += dx * 0.25;
  };
  const onUp = () => { dragging.current = false; };
  const nudge = (dir: number) => { angle.current += dir * STEP; };

  return (
    <section className="px-6 lg:px-12 py-20 md:py-24 border-t overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#000" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
            Design range
          </p>
          <h2 className="font-light mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
            Websites we have built
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#A1A1AA" }}>
            A selection of sites we have designed and shipped, across fitness, hospitality, real estate, and retail. Drag to spin, or tap any one to open it live.
          </p>
        </div>

        {/* radial glow behind the cylinder */}
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(249,115,22,0.10) 0%, transparent 70%)" }} />

          <div
            className="relative mx-auto flex items-center justify-center select-none touch-pan-y"
            style={{ height: dims.cardH + 90, perspective: "1200px", perspectiveOrigin: "50% 50%", cursor: "grab" }}
            onPointerEnter={() => { paused.current = true; }}
            onPointerLeave={() => { paused.current = false; dragging.current = false; }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
          >
            <div
              ref={stageRef}
              style={{ position: "relative", width: dims.cardW, height: dims.cardH, transformStyle: "preserve-3d" }}
            >
              {SITES.map((s, i) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (moved.current > 6) e.preventDefault(); }}
                  className="group absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    width: dims.cardW,
                    height: dims.cardH,
                    transform: `rotateY(${i * STEP}deg) translateZ(${dims.radius}px)`,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "#0D0D0D",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
                  }}
                >
                  <Image
                    src={s.img}
                    alt={`${s.name} website designed and built by AEGIBIT`}
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                    draggable={false}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)" }} />
                  {s.live && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] uppercase font-bold" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981", letterSpacing: "0.1em" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
                      Live client
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase font-bold mb-0.5" style={{ color: "#F97316", letterSpacing: "0.14em" }}>{s.category}</p>
                      <h3 className="font-medium leading-tight" style={{ fontSize: "1.05rem", color: "#fff" }}>{s.name}</h3>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#fff" }}>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* controls */}
          <div className="relative z-10 flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              aria-label="Spin left"
              onClick={() => nudge(-1)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs" style={{ color: "#52525B" }}>Drag to explore</span>
            <button
              type="button"
              aria-label="Spin right"
              onClick={() => nudge(1)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
