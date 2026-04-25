import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const LINKS = {
  Company: [
    { label: "About",   href: "/about" },
    { label: "Blog",    href: "/blog" },
    { label: "Careers", href: "/about#careers" },
    { label: "Contact", href: "/contact" },
  ],
  Platform: [
    { label: "AEGIBIT Flow", href: "/features" },
    { label: "AI Agents",    href: "/features" },
    { label: "Security",     href: "/security" },
    { label: "Pricing",      href: "/pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use",   href: "/terms" },
    { label: "Security",       href: "/security" },
    { label: "Compliance",     href: "/security#compliance" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="sm" />
            <p className="text-[#52525B] text-sm leading-relaxed max-w-xs">
              AI, Cybersecurity, and Automation for enterprises that cannot afford failure.
            </p>
            <p className="text-[#2A2A2A] text-xs">🇮🇳 Built in India</p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="mono-label text-[#2A2A2A] mb-5">{cat}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#2A2A2A] text-xs">
            © {new Date().getFullYear()} AEGIBIT Security Pvt. Ltd. All rights reserved.
          </p>
          <a href="mailto:contact@aegibit.com" className="text-[#52525B] text-xs hover:text-[#A1A1AA] transition-colors">
            contact@aegibit.com
          </a>
        </div>
      </div>
    </footer>
  );
}
