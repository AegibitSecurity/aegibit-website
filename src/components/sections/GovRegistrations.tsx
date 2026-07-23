import { BadgeCheck, ScrollText, Landmark } from "lucide-react";

/**
 * GovRegistrations, the government-registration trust strip.
 *
 * Every item is defensible against a real certificate held by the
 * company (standing honesty covenant):
 *  - Udyam (MSME) registration UDYAM-WB-10-0209203, "AEGIBIT GLOBAL
 *    CONSULTING", Ministry of MSME, Government of India, registered
 *    06/06/2026, publicly verifiable at udyamregistration.gov.in.
 *  - Incorporation date 04/06/2026 per the same certificate.
 *  - Trademark: TM-A application filed at the Trade Marks Registry,
 *    Kolkata, June 2026. Filed means TM (never claim R until granted).
 * Personal data on the certificates (mobile, email, street address,
 * names) is deliberately NOT published.
 */

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "MSME Registered",
    line1: "Udyam Reg. No. UDYAM-WB-10-0209203",
    line2: "Ministry of MSME, Government of India",
  },
  {
    icon: ScrollText,
    title: "Trademark Filed",
    line1: "AEGIBIT™ application at the Trade Marks Registry",
    line2: "Intellectual Property India, Kolkata, 2026",
  },
  {
    icon: Landmark,
    title: "Registered Enterprise",
    line1: "AEGIBIT Global Consulting, incorporated 4 June 2026",
    line2: "Kolkata, West Bengal, India",
  },
] as const;

export function GovRegistrations() {
  return (
    <section className="px-6 lg:px-12 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#000" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase font-medium mb-8 text-center" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
          Registered with the Government of India
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="rounded-2xl p-6 flex items-start gap-4" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.30)" }}>
                  <Icon size={20} style={{ color: "#10B981" }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium mb-1" style={{ fontSize: "1.02rem", color: "#fff" }}>{it.title}</h3>
                  <p className="text-xs leading-relaxed break-words" style={{ color: "#A1A1AA" }}>{it.line1}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#52525B" }}>{it.line2}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: "#52525B" }}>
          Udyam registration is publicly verifiable at udyamregistration.gov.in
        </p>
      </div>
    </section>
  );
}
