import { Logo } from "@/components/shared/Logo";
import { TrackedLink } from "@/components/shared/TrackedLink";

const COLS = {
  Product: [
    { label:"PayMint",    href:"/products/paymint"    },
    { label:"MCP Shield", href:"/products/mcp-shield" },
    { label:"Platform",   href:"/features"            },
    { label:"Security",   href:"/security"            },
    { label:"Pricing",    href:"/pricing"             },
    { label:"Changelog",  href:"/blog"                },
  ],
  Company: [
    { label:"About",   href:"/about"   },
    { label:"Blog",    href:"/blog"    },
    { label:"Contact", href:"/contact" },
    { label:"Careers", href:"/about#careers" },
  ],
  Legal: [
    { label:"Privacy",       href:"/privacy" },
    { label:"Terms",         href:"/terms"   },
    { label:"DPDP (India)",  href:"/dpdp"    },
    { label:"Security",      href:"/security" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#000]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="text-[#71717A] text-xs mt-4 leading-relaxed max-w-[200px]">
              Cybersecurity-first operational software for businesses that
              can&apos;t afford a leak.
            </p>
          </div>
          {Object.entries(COLS).map(([cat, links]) => (
            <div key={cat}>
              <p className="mono-label text-[#3F3F46] mb-4">{cat}</p>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l.href}>
                    <TrackedLink
                      href={l.href}
                      ctaId={`footer_${cat.toLowerCase()}_${l.label.toLowerCase().replace(/\W+/g, "_")}`}
                      ctaLabel={l.label}
                      ctaSection="footer"
                      className="text-xs text-[#71717A] hover:text-white transition-colors">
                      {l.label}
                    </TrackedLink>
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
