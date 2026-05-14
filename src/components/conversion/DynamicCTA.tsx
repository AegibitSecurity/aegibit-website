"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDynamicCTA } from "@/hooks/useDynamicCTA";
import { cn } from "@/lib/utils";

interface DynamicCTAProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DynamicCTA({ className, size = "md" }: DynamicCTAProps) {
  const cta = useDynamicCTA();

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.div
      key={cta.label}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={cta.href}
        className={cn(
          "group inline-flex items-center gap-2 font-semibold rounded-md transition-colors",
          sizeClasses[size],
          cta.urgency === "high"
            ? "bg-[#F97316] hover:bg-[#CC5500] text-white ring-2 ring-[rgba(249,115,22,0.3)]"
            : "bg-[#F97316] hover:bg-[#CC5500] text-white",
          className
        )}
      >
        {cta.label}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}
