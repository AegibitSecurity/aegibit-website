"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export function HomeCTA() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.2 });

  return (
    <section ref={ref} className="py-32 px-6 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto">
        {/* Card with radial glow */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:0.7, ease:"easeOut" }}
          className="relative rounded-2xl overflow-hidden text-center px-8 py-20"
          style={{
            background:"linear-gradient(135deg, #0D0D0D 0%, #111 50%, #0D0D0D 100%)",
            border:"1px solid rgba(255,255,255,0.08)",
          }}>
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 65%)" }}/>
          {/* Top orange line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
            style={{ background:"linear-gradient(90deg, transparent, #F97316, transparent)" }}/>

          <motion.span
            initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.2 }}
            className="mono-label text-[#F97316] block mb-6">
            Get started
          </motion.span>

          <motion.h2
            initial={{ opacity:0,y:16 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, delay:0.15, ease:"easeOut" }}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight tracking-tight mb-5">
            Ready to secure<br/>and scale your business?
          </motion.h2>

          <motion.p
            initial={{ opacity:0,y:12 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, delay:0.25, ease:"easeOut" }}
            className="text-[#52525B] text-base mb-12 max-w-sm mx-auto">
            Join enterprises building on AEGIBIT. No credit card required.
          </motion.p>

          <motion.div
            initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
            transition={{ duration:0.5, delay:0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="text-sm font-semibold text-white px-8 py-4 rounded-xl transition-all hover:opacity-90"
              style={{ background:"#F97316", boxShadow:"0 0 40px rgba(249,115,22,0.3)", minWidth:210 }}>
              Get Enterprise Access
            </Link>
            <a href="mailto:contact@aegibit.com"
              className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              contact@aegibit.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
