"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BUSINESS_PLAN_PER_USER = 2499; // Rs./user/month

function Slider({ label, min, max, value, onChange, prefix = "", suffix = "" }: {
  label: string; min: number; max: number; value: number;
  onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[#A1A1AA] text-sm">{label}</span>
        <span className="font-semibold text-white text-sm">
          {prefix}{value.toLocaleString("en-IN")}{suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #FF6A00 0%, #FF6A00 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
        }}
      />
      <div className="flex justify-between">
        <span className="mono-label text-[#2A2A2A]">{prefix}{min}{suffix}</span>
        <span className="mono-label text-[#2A2A2A]">{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}

export function ROICalculator() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [teamSize,    setTeamSize]    = useState(25);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [hourlyCost,  setHourlyCost]  = useState(1500);

  const results = useMemo(() => {
    const wastedHoursPerMonth  = teamSize * hoursPerDay * 22;
    const monthlySavings       = wastedHoursPerMonth * hourlyCost;
    const annualSavings        = monthlySavings * 12;
    const aegibitCostPerMonth  = teamSize * BUSINESS_PLAN_PER_USER;
    const netMonthlySavings    = monthlySavings - aegibitCostPerMonth;
    const roi                  = aegibitCostPerMonth > 0
      ? Math.round((netMonthlySavings / aegibitCostPerMonth) * 100)
      : 0;
    return { monthlySavings, annualSavings, aegibitCostPerMonth, netMonthlySavings, roi };
  }, [teamSize, hoursPerDay, hourlyCost]);

  function fmt(n: number) {
    if (n >= 10000000) return `Rs.${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000)   return `Rs.${(n / 100000).toFixed(1)}L`;
    return `Rs.${n.toLocaleString("en-IN")}`;
  }

  return (
    <section ref={ref} className="py-24 sm:py-32 px-6 lg:px-10 bg-[#111111] border-y border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="mono-label text-[#FF6A00] block mb-4">ROI Calculator</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            How much is manual work costing you?
          </h2>
          <p className="text-[#52525B] text-sm mb-12">Adjust the sliders to see your potential savings with VoiceCore.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-8"
          >
            <Slider label="Team size" min={5} max={500} value={teamSize} onChange={setTeamSize} suffix=" people" />
            <Slider label="Hours/day on manual tasks" min={1} max={8} value={hoursPerDay} onChange={setHoursPerDay} suffix=" hrs" />
            <Slider label="Average hourly cost" min={500} max={5000} value={hourlyCost} onChange={setHourlyCost} prefix="Rs." />
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="rounded-sm border border-[rgba(255,106,0,0.2)] bg-[#0A0A0A] p-8 space-y-6"
          >
            <div className="pb-6 border-b border-[rgba(255,255,255,0.06)]">
              <p className="mono-label text-[#52525B] mb-2">Monthly savings potential</p>
              <p className="text-4xl font-bold text-white tracking-tight">
                {fmt(results.monthlySavings)}
              </p>
              <p className="text-[#52525B] text-xs mt-1">from recovered hours alone</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Annual savings potential</span>
                <span className="text-white font-semibold">{fmt(results.annualSavings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">VoiceCore Business plan cost</span>
                <span className="text-[#52525B]">{fmt(results.aegibitCostPerMonth)}/mo</span>
              </div>
              <div className="flex justify-between text-sm border-t border-[rgba(255,255,255,0.06)] pt-4">
                <span className="text-[#A1A1AA] font-medium">Net monthly gain</span>
                <span className={`font-bold ${results.netMonthlySavings > 0 ? "text-[#FF6A00]" : "text-[#52525B]"}`}>
                  {results.netMonthlySavings > 0 ? "+" : ""}{fmt(results.netMonthlySavings)}
                </span>
              </div>
            </div>

            {results.roi > 0 && (
              <div className="rounded-sm bg-[rgba(255,106,0,0.08)] border border-[rgba(255,106,0,0.15)] px-4 py-3">
                <p className="text-[#FF6A00] font-semibold text-sm">
                  That&apos;s {fmt(results.annualSavings)} per year — {results.roi}x ROI on Business plan
                </p>
              </div>
            )}

            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 w-full bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold py-3 rounded-md text-sm transition-colors"
            >
              See Your Savings in Action — Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
