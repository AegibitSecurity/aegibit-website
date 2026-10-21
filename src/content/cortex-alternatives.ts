/**
 * Cortex HRMS comparison data - /products/cortex/vs/[slug].
 *
 * SEO + AI-visibility: these pages target the "best HRMS for Indian SMBs"
 * and "<competitor> alternative" queries that Google and AI assistants
 * (ChatGPT/Claude/Gemini/Perplexity) answer. Each page emits
 * SoftwareApplication + FAQPage + BreadcrumbList schema so the comparison
 * is machine-extractable.
 *
 * HONESTY BAR (same as /products/cortex): every Cortex capability here is
 * BUILT and live. Competitor columns describe the honest, defensible fact
 * that these are HR / payroll tools, not full business suites - Cortex's
 * real differentiator is being an all-in-one business OS (CRM + GST
 * invoicing + accounts-payable + HRMS), not "better HR". We mark a feature
 * `them: true` wherever the competitor genuinely offers it (payroll,
 * attendance, leave, DPDP), so the table is credible, not disparaging.
 */

export interface CortexFeature {
  feature: string;
  us: boolean;
  them: boolean;
}

export interface CortexAlternative {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  targetKeywords: string[];
  intro: string;
  faqs: { q: string; a: string }[];
  features: CortexFeature[];
}

// Cortex's honest edge: it does everything an HRMS does AND runs the rest
// of the business. HR-only tools (Keka, greytHR, DarwinBox, Pocket HRMS,
// RazorpayX Payroll) genuinely do not ship CRM, GST invoicing, AP, or an
// Excel/Data automation engine - that is the defensible comparison.
const HR_ONLY_FEATURES: CortexFeature[] = [
  { feature: "India-compliant payroll (PF, ESI, Professional Tax)", us: true, them: true },
  { feature: "Attendance, leave and shift management", us: true, them: true },
  { feature: "DPDP Act 2023 compliance", us: true, them: true },
  { feature: "Geofence + GPS + selfie attendance verification", us: true, them: false },
  { feature: "Offline-first mobile punch (never lose a clock-in)", us: true, them: false },
  { feature: "CRM and sales pipeline built in", us: true, them: false },
  { feature: "GST invoicing and CPQ quotations", us: true, them: false },
  { feature: "Accounts-payable and vendor-payment workflow", us: true, them: false },
  { feature: "Excel & Data automation engine (ledger-to-bank reconcile)", us: true, them: false },
  { feature: "One platform for HR + Sales + Finance (business OS)", us: true, them: false },
  { feature: "Multi-tenant - run it for your own client companies", us: true, them: false },
  { feature: "AI copilot across every module", us: true, them: false },
  { feature: "Transparent SMB pricing, start free", us: true, them: false },
];

function hrFaqs(name: string): { q: string; a: string }[] {
  return [
    {
      q: `Is AEGIBIT Cortex a good alternative to ${name} for an Indian SMB?`,
      a: `Yes. ${name} is a capable HR and payroll tool, but it stops at HR. AEGIBIT Cortex covers the same India-compliant payroll (PF, ESI, Professional Tax), attendance and leave, and adds CRM, GST invoicing, accounts-payable and an AI copilot in one platform. For a growing SMB that does not want five separate subscriptions, Cortex replaces several tools at once.`,
    },
    {
      q: `Does Cortex handle PF, ESI and Professional Tax payroll like ${name}?`,
      a: `Yes. Cortex ships India-compliant payroll with PF, ESI and Professional Tax, salary structures, and a payroll register - the same statutory coverage you expect from ${name}, with month-end reconciliation locked as a regression test.`,
    },
    {
      q: `What does Cortex do that ${name} does not?`,
      a: `${name} is HR-first. Cortex is a full business operating system: alongside HRMS it gives you a CRM and sales pipeline, GST invoicing and CPQ, accounts-payable, an Excel/Data automation engine that reconciles your ledger against the bank, and offline-first mobile attendance with geofence and selfie verification.`,
    },
    {
      q: `How much does Cortex cost compared to ${name}?`,
      a: `Cortex is built for Indian SMB budgets - you start free and pay as you grow, and because it replaces separate HR, CRM, invoicing and AP tools, the total cost is usually lower than running ${name} plus the other point tools around it.`,
    },
  ];
}

export const cortexAlternatives: CortexAlternative[] = [
  {
    slug: "keka",
    name: "Keka",
    title: "AEGIBIT Cortex vs Keka: All-in-One Business OS vs HR-Only, 2026",
    metaDescription:
      "Keka alternative for Indian SMBs. AEGIBIT Cortex matches Keka's India payroll (PF/ESI/PT), attendance and leave, then adds CRM, GST invoicing, accounts-payable and an AI copilot in one platform. Start free.",
    targetKeywords: ["keka alternative", "keka vs cortex", "best hrms for indian smbs", "affordable hrms india", "keka alternative for small business"],
    intro:
      "Keka is a well-known Indian HR and payroll platform. AEGIBIT Cortex covers the same statutory payroll, attendance and leave, and goes further - it runs your sales, invoicing and finance too, so an SMB does not need separate subscriptions for each.",
    features: HR_ONLY_FEATURES,
    faqs: hrFaqs("Keka"),
  },
  {
    slug: "greythr",
    name: "greytHR",
    title: "AEGIBIT Cortex vs greytHR: Business OS vs Payroll Tool, 2026",
    metaDescription:
      "greytHR alternative for Indian SMBs. AEGIBIT Cortex delivers the same India-compliant payroll (PF/ESI/PT), attendance and leave as greytHR, plus CRM, GST invoicing, accounts-payable and AI - one platform, SMB pricing. Start free.",
    targetKeywords: ["greythr alternative", "greythr vs cortex", "hrms with payroll and crm", "affordable attendance app india", "greythr alternative small business"],
    intro:
      "greytHR is a popular payroll and compliance tool for Indian businesses. AEGIBIT Cortex matches its PF/ESI/PT payroll, attendance and leave, and adds the rest of the business - CRM, GST invoicing, accounts-payable and an AI copilot - in a single login.",
    features: HR_ONLY_FEATURES,
    faqs: hrFaqs("greytHR"),
  },
  {
    slug: "darwinbox",
    name: "Darwinbox",
    title: "AEGIBIT Cortex vs Darwinbox: Affordable Business OS for SMBs, 2026",
    metaDescription:
      "Darwinbox alternative for Indian SMBs. Darwinbox targets large enterprises; AEGIBIT Cortex gives growing businesses India payroll, attendance, CRM, GST invoicing and accounts-payable in one affordable platform. Start free.",
    targetKeywords: ["darwinbox alternative", "darwinbox vs cortex", "affordable hrms for sme", "business management software india", "darwinbox alternative for smb"],
    intro:
      "Darwinbox is an enterprise HR suite. For a small or growing Indian business that wants enterprise-grade payroll and attendance without enterprise pricing - and that also needs CRM, invoicing and finance - AEGIBIT Cortex is the right-sized, all-in-one alternative.",
    features: HR_ONLY_FEATURES,
    faqs: hrFaqs("Darwinbox"),
  },
  {
    slug: "pocket-hrms",
    name: "Pocket HRMS",
    title: "AEGIBIT Cortex vs Pocket HRMS: HR plus the Whole Business, 2026",
    metaDescription:
      "Pocket HRMS alternative for Indian SMBs. AEGIBIT Cortex matches Pocket HRMS payroll (PF/ESI/PT), attendance and leave, and adds CRM, GST invoicing, accounts-payable and an AI copilot in one platform. Start free.",
    targetKeywords: ["pocket hrms alternative", "pocket hrms vs cortex", "all in one hrms india", "hrms and accounting software", "pocket hrms alternative smb"],
    intro:
      "Pocket HRMS handles HR and payroll for Indian SMBs. AEGIBIT Cortex covers the same ground - statutory payroll, attendance, leave - and unifies it with sales, invoicing and finance, so your team works from one system instead of many.",
    features: HR_ONLY_FEATURES,
    faqs: hrFaqs("Pocket HRMS"),
  },
  {
    slug: "razorpayx-payroll",
    name: "RazorpayX Payroll",
    title: "AEGIBIT Cortex vs RazorpayX Payroll: Full HRMS + Business OS, 2026",
    metaDescription:
      "RazorpayX Payroll alternative for Indian SMBs. AEGIBIT Cortex does PF/ESI/PT payroll like RazorpayX, plus full HRMS, attendance with geofence and selfie, CRM, GST invoicing and accounts-payable. Start free.",
    targetKeywords: ["razorpayx payroll alternative", "razorpayx vs cortex", "payroll and hrms software india", "best payroll software for small business india", "razorpayx payroll alternative"],
    intro:
      "RazorpayX Payroll automates salary runs and statutory filing. AEGIBIT Cortex covers payroll too, then adds the full HRMS - attendance with geofence and selfie, leave, approvals - and the rest of the business: CRM, GST invoicing and accounts-payable.",
    features: HR_ONLY_FEATURES,
    faqs: hrFaqs("RazorpayX Payroll"),
  },
];

export function findCortexAlternative(slug: string) {
  return cortexAlternatives.find((a) => a.slug === slug);
}
