"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDynamicCTA } from "@/hooks/useDynamicCTA";

export function StickyMobileCTA() {
  const [show, setShow]         = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const footerRef               = useRef<Element | null>(null);
  const cta                     = useDynamicCTA();

  // Detect mobile once on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    footerRef.current = document.querySelector("footer");

    function onScroll() {
      const heroHeight = window.innerHeight;
      setShow(window.scrollY > heroHeight);

      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setAtFooter(rect.top < window.innerHeight);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {show && !atFooter && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[rgba(10,10,10,0.97)] border-t border-[rgba(255,255,255,0.06)] backdrop-blur-xl"
        >
          <Link
            href={cta.href}
            className="block w-full text-center bg-[#FF5A1F] hover:bg-[#E84E17] text-white font-semibold py-3.5 rounded-md text-sm transition-colors active:scale-[0.98]"
          >
            {cta.label}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
