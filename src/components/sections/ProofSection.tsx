/**
 * Numbers section.
 *
 * Every metric here is anchored to Nibir Motors, our first lighthouse
 * customer (7 dealerships, West Bengal). We deliberately do NOT show:
 *   - "99.99% Uptime SLA" (we have no SLA contract that says 99.99%)
 *   - "<50ms Voice Response" (VoiceCore-era, not our product anymore)
 *   - "500+ Enterprise Teams" (we have one customer; this number was a lie)
 *   - "Zero Data Breaches" (vacuously true for low-traffic; misleading)
 *
 * As more customers ship, additional metrics get added, but every one
 * must be a real number we can defend if a CISO asks "where does this
 * come from?". That's the bar for a $1B-grade company. Specifics > vibes.
 */
const METRICS = [
  { value: 7,    suffix: "",         label: "Branches live"        },
  { value: 30,   suffix: "s",        label: "Voucher capture"      },
  { value: 12,   suffix: " hrs/wk",  label: "Reclaimed for Nibir"  },
  { value: 30,   suffix: " days",    label: "To 100% audit-ready"  },
];

export function ProofSection() {
  return (
    <section
      className="py-32 px-6 border-t border-[rgba(255,255,255,0.06)]"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(249,115,22,0.04) 0%, transparent 70%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <p
          className="mono-label text-[#F97316] text-center mb-3"
        >
          Real numbers, real customers
        </p>
        <p
          className="text-center text-[#52525B] text-sm mb-16"
        >
          From{" "}
          <a
            href="/case-studies/nibir-motors"
            className="text-[#A1A1AA] hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Nibir Motors, 7 dealerships, West Bengal
          </a>
          , now also live with SS Auto Trader LLP (Authorized Bajaj Dealership)
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="text-center lg:text-left"
            >
              <p className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold text-white leading-none mb-3 tracking-tight">
                {m.value}{m.suffix}
              </p>
              <p className="mono-label text-[#52525B]">{m.label}</p>
              <div
                className="w-8 h-0.5 mt-3 mx-auto lg:mx-0"
                style={{ background: "rgba(249,115,22,0.4)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
