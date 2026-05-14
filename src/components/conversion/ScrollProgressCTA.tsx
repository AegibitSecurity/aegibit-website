"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

export function ScrollProgressCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(pct > 0.6);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.95)] backdrop-blur-xl px-6 py-3"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-[#A1A1AA] text-sm hidden sm:block">
              Ready to secure and scale your operations?
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/signup" className="text-sm font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2 rounded-md transition-colors">
                Get Private Access
              </Link>
              <button onClick={() => setDismissed(true)} className="text-[#52525B] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
