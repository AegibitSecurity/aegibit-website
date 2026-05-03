import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const COLS = {
  Product: [
    { label:"PayMint",   href:"/products/paymint" },
    { label:"Platform",  href:"/features" },
    { label:"Security",  href:"/security" },
    { label:"Pricing",   href:"/pricing"  },
    { label:"Changelog", href:"/blog"     },
  ],
  Company: [
    { label:"About",   href:"/about"   },
    { label:"Blog",    href:"/blog"    },
    { label:"Contact", href:"/contact" },
    { label:"Careers", href:"/about#careers" },
  ],
  Legal: [
    { label:"Privacy",  href:"/privacy" },
    { label:"Terms",    href:"/terms"   },
    { label:"Security", href:"/security#compliance" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#000]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="text-[#3F3F46] text-xs mt-4 leading-relaxed max-w-[200px]">
              AI, Cybersecurity, and Automation for enterprises that cannot afford failure.
            </p>
          </div>
          {Object.entries(COLS).map(([cat, links]) => (
            <div key={cat}>
              <p className="mono-label text-[#3F3F46] mb-4">{cat}</p>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-xs text-[#3F3F46] hover:text-[#A1A1AA] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <p className="text-[#3F3F46] text-xs">
            © {new Date().getFullYear()} AEGIBIT Security Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-[#3F3F46] text-xs">🇮🇳 Built in India</p>
        </div>
      </div>
    </footer>
  );
}
