"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "PayMint",   href: "/products/paymint" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing",   href: "/pricing"  },
  { label: "Security",  href: "/security" },
  { label: "Contact",   href: "/contact"  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const [open, setOpen]         = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
    setHidden(y > lastY.current && y > 80);
    lastY.current = y;
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -72 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[68px] transition-all duration-300",
          scrolled ? "glass-nav border-b border-[rgba(255,255,255,0.06)]" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <Logo size="sm" />

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={cn("text-sm font-medium transition-colors",
                  pathname === l.href ? "text-white" : "text-[#71717A] hover:text-white"
                )}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors px-2">
              Sign in
            </Link>
            <Link href="/products/paymint/demo"
              onClick={() => track("cta_click", { cta_id: "navbar_book_demo", cta_label: "Book Demo", target: "/products/paymint/demo" })}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ background:"#F97316", boxShadow:"0 0 24px rgba(249,115,22,0.3)" }}>
              Book Demo
            </Link>
          </div>

          <button className="md:hidden text-[#71717A] hover:text-white transition-colors"
            onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {open && (
        <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }}
          className="fixed inset-x-0 top-[68px] z-40 glass-nav border-b border-[rgba(255,255,255,0.06)] md:hidden">
          <div className="px-6 py-5 flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-sm text-[#71717A] hover:text-white py-3 border-b border-[rgba(255,255,255,0.05)] transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/products/paymint/demo"
              onClick={() => {
                track("cta_click", { cta_id: "mobile_book_demo", cta_label: "Book Demo", target: "/products/paymint/demo" });
                setOpen(false);
              }}
              className="mt-4 text-center text-sm font-semibold text-white py-3 rounded-lg"
              style={{ background:"#F97316" }}>
              Book Demo
            </Link>
            <Link href="/login" onClick={() => setOpen(false)}
              className="mt-2 text-center text-sm text-[#A1A1AA] py-2">
              Sign in
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
