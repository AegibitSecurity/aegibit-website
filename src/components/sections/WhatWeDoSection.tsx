"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function WhatWeDoSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-32 px-6 lg:px-10 border-t border-[rgba(255,255,255,0.06)] bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mono-label text-[#F97316] block mb-8"
        >
          What we do
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          className="text-[clamp(2rem,4vw,3.2rem)] font-bold text-white tracking-tight leading-tight mb-8 max-w-3xl"
        >
          We build systems that think, secure, and scale.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22,1,0.36,1] }}
          className="text-[#A1A1AA] text-lg leading-relaxed max-w-2xl"
        >
          AEGIBIT combines AI, cybersecurity, and automation to build intelligent systems for modern enterprises.
          We help companies operate faster, safer, and smarter — without compromising on security or control.
        </motion.p>
      </div>
    </section>
  );
}
