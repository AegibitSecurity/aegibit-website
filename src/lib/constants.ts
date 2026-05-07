export const SITE = {
  name: "AEGIBIT",
  tagline: "Built to Outlast.",
  description:
    "AEGIBIT builds operational software for businesses that can't afford a leak. Cybersecurity-first. Real-time across every branch. Engineered to outlast.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.aegibit.com",
  email: "contact@aegibit.com",
  twitter: "@aegibit",
  github: "AegibitSecurity",
} as const;

export const NAV_LINKS = [
  { label: "Features",     href: "/features" },
  { label: "Security",     href: "/security" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing",      href: "/pricing" },
  { label: "Blog",         href: "/blog" },
] as const;

export const CITIES = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"] as const;

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 999, annual: 799 },
    currency: "Rs.",
    unit: "user/month",
    description: "Perfect for small security teams getting started with AI voice workflows.",
    features: [
      "Core voice + LLM assistant",
      "30-day audit logs",
      "5 integrations",
      "Basic RBAC",
      "Email support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    highlighted: false,
  },
  {
    id: "business",
    name: "Business",
    price: { monthly: 2499, annual: 1999 },
    currency: "Rs.",
    unit: "user/month",
    description: "For enterprise security teams that need biometric auth and full compliance.",
    features: [
      "Everything in Starter",
      "Voice biometric authentication",
      "RBAC + custom roles",
      "1-year immutable audit logs",
      "15 integrations + API access",
      "ML anomaly detection",
      "Priority support",
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: null, annual: null },
    currency: "",
    unit: "",
    description: "Custom deployment for regulated industries with full data sovereignty.",
    features: [
      "Everything in Business",
      "Sudo Mode — Dual Approval",
      "SIEM integration",
      "On-premise deployment option",
      "India data residency SLA",
      "Dedicated Customer Success Manager",
      "SOC 2 Type II reports",
    ],
    cta: "Talk to Us",
    ctaVariant: "outline" as const,
    highlighted: false,
  },
] as const;

export const STATS = [
  { value: 99.9, suffix: "%", label: "Uptime SLA",        decimals: 1 },
  { value: 300,  prefix: "<", suffix: "ms", label: "Voice Response" },
  { value: 100,  suffix: "%", label: "Audit Coverage" },
  { value: 50,   suffix: "+", label: "Beta Waitlist Teams" },
] as const;

export const FAQS = [
  {
    q: "Is VoiceCore secure enough for BFSI environments?",
    a: "Yes. VoiceCore is designed ground-up for regulated environments. Every command goes through voice biometric identity verification, TLS 1.3 encryption, per-command RBAC checks, and is written to an immutable audit log. We're pursuing SOC 2 Type II and align with RBI's cybersecurity framework.",
  },
  {
    q: "How does voice biometric authentication work?",
    a: "We capture a voiceprint on enrollment and compare it against every subsequent command using speaker verification ML models. The system rejects impersonation attempts, replayed audio, and synthetic voice with >99.5% accuracy.",
  },
  {
    q: "Where is our data stored? Can we keep it in India?",
    a: "Enterprise plans include an India data residency SLA — all voice data, transcripts, and audit logs remain in Indian data centers. We support both cloud-hosted and on-premise deployments for full data sovereignty.",
  },
  {
    q: "What integrations are supported out of the box?",
    a: "VoiceCore integrates with Google Calendar, Gmail, Outlook, Slack, Jira, Linear, ServiceNow, Notion, PagerDuty, GitHub, Splunk, and major SIEM platforms. Custom integrations via our REST API are available on Business and Enterprise plans.",
  },
  {
    q: "How is pricing calculated for large teams?",
    a: "Pricing is per active user per month. Enterprise plans include volume discounts, dedicated infrastructure, and a custom SLA. Contact us for a custom quote for teams above 100 users.",
  },
  {
    q: "Can we deploy VoiceCore on our own servers?",
    a: "Yes. Enterprise plans support on-premise and private-cloud deployment. We provide a Docker-based deployment package and dedicated engineering support for setup.",
  },
  {
    q: "What compliance certifications does AEGIBIT hold?",
    a: "We are currently SOC 2 Type II in process and align with ISO 27001, GDPR, and India's Digital Personal Data Protection (DPDP) Act 2023. Enterprise customers receive compliance documentation on request.",
  },
  {
    q: "How quickly can our team be onboarded?",
    a: "Most teams are live within 2 hours. Our onboarding includes guided voice enrollment, RBAC configuration, and integration setup. Business and Enterprise customers get a dedicated onboarding engineer.",
  },
] as const;
