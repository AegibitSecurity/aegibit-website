import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { airaChatTurn, type ChatMessage } from "@/lib/aira-bot";
import { checkRateLimit, chatLimiter } from "@/lib/rate-limiter";
import { GLOSSARY } from "@/content/glossary";

/**
 * Follow-up suggestions: when the answer is grounded in a glossary
 * term, offer that term's related concepts as next questions. Pure
 * content discovery, and it only fires from REAL retrieved sources, so
 * it never invents a topic we do not actually cover.
 */
function followUpSuggestions(
  sources: { url: string; title: string }[],
): { q: string; url: string }[] {
  const top = sources.find((s) => s.url.startsWith("/glossary/"));
  if (!top) return [];
  const slug = top.url.split("/").filter(Boolean).pop();
  const term = GLOSSARY.find((t) => t.slug === slug);
  if (!term) return [];
  return term.related
    .map((rslug) => GLOSSARY.find((t) => t.slug === rslug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 3)
    .map((t) => ({ q: `What is ${t.term}?`, url: `/glossary/${t.slug}` }));
}

/**
 * POST /api/chat
 *
 * The Aira chatbot endpoint. Public, no auth (it's a marketing-site
 * widget, every visitor uses it). Rate-limited per IP via Upstash so
 * a single attacker can't burn the Gemini free-tier budget for the
 * whole site.
 *
 * Graceful-degradation contract:
 *   - GROQ_API_KEY missing → return a canned "talk to AEGIBIT team"
 *     reply with captureLead=true. Frontend collects email and routes
 *     to /api/leads. The chat still feels alive.
 *   - Gemini 429 / 5xx / network error → same canned fallback.
 *   - Visitor exceeds rate limit → 429 with Retry-After header.
 *
 * The visitor never sees a raw error, every failure mode lands on
 * the same path: "let me connect you with a founder."
 */

interface ChatRequestBody {
  history?: ChatMessage[];
  message?: string;
}

// Single fallback reply used whenever Gemini is unreachable (missing
// key, rate-limit, network error, safety-block). Kept terse and on-
// brand so the visitor can't tell something failed, they just hit
// the founder-handoff path one turn earlier than expected.
const FALLBACK_REPLY =
  "Let me put you in touch with the AEGIBIT team directly. What's the best work email to reach you at?";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, retryAfter } = await checkRateLimit(chatLimiter, ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message ?? "").toString().trim();
  if (!message) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // Sanitize history: trust only the role/text shape, cap length so a
  // malicious client can't blow up our token budget.
  const history: ChatMessage[] = Array.isArray(body.history)
    ? body.history
        .filter((m) => m && (m.role === "user" || m.role === "model") && typeof m.text === "string")
        .map((m) => ({ role: m.role, text: m.text.slice(0, 2000) }))
        .slice(-12) // last 12 turns; enough context, bounded cost
    : [];

  const reply = await airaChatTurn({ history, userMessage: message });

  if (!reply.ok) {
    // Graceful fallback. The visitor never sees `reply.error`. The
    // capture-lead flow kicks in so the conversation still ends in a
    // useful place.
    return NextResponse.json({
      text: FALLBACK_REPLY,
      captureLead: true,
      degraded: true,
    });
  }

  const sources = reply.sources ?? [];
  return NextResponse.json({
    text: reply.text,
    captureLead: reply.captureLead,
    // Pages the answer was grounded in; the widget renders these as
    // titled "source" links so visitors can verify and click deeper.
    sources,
    // Honest trust signal: true only when the answer actually cites
    // knowledge-base pages. No fabricated confidence percentage, a
    // number we cannot truthfully compute would be worse than none.
    grounded: sources.length > 0,
    // Content-discovery follow-ups, derived from real related terms.
    suggestions: followUpSuggestions(sources),
  });
}
