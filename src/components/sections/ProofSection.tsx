"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

const METRICS = [
  { value:99.99, suffix:"%",   label:"Uptime SLA",       decimals:2 },
  { value:50,    prefix:"<",   suffix:"ms",  label:"Voice Response" },
  { value:500,   suffix:"+",   label:"Enterprise Teams"             },
  { value:0,     suffix:"",    label:"Data Breaches",    zero:true  },
];

export function ProofSection() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.2 });

  return (
    <section ref={ref} className="py-32 px-6 border-t border-[rgba(255,255,255,0.06)]"
      style={{ background:"radial-gradient(ellipse at center, rgba(249,115,22,0.04) 0%, transparent 70%)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.p initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
          transition={{ duration:0.5 }}
          className="mono-label text-[#F97316] text-center mb-16">
          By the numbers
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity:0, y:20 }}
              animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.5, delay:i*0.08, ease:"easeOut" }}
              className="text-center lg:text-left">
              <p className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold text-white leading-none mb-3 tracking-tight">
                {"zero" in m ? (
                  <span>Zero</span>
                ) : (
                  <AnimatedCounter
                    value={m.value}
                    prefix={m.prefix ?? ""}
                    suffix={m.suffix}
                    decimals={"decimals" in m ? m.decimals : 0}
                    duration={2}
                  />
                )}
              </p>
              <p className="mono-label text-[#52525B]">{m.label}</p>
              {/* Orange underline accent */}
              <div className="w-8 h-0.5 mt-3 mx-auto lg:mx-0" style={{ background:"rgba(249,115,22,0.4)" }}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
