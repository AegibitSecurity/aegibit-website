"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { buildChatLeadMessage } from "@/lib/chat-lead";
import { track } from "@/lib/track";
import type { ChatMessage } from "@/lib/aira-bot";

/**
 * Aira chat widget, floating bottom-right launcher → expandable
 * conversation panel. Mounted via MarketingChrome on every public
 * marketing surface.
 *
 * Conversation state:
 *   - Held in component state. Lost on full page reload, that's fine
 *     for v1; the visitor's intent rarely survives a refresh anyway.
 *   - Last 12 turns sent to /api/chat with each request. Server caps
 *     this again defensively.
 *
 * Lead-capture protocol:
 *   1. Bot replies with `captureLead: true` (it emitted [CAPTURE_LEAD]).
 *   2. Input mode flips from free-text to email-only.
 *   3. Visitor submits email → POST /api/leads with source="chat" and
 *      a conversation snippet as `message`. That routes through last
 *      night's hot-lead pipeline (Resend founder email + Slack push).
 *   4. Confirmation message added to the chat. Widget stays open.
 *
 * Graceful failures:
 *   - /api/chat 429 → "give me a moment" message, retry possible
 *   - /api/chat 500 → escalate to capture mode immediately
 *   - /api/leads error → "couldn't save email, please reach out at
 *      contact@aegibit.com" inline. Visitor still gets the address.
 *
 * Telemetry (via existing track helper):
 *   - chat_open, fired once per session when widget is opened
 *   - chat_message, fired on each user message sent
 *   - chat_lead, fired on successful email capture
 */

type Mode = "chat" | "capture" | "captured";

interface UiMessage extends ChatMessage {
  /** Stable key across re-renders for AnimatePresence. */
  id: string;
  /** Pages the reply was grounded in (RAG citations), rendered as titled links. */
  sources?: { url: string; title: string }[];
  /** True when the answer cites knowledge-base pages (honest trust badge). */
  grounded?: boolean;
  /** Follow-up questions from related knowledge, for content discovery. */
  suggestions?: { q: string; url: string }[];
}

const GREETING: UiMessage = {
  id: "g0",
  role: "model",
  text:
    "I'm Aira, AEGIBIT's AI consultant. Tell me what's slowing your business down, expenses, sales, attendance, billing, anything, and I'll point you to the right solution. Or ask me about any AEGIBIT product.",
};

/**
 * The empty-state sales funnel. One option per flagship offering, each
 * leading with the product name (brand positioning) plus its sharpest
 * outcome hook. Tapping one fires a high-intent question so Aira's
 * first answer is a targeted pitch for that product, top of funnel to
 * qualified conversation in one tap.
 */
const FUNNEL = [
  { tag: "Trust", hook: "Registration, security and how we handle data", send: "How can I verify AEGIBIT and understand your website security and privacy?" },
  {
    tag: "Cortex",
    hook: "Explore CRM and workforce workflows",
    send: "My team wastes hours on CRM data entry and follow-ups. How does AEGIBIT Cortex fix that?",
  },
  {
    tag: "PayMint",
    hook: "Branch expenses and approvals in one workflow",
    send: "We lose track of expenses across our branches. How does PayMint make them audit-ready?",
  },
  {
    tag: "LeadSync",
    hook: "Track dealership enquiries and delivery steps",
    send: "Our dealership loses leads between enquiry and delivery. How does LeadSync stop that?",
  },
  {
    tag: "Vestiq",
    hook: "Boutique billing and customer dues, sorted",
    send: "I run a boutique and billing plus customer dues are a mess. What does Vestiq do?",
  },
  {
    tag: "Web Studio",
    hook: "Explain your offer with a business website",
    send: "We need a premium website that actually converts visitors. What does AEGIBIT offer?",
  },
  {
    tag: "Pricing",
    hook: "Straight numbers, or book a live demo",
    send: "Give me a quick overview of AEGIBIT pricing and how to book a demo.",
  },
] as const;

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [openedOnce, setOpenedOnce] = useState(false);
  const [messages, setMessages]   = useState<UiMessage[]>([GREETING]);
  const [input, setInput]         = useState("");
  const [mode, setMode]           = useState<Mode>("chat");
  const [busy, setBusy]           = useState(false);
  const [contactConsent, setContactConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [timeline, setTimeline] = useState("");
  const scrollRef                 = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever a new message lands.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, open]);

  function openWidget() {
    setOpen(true);
    if (!openedOnce) {
      setOpenedOnce(true);
      track("chat_open");
    }
  }

  function appendMessage(
    role: ChatMessage["role"],
    text: string,
    extra?: {
      sources?: { url: string; title: string }[];
      grounded?: boolean;
      suggestions?: { q: string; url: string }[];
    },
  ) {
    setMessages((m) => [...m, { id: newId(), role, text, ...extra }]);
  }

  async function sendChatTurn(userText: string) {
    if (busy) return;
    setBusy(true);
    appendMessage("user", userText);
    track("chat_message", { length: userText.length });

    // Build the history to send: everything BEFORE the message we
    // just appended (that goes as the userMessage param).
    const history = messages.map(({ role, text }) => ({ role, text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: userText }),
      });
      if (res.status === 429) {
        appendMessage(
          "model",
          "Give me a few seconds, getting more questions than usual. Try again shortly.",
        );
        return;
      }
      if (!res.ok) throw new Error("Chat unavailable");
      const data = await res.json();
      const replyText = (data.text as string | undefined) ?? "";
      const sources = Array.isArray(data.sources)
        ? (data.sources as { url: string; title: string }[]).slice(0, 3)
        : undefined;
      const suggestions = Array.isArray(data.suggestions)
        ? (data.suggestions as { q: string; url: string }[]).slice(0, 3)
        : undefined;
      appendMessage(
        "model",
        replyText ||
          "Let me put you in touch with the AEGIBIT team directly. What's the best work email to reach you?",
        { sources, grounded: Boolean(data.grounded), suggestions },
      );
      if (data.captureLead) setMode("capture");
    } catch {
      appendMessage(
        "model",
        "Connection hiccup. If you'd like the AEGIBIT team to reach out directly, drop your work email here.",
      );
      setMode("capture");
    } finally {
      setBusy(false);
    }
  }

  async function submitLead(email: string) {
    setBusy(true);

    const message = buildChatLeadMessage(messages, country, timeline);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "chat",
          company: company.trim(),
          contactConsent,
          page: typeof window !== "undefined" ? window.location.pathname : "/",
          message,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("chat_lead");
      appendMessage(
        "model",
        "Your enquiry has been saved for the AEGIBIT team. You can also email contact@aegibit.com. Anything else I can help you explore?",
      );
      setInput("");
      setMode("captured");
    } catch {
      appendMessage(
        "model",
        "Something hiccupped on our side, please reach out directly at contact@aegibit.com. Sorry about that.",
      );
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    if (mode === "capture") {
      if (!contactConsent) return;
      if (!isValidEmail(text)) {
        appendMessage(
          "model",
          "That doesn't look right, mind double-checking the email?",
        );
        return;
      }
      void submitLead(text);
      return;
    }

    setInput("");
    void sendChatTurn(text);
  }

  return (
    <>
      {/* Launcher, visible when widget is closed. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 1.5 }}
            onClick={openWidget}
            aria-label="Open chat with Aira"
            className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 px-4 py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold shadow-[0_8px_30px_rgba(249,115,22,0.4)] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Aira</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile launcher, icon-only floating button. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 1.5 }}
            onClick={openWidget}
            aria-label="Open chat with Aira"
            className="fixed bottom-20 right-4 z-50 md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-[#F97316] text-white shadow-[0_8px_30px_rgba(249,115,22,0.4)]"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel, visible when widget is open. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[400px] h-[calc(100vh-6rem)] max-h-[600px] flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.97)] backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F97316]" />
                </span>
                <span className="text-white text-sm font-semibold">Aira</span>
                <span className="text-[#52525B] text-xs">· AI assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-[#52525B] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#F97316] text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-[#E4E4E7] border border-[rgba(255,255,255,0.06)]"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {m.text}
                    {m.role === "model" && m.grounded && (
                      <span className="flex items-center gap-1.5 mt-2 text-[10px] text-[#10B981]">
                        <ShieldCheck className="w-3 h-3" />
                        Related AEGIBIT page
                      </span>
                    )}
                    {m.sources && m.sources.length > 0 && (
                      <span className="block mt-2 pt-2 border-t border-[rgba(255,255,255,0.08)] space-y-1">
                        <span className="block text-[9px] uppercase tracking-[0.12em] text-[#52525B] mb-1">
                          Sources
                        </span>
                        {m.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            className="flex items-start gap-1.5 group"
                          >
                            <span className="text-[11px] leading-tight">📘</span>
                            <span className="min-w-0">
                              <span className="block text-[11px] leading-tight text-[#FDBA74] group-hover:underline truncate">
                                {s.title || s.url}
                              </span>
                              <span className="block text-[9px] text-[#52525B] truncate">{s.url}</span>
                            </span>
                          </a>
                        ))}
                      </span>
                    )}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <span className="block mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                        <span className="block text-[9px] uppercase tracking-[0.12em] text-[#52525B] mb-1.5">
                          You might also ask
                        </span>
                        {m.suggestions.map((sug) => (
                          <button
                            key={sug.url}
                            onClick={() => void sendChatTurn(sug.q)}
                            className="block w-full text-left text-[11px] text-[#A1A1AA] hover:text-white mb-1 transition-colors"
                          >
                            <span className="text-[#F97316]">&rsaquo;</span> {sug.q}
                          </button>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 1 && mode === "chat" && !busy && (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#52525B] px-1">
                    What can we solve for you?
                  </p>
                  {FUNNEL.map((f) => (
                    <button
                      key={f.tag}
                      onClick={() => void sendChatTurn(f.send)}
                      className="group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(249,115,22,0.45)] hover:bg-[rgba(249,115,22,0.06)] transition-colors"
                    >
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] text-[#F97316] border border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.08)]">
                        {f.tag}
                      </span>
                      <span className="flex-1 text-xs text-[#D4D4D8] group-hover:text-white transition-colors">
                        {f.hook}
                      </span>
                      <span className="text-[#52525B] group-hover:text-[#F97316] transition-colors text-sm">
                        &rsaquo;
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2">
                    <Loader2 className="w-4 h-4 text-[#A1A1AA] animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 py-2 text-xs text-zinc-300 border-t border-white/10">
              AI replies can be mistaken. Do not share confidential data. Chat text is processed by our AI provider. <a href="/privacy" className="text-orange-300 underline">Privacy</a> · <a href="/security" className="text-orange-300 underline">Trust &amp; security</a>
              {mode !== "capture" && <button type="button" disabled={busy} onClick={() => { setMode("capture"); setInput(""); }} className="block mt-2 text-orange-300 underline">Request a human follow-up</button>}
            </div>
            <form onSubmit={onSubmit} className="border-t border-[rgba(255,255,255,0.06)] p-3">
              {mode === "capture" && <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                <p className="text-sm text-white">Send your project enquiry</p>
                <input aria-label="Company (optional)" placeholder="Company (optional)" value={company} onChange={e => setCompany(e.target.value)} maxLength={100} className="w-full rounded bg-zinc-900 p-2 text-sm text-white" />
                <input aria-label="Country or time zone (optional)" placeholder="Country / time zone (optional)" value={country} onChange={e => setCountry(e.target.value)} maxLength={100} className="w-full rounded bg-zinc-900 p-2 text-sm text-white" />
                <input aria-label="Target date (optional)" placeholder="Target date (optional)" value={timeline} onChange={e => setTimeline(e.target.value)} maxLength={100} className="w-full rounded bg-zinc-900 p-2 text-sm text-white" />
                <label className="flex items-start gap-2 text-xs text-zinc-300"><input type="checkbox" checked={contactConsent} onChange={e => setContactConsent(e.target.checked)} required />I agree to share my questions and these details with AEGIBIT for a reply to this enquiry. This does not subscribe me to marketing emails.</label>
                <button type="button" onClick={() => { setMode("chat"); setInput(""); }} className="text-xs text-orange-300 underline">Continue chatting instead</button>
              </div>}
              <div className="flex items-center gap-2">
                <input
                  aria-label={mode === "capture" ? "Work email" : "Message to Aira"}
                  maxLength={mode === "capture" ? 200 : 2000}
                  type={mode === "capture" ? "email" : "text"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode === "capture"
                      ? "your@company.com"
                      : mode === "captured"
                        ? "Ask anything else…"
                        : "Type a message…"
                  }
                  disabled={busy}
                  className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(249,115,22,0.5)] rounded-md px-3 py-2 text-sm text-white placeholder:text-[#52525B] outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim() || (mode === "capture" && !contactConsent)}
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-white transition-colors"
                  aria-label={mode === "capture" ? "Submit email" : "Send message"}
                >
                  {mode === "capture" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              {mode === "capture" && (
                <p className="text-[11px] text-[#52525B] mt-2">
                  Submit to send your enquiry for human review. Pricing and delivery are agreed with the team.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
