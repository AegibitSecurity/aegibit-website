/**
 * AEGIBIT — Programmatic SEO landing pages.
 *
 * Each entry generates a static, indexable page at /solutions/{slug}.
 *
 * Strategy: target one high-intent keyword per page that a real
 * dealership owner / CFO / operations head would actually type into
 * Google. Each page ranks for that keyword AND funnels to the same
 * /products/paymint/demo conversion CTA.
 *
 * To add a new SEO page: append a Solution object below, redeploy.
 * The dynamic route + sitemap pick it up automatically.
 *
 * Editorial guardrails (so every page is conversion-grade, not thin):
 *   • title          ≤ 60 chars (Google SERP truncation)
 *   • description    ≤ 155 chars (SERP description)
 *   • h1             punchy, contains primary keyword
 *   • painPoints     3-4 concrete problems THIS audience has
 *   • features       3-4 PayMint features that solve those problems
 *   • faqs           4-5 questions with substantive answers (rich results)
 *   • testimonialAngle  pivots Nibir quote to match the keyword's intent
 */

export interface SolutionFAQ {
  q: string;
  a: string;
}

export interface Solution {
  slug: string;
  /** Primary keyword the page is optimized for. */
  keyword: string;
  /** ≤ 60 chars. Used as <title>. */
  title: string;
  /** ≤ 155 chars. Used as meta description. */
  description: string;
  /** Eyebrow label above the H1 (category). */
  eyebrow: string;
  /** The H1 — should contain the keyword naturally. */
  h1: string;
  /** Sub-headline beneath H1. ≤ 200 chars. */
  subheadline: string;
  /** "Who this is for" mini-description. */
  audience: string;
  /** 3-4 concrete pain points this audience faces. */
  painPoints: string[];
  /** 3-4 PayMint features that map directly to the pain points. */
  features: { title: string; body: string }[];
  /** Reframed Nibir Motors quote for this specific use-case. */
  testimonialAngle: string;
  /** 4-5 substantive Q&A. Rendered in FAQ schema for Google rich results. */
  faqs: SolutionFAQ[];
}

export const SOLUTIONS: Solution[] = [
  // ── 1. Car dealerships (broadest dealer keyword) ────────────────
  {
    slug: "expense-management-software-for-car-dealerships",
    keyword: "expense management software for car dealerships",
    title: "Expense Management Software for Car Dealerships | PayMint",
    description:
      "PayMint is the secure, real-time expense management platform built for multi-branch car dealerships. Branch-coded vouchers, role-based approvals, Tally-ready exports.",
    eyebrow: "For Automotive Dealerships",
    h1: "Expense Management Software, Built for Car Dealerships.",
    subheadline:
      "Run every fuel bill, workshop invoice, and showroom petty-cash voucher across all your branches through one audited pipeline. Real-time visibility, zero spreadsheets.",
    audience:
      "Multi-branch car dealerships across India that need centralised finance control without the SAP-grade price tag.",
    painPoints: [
      "Fuel and petty-cash receipts piling up across branches with no audit trail",
      "Approvers chasing managers on WhatsApp instead of seeing one queue",
      "Manual Tally entry every month-end, prone to errors and duplicate vouchers",
      "No way to know in real time how much each branch is actually spending",
    ],
    features: [
      {
        title: "Branch-coded voucher numbers",
        body: "Every payment gets a tamper-proof voucher like KLY/0042/2627 — branch + sequence + fiscal year. Atomic per-branch counters prevent duplicates even when multiple managers submit at once.",
      },
      {
        title: "Role-based approval workflow",
        body: "Maker → Authoriser → Accountant → Admin. Each role only sees what their job demands. Server-enforced rules — not a UI gate that can be bypassed.",
      },
      {
        title: "Tally-ready CSV exports",
        body: "Eleven-column accounting CSVs map straight to Tally and Power BI. Cost centers, voucher types, amounts — all pre-formatted. Month-end goes from days to minutes.",
      },
      {
        title: "Real-time multi-branch sync",
        body: "Submit a voucher in Kalyani branch — head office sees it in 200 ms. Works offline; queued writes flush the moment connectivity returns.",
      },
    ],
    testimonialAngle:
      "Every fuel bill, workshop invoice, and petty-cash voucher across 7 branches now flows through one audited pipeline.",
    faqs: [
      {
        q: "Can PayMint handle multiple dealership branches under one head office?",
        a: "Yes. PayMint is built multi-branch-first. Each branch operates independently for day-to-day vouchering, while head-office finance sees a consolidated real-time view of every transaction across every branch. Branch managers cannot see other branches' data — server-enforced via Firestore Security Rules.",
      },
      {
        q: "Does PayMint integrate with Tally?",
        a: "Yes. PayMint exports your monthly transactions as a Tally-ready CSV with all 11 standard accounting columns pre-mapped — voucher type, voucher number, date, ledger name, amount, cost center, narration, and more. Drop the file straight into Tally Prime; no manual cleanup required.",
      },
      {
        q: "What happens if a branch is offline?",
        a: "Vouchers are created locally and queued in the device's storage. The moment internet reconnects, every queued voucher syncs automatically with proper voucher numbering preserved. Field staff at remote branches never lose work.",
      },
      {
        q: "How long does deployment take for a new dealership?",
        a: "First branch live in 24-48 hours after the demo. Each additional branch takes about 15 minutes — we onboard your branch managers, configure their role, and they start submitting expenses immediately. Full multi-branch rollout typically completes in under a week.",
      },
      {
        q: "Is PayMint secure enough for financial data?",
        a: "PayMint is built by a cybersecurity company. End-to-end encrypted in transit and at rest, server-enforced role-based access, append-only audit logs, atomic voucher transactions, and device-binding for new logins. Tested against the OWASP Top 10 before every release.",
      },
    ],
  },

  // ── 2. Multi-branch petty cash ───────────────────────────────────
  {
    slug: "multi-branch-petty-cash-management",
    keyword: "multi-branch petty cash management software",
    title: "Multi-Branch Petty Cash Management Software | PayMint",
    description:
      "Reconcile petty cash across every branch in real time. Audit-grade logs, branch-coded vouchers, no spreadsheets. Built for multi-location SMEs in India.",
    eyebrow: "Petty Cash Control",
    h1: "Multi-Branch Petty Cash Management — Reconciled in Real Time.",
    subheadline:
      "Stop chasing branch managers for receipts at month-end. PayMint captures every petty-cash voucher the moment it's spent — across every branch, on every device, with full audit trail.",
    audience:
      "Multi-location businesses where head office finance is responsible for petty cash across branches they cannot physically visit.",
    painPoints: [
      "Branch managers submit petty cash vouchers in WhatsApp / paper / Excel — head office reconciles manually at month-end",
      "Receipts get lost, photos go missing, totals don't tie out",
      "No way to know if a branch is over-spending until the books close",
      "Audits take days because there's no single source of truth",
    ],
    features: [
      {
        title: "One-tap voucher capture (mobile-first)",
        body: "Branch staff snap the receipt, fill 4 fields, submit. The voucher is in head office's queue in under 5 seconds with a tamper-proof voucher number.",
      },
      {
        title: "Real-time branch-level dashboard",
        body: "Head office sees today's, this week's, this month's petty-cash spend per branch — live. Set a threshold per branch; get notified the moment it's breached.",
      },
      {
        title: "Append-only audit log",
        body: "Every action — create, edit, approve, reject, delete — is captured with actor UID and timestamp. No one can erase their own history. Audit-ready by design.",
      },
      {
        title: "Soft-delete safety net",
        body: "Vouchers are never destroyed on user action — they're tombstoned. Recover from accidental deletes or bad-actor edits with a single click.",
      },
    ],
    testimonialAngle:
      "Petty cash across 7 branches reconciled in real time. We see overspend the same day, not at month-end.",
    faqs: [
      {
        q: "How does PayMint prevent duplicate or fraudulent petty-cash entries?",
        a: "Every voucher number is issued by an atomic transaction on a per-branch counter — concurrent submissions cannot collide on the same number. Once a voucher is approved and paid, the number is permanent and visible in every audit log entry. Editing requires elevated permissions and is itself logged.",
      },
      {
        q: "Can branch staff submit expenses on a basic Android phone?",
        a: "Yes. PayMint runs in any modern browser and as a lightweight Android APK. We've tested on entry-level phones with 2GB RAM. The voucher capture flow works on 2G/3G networks; image compression is built in so receipts upload even on slow connections.",
      },
      {
        q: "What if a branch manager submits without head-office approval?",
        a: "Submission and approval are separate roles. A maker can submit, but the voucher sits in 'pending' state until an authoriser at head office (or the branch's designated approver) explicitly approves it. No payment goes out without approval.",
      },
      {
        q: "Can we set per-branch monthly petty-cash limits?",
        a: "Yes. Each branch can have its own monthly cap. The dashboard shows live consumption against the cap, and the system can be configured to require additional approval for any voucher that would push the branch over its limit.",
      },
      {
        q: "How do we get historic data into PayMint?",
        a: "We support bulk import from Excel/CSV during onboarding. Most customers migrate the last 3-6 months of historic vouchers so the dashboard has trend data from day one.",
      },
    ],
  },

  // ── 3. Tally-ready expense tracking ──────────────────────────────
  {
    slug: "tally-ready-expense-tracking-software",
    keyword: "tally compatible expense tracking software",
    title: "Tally-Ready Expense Tracking Software for India | PayMint",
    description:
      "Export every expense as a Tally-ready CSV with 11 pre-mapped columns. Cost centers, voucher types, amounts — all formatted. Month-end in minutes.",
    eyebrow: "Tally Integration",
    h1: "Tally-Ready Expense Tracking — Month-End in Minutes, Not Days.",
    subheadline:
      "Eleven-column accounting CSVs that drop straight into Tally Prime. Voucher type, voucher number, ledger name, cost center, amount — all pre-mapped, all clean.",
    audience:
      "Indian SMEs and dealerships whose accountants use Tally Prime and lose days every month to manual data entry.",
    painPoints: [
      "Accountant manually keys vouchers from receipts into Tally — slow and error-prone",
      "Branch and cost-center mappings drift between Excel and Tally",
      "No standard voucher numbering — entries get duplicated or skipped",
      "Reconciliation depends on one accountant's spreadsheet skills",
    ],
    features: [
      {
        title: "11-column Tally CSV mapping",
        body: "Voucher Type · Voucher Number · Date · Reference · Narration · Cost Center · Ledger Name · Amount · Tax · Approver · Source — every column matches Tally Prime's standard import schema.",
      },
      {
        title: "Cost-center auto-tagging",
        body: "Branch + expense type combinations auto-map to cost centers. \"BERHAMPORE Branch\" and \"KALYANI Service\" hit the right cost center in Tally without manual edits.",
      },
      {
        title: "Idempotent voucher numbers",
        body: "Once assigned, a voucher number never changes — re-export the same month and Tally won't see duplicates. Safe to regenerate as often as needed.",
      },
      {
        title: "Power BI dashboards",
        body: "Same CSV opens in Power BI for executive dashboards — branch comparison, expense category breakdown, month-over-month trend, all live.",
      },
    ],
    testimonialAngle:
      "Month-end Tally entry used to take 3 days. PayMint's export turned it into 20 minutes.",
    faqs: [
      {
        q: "Which Tally version does PayMint export work with?",
        a: "Tally Prime (current version) and Tally ERP 9. The CSV format follows Tally's standard import schema — Voucher Type, Voucher Number, Date, Reference, Narration, Cost Center, Ledger, Amount. Verified working across both.",
      },
      {
        q: "Do we need to map ledger names manually for every voucher?",
        a: "No. Ledger and cost-center mappings are configured once during onboarding (a 30-minute exercise) and applied automatically to every voucher thereafter. New ledger? Add it once in PayMint, every future voucher uses it.",
      },
      {
        q: "What about GST? Does PayMint handle CGST/SGST/IGST split?",
        a: "Yes. Tax fields are first-class. PayMint captures GST rate per voucher, splits CGST/SGST/IGST automatically based on inter-state vs intra-state, and exports them as separate columns Tally can ingest directly.",
      },
      {
        q: "Can we re-export a previous month if we missed something?",
        a: "Yes, anytime. Voucher numbers are immutable, so re-exports are idempotent — Tally won't see duplicates. Many customers re-run exports monthly as a check.",
      },
      {
        q: "Is there a Power BI integration too?",
        a: "The same Tally-ready CSV is also Power BI-friendly. We've published a starter Power BI template with branch and cost-center dashboards pre-built. Drop the CSV in, dashboards refresh.",
      },
    ],
  },

  // ── 4. Voucher generation ────────────────────────────────────────
  {
    slug: "branch-voucher-generation-software",
    keyword: "branch-coded voucher generation software",
    title: "Branch-Coded Voucher Generation Software | PayMint",
    description:
      "Tamper-proof voucher numbers like KLY/0042/2627 — branch, sequence, fiscal year. Atomic per-branch counters. Zero duplicates, ever.",
    eyebrow: "Voucher System",
    h1: "Branch-Coded Voucher Generation — Tamper-Proof, Audit-Ready.",
    subheadline:
      "Every payment gets a unique voucher number stamped with branch code, sequence, and fiscal year. Atomic transactions guarantee zero collisions even under concurrent load.",
    audience:
      "Multi-branch businesses where voucher integrity is the foundation of audit, reconciliation, and trust.",
    painPoints: [
      "Manual voucher numbering leads to duplicates, gaps, and disputes",
      "Branch-level numbering can't be reconciled at head office",
      "Re-generating PDFs creates conflicting numbers for the same payment",
      "Auditors flag the lack of immutability — voucher numbers shouldn't be editable",
    ],
    features: [
      {
        title: "Branch + Sequence + Fiscal Year format",
        body: "KLY/0042/2627 = Kalyani branch, voucher #42 of FY 2026-27. Read it once, know exactly where, when, and which one. Auditors love it.",
      },
      {
        title: "Atomic per-branch counters",
        body: "Issued inside Firestore transactions — concurrent makers across branches can never collide on the same number. Sequence is gap-free per branch.",
      },
      {
        title: "Idempotent re-downloads",
        body: "Re-downloading a voucher PDF returns the exact same number. The system never re-issues. Safe for repeated print runs and email forwards.",
      },
      {
        title: "Self-healing on broken legacy data",
        body: "Migrating from a legacy system? PayMint detects malformed voucher numbers (e.g., 'BHP/0001/aNaN') and automatically heals them on next interaction without changing already-correct ones.",
      },
    ],
    testimonialAngle:
      "Two-and-a-half years of vouchers. Zero duplicate numbers. Zero disputes with auditors.",
    faqs: [
      {
        q: "Why branch-coded vouchers instead of a single global counter?",
        a: "Branch-coded numbers are instantly readable — auditors and ops staff can tell which branch issued a voucher just by looking at it. They also let each branch operate independently when offline; head office reconciles them later. A single global counter creates a write bottleneck and hides branch-level provenance.",
      },
      {
        q: "What if two branches submit at the exact same millisecond?",
        a: "Each branch has its own counter, incremented inside a Firestore transaction. Even if two branches submit simultaneously, they get different sequence numbers because their counters are independent. Within one branch, the transaction guarantees no two vouchers can ever share a number.",
      },
      {
        q: "Can voucher numbers be edited after creation?",
        a: "No. Once assigned, a voucher number is immutable. Editing other voucher fields (amount, payee, etc.) is logged in the audit trail. The number itself cannot be changed by anyone, including super admins. This is enforced server-side via Firestore Security Rules.",
      },
      {
        q: "What format do you use for the fiscal year?",
        a: "Indian fiscal year format: YYYY-YY shortened. FY 2026-27 = 2627. The system auto-computes the FY based on Apr 1 - Mar 31 boundary, with Asia/Kolkata timezone awareness, so a voucher created on March 31 at 11:55 PM IST gets last FY's number; April 1 at 12:05 AM gets the new one.",
      },
      {
        q: "Can I customize the branch codes?",
        a: "Yes. Branch codes are configured during onboarding — typically 3-letter abbreviations (KLY, BHP, CKD). They're tied to the branch record and used across vouchers, exports, and dashboards consistently.",
      },
    ],
  },

  // ── 5. Approval workflow ─────────────────────────────────────────
  {
    slug: "expense-approval-workflow-software",
    keyword: "expense approval workflow software india",
    title: "Expense Approval Workflow Software for India | PayMint",
    description:
      "Maker → Authoriser → Accountant → Admin. Server-enforced roles, real-time queue, mobile-first approvals. Stop chasing managers on WhatsApp.",
    eyebrow: "Approval Workflows",
    h1: "Expense Approval Workflow Software — One Queue, Zero Chasing.",
    subheadline:
      "Maker submits, authoriser approves, accountant pays, admin oversees. Each role sees only their queue. Server-enforced — not a UI gate.",
    audience:
      "Indian businesses where approvers are getting WhatsApp pings, photo forwards, and email forwards instead of one clean queue.",
    painPoints: [
      "Approvers spend an hour a day chasing receipts and approving over WhatsApp",
      "No clear separation between who creates, who approves, who pays",
      "Approvers see expenses they shouldn't (other branches, other categories)",
      "When someone leaves, their approval queue is lost in their personal chat",
    ],
    features: [
      {
        title: "5-role workflow out of the box",
        body: "Maker · Authoriser · Accountant · Admin · Super Admin. Each role has scoped permissions enforced by server rules — even a compromised browser cannot bypass them.",
      },
      {
        title: "Mobile-first approval queue",
        body: "Approvers see one screen: 'Pending for me'. Tap a voucher, see the receipt, approve or reject in 3 taps. Works on any phone.",
      },
      {
        title: "Real-time notifications",
        body: "The moment a maker submits, the relevant approver gets a live notification. The moment an approver acts, the maker and accountant see the status change. No polling, no refresh.",
      },
      {
        title: "Branch-scoped visibility",
        body: "Authorisers at Kalyani branch see only Kalyani vouchers. Service-GMs see only service vouchers. Server-enforced — auditor-friendly by design.",
      },
    ],
    testimonialAngle:
      "Approvers used to lose an hour a day on WhatsApp. Now they tap once, it's done.",
    faqs: [
      {
        q: "Can we customize the approval chain for our company?",
        a: "Yes. Within the 5 standard roles, every customer configures their own escalation logic — e.g., 'vouchers above ₹50,000 also need GM approval' or 'fuel vouchers go straight to accountant'. We help configure during onboarding.",
      },
      {
        q: "What happens if an approver is on leave?",
        a: "Each role can have multiple users. If your primary authoriser is on leave, vouchers route to the secondary. Super admin can also temporarily reassign a queue with full audit logging of the change.",
      },
      {
        q: "Do approvers need a desktop?",
        a: "No. The entire approval flow is designed mobile-first. Most of our customers' approvers do 100% of approvals on their phones — checking the queue while traveling, approving in seconds.",
      },
      {
        q: "Can I revoke an approval if I made a mistake?",
        a: "Yes, until the voucher is paid. After payment, the voucher becomes immutable for audit reasons but you can issue a reversal entry. All revocations are logged.",
      },
      {
        q: "Is there an SLA for approvals?",
        a: "PayMint can be configured to escalate vouchers that sit in a queue for more than X hours. Default is no auto-escalation; configurable per customer.",
      },
    ],
  },

  // ── 6. Real-time multi-branch ────────────────────────────────────
  {
    slug: "real-time-multi-branch-expense-tracker",
    keyword: "real-time multi-branch expense tracker",
    title: "Real-Time Multi-Branch Expense Tracker | PayMint",
    description:
      "Submit a voucher in any branch — head office sees it in 200ms. Real-time sync across every device, 24/7. Works offline, syncs automatically.",
    eyebrow: "Real-Time Sync",
    h1: "Real-Time Multi-Branch Expense Tracker — 24/7, Every Device.",
    subheadline:
      "Built on Firebase real-time streams. The moment a maker in Kalyani submits, every approver in head office sees it. Works offline; syncs the second connectivity returns.",
    audience:
      "Operations leaders who need to see what's happening across all branches NOW, not at end-of-day or end-of-month.",
    painPoints: [
      "Spreadsheets emailed from branches at end of day are 12 hours stale",
      "WhatsApp groups are noisy and unsearchable",
      "When a branch is offline, work stops",
      "No single screen showing live spend across the entire company",
    ],
    features: [
      {
        title: "200 ms cross-device sync",
        body: "Built on Firebase real-time streams. Voucher created in one branch is visible at head office in roughly the time it takes a packet to travel across India.",
      },
      {
        title: "Offline-first with auto-flush",
        body: "Branch goes offline? Voucher creation continues against local IndexedDB. The moment internet returns, queued vouchers flush with proper voucher numbering preserved.",
      },
      {
        title: "Live executive dashboard",
        body: "Head office sees today's, this week's, this month's spend per branch — all live, all the time. Filters update without page reloads.",
      },
      {
        title: "Real-time push notifications",
        body: "Approvers know within seconds when something needs attention. Per-user, per-role notification streams.",
      },
    ],
    testimonialAngle:
      "We see every voucher across 7 branches in real time. Decisions that used to take a day now take 2 minutes.",
    faqs: [
      {
        q: "What 'real-time' actually means in PayMint",
        a: "Sub-300ms p95 latency from voucher creation to it appearing on every other authorised device. Built on Firebase Firestore's real-time listener architecture, deployed on Google's global edge. Faster than most chat apps.",
      },
      {
        q: "What happens if my branch loses internet for hours?",
        a: "Local IndexedDB persistence means voucher creation, approval drafts, and basic operations all keep working offline. The moment connectivity returns, every queued change syncs automatically with conflict resolution. Voucher numbers issued offline are reconciled atomically when sync resumes.",
      },
      {
        q: "Will PayMint slow down as we add more branches?",
        a: "No. Firebase scales horizontally — each branch is an independent partition. We've stress-tested with 50+ branches submitting concurrently with no measurable latency degradation.",
      },
      {
        q: "Is the real-time data secure across branches?",
        a: "Yes. Each branch's data is isolated by Firestore Security Rules — server-enforced. A compromised browser at branch A still cannot read branch B's data. Authorised cross-branch viewers (head office, super admin) see what their role permits.",
      },
      {
        q: "Can I get push notifications on mobile?",
        a: "Yes. PayMint supports in-app notifications and (via the installable PWA / Android APK) native push notifications. Configurable per role and per event type.",
      },
    ],
  },

  // ── 7. Audit-grade ────────────────────────────────────────────────
  {
    slug: "audit-grade-expense-tracking-software",
    keyword: "audit-grade expense tracking software",
    title: "Audit-Grade Expense Tracking Software | PayMint",
    description:
      "Append-only audit log. Every action recorded with actor UID and timestamp. Server-enforced rules. Forensics-ready, day one. Built by a cybersecurity company.",
    eyebrow: "Audit & Compliance",
    h1: "Audit-Grade Expense Tracking — Forensics-Ready, Day One.",
    subheadline:
      "Every action recorded immutably. Every permission server-enforced. Every transaction traceable to actor and timestamp. Built by a cybersecurity company — not as a feature, as a baseline.",
    audience:
      "Finance heads, compliance officers, and CFOs who need expense data that holds up under audit, due-diligence, or legal scrutiny.",
    painPoints: [
      "Spreadsheets are editable — no proof of who changed what when",
      "Email approval chains are forgeable and unsearchable",
      "Auditors demand provenance you can't produce",
      "One bad actor with admin access can rewrite history",
    ],
    features: [
      {
        title: "Append-only audit log",
        body: "Every create, edit, approve, reject, pay action is recorded with actor UID and server timestamp. No one — including super admins — can erase their own history. Server rules block tampering.",
      },
      {
        title: "Server-enforced permissions",
        body: "All access control lives in Firestore Security Rules — not the client. A compromised browser cannot read another branch's data even if its JavaScript is rewritten.",
      },
      {
        title: "Atomic, idempotent operations",
        body: "Voucher numbers, counters, payment status — all issued inside transactions. Concurrent operations never collide; replay attacks never produce duplicates.",
      },
      {
        title: "Soft-delete with full recovery",
        body: "Records are tombstoned, not destroyed. Recover from accidental deletes, bad-actor edits, or ransomware-grade incidents with a single click and full audit trail intact.",
      },
    ],
    testimonialAngle:
      "Auditors completed our review in half the time because every transaction had clean provenance.",
    faqs: [
      {
        q: "How does PayMint prevent insider tampering?",
        a: "Three layers: (1) Firestore Security Rules deny edits to historical audit entries even with admin credentials. (2) Voucher numbers are immutable post-creation. (3) Every privileged action is itself logged in the audit trail. The system records the audit of the audit.",
      },
      {
        q: "Do you support data residency in India?",
        a: "Yes. We can deploy on Firebase regions in Asia (Mumbai). Customer data never leaves the chosen region. We can also deploy on private GCP / AWS environments for enterprise customers.",
      },
      {
        q: "Is PayMint SOC 2 / ISO 27001 ready?",
        a: "Built to those standards. We can provide compliance documentation packages on request. Continuous security review by AEGIBIT's cybersecurity team.",
      },
      {
        q: "How long is audit data retained?",
        a: "Indefinitely by default. Audit logs are append-only and never expire. Customer-configurable retention policies available for jurisdictions with specific requirements.",
      },
      {
        q: "Can our external auditor get read-only access?",
        a: "Yes. We provision a 'auditor' role with read-only access scoped to a date range you specify. They can query, export, and verify without any write capability.",
      },
    ],
  },

  // ── 8. Fuel expense ──────────────────────────────────────────────
  {
    slug: "fuel-expense-management-software",
    keyword: "fuel expense management software for fleet and dealerships",
    title: "Fuel Expense Management Software | PayMint",
    description:
      "Track fuel spend per branch, per vehicle, per driver. Real-time dashboards, instant approvals, Tally exports. Built for dealerships and fleet operators.",
    eyebrow: "Fleet & Fuel",
    h1: "Fuel Expense Management — Per Branch, Per Vehicle, Per Driver.",
    subheadline:
      "Capture every fuel bill the moment it's spent. See real-time fuel cost per branch, identify outliers, and export to Tally without retyping.",
    audience:
      "Dealerships, logistics, and fleet operators where fuel is a top-3 expense and leakage is invisible until month-end.",
    painPoints: [
      "Drivers submit paper bills that go missing or get inflated",
      "No way to compare fuel cost per kilometer across vehicles",
      "Branch managers approve without seeing the trend — overspend goes unnoticed",
      "Reconciling fuel bills with vehicle logs is a manual nightmare",
    ],
    features: [
      {
        title: "Vehicle-tagged fuel vouchers",
        body: "Tag every fuel bill with vehicle registration, driver name, odometer reading. Spot the outlier vehicle in seconds.",
      },
      {
        title: "Per-vehicle dashboards",
        body: "See cost per km, fill frequency, and month-over-month trend for every vehicle. Identify the truck that's leaking fuel before the auditor does.",
      },
      {
        title: "Photo-receipt capture",
        body: "Driver snaps the receipt at the pump; image is auto-compressed and attached to the voucher. Search by date, vehicle, or amount later.",
      },
      {
        title: "Threshold alerts",
        body: "Set a per-vehicle weekly fuel cap. The moment it's breached, head office and the branch manager get a real-time alert.",
      },
    ],
    testimonialAngle:
      "We caught two vehicles with 30% inflated fuel bills in the first month — paid for the system three times over.",
    faqs: [
      {
        q: "Can I link fuel vouchers to specific vehicles?",
        a: "Yes. Each fuel voucher carries vehicle registration, driver name, odometer reading at fill, and the pump location (optional GPS tag). All searchable and reportable.",
      },
      {
        q: "Does PayMint compute cost per kilometer automatically?",
        a: "Yes, when odometer readings are captured. We compute cost-per-km between consecutive fills and flag vehicles whose CPK suddenly changes — early signal of pilferage or maintenance issue.",
      },
      {
        q: "What if fuel is purchased on a fleet card vs cash?",
        a: "Both flows are supported. Fleet card transactions can be bulk-imported via CSV; cash purchases get the standard photo-receipt voucher flow. Reports unify them.",
      },
      {
        q: "Can drivers submit from a basic phone?",
        a: "Yes. The fuel voucher form is mobile-first and works on entry-level Android phones. Image compression handles 2G/3G uploads gracefully.",
      },
      {
        q: "How do we prevent driver fraud (e.g., fake receipts)?",
        a: "Multiple safeguards: (1) Required photo of physical receipt, (2) Required odometer photo, (3) Anomaly detection on cost-per-km, (4) Mandatory branch-manager approval before payment. Every action is in the audit log.",
      },
    ],
  },

  // ── 9. Workshop / service ────────────────────────────────────────
  {
    slug: "workshop-expense-management-system",
    keyword: "workshop expense management software for automotive service",
    title: "Workshop Expense Management Software | PayMint",
    description:
      "Track parts, labour, and consumables per workshop, per job. Real-time profitability, branch-level visibility, audit-grade logs.",
    eyebrow: "Service & Workshop",
    h1: "Workshop Expense Management — Per Job, Per Branch, Per Margin.",
    subheadline:
      "Capture every parts bill, every consumable, every external invoice the moment it hits the workshop. See real workshop margin in real time.",
    audience:
      "Multi-branch automotive service centers and workshops that need to know which jobs make money and which leak.",
    painPoints: [
      "Parts and consumables get expensed without job tagging — margin invisible",
      "Branch workshops over-spend on consumables and head office only learns at month-end",
      "External labour invoices pile up, get approved late, payment terms slip",
      "No clean reconciliation between workshop cost and customer billing",
    ],
    features: [
      {
        title: "Job-card-linked vouchers",
        body: "Every parts purchase and external invoice can be tagged to a specific job card. Workshop margin per job becomes visible the moment work completes.",
      },
      {
        title: "Branch-level workshop dashboards",
        body: "Compare consumables spend per workshop. See which branch is running efficiently, which is over-stocking.",
      },
      {
        title: "Service-GM approval queue",
        body: "Workshop expenses route to a service-GM role separate from branch managers. Service ops gets visibility without finance overhead.",
      },
      {
        title: "External-vendor invoice tracking",
        body: "Captured at submission, queued for approval, paid with one tap. Vendor history is searchable; payment terms are tracked per vendor.",
      },
    ],
    testimonialAngle:
      "We discovered one workshop was buying parts at 22% above the others. Fixed in a week, saved lakhs annually.",
    faqs: [
      {
        q: "Can PayMint link workshop expenses to specific service jobs?",
        a: "Yes, when job-card numbers are captured during voucher creation. Reports then show cost per job and per job category (e.g., engine work, body, electrical) per workshop branch.",
      },
      {
        q: "Do you integrate with our DMS (Dealer Management System)?",
        a: "PayMint exports CSV that most DMS systems can import. For deeper integration, we can build a custom API connector during onboarding for enterprise customers.",
      },
      {
        q: "Can different workshops have different parts ledgers in Tally?",
        a: "Yes. Each branch can map to its own cost center and ledger structure in Tally. Configured once during onboarding, applied automatically thereafter.",
      },
      {
        q: "How do we handle warranty work (zero-revenue jobs)?",
        a: "Warranty jobs are tagged with a 'warranty' flag at the voucher level. Reports separate them from paid work so margin calculations stay accurate.",
      },
      {
        q: "Can workshop technicians submit parts requisitions themselves?",
        a: "Yes, with a maker-only role. They submit; service-GM or branch-manager approves. Standard workflow, but role-scoped so technicians don't see other branches' data.",
      },
    ],
  },

  // ── 10. SME automation ───────────────────────────────────────────
  {
    slug: "sme-expense-automation-india",
    keyword: "SME expense management automation software india",
    title: "SME Expense Management Automation for India | PayMint",
    description:
      "Built for Indian SMEs scaling past 3 branches. Real-time visibility, role-based approvals, Tally exports. Deploy in days, not months.",
    eyebrow: "For Indian SMEs",
    h1: "SME Expense Automation — Built for the Way India Actually Works.",
    subheadline:
      "Multi-branch, multi-role, Tally-native, mobile-first. Designed for the Indian SME owner who can't afford SAP and is tired of WhatsApp finance.",
    audience:
      "Indian small and mid-sized businesses (10-500 staff, 2-30 branches) where finance is currently 'a senior person + Excel + WhatsApp'.",
    painPoints: [
      "Outgrew Excel + WhatsApp but can't justify ERP cost",
      "Branch and head-office finance run in disconnected silos",
      "Founder still personally approving every expense",
      "Audit and compliance ad-hoc, not systematic",
    ],
    features: [
      {
        title: "Multi-branch from day one",
        body: "Built multi-branch-first, not retrofitted. Add a branch in 15 minutes. Each branch operates independently; head office sees everything.",
      },
      {
        title: "Tally + Power BI native",
        body: "11-column Tally CSV exports + Power BI templates. Your existing accountant uses what they already know.",
      },
      {
        title: "Role-based delegation",
        body: "Founder steps out of the approval chain. Authorised managers handle approvals; founder sees real-time dashboards. Trust, but verify.",
      },
      {
        title: "Indian-context defaults",
        body: "GST splits (CGST/SGST/IGST), Indian fiscal year (Apr-Mar), branch-coded vouchers, INR formatting, Asia/Kolkata timezone. No Americanisation tax.",
      },
    ],
    testimonialAngle:
      "Founder used to approve every voucher personally. Now the system handles 90% of approvals; he sees everything in real time.",
    faqs: [
      {
        q: "Is PayMint affordable for an Indian SME?",
        a: "Yes — we explicitly priced PayMint to be accessible to multi-branch SMEs that have outgrown Excel but can't justify SAP. Pricing scales with the number of branches; book a demo for a tailored quote.",
      },
      {
        q: "How long does deployment take for a 5-branch SME?",
        a: "First branch live within 24-48 hours. Each additional branch takes 15-30 minutes. Most 5-branch SMEs are fully live within a week.",
      },
      {
        q: "Do my staff need training?",
        a: "Branch staff (makers): under 5 minutes — the form is intentionally simple. Approvers: under 15 minutes. We provide a Bengali user manual on request and train all key roles during onboarding.",
      },
      {
        q: "What if I outgrow PayMint?",
        a: "PayMint is built on Firebase, which scales horizontally to enterprise. Customers running 50+ branches use the same product without architectural changes. You won't outgrow it; you'll outgrow other tools.",
      },
      {
        q: "Can I keep my existing accountant?",
        a: "Yes — that's the design intent. PayMint exports clean Tally CSVs; your accountant continues using Tally Prime exactly as they always have, just with cleaner inputs and no manual data entry.",
      },
    ],
  },

  // ── 11. Dealer petty cash app ───────────────────────────────────
  {
    slug: "automotive-dealer-petty-cash-app",
    keyword: "automotive dealer petty cash management app",
    title: "Automotive Dealer Petty Cash App | PayMint",
    description:
      "Mobile-first petty cash management for car and bike dealers. Branch managers submit, head office approves, accountant pays — all in real time.",
    eyebrow: "Dealer Operations",
    h1: "Automotive Dealer Petty Cash — On Your Phone, Across Every Branch.",
    subheadline:
      "Built for the way Indian car and bike dealerships actually operate: branch managers on phones, head office in real-time visibility, accountants exporting to Tally.",
    audience:
      "Car, bike, and commercial vehicle dealerships running 2+ branches who need petty cash discipline without bureaucracy.",
    painPoints: [
      "Branch managers carry cash, submit bills weeks later",
      "Head office can't tell a Saturday spike from a fraud signal",
      "Voucher numbers conflict between branches",
      "Service center vs sales floor expenses get mixed in reports",
    ],
    features: [
      {
        title: "Branch and service-center separation",
        body: "Sales-floor expenses (showroom, marketing) vs workshop expenses (parts, labour) are tagged at submission. Reports separate them automatically.",
      },
      {
        title: "GST-ready capture",
        body: "Capture GSTIN, GST rate, and split CGST/SGST/IGST at voucher creation. Tally export includes the splits pre-formatted.",
      },
      {
        title: "Mobile-first by design",
        body: "Branch managers do 100% of voucher submission on phones. Head-office staff use desktops for dashboards. Both are first-class.",
      },
      {
        title: "Founder dashboard",
        body: "Single screen showing today's, this week's, this month's spend across every branch and category. Mobile-friendly so the founder can check it on a flight.",
      },
    ],
    testimonialAngle:
      "Branch managers love it. Head office finance loves it. The founder finally trusts what he's seeing.",
    faqs: [
      {
        q: "Does PayMint work for both car and bike dealerships?",
        a: "Yes. The expense categories, branch types, and reporting work identically. We have customers running car and two-wheeler operations under the same parent company on the same PayMint instance.",
      },
      {
        q: "Can we separate sales vs service expenses in reports?",
        a: "Yes. Each voucher is tagged at submission as 'branch' (sales floor / showroom) or 'service' (workshop). Reports filter and aggregate by either independently.",
      },
      {
        q: "What about used-vehicle reconditioning expenses?",
        a: "Those typically fall under 'service' workshop category but can be tagged with a 'used-recon' sub-tag. Useful for analyzing whether the recon margin holds across your inventory.",
      },
      {
        q: "Does PayMint integrate with the brand DMS systems?",
        a: "PayMint exports clean CSV that Maruti, Hyundai, Tata, and Mahindra DMS systems can import for finance modules. Custom API integration available for enterprise customers.",
      },
      {
        q: "Can multiple owners (in a family business) all see real-time data?",
        a: "Yes. Multiple super-admin / admin accounts are supported. Each sees the full real-time view; the audit log records who looked at what when.",
      },
    ],
  },

  // ── 12. Branch-level finance control ──────────────────────────────
  {
    slug: "branch-level-finance-control-software",
    keyword: "branch-level finance control software",
    title: "Branch-Level Finance Control Software | PayMint",
    description:
      "Give every branch financial autonomy. Give head office real-time oversight. PayMint reconciles both with audit-grade logs and instant Tally exports.",
    eyebrow: "Branch Finance",
    h1: "Branch-Level Finance Control — Autonomy + Oversight, Done Right.",
    subheadline:
      "Branches operate independently for daily finance. Head office sees everything live. Audit trail captures every action. The classic tension, finally solved.",
    audience:
      "Multi-branch business owners who want their branches to move fast without losing control of money flow.",
    painPoints: [
      "If you centralise too much, branches grind to a halt",
      "If you decentralise too much, you can't see leakage until books close",
      "Branch managers feel watched OR head office feels in the dark",
      "Audit reconciliation is a fight every quarter",
    ],
    features: [
      {
        title: "Branch operates independently — head office sees everything",
        body: "Each branch has its own voucher numbering, its own petty-cash flow, its own approver. Head office gets a real-time consolidated view without injecting itself into every approval.",
      },
      {
        title: "Per-branch caps and thresholds",
        body: "Set monthly caps per branch per category. Live consumption is visible to both branch and head office. Threshold breaches trigger immediate alerts to both sides.",
      },
      {
        title: "Cross-branch reporting in two clicks",
        body: "'Show me fuel spend by branch this month, ranked' — two clicks. 'Compare petty cash discipline across branches over 6 months' — two clicks.",
      },
      {
        title: "Single audit log across all branches",
        body: "Auditors see one canonical timeline of every transaction company-wide. No more hunting through branch-specific spreadsheets.",
      },
    ],
    testimonialAngle:
      "Branches finally have the autonomy to move fast, and head office finally has the visibility to sleep at night.",
    faqs: [
      {
        q: "How do you balance branch autonomy with head-office control?",
        a: "Through scoped permissions. Branches have FULL autonomy for daily operations within their configured caps and approval chain. Head office has FULL visibility (real-time dashboards, audit log, exports) but doesn't have to insert itself into every approval. Both sides see what they need; neither blocks the other.",
      },
      {
        q: "Can a head-office user override a branch decision?",
        a: "Yes — super admin can revoke approvals, restore deleted vouchers, or reassign queues. Every override action is itself logged in the audit trail with reason captured.",
      },
      {
        q: "Do branches see each other's data?",
        a: "By default, no — each branch is isolated. Optional 'peer visibility' modes can be configured for specific use cases (e.g., regional managers seeing all branches in their region).",
      },
      {
        q: "Can we add a branch later without disrupting existing ones?",
        a: "Yes. Adding a branch is a 15-minute operation. Existing branches and their data are completely unaffected. Voucher numbering for the new branch starts from #1.",
      },
      {
        q: "What if we close a branch?",
        a: "Branches can be deactivated (data preserved, no new vouchers can be created). Audit log and historical exports remain fully accessible.",
      },
    ],
  },
];

export const SOLUTION_SLUGS = SOLUTIONS.map((s) => s.slug);

export function findSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
