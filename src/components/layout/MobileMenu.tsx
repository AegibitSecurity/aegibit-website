"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#D1D5DB] hover:text-white hover:bg-white/5"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] bg-[#070d1a] border-l border-[rgba(37,99,235,0.2)] p-0"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[rgba(37,99,235,0.15)]">
            <Logo size="sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-[#6B7280] hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="flex-1 p-6 space-y-1">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#D1D5DB] hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="p-6 border-t border-[rgba(37,99,235,0.15)] space-y-3">
            <Link href="/pricing" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full border-[rgba(37,99,235,0.3)] text-[#D1D5DB] hover:border-[rgba(37,99,235,0.6)] hover:text-white">
                View Plans
              </Button>
            </Link>
            <Link href="/#waitlist" onClick={() => setOpen(false)}>
              <Button className="w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white">
                Get Early Access
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
