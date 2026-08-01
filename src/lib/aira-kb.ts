/**
 * aira-kb.ts, Aira's retrieval engine (the "R" in RAG).
 *
 * Retrieves grounded knowledge for every chat turn from the crawled
 * site index (src/data/aira-kb.json, built by
 * automation/scripts/build-aira-kb.mjs).
 *
 * ARCHITECTURE DECISION, hybrid lexical retrieval instead of a vector DB:
 * Our corpus is ~240 chunks across ~50 pages describing 6 products. At
 * this scale a BM25-style lexical ranker plus a business-intent
 * expansion layer (the map below) outperforms naive embeddings, runs
 * in <5ms with zero infra, zero cold-start, zero cost, and keeps the
 * whole pipeline deterministic and testable. The chunk format already
 * carries everything needed to add pgvector embeddings later if the
 * corpus grows 10x; the seam is retrieve()'s internals, nothing else
 * changes.
 *
 * INTENT EXPANSION, the consultant layer:
 * Visitors describe business pain, not product names. "Employees fake
 * attendance" must retrieve Cortex HRMS content even though the words
 * never overlap. EXPANSIONS maps pain vocabulary to domain vocabulary
 * before scoring. This is deliberate strategy-layer knowledge, small,
 * reviewed, and versioned, while ALL product facts stay in the
 * auto-crawled index (never hardcoded here).
 */

import kbData from "@/data/aira-kb.json";

export interface KbChunk {
  id: string;
  url: string;
  title: string;
  text: string;
}

export interface RetrievedSource {
  url: string;
  title: string;
}

const CHUNKS: KbChunk[] = (kbData as { chunks: KbChunk[] }).chunks;

/* ------------------------------------------------------------------ */
/* Business-pain -> domain vocabulary expansion                        */
/* ------------------------------------------------------------------ */

const EXPANSIONS: Record<string, string[]> = {
  // HR / attendance / payroll pain -> Cortex
  attendance: ["cortex", "hrms", "payroll", "selfie", "geo", "punch", "crm"],
  fake: ["fraud", "audit", "verification", "selfie", "geo"],
  fraud: ["audit", "verification", "leakage", "immutable", "logs"],
  payroll: ["cortex", "hrms", "attendance", "salary"],
  employees: ["hrms", "attendance", "payroll", "cortex", "team"],
  hr: ["hrms", "cortex", "attendance", "payroll"],
  // Sales / CRM pain -> Cortex CRM + LeadSync
  sales: ["crm", "leads", "pipeline", "cortex", "leadsync", "quotation"],
  crm: ["cortex", "leadsync", "pipeline", "leads"],
  leads: ["leadsync", "crm", "cortex", "pipeline", "followup"],
  followup: ["crm", "leads", "pipeline", "reminders"],
  quotation: ["cortex", "cpq", "invoice", "approval"],
  executives: ["crm", "sales", "leads", "tracking", "leadsync", "cortex"],
  // Expense / finance pain -> PayMint
  expense: ["paymint", "voucher", "approvals", "petty", "cash", "audit"],
  expenses: ["paymint", "voucher", "approvals", "petty", "cash", "audit"],
  voucher: ["paymint", "expense", "approvals", "branch"],
  petty: ["paymint", "cash", "expense", "branch"],
  tally: ["paymint", "export", "expense", "accounting"],
  reimbursement: ["paymint", "expense", "voucher", "approvals"],
  accounts: ["paymint", "expense", "tally", "audit", "invoice"],
  // Dealership pain -> LeadSync + PayMint
  dealership: ["leadsync", "paymint", "automotive", "showroom", "branch"],
  showroom: ["leadsync", "dealership", "leads", "delivery"],
  automotive: ["dealership", "leadsync", "paymint"],
  // Boutique / retail pain -> Vestiq
  boutique: ["vestiq", "billing", "tailoring", "whatsapp", "dues"],
  tailoring: ["vestiq", "boutique", "billing", "measurements"],
  billing: ["vestiq", "invoice", "bills", "payment"],
  dues: ["vestiq", "payment", "pending", "customers"],
  // Manual-work pain -> automation (Cortex + services)
  excel: ["automation", "cortex", "reports", "workflow", "manual"],
  spreadsheet: ["automation", "cortex", "reports", "workflow", "manual"],
  manual: ["automation", "workflow", "cortex", "ai"],
  paperwork: ["automation", "workflow", "digital", "cortex", "paymint"],
  whatsapp: ["vestiq", "automation", "agent", "sharing"],
  // Security pain -> security page + MCP Shield
  hacked: ["security", "shield", "audit", "protection"],
  security: ["shield", "mcp", "audit", "isolation", "encryption"],
  ai: ["cortex", "aira", "automation", "agent", "mcp"],
  // Web presence pain -> services
  website: ["web", "development", "kolkata", "design", "seo"],
  app: ["mobile", "android", "development", "apk"],
  // Commercial questions
  price: ["pricing", "cost", "plans", "tier", "gst"],
  cost: ["pricing", "price", "plans", "roi"],
  free: ["pricing", "aira", "shield", "download"],
  demo: ["contact", "pricing", "demo", "trial"],
};

/* ------------------------------------------------------------------ */
/* Lexical index (BM25-flavored) built once at module load             */
/* ------------------------------------------------------------------ */

const STOP = new Set([
  "the","a","an","and","or","but","is","are","was","were","be","been","to",
  "of","in","on","for","with","at","by","from","as","it","its","this","that",
  "we","our","you","your","i","my","me","they","their","them","do","does",
  "have","has","had","what","which","who","how","can","will","would","should",
  "not","no","so","if","then","than","too","very","just","about","into","also",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

interface IndexedChunk {
  chunk: KbChunk;
  tf: Map<string, number>;
  len: number;
  titleTokens: Set<string>;
}

const INDEX: IndexedChunk[] = CHUNKS.map((chunk) => {
  const tokens = tokenize(chunk.text);
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { chunk, tf, len: tokens.length, titleTokens: new Set(tokenize(chunk.title + " " + chunk.url)) };
});

const DF = new Map<string, number>();
for (const doc of INDEX) {
  for (const term of doc.tf.keys()) DF.set(term, (DF.get(term) ?? 0) + 1);
}
const N = INDEX.length || 1;
const AVG_LEN = INDEX.reduce((s, d) => s + d.len, 0) / N || 1;

function idf(term: string): number {
  const df = DF.get(term) ?? 0;
  return Math.log(1 + (N - df + 0.5) / (df + 0.5));
}

/* ------------------------------------------------------------------ */
/* Retrieval                                                           */
/* ------------------------------------------------------------------ */

const K1 = 1.4;
const B = 0.6;

/** Expand the raw query with business-intent vocabulary. */
export function expandQuery(query: string): string[] {
  const base = tokenize(query);
  const expanded = new Set(base);
  for (const t of base) {
    for (const e of EXPANSIONS[t] ?? []) expanded.add(e);
  }
  return [...expanded];
}

/**
 * Retrieve the top-k most relevant knowledge chunks for a visitor
 * message. Deterministic, <5ms, never throws.
 */
export function retrieve(query: string, k = 6): KbChunk[] {
  const terms = expandQuery(query);
  if (terms.length === 0) return [];

  const scored = INDEX.map((doc) => {
    let score = 0;
    for (const term of terms) {
      const f = doc.tf.get(term) ?? 0;
      if (f > 0) {
        score += idf(term) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * doc.len) / AVG_LEN)));
      }
      // Title/URL hits are strong relevance signals on a marketing site.
      if (doc.titleTokens.has(term)) score += 1.2;
    }
    return { doc, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Diversity guard: at most 2 chunks per page so one long page can't
  // crowd out cross-product knowledge.
  const out: KbChunk[] = [];
  const perUrl = new Map<string, number>();
  for (const { doc } of scored) {
    const c = perUrl.get(doc.chunk.url) ?? 0;
    if (c >= 2) continue;
    perUrl.set(doc.chunk.url, c + 1);
    out.push(doc.chunk);
    if (out.length >= k) break;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Knowledge block assembly for the LLM prompt                         */
/* ------------------------------------------------------------------ */

/**
 * The always-present product catalog. One line per product, URLs only,
 * so Aira can cross-recommend even when retrieval focuses elsewhere.
 * Rule: one line per LIVE product; details live in the crawled index,
 * never here. Update only when a product launches or retires.
 */
export const PRODUCT_CATALOG = `AEGIBIT product catalog (all live, details in KNOWLEDGE below):
- AEGIBIT Cortex (/products/cortex): AI CRM + sales automation + quotation/CPQ + invoicing + HRMS with geo/selfie attendance and payroll. For SMB and mid-market teams. Web, Android, iOS.
- PayMint (/products/paymint): multi-branch expense automation, vouchers, tiered approvals, audit logs, Tally-ready exports. Live with automotive dealerships.
- LeadSync (/products/leadsync): the Dealership OS, lead-to-delivery pipeline for automobile dealerships. Android and web.
- Vestiq (/products/vestiq): the Boutique OS, billing and shop management for boutiques and tailoring businesses.
- Aira (/products/aira): free voice-controlled desktop assistant for Windows. Hindi, Bengali, English.
- MCP Shield (/products/mcp-shield): free open-source security scanner for Model Context Protocol servers.
Services (/website-development-company-kolkata, /work): custom software, web and app development, AI automation, security reviews.
Ecosystem plays: dealerships combine PayMint + LeadSync (+ Cortex for CRM/HR). Boutiques combine Vestiq + a website. Any multi-branch SME: PayMint + Cortex.`;

export interface KnowledgeBlock {
  text: string;
  sources: RetrievedSource[];
}

/** Build the grounded knowledge block for one chat turn. */
export function buildKnowledgeBlock(query: string, k = 6): KnowledgeBlock {
  const chunks = retrieve(query, k);
  const seen = new Map<string, RetrievedSource>();
  const parts: string[] = [];
  for (const c of chunks) {
    if (!seen.has(c.url)) seen.set(c.url, { url: c.url, title: c.title });
    parts.push(`[Source: ${c.url}]\n${c.text}`);
  }
  return {
    text: parts.length
      ? parts.join("\n\n")
      : "(no specific page matched this question)",
    sources: [...seen.values()],
  };
}
