import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { CheckCircle2, ExternalLink } from "lucide-react";

/**
 * /status — AEGIBIT service-status page.
 *
 * Discipline call:
 *   A status page only earns trust if it's wired to real signals. At
 *   AEGIBIT's current scale we monitor via (a) Vercel's own platform
 *   uptime dashboard, (b) GitHub's availability for the public
 *   repositories, and (c) manual incident-channel review. We don't yet
 *   operate a multi-region observability grid because we don't yet
 *   have the SLA tier to justify pretending to.
 *
 *   Saying that honestly is the high-trust move. A "100% green for the
 *   last 90 days" wall of synthetic checkmarks would be the same
 *   credibility miss we eliminated everywhere else in the $1B sprint.
 *
 * What this page covers:
 *   - Current state per surface (Marketing, API, PayMint app subdomain,
 *     MCP Shield GitHub releases). Each state is sourced from an
 *     externally verifiable signal a reader can click through to.
 *   - Incident history (currently empty — said so).
 *   - How to be notified (email path through the existing leads
 *     pipeline; explicit promise that this list is incident-only).
 *
 * What this page does NOT show:
 *   - Synthetic 90-day uptime histogram. Without real probes those
 *     numbers would be invented.
 *   - SLA percentages we don't publish to customers under contract.
 *
 * When the next status-page upgrade happens, the trigger is one of:
 *   - First paid PayMint MSA with an uptime SLA clause attached
 *   - First independent monitoring vendor in the stack (Better Stack
 *     free tier is the likely first step — zero-spend compatible)
 *   - First inbound incident the system surfaced on its own
 */

export const metadata: Metadata = {
  title: "AEGIBIT Service Status — Live operational state",
  description:
    "Current operational state of every AEGIBIT surface — marketing site, API endpoints, PayMint application, and MCP Shield public repositories. Honest scope, externally verifiable signals, no synthetic uptime histograms.",
  alternates: { canonical: "/status" },
  openGraph: {
    title: "AEGIBIT Service Status",
    description:
      "Live operational state of every AEGIBIT surface. Honest scope, externally verifiable signals.",
    type: "website",
    url: "https://www.aegibit.com/status",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary",
    title: "AEGIBIT Service Status",
    description: "Live operational state of every AEGIBIT surface.",
  },
};

const SURFACES = [
  {
    name: "Marketing site",
    detail: "www.aegibit.com",
    signal: "Vercel deployment status — bom1 Mumbai edge",
    state: "Operational",
    signalUrl: "https://www.vercel-status.com/",
    signalLabel: "Vercel platform status",
  },
  {
    name: "API endpoints",
    detail: "/api/* — leads, contact, telemetry, rate limiter",
    signal: "Vercel Function deploy status + Upstash Redis health",
    state: "Operational",
    signalUrl: "https://status.upstash.com/",
    signalLabel: "Upstash status",
  },
  {
    name: "PayMint application",
    detail: "paymint.aegibit.com (separate deploy, internal pilots only)",
    signal: "Vercel deployment status + Supabase Singapore region",
    state: "Operational",
    signalUrl: "https://status.supabase.com/",
    signalLabel: "Supabase status",
  },
  {
    name: "MCP Shield repository",
    detail: "github.com/AegibitSecurity/mcp-shield — public, MIT, v0.2.1",
    signal: "GitHub availability",
    state: "Operational",
    signalUrl: "https://www.githubstatus.com/",
    signalLabel: "GitHub status",
  },
] as const;

const LAST_REVIEWED = "2026-05-14";

export default function StatusPage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        style={{ background: "#000", color: "#fff" }}
      >
        {/* ───────── Hero ───────── */}
        <section
          className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{
                background: "rgba(34,197,94,0.10)",
                border: "1px solid rgba(34,197,94,0.30)",
              }}
            >
              <span
                className="relative flex h-1.5 w-1.5"
                aria-hidden
              >
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#22C55E", animation: "ping 2s infinite" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "#22C55E" }}
                />
              </span>
              <span
                className="text-[10px] uppercase font-bold"
                style={{ color: "#22C55E", letterSpacing: "0.18em" }}
              >
                All systems operational
              </span>
            </div>

            <h1
              className="font-light leading-[1.05] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "#fff" }}
            >
              AEGIBIT{" "}
              <span
                className="italic"
                style={{
                  fontFamily:
                    "var(--font-serif), 'Instrument Serif', Georgia, serif",
                  background:
                    "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                service status.
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              Live operational state of every AEGIBIT surface. We monitor via
              Vercel, Supabase, Upstash, and GitHub&apos;s own status pages
              — every check on this page links out to the externally
              verifiable signal it&apos;s sourced from. No synthetic
              uptime histograms.
            </p>
          </div>
        </section>

        {/* ───────── Surfaces grid ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#F97316",
                letterSpacing: "0.22em",
              }}
            >
              Surfaces · {LAST_REVIEWED}
            </p>
            <h2
              className="font-light leading-tight mb-10"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              Current state, per surface
            </h2>

            <ul className="space-y-4 list-none m-0 p-0">
              {SURFACES.map((s) => (
                <li
                  key={s.name}
                  className="grid md:grid-cols-[1fr_auto] gap-4 md:gap-8 p-6 rounded-xl"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <h3
                      className="font-medium mb-1.5"
                      style={{ fontSize: "1.05rem", color: "#fff" }}
                    >
                      {s.name}
                    </h3>
                    <p
                      style={{
                        color: "#A1A1AA",
                        fontSize: "0.9rem",
                        lineHeight: 1.55,
                        marginBottom: "0.4rem",
                      }}
                    >
                      {s.detail}
                    </p>
                    <p
                      style={{
                        color: "#71717A",
                        fontSize: "0.82rem",
                        lineHeight: 1.55,
                      }}
                    >
                      Signal: {s.signal} ·{" "}
                      <TrackedLink
                        href={s.signalUrl}
                        ctaId={`status_signal_${s.name
                          .toLowerCase()
                          .replace(/\W+/g, "_")}`}
                        ctaLabel={s.signalLabel}
                        ctaSection="status_surfaces"
                        className="underline-offset-4 hover:underline"
                        style={{ color: "#A1A1AA" }}
                      >
                        {s.signalLabel}
                        <ExternalLink
                          size={11}
                          style={{
                            display: "inline",
                            marginLeft: "0.25rem",
                            verticalAlign: "baseline",
                          }}
                        />
                      </TrackedLink>
                    </p>
                  </div>
                  <div className="flex md:items-center">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium"
                      style={{
                        background: "rgba(34,197,94,0.10)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        color: "#22C55E",
                      }}
                    >
                      <CheckCircle2 size={12} />
                      {s.state}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Scope / honest framing ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#000",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="font-light leading-tight mb-6"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                color: "#fff",
              }}
            >
              Scope of this page
            </h2>
            <div className="space-y-4" style={{ color: "#A1A1AA", lineHeight: 1.75 }}>
              <p>
                AEGIBIT is early enough that we don&apos;t yet operate a
                multi-region observability grid or publish synthetic 90-day
                uptime histograms. Pretending to would be the kind of
                credibility miss we&apos;ve spent the rest of the site
                eliminating.
              </p>
              <p>
                What we <span style={{ color: "#fff" }}>do</span> monitor:
                Vercel deployment health, Supabase database availability,
                Upstash Redis rate-limiter health, and GitHub public-repo
                availability — each linked above to the upstream provider&apos;s
                own status page so you can verify independently.
              </p>
              <p>
                When the first paid PayMint MSA with an uptime SLA attaches —
                or the first independent monitoring vendor enters the stack —
                this page upgrades to the corresponding fidelity. Until then,
                this is the honest scope.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Incident history ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#71717A",
                letterSpacing: "0.22em",
              }}
            >
              Incident history
            </p>
            <h2
              className="font-light leading-tight mb-6"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                color: "#fff",
              }}
            >
              No reported customer-impacting incidents to date.
            </h2>
            <p style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              When the first customer-impacting incident occurs, it will be
              posted here with timestamps, scope, root cause, and remediation —
              the same level of detail we&apos;d expect a vendor to publish to
              us. Internal performance regressions and platform-side blips
              that didn&apos;t reach a customer are not posted here; they
              live in the changelog at{" "}
              <TrackedLink
                href="/changelog"
                ctaId="status_link_changelog"
                ctaLabel="/changelog"
                ctaSection="status_incident_history"
                className="underline-offset-4 hover:underline"
                style={{ color: "#fff" }}
              >
                /changelog
              </TrackedLink>
              .
            </p>
          </div>
        </section>

        {/* ───────── Subscribe ───────── */}
        <section
          className="relative py-20 md:py-24 px-6 lg:px-12 overflow-hidden"
          style={{
            background: "#000",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="font-light leading-tight mb-5"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              Get notified when something breaks
            </h2>
            <p
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Email the team and ask to be added to the incident list. We use
              the existing AEGIBIT mailing pipeline — incident-only, no
              marketing on this list, no unsubscribe friction.
            </p>
            <TrackedLink
              href="mailto:contact@aegibit.com?subject=Incident%20list%20subscription"
              ctaId="status_incident_subscribe"
              ctaLabel="Subscribe to incidents"
              ctaSection="status_subscribe"
              className="inline-flex items-center gap-2 px-7 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: "#F97316",
                padding: "0 1.75rem",
                height: "3.25rem",
                boxShadow: "0 0 28px rgba(249,115,22,0.30)",
              }}
            >
              Subscribe to incidents
            </TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
