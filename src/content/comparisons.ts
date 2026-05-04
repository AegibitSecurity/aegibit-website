/**
 * AEGIBIT — Programmatic comparison pages.
 *
 * Each entry generates /compare/{slug} — a head-to-head landing page
 * targeting the high-intent "X vs Y" search query for buyers actively
 * evaluating PayMint against an alternative.
 *
 * Editorial discipline:
 *   • Be honest about what the competitor does well — we earn trust by not
 *     pretending alternatives are useless.
 *   • Position PayMint where it OBJECTIVELY wins (multi-branch ops, real-time
 *     sync, audit-grade logs). Concede the categories where the competitor
 *     leads (e.g. Tally's deep accounting depth).
 *   • Every page funnels to /products/paymint/demo with a UTM tag tied to
 *     the competitor name so we can attribute conversions per comparison.
 */

export interface ComparisonRow {
  feature: string;
  paymint: string | "✓" | "—";
  competitor: string | "✓" | "—";
  /** Optional note that explains the row in plain English. */
  note?: string;
}

export interface ComparisonSection {
  title: string;
  rows: ComparisonRow[];
}

export interface ComparisonFAQ {
  q: string;
  a: string;
}

export interface Comparison {
  slug: string;
  competitorName: string;
  competitorTagline: string;
  /** Short respect statement — concede what they do well. */
  competitorStrengths: string[];
  /** Where PayMint clearly wins. Honest framing. */
  paymintWins: string[];
  /** Title (≤ 60 chars). */
  title: string;
  /** Meta description (≤ 155 chars). */
  description: string;
  /** Punch headline at top of page. */
  headline: string;
  /** Short subhead under the headline. */
  subhead: string;
  /** Detailed feature comparison table, grouped by section. */
  table: ComparisonSection[];
  /** Buyer-facing FAQs — also feeds Google rich results. */
  faqs: ComparisonFAQ[];
  /** When PayMint is the right choice (clear positioning). */
  pickPaymintIf: string[];
  /** When the competitor is the right choice (honest framing). */
  pickCompetitorIf: string[];
}

export const COMPARISONS: Comparison[] = [
  // ── 1. PayMint vs Tally ─────────────────────────────────────────────
  {
    slug: "paymint-vs-tally",
    competitorName: "Tally",
    competitorTagline: "Tally Prime — India's most-used accounting software.",
    competitorStrengths: [
      "Decades of trust in Indian SME accounting",
      "Deep ledger and double-entry accounting depth",
      "Familiar to most Indian accountants",
      "One-time license model (lower long-term cost for accounting alone)",
    ],
    paymintWins: [
      "Real-time multi-branch expense tracking (Tally is single-user / single-PC by default)",
      "Mobile-first voucher capture — branch staff submit on phones in seconds",
      "Branch-coded voucher numbering with atomic per-branch counters",
      "Server-enforced role-based approval workflow (Maker → Authoriser → Accountant → Admin)",
      "Append-only audit log with actor + timestamp on every action",
      "Cloud-native — works offline, syncs automatically when connectivity returns",
      "Tally-ready CSV export so you keep using Tally for accounting",
    ],
    title: "PayMint vs Tally — Honest Comparison for Multi-Branch SMEs",
    description:
      "Should you use PayMint or Tally for multi-branch expense management? Honest comparison: where each wins, when to pick which. Built by AEGIBIT.",
    headline: "PayMint vs Tally.",
    subhead:
      "Tally runs your books. PayMint runs your branches. Most Indian dealerships and multi-branch SMEs need both — and they integrate perfectly.",
    table: [
      {
        title: "Multi-branch operations",
        rows: [
          { feature: "Real-time sync across branches", paymint: "✓ 200ms p95", competitor: "—", note: "Tally is single-user / single-PC by default; multi-branch requires Tally on Cloud (extra cost) or sync setups." },
          { feature: "Branch-coded voucher numbers (e.g. KLY/0042/2627)", paymint: "✓ Native", competitor: "—" },
          { feature: "Atomic per-branch counters", paymint: "✓ Transaction-safe", competitor: "—" },
          { feature: "Mobile voucher capture by branch staff", paymint: "✓ Mobile-first", competitor: "Limited" },
          { feature: "Offline-capable with auto-sync", paymint: "✓ IndexedDB", competitor: "—" },
        ],
      },
      {
        title: "Approval & audit",
        rows: [
          { feature: "Role-based approval workflow", paymint: "✓ 5 roles, server-enforced", competitor: "Limited" },
          { feature: "Append-only audit log", paymint: "✓ Every action logged", competitor: "Audit trail (editable in some versions)" },
          { feature: "Server-enforced permissions", paymint: "✓ Firestore Security Rules", competitor: "Local user permissions" },
          { feature: "Forensics-ready (immutable history)", paymint: "✓", competitor: "—" },
        ],
      },
      {
        title: "Accounting & exports",
        rows: [
          { feature: "Full double-entry accounting ledger", paymint: "—", competitor: "✓ Depth & maturity", note: "PayMint is built for expense ops — exports clean data into Tally for full accounting." },
          { feature: "GST split (CGST/SGST/IGST)", paymint: "✓ Captured at voucher", competitor: "✓ Native" },
          { feature: "Tally-ready CSV export (11 columns)", paymint: "✓ One-click", competitor: "✓ Native (it IS Tally)" },
          { feature: "Power BI dashboards from same data", paymint: "✓ Same export", competitor: "Indirect (third-party)" },
        ],
      },
      {
        title: "Deployment & cost",
        rows: [
          { feature: "Cloud-native, no install", paymint: "✓ Web + APK", competitor: "Desktop install (cloud variant exists at extra cost)" },
          { feature: "Per-user licensing", paymint: "Unlimited users (per-branch pricing)", competitor: "Per-user license cost" },
          { feature: "Pricing model", paymint: "₹999 / branch / month", competitor: "₹18k+ one-time + ~₹6k/yr renewal" },
          { feature: "Free trial", paymint: "14-day free pilot, no card", competitor: "Demo / educational free version" },
        ],
      },
      {
        title: "Security",
        rows: [
          { feature: "Built by a cybersecurity company", paymint: "✓", competitor: "—" },
          { feature: "Encrypted in transit and at rest", paymint: "✓ HTTPS + Firestore encryption", competitor: "Depends on deployment" },
          { feature: "Device binding for new logins", paymint: "✓ Admin approval required", competitor: "—" },
          { feature: "Tested against OWASP Top 10", paymint: "✓ Every release", competitor: "—" },
        ],
      },
    ],
    pickPaymintIf: [
      "You operate 2+ branches and need real-time visibility across all of them",
      "Branch managers need to submit vouchers on mobile phones",
      "You want server-enforced approval workflow with audit trail",
      "You need branch-coded voucher numbers for clean reconciliation",
      "You want to keep using Tally for accounting AND solve the operations layer",
    ],
    pickCompetitorIf: [
      "You only operate one location and one accountant handles everything",
      "Your needs are pure accounting (ledger, balance sheet, P&L, GST) without operational layers",
      "You don't need real-time multi-user / multi-branch capabilities",
      "Your team is already deep on Tally and won't add a second tool",
    ],
    faqs: [
      {
        q: "Does PayMint replace Tally?",
        a: "No — and we don't recommend trying. Tally is a mature double-entry accounting system; PayMint is a multi-branch operational expense system. Most of our customers run both, with PayMint feeding Tally via the 11-column CSV export. PayMint solves what Tally is weakest at (real-time multi-branch ops, mobile capture, role-based workflow, audit-grade logging); Tally solves what PayMint doesn't try to do (full accounting ledger, balance sheet, P&L).",
      },
      {
        q: "Can PayMint export directly to Tally Prime?",
        a: "Yes — and the export schema follows Tally's standard 11-column import format: Voucher Type, Voucher Number, Date, Reference, Narration, Cost Center, Ledger Name, Amount, GST split, Approver, Source. Drop the file straight into Tally Prime; no manual cleanup. Cost-center and ledger mappings are configured once during onboarding.",
      },
      {
        q: "Why not just use Tally on Cloud for multi-branch?",
        a: "Tally on Cloud (TallyPrime + cloud sync) works but is significantly more expensive at scale (per-user licensing, per-machine cloud server costs) and isn't mobile-first. PayMint is purpose-built for the multi-branch ops layer: branch staff submit on phones, role-based approvals route automatically, audit log captures every action server-side. Then we hand clean data off to whatever Tally setup you already have.",
      },
      {
        q: "How does Tally's audit trail compare to PayMint's?",
        a: "Tally's audit trail (TallyPrime 2.x onwards) tracks edits to vouchers, but the trail itself is editable by users with sufficient permissions in some configurations. PayMint's audit log is append-only at the database level — Firestore Security Rules deny edits to historical entries even from super-admin credentials. For SOC 2 / forensics-grade compliance, PayMint is the stronger position.",
      },
      {
        q: "Can my Tally accountant continue working as before?",
        a: "Yes. That's the design intent. Your accountant continues using Tally Prime exactly as they always have — they just stop manually keying 200+ vouchers a month. PayMint's CSV export drops straight into Tally; the accountant's job becomes verification, not data entry. Most accountants love it.",
      },
    ],
  },

  // ── 2. PayMint vs Zoho Books ────────────────────────────────────────
  {
    slug: "paymint-vs-zoho-books",
    competitorName: "Zoho Books",
    competitorTagline: "Zoho Books — cloud-native accounting for SMEs.",
    competitorStrengths: [
      "Modern cloud-native UI (better than Tally for digital-first teams)",
      "Built-in invoicing, banking, GST filing for end-to-end accounting",
      "Tight integration with the rest of the Zoho suite (CRM, Inventory, etc.)",
      "Pay-monthly subscription model",
    ],
    paymintWins: [
      "Branch-first architecture — Zoho Books treats branches as a customisation; PayMint is multi-branch native",
      "Branch-coded voucher numbering with atomic per-branch counters",
      "Server-enforced 5-role approval workflow specifically for branch ops",
      "Audit-grade logging engineered by a cybersecurity company",
      "Mobile-first voucher capture for branch staff (not finance staff)",
      "Tally export — important when your accountant uses Tally, not Zoho",
    ],
    title: "PayMint vs Zoho Books — When Each is the Right Pick",
    description:
      "PayMint vs Zoho Books for multi-branch expense management. Honest comparison of features, pricing, and use-case fit. Built by AEGIBIT.",
    headline: "PayMint vs Zoho Books.",
    subhead:
      "Zoho Books is a strong cloud-native accounting suite. PayMint is a purpose-built multi-branch operations layer. Different jobs — sometimes complementary.",
    table: [
      {
        title: "Multi-branch ops",
        rows: [
          { feature: "Multi-branch as a first-class concept", paymint: "✓ Native", competitor: "Add-on / customisation" },
          { feature: "Branch-coded voucher numbers", paymint: "✓ KLY/0042/2627", competitor: "—" },
          { feature: "Per-branch atomic counters", paymint: "✓ Transaction-safe", competitor: "Sequence numbering shared" },
          { feature: "Real-time sync across branches", paymint: "✓ 200ms p95", competitor: "✓ Cloud-native" },
          { feature: "Mobile-first voucher capture", paymint: "✓ Branch staff", competitor: "Mobile app for finance team" },
        ],
      },
      {
        title: "Approval & workflow",
        rows: [
          { feature: "Role-based approval (Maker→Authoriser→Accountant→Admin)", paymint: "✓ 5 roles, server-enforced", competitor: "Approval available, less branch-specific" },
          { feature: "Branch-scoped permission isolation", paymint: "✓ Server rules", competitor: "Configurable" },
          { feature: "Append-only audit log", paymint: "✓ Immutable", competitor: "Edit log (editable depending on tier)" },
        ],
      },
      {
        title: "Accounting features",
        rows: [
          { feature: "Full accounting (P&L, balance sheet)", paymint: "—", competitor: "✓ Native", note: "PayMint is expense ops; Zoho is full accounting." },
          { feature: "Banking integration", paymint: "—", competitor: "✓ India bank feeds" },
          { feature: "Built-in invoicing", paymint: "—", competitor: "✓ Native" },
          { feature: "GST filing (GSTR-1, 3B, etc.)", paymint: "—", competitor: "✓ Native" },
          { feature: "Tally-compatible export", paymint: "✓ 11-column CSV", competitor: "Limited (Zoho is its own ecosystem)" },
        ],
      },
      {
        title: "Pricing & deployment",
        rows: [
          { feature: "Pricing model", paymint: "₹999 / branch / month", competitor: "₹749/user/month (Standard) — scales with users" },
          { feature: "Per-user fees", paymint: "Unlimited users included", competitor: "Per-user pricing" },
          { feature: "Free trial", paymint: "14-day pilot, no card", competitor: "14-day trial" },
        ],
      },
      {
        title: "Security",
        rows: [
          { feature: "Built by a cybersecurity company", paymint: "✓", competitor: "—" },
          { feature: "Tested against OWASP Top 10", paymint: "✓ Every release", competitor: "Standard cloud SaaS posture" },
          { feature: "India data residency", paymint: "✓ Mumbai region available", competitor: "Multi-region" },
        ],
      },
    ],
    pickPaymintIf: [
      "Your primary need is multi-branch operational expense capture (not full accounting)",
      "Branch managers and field staff need mobile-first voucher submission",
      "Your accountant uses Tally Prime for accounting and won't migrate",
      "You want server-enforced role-based approvals specifically for branch ops",
      "You need branch-coded voucher numbering for audit clarity",
    ],
    pickCompetitorIf: [
      "You need a full accounting suite (P&L, balance sheet, GST filings) end-to-end",
      "You're already on the Zoho ecosystem (Zoho One / Books / CRM / Inventory)",
      "You operate one or two locations; multi-branch overhead is overkill",
      "Your team is comfortable replacing Tally with Zoho",
    ],
    faqs: [
      {
        q: "Can I use PayMint AND Zoho Books together?",
        a: "Yes, though it's less common than PayMint + Tally. PayMint exports CSV that Zoho Books can ingest. Most of our customers use Tally for accounting, but a few use Zoho for accounting + PayMint for the multi-branch ops layer.",
      },
      {
        q: "Is Zoho Books better than Tally for Indian SMEs?",
        a: "Different fits. Zoho is more modern UX and cloud-native; Tally has deeper India-specific accounting depth and is what most senior Indian accountants know cold. The choice depends on your accounting team. PayMint is agnostic — we feed clean data into either.",
      },
      {
        q: "Does PayMint do invoicing?",
        a: "No. PayMint is an expense and voucher operations system, not an accounts-receivable / invoicing platform. For invoicing, use Tally, Zoho Books, or your DMS / billing system.",
      },
      {
        q: "How does pricing actually compare for a 5-branch dealership?",
        a: "PayMint: 5 × ₹999 = ₹4,995/month (unlimited users). Zoho Books Standard: ~₹749/user/month — at 15 users (typical for a 5-branch operation: 5 makers + 5 approvers + 3 accountants + 2 admins) that's ~₹11,235/month. PayMint is roughly half, includes mobile-first branch capture, and your accountant keeps using Tally.",
      },
      {
        q: "Will my data be safe in PayMint?",
        a: "Yes. End-to-end encrypted in transit and at rest. Server-enforced role permissions (Firestore Security Rules) — even a compromised browser can't read other branches' data. Append-only audit log. Built by AEGIBIT, a cybersecurity-first company. Tested against OWASP Top 10 every release. India data residency available (Mumbai region).",
      },
    ],
  },

  // ── 3. PayMint vs QuickBooks ────────────────────────────────────────
  {
    slug: "paymint-vs-quickbooks",
    competitorName: "QuickBooks",
    competitorTagline: "QuickBooks — Intuit's global SMB accounting platform.",
    competitorStrengths: [
      "Globally trusted brand, especially in US/UK/Canada SMB markets",
      "Mature double-entry accounting with strong reporting",
      "Wide ecosystem of integrations and add-ons",
      "Banking integrations across many international banks",
    ],
    paymintWins: [
      "Built specifically for Indian multi-branch operational shape (Tally export, GST split, fiscal year, branch codes)",
      "Real-time multi-branch sync as a core architectural primitive",
      "Mobile-first voucher capture by branch staff (not just by finance)",
      "Branch-coded voucher numbering — unique to PayMint's architecture",
      "Append-only server-enforced audit log",
      "Per-branch pricing scales linearly with operational footprint",
    ],
    title: "PayMint vs QuickBooks — Which Fits Your Operation",
    description:
      "PayMint vs QuickBooks for multi-branch expense management — when each is the right pick, with honest feature comparison. Built by AEGIBIT.",
    headline: "PayMint vs QuickBooks.",
    subhead:
      "QuickBooks is global accounting. PayMint is India-first multi-branch operations. They solve different problems — and they integrate via clean CSV export.",
    table: [
      {
        title: "Architecture & origin",
        rows: [
          { feature: "Built for India / Tally ecosystem", paymint: "✓ Native", competitor: "—" },
          { feature: "Built for multi-branch ops first", paymint: "✓ Architecture-level", competitor: "Add-on" },
          { feature: "Built by a cybersecurity company", paymint: "✓ AEGIBIT", competitor: "—" },
        ],
      },
      {
        title: "Operations layer",
        rows: [
          { feature: "Branch-coded voucher numbers", paymint: "✓ KLY/0042/2627", competitor: "—" },
          { feature: "Atomic per-branch counters", paymint: "✓", competitor: "—" },
          { feature: "Real-time multi-device sync", paymint: "✓ 200ms p95", competitor: "Cloud-native" },
          { feature: "Offline-capable with auto-sync", paymint: "✓ IndexedDB", competitor: "Limited offline" },
          { feature: "Mobile-first voucher capture by branch staff", paymint: "✓", competitor: "Limited" },
        ],
      },
      {
        title: "Accounting features",
        rows: [
          { feature: "Full P&L / balance sheet / cash flow", paymint: "—", competitor: "✓ Mature" },
          { feature: "Indian GST split (CGST/SGST/IGST)", paymint: "✓ Native", competitor: "Configurable" },
          { feature: "Indian fiscal year (Apr–Mar)", paymint: "✓ Native (FY 2026-27)", competitor: "Configurable" },
          { feature: "Tally-ready CSV export", paymint: "✓ 11 columns", competitor: "Indirect (CSV-only)" },
        ],
      },
      {
        title: "Pricing & support",
        rows: [
          { feature: "Pricing model", paymint: "₹999 / branch / month", competitor: "$25-180/month (USD-priced)" },
          { feature: "India support", paymint: "✓ India team", competitor: "International support" },
          { feature: "Free trial", paymint: "14-day pilot, no card", competitor: "30-day trial" },
        ],
      },
    ],
    pickPaymintIf: [
      "You operate in India (Tally compatibility, GST splits, INR billing matter)",
      "Your primary need is multi-branch operational ops, not full accounting",
      "You want India-based support and India data residency",
      "Per-branch pricing is more predictable than per-user accounting tiers",
      "Your accountant uses Tally and won't migrate to QuickBooks",
    ],
    pickCompetitorIf: [
      "You operate primarily in US / UK / Canada / international markets",
      "You need full accounting (P&L, balance sheet) end-to-end without Tally",
      "You're already on Intuit's ecosystem (QuickBooks + Mailchimp + TurboTax etc.)",
      "Your team is already trained on QuickBooks",
    ],
    faqs: [
      {
        q: "Is QuickBooks popular in India?",
        a: "Less popular than Tally or Zoho among Indian SMEs. QuickBooks Online is available, but Tally remains the dominant choice for multi-branch dealerships and SMEs because of its India-specific accounting depth and the depth of Tally-trained accountants.",
      },
      {
        q: "Can PayMint replace QuickBooks?",
        a: "No. PayMint is an operational expense + voucher system; QuickBooks is full accounting. They solve different problems. If you're using QuickBooks today and need a multi-branch operations layer, PayMint slots in beside it (CSV export to QuickBooks works).",
      },
      {
        q: "Why is PayMint cheaper than QuickBooks?",
        a: "Different scopes. PayMint at ₹999/branch/month is for operational expense capture with unlimited users. QuickBooks at $25-180/month is full accounting with reporting depth PayMint doesn't try to match. Different tools, different prices.",
      },
      {
        q: "Does PayMint support international currencies?",
        a: "Today: INR-first. The architecture supports multi-currency, and we can configure additional currencies for enterprise customers expanding internationally. For multi-currency-first needs, QuickBooks or Xero have more depth.",
      },
      {
        q: "Is PayMint India-data-residency-safe?",
        a: "Yes. Firestore region is Asia-South1 (Mumbai); customer data never leaves the region. SOC 2 / ISO 27001 documentation packages available on request. Built by AEGIBIT, an India-based cybersecurity-first software company.",
      },
    ],
  },
];

export const COMPARISON_SLUGS = COMPARISONS.map((c) => c.slug);

export function findComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
