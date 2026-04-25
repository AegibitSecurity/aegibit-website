"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const LOGOS = [
  { label: "F500",  title: "Fortune 500" },
  { label: "ENT",   title: "Enterprise" },
  { label: "G2000", title: "Global 2000" },
  { label: "UNI",   title: "University" },
  { label: "GOV",   title: "Government" },
  { label: "FIN",   title: "Financial" },
];

export function TrustStrip() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="py-14 border-y border-[rgba(255,255,255,0.06)]"
      style={{ background: "rgba(255,255,255,0.012)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mono-label text-center mb-10"
          style={{ color: "#3F3F46" }}
        >
          Trusted by security teams at
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo.label}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              title={logo.title}
              className="group flex items-center justify-center cursor-default transition-all duration-300"
              style={{
                width: 88,
                height: 40,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
              }}
              whileHover={{
                borderColor: "rgba(249,115,22,0.22)",
                backgroundColor: "rgba(249,115,22,0.04)",
              }}
            >
              <span
                className="font-semibold tracking-widest transition-colors duration-300 group-hover:text-[#A1A1AA]"
                style={{
                  fontSize: "0.62rem",
                  color: "#3F3F46",
                  letterSpacing: "0.12em",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {logo.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
