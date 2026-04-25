"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

const CITIES = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"];

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [city, setCity] = useState(CITIES[0]);

  useEffect(() => {
    function showToast() {
      setCity(CITIES[Math.floor(Math.random() * CITIES.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    }

    // First show after 20s, then every 45s
    const first = setTimeout(showToast, 20000);
    const recurring = setInterval(showToast, 45000);

    return () => {
      clearTimeout(first);
      clearInterval(recurring);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={() => setVisible(false)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(37,99,235,0.3)] bg-[rgba(7,13,26,0.95)] backdrop-blur shadow-[0_0_24px_rgba(37,99,235,0.15)] cursor-pointer max-w-xs"
        >
          <div className="w-8 h-8 rounded-full bg-[rgba(37,99,235,0.2)] flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-[#60A5FA]" />
          </div>
          <div>
            <p className="text-[#F9FAFB] text-sm font-medium">A team from {city} just joined</p>
            <p className="text-[#6B7280] text-xs">VoiceCore waitlist</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
