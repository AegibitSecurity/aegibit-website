"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Platform",     href: "/features" },
  { label: "Solutions",    href: "/security" },
  { label: "Products",     href: "/#products" },
  { label: "Case Studies", href: "/blog" },
  { label: "Company",      href: "/about" },
  { label: "Contact",      href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 30);
    setHidden(y > lastY.current && y > 120);
    lastY.current = y;
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          scrolled ? "bg-[rgba(10,10,10,0.92)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 text-sm transition-colors rounded-md",
                      active ? "text-white" : "text-[#52525B] hover:text-[#A1A1AA]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/contact"
                className="text-sm text-[#A1A1AA] hover:text-white transition-colors px-4 py-2"
              >
                Book Demo
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-[#FF6A00] hover:bg-[#CC5500] text-white px-5 py-2 rounded-md transition-colors"
              >
                Get Private Access
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-[#A1A1AA] hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed inset-x-0 top-16 z-40 bg-[#111111] border-b border-[rgba(255,255,255,0.08)] lg:hidden"
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-[#A1A1AA] hover:text-white py-3 border-b border-[rgba(255,255,255,0.04)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-center text-[#A1A1AA] border border-[rgba(255,255,255,0.1)] py-2.5 rounded-md hover:text-white transition-colors"
              >
                Book Demo
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-center bg-[#FF6A00] hover:bg-[#CC5500] text-white py-2.5 rounded-md transition-colors"
              >
                Get Private Access
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </>
  );
}
