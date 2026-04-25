"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export function LiveBadge() {
  const [count, setCount] = useState(47);
  const [bump, setBump]   = useState(false);

  useEffect(() => {
    // Simulate live count fluctuation every 25–60s
    const tick = () => {
      const delta = Math.random() < 0.6 ? 1 : -1;
      setCount((c) => Math.max(40, Math.min(70, c + delta)));
      setBump(true);
      setTimeout(() => setBump(false), 600);
    };

    const id = setInterval(tick, 25000 + Math.random() * 35000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.9)] backdrop-blur-xl shadow-lg"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF5A1F] opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5A1F]" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: bump ? -6 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-white text-xs font-semibold"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <Users className="w-3.5 h-3.5 text-[#52525B]" />
      <span className="text-[#52525B] text-xs">teams evaluating</span>
    </motion.div>
  );
}
