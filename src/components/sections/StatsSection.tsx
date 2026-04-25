"use client";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { FadeIn } from "@/components/motion/FadeIn";
import { STATS } from "@/lib/constants";

export function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#070d1a] via-[#0b1526] to-[#070d1a] border-y border-[rgba(37,99,235,0.15)]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1} direction="up">
              <div className="space-y-2">
                <p className="text-4xl sm:text-5xl font-bold gradient-text">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={"prefix" in stat ? stat.prefix : ""}
                    suffix={stat.suffix}
                    decimals={"decimals" in stat ? stat.decimals : 0}
                    duration={2}
                  />
                </p>
                <p className="text-[#6B7280] text-sm">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
