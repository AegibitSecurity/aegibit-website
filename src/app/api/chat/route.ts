import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { airaChatTurn, type ChatMessage } from "@/lib/aira-bot";
import { checkRateLimit, chatLimiter } from "@/lib/rate-limiter";

/**
 * POST /api/chat
 *
 * The Aira chatbot endpoint. Public — no auth (it's a marketing-site
 * widget, every visitor uses it). Rate-limited per IP via Upstash so
 * a single attacker can't burn the Gemini free-tier budget for the
 * whole site.
 *
 * Graceful-degradation contract:
 *   - GEMINI_API_KEY missing → return a canned "talk to a founder"
 *     reply with captureLead=true. Frontend collects email and routes
 *     to /api/leads. The chat still feels alive.
 *   - Gemini 429 / 5xx / network error → same canned fallback.
 *   - Visitor exceeds rate limit → 429 with Retry-After header.
 *
 * The visitor never sees a raw error — every failure mode lands on
 * the same path: "let me connect you with a founder."
 */

interface ChatRequestBody {
  history?: ChatMessage[];
  message?: string;
}

const FALLBACK_REPLY =
  "Let me connect you with one of our founders directly — they'll get back to you within 24 hours. What's the best work email to reach you at?";

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

  return NextResponse.json({
    text: reply.text,
    captureLead: reply.captureLead,
  });
}
