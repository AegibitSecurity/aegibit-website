"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useVisitorStore } from "@/stores/visitor-store";

const CITIES = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Dubai", "Singapore", "London"];

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [city, setCity]       = useState(CITIES[0]);
  const score = useVisitorStore((s) => s.behaviorScore);

  useEffect(() => {
    // Only show for warm+ visitors (score > 25)
    if (score < 20) return;

    function showToast() {
      setCity(CITIES[Math.floor(Math.random() * CITIES.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }

    const first     = setTimeout(showToast, 20000);
    const recurring = setInterval(showToast, 30000);
    return () => { clearTimeout(first); clearInterval(recurring); };
  }, [score]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={() => setVisible(false)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,17,0.95)] backdrop-blur cursor-pointer max-w-xs shadow-lg"
        >
          <div className="w-8 h-8 rounded-full bg-[rgba(255,90,31,0.15)] flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-[#FF5A1F]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">A security team from {city} just joined the waitlist</p>
            <p className="text-[#52525B] text-xs">AEGIBIT</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
