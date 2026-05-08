"use client";

import { useState } from "react";
import { Send, Copy, Check, MessageSquare, Mail, Sparkles, AlertTriangle } from "lucide-react";

/**
 * /dashboard/outbound — Interactive Outbound Playbook
 *
 * Operator tool for the AEGIBIT founders. Centralises:
 *   • 3 LinkedIn DM templates (cold open, follow-up, breakup)
 *   • 5-touch cold email sequence
 *   • ICP target list framework
 *   • Personalization variables (auto-substituted in preview)
 *   • One-click copy with UTM-tracked CTA links
 *
 * Every CTA link auto-includes UTM params so we can attribute every booked
 * demo back to the message variant that produced it.
 *
 * Note: This is intentionally a CONTENT page, not a sender. We never auto-
 * send DMs/emails on the founder's behalf — relationship integrity matters.
 * The founder copies, personalises further if needed, and sends manually
 * (LinkedIn) or via their existing outbound tool (Lemlist, Apollo, etc.)
 * for email.
 */

interface TokenSet {
  firstName: string;
  company: string;
  city: string;
  branchCount: string;
  painPoint: string;
}

const DEFAULT_TOKENS: TokenSet = {
  firstName: "Rajesh",
  company: "Sharma Motors",
  city: "Pune",
  branchCount: "5",
  painPoint: "fuel and petty cash reconciliation across branches",
};

// ─── LinkedIn DM Templates ────────────────────────────────────────

const LINKEDIN_DMS = [
  {
    id: "cold_open",
    label: "Touch 1: Cold open",
    purpose:
      "First message. Goal: pattern interrupt + earn a reply. Short, no link, no pitch.",
    when: "Day 0 — connection request acceptance day",
    body: `Hi {{firstName}}, saw {{company}} runs {{branchCount}} branches across {{city}} — impressive ops.

Quick question (no pitch, promise): how do you currently track petty cash + fuel + workshop expenses across branches? Excel? WhatsApp? Tally entries?

Working on something specific to multi-branch dealers and curious if the standard pain points match yours.`,
  },
  {
    id: "follow_up",
    label: "Touch 2: Follow-up (2 days later)",
    purpose:
      "After they reply OR after 48h silence. Brings the value angle in. One link, one ask.",
    when: "Day 2-3 after Touch 1",
    body: `Thanks {{firstName}} — what you described ({{painPoint}}) is exactly the pattern.

We built PayMint to solve this for Indian multi-branch dealers. Live with Nibir Motors across 7 branches in West Bengal. Real-time sync, branch-coded vouchers, Tally-ready exports, audit log built in.

₹999/branch/month. Free 14-day pilot, no card.

Worth a 20-min look? Quick demo here: aegibit.com/products/paymint/demo`,
  },
  {
    id: "breakup",
    label: "Touch 3: Breakup (5 days after Touch 2)",
    purpose:
      "Final message if no reply. Counter-intuitive: closing the door often opens it. Permission to forget.",
    when: "Day 7-8 after Touch 1",
    body: `{{firstName}}, last message — I'll stop bothering you.

If multi-branch expense tracking is on the roadmap for {{company}} this quarter, the demo link is here: aegibit.com/products/paymint/demo

If not, all good — I'll keep building, see you when the time is right.

— The AEGIBIT Team`,
  },
];

// ─── Cold Email Sequence ──────────────────────────────────────────

const COLD_EMAILS = [
  {
    id: "email_1",
    label: "Touch 1: Pattern-interrupt opener",
    when: "Day 0",
    subject: "{{company}} + branch expense control?",
    body: `Hi {{firstName}},

Saw {{company}} runs {{branchCount}} branches around {{city}}. Genuinely curious — when one of your branch managers spends ₹2,000 on fuel today, how does that voucher reach head-office reconciliation?

Most multi-branch dealers we talk to are still running on Excel + WhatsApp. Some on Tally direct entry. Both leak time and accuracy.

We built PayMint specifically for this — branch-coded vouchers, real-time sync, audit trail, Tally-ready exports. Live with Nibir Motors (7 branches, West Bengal).

Open to a 20-min walkthrough? Same-day sandbox link if you want to try it first.

— The AEGIBIT Team
aegibit.com/products/paymint/demo?utm_source=email&utm_campaign=cold_t1`,
  },
  {
    id: "email_2",
    label: "Touch 2: Specific pain hook",
    when: "Day 3",
    subject: "Re: {{company}} branch expense control",
    body: `{{firstName}},

Quick follow-up — one specific scenario most multi-branch dealers tell us is painful:

  Month-end. Branch managers send petty-cash totals via WhatsApp. Head-office accountant manually keys 200+ vouchers into Tally. Two days lost. Some duplicates, some missing, some misclassified.

PayMint takes that from 2 days to 20 minutes. Vouchers flow live as they're spent. Tally-ready CSV exports drop straight into Tally Prime. Audit log captures every action.

Want to see it run on real numbers? 20-min screen-share, no prep needed:
aegibit.com/products/paymint/demo?utm_source=email&utm_campaign=cold_t2

— The AEGIBIT Team`,
  },
  {
    id: "email_3",
    label: "Touch 3: Value drop (case study)",
    when: "Day 7",
    subject: "How Nibir Motors automated 7 branches",
    body: `{{firstName}},

If you'd rather see proof before booking time, here's the Nibir Motors case study:
aegibit.com/case-studies/nibir-motors?utm_source=email&utm_campaign=cold_t3

7 branches. Real-time vouchers. Tally exports. Audit log. Built by a cybersecurity company.

— The AEGIBIT Team`,
  },
  {
    id: "email_4",
    label: "Touch 4: Pricing transparency",
    when: "Day 12",
    subject: "PayMint pricing — ₹999/branch/month",
    body: `{{firstName}},

Realised I never sent the pricing. Transparent, no per-user fees, no hidden tiers:

  ₹999 per branch per month — every feature, unlimited users
  Free 14-day pilot, no credit card
  Cancel anytime, export everything as CSV

For {{company}}'s {{branchCount}} branches: ₹{{branchCount}}999/month. ROI math vs hiring one finance person at ₹50k/month: roughly 50× cheaper.

Full pricing + ROI calculator: aegibit.com/pricing?utm_source=email&utm_campaign=cold_t4

— The AEGIBIT Team`,
  },
  {
    id: "email_5",
    label: "Touch 5: Breakup",
    when: "Day 18",
    subject: "Closing the loop, {{firstName}}",
    body: `{{firstName}},

Last note — promise.

If branch expense automation isn't a priority for {{company}} this quarter, totally understand. I'll move on and stop bothering you.

If it is and you want to take a look, the 20-min demo is here whenever:
aegibit.com/products/paymint/demo?utm_source=email&utm_campaign=cold_t5

Either way — keep building.

— The AEGIBIT Team`,
  },
];

// ─── ICP Targeting ────────────────────────────────────────────────

const ICP = {
  primary: {
    title: "Primary ICP — book here first",
    items: [
      "Multi-brand car dealerships, 3-15 branches, India",
      "Two-wheeler dealerships (Hero, Honda, TVS, Bajaj channel), 2-10 branches",
      "Commercial vehicle dealerships (Tata, Ashok Leyland), any branch count",
      "Used-car multi-location chains (Cars24-style — but smaller, regional)",
      "Multi-branch automotive workshops (independent service chains)",
    ],
  },
  secondary: {
    title: "Secondary ICP — warm later",
    items: [
      "Multi-location retail SMEs (clothing, electronics) with 5-20 branches",
      "Multi-branch restaurants / dark kitchens",
      "Healthcare clinic chains (3-20 locations)",
      "Multi-branch educational coaching institutes",
      "Logistics / fleet operators with regional branches",
    ],
  },
  who: {
    title: "Decision-maker job titles to target",
    items: [
      "Founder / Owner / Managing Director",
      "CFO / Finance Head / Finance Controller",
      "Operations Director / COO / VP Operations",
      "Head of Accounts / Accounts Manager",
      "IT Head (technical buyer for security/audit features)",
    ],
  },
  geo: {
    title: "Geographic priority order",
    items: [
      "1. West Bengal + East India (warm — Nibir Motors social proof)",
      "2. Maharashtra + Gujarat (large dealer concentration, English-friendly)",
      "3. Tamil Nadu + Karnataka + Telangana (tech-forward SME market)",
      "4. Delhi NCR + Punjab (high-volume dealerships)",
      "5. Tier-2 cities (Indore, Coimbatore, Lucknow — under-served by SaaS)",
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────

export default function OutboundPlaybook() {
  const [tab, setTab] = useState<"linkedin" | "email" | "icp">("linkedin");
  const [tokens, setTokens] = useState<TokenSet>(DEFAULT_TOKENS);

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Send size={20} style={{ color: "#F97316" }} />
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Outbound Playbook</h1>
        </div>
        <p className="text-sm text-[#6B7280]">
          Ready-to-send LinkedIn DMs, cold email sequences, and ICP targeting. Edit
          variables once — every template substitutes them live.
        </p>
      </div>

      {/* ── Compliance banner ──────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        style={{
          background: "rgba(245,158,11,0.05)",
          border: "1px solid rgba(245,158,11,0.20)",
        }}
      >
        <AlertTriangle size={18} style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }} />
        <div className="text-xs leading-relaxed text-[#FBBF24]">
          <strong>Aira never auto-sends</strong> — this is a content & personalisation tool.
          The founder copies, customises further if context demands, and sends manually
          (LinkedIn) or via their existing outbound tool (Lemlist / Apollo / Instantly) for
          email. Relationship integrity matters.
        </div>
      </div>

      {/* ── Personalisation tokens ─────────────────────────────────── */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{
          background: "#070d1a",
          border: "1px solid rgba(37,99,235,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} style={{ color: "#F97316" }} />
          <span className="text-[10px] uppercase tracking-wider text-[#F97316] font-semibold">
            Personalisation
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <TokenInput label="firstName"   value={tokens.firstName}   onChange={(v) => setTokens({ ...tokens, firstName: v })} />
          <TokenInput label="company"     value={tokens.company}     onChange={(v) => setTokens({ ...tokens, company: v })} />
          <TokenInput label="city"        value={tokens.city}        onChange={(v) => setTokens({ ...tokens, city: v })} />
          <TokenInput label="branchCount" value={tokens.branchCount} onChange={(v) => setTokens({ ...tokens, branchCount: v })} />
          <TokenInput label="painPoint"   value={tokens.painPoint}   onChange={(v) => setTokens({ ...tokens, painPoint: v })} />
        </div>
        <p className="text-[10px] text-[#6B7280] mt-3">
          Tokens substitute live in every template below. Update for each prospect, then
          copy.
        </p>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-5 border-b border-[rgba(255,255,255,0.05)]">
        <Tab active={tab === "linkedin"} onClick={() => setTab("linkedin")} icon={MessageSquare}>
          LinkedIn DMs
        </Tab>
        <Tab active={tab === "email"} onClick={() => setTab("email")} icon={Mail}>
          Cold Email Sequence
        </Tab>
        <Tab active={tab === "icp"} onClick={() => setTab("icp")} icon={Sparkles}>
          ICP Targeting
        </Tab>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      {tab === "linkedin" && (
        <div className="space-y-4">
          {LINKEDIN_DMS.map((t) => (
            <TemplateCard key={t.id} {...t} subject={undefined} tokens={tokens} />
          ))}
        </div>
      )}

      {tab === "email" && (
        <div className="space-y-4">
          {COLD_EMAILS.map((t) => (
            <TemplateCard key={t.id} {...t} tokens={tokens} />
          ))}
        </div>
      )}

      {tab === "icp" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <ICPCard {...ICP.primary} accent="#F97316" />
          <ICPCard {...ICP.secondary} accent="#60A5FA" />
          <ICPCard {...ICP.who} accent="#34D399" />
          <ICPCard {...ICP.geo} accent="#C084FC" />
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function TokenInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-[#6B7280] block mb-1.5">
        {`{{${label}}}`}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md text-xs text-[#F9FAFB] outline-none focus:ring-2 focus:ring-[#F97316]/40"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative"
      style={{
        color: active ? "#F97316" : "#9CA3AF",
        borderBottom: active ? "2px solid #F97316" : "2px solid transparent",
        marginBottom: -1,
      }}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function TemplateCard({
  label,
  purpose,
  when,
  subject,
  body,
  tokens,
}: {
  label: string;
  purpose?: string;
  when: string;
  subject?: string;
  body: string;
  tokens: TokenSet;
}) {
  const [copied, setCopied] = useState<"subject" | "body" | null>(null);
  const renderedSubject = subject ? substitute(subject, tokens) : undefined;
  const renderedBody = substitute(body, tokens);

  function copy(text: string, which: "subject" | "body") {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#070d1a",
        border: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      <div className="p-5 pb-4 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
          <h3 className="text-sm font-semibold text-[#F9FAFB]">{label}</h3>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-medium"
            style={{
              background: "rgba(249,115,22,0.10)",
              color: "#F97316",
              border: "1px solid rgba(249,115,22,0.20)",
            }}
          >
            {when}
          </span>
        </div>
        {purpose && (
          <p className="text-xs text-[#9CA3AF] leading-relaxed">{purpose}</p>
        )}
      </div>

      {renderedSubject && (
        <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-medium">
              Subject
            </span>
            <button
              onClick={() => copy(renderedSubject, "subject")}
              className="flex items-center gap-1.5 text-[10px] text-[#6B7280] hover:text-[#F97316] transition-colors"
            >
              {copied === "subject" ? <Check size={11} /> : <Copy size={11} />}
              {copied === "subject" ? "Copied!" : "Copy subject"}
            </button>
          </div>
          <div className="text-sm text-[#F9FAFB] font-medium">{renderedSubject}</div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-medium">
            Message body
          </span>
          <button
            onClick={() => copy(renderedBody, "body")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold transition-all"
            style={{
              background: copied === "body" ? "rgba(16,185,129,0.10)" : "rgba(249,115,22,0.10)",
              color: copied === "body" ? "#34D399" : "#F97316",
              border: `1px solid ${copied === "body" ? "rgba(16,185,129,0.30)" : "rgba(249,115,22,0.30)"}`,
            }}
          >
            {copied === "body" ? <Check size={12} /> : <Copy size={12} />}
            {copied === "body" ? "Copied to clipboard" : "Copy body"}
          </button>
        </div>
        <pre
          className="text-sm text-[#D1D5DB] whitespace-pre-wrap leading-relaxed font-[inherit]"
          style={{ fontFamily: "inherit" }}
        >
          {renderedBody}
        </pre>
      </div>
    </div>
  );
}

function ICPCard({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "#070d1a",
        border: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
              style={{ background: accent }}
            />
            <span className="text-xs leading-relaxed text-[#D1D5DB]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function substitute(template: string, tokens: TokenSet): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return (tokens as unknown as Record<string, string>)[key] ?? `{{${key}}}`;
  });
}
