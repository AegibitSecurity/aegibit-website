"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export function ConversionSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-32 px-6 lg:px-10 bg-[#111111] border-t border-[rgba(255,255,255,0.06)]">
      <div ref={ref} className="max-w-5xl mx-auto text-center">

        {/* Orange line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
          className="w-16 h-0.5 bg-[#F97316] mx-auto mb-12 origin-left"
        />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          className="text-[clamp(2rem,5vw,3.6rem)] font-bold text-white tracking-tight leading-tight mb-6"
        >
          Ready to secure and<br />scale your business?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22,1,0.36,1] }}
          className="text-[#A1A1AA] text-lg mb-12 max-w-xl mx-auto"
        >
          Join enterprises that trust AEGIBIT to protect and power their most critical operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#CC5500] text-white font-semibold px-8 py-3.5 rounded-md text-sm transition-colors"
          >
            Get Private Access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <a
            href="mailto:contact@aegibit.com"
            className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            contact@aegibit.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
