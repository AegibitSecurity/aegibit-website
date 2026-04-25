"use client";
import { motion } from "framer-motion";

const LOGOS = [
  "HDFC Bank", "ICICI Bank", "Wipro", "Infosys", "TCS",
  "Razorpay", "Zerodha", "PhonePe", "Groww", "Paytm", "NPCI", "SBI Life",
];

export function LogosBarSection() {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className="py-12 border-y border-[rgba(37,99,235,0.1)] overflow-hidden">
      <p className="text-center mono-label text-[#374151] mb-8">
        Trusted by security-conscious teams
      </p>
      <div className="relative">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          style={{ width: "max-content" }}
        >
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-3 rounded-lg border border-[rgba(37,99,235,0.12)] bg-[rgba(7,13,26,0.5)] text-[#374151] font-semibold text-sm whitespace-nowrap hover:text-[#6B7280] transition-colors"
            >
              {name}
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#040810] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#040810] to-transparent z-10" />
      </div>
    </section>
  );
}
