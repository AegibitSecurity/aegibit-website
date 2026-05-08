import { describe, expect, it } from "vitest";
import { buildGroqPayload, parseAiraOutput, type ChatMessage } from "./aira-bot";

/**
 * Pure-function tests for the Aira chatbot. We don't test the Groq
 * network call (that's an external service); we test the boundary
 * code that turns raw model output into the captureLead/text contract
 * the frontend depends on, plus the payload assembly so the system
 * prompt + history threading is correct AND the Gemini-vocabulary
 * "model" role translates to OpenAI-vocabulary "assistant" before
 * leaving the process.
 */

describe("parseAiraOutput", () => {
  it("strips a trailing CAPTURE_LEAD token and signals captureLead=true", () => {
    const out = parseAiraOutput("Sure — what's your work email?\n[CAPTURE_LEAD]");
    expect(out.text).toBe("Sure — what's your work email?");
    expect(out.captureLead).toBe(true);
  });

  it("strips an inline CAPTURE_LEAD token even without surrounding whitespace", () => {
    const out = parseAiraOutput("Drop your email here[CAPTURE_LEAD]");
    expect(out.text).toBe("Drop your email here");
    expect(out.captureLead).toBe(true);
  });

  it("trims whitespace after stripping the token", () => {
    const out = parseAiraOutput("Tell me your email.\n\n   [CAPTURE_LEAD]   \n");
    expect(out.text).toBe("Tell me your email.");
    expect(out.captureLead).toBe(true);
  });

  it("returns captureLead=false when the token is absent", () => {
    const out = parseAiraOutput("PayMint pricing starts at the Starter tier — see /pricing.");
    expect(out.text).toBe("PayMint pricing starts at the Starter tier — see /pricing.");
    expect(out.captureLead).toBe(false);
  });

  it("preserves multi-line responses", () => {
    const out = parseAiraOutput("Line 1.\n\nLine 2.\n\nLine 3.");
    expect(out.text).toBe("Line 1.\n\nLine 2.\n\nLine 3.");
    expect(out.captureLead).toBe(false);
  });
});

describe("buildGroqPayload", () => {
  const baseInput = {
    history: [] as ChatMessage[],
    userMessage: "What's PayMint?",
  };

  it("emits a Groq-shaped payload with the system prompt as the first message", () => {
    const payload = buildGroqPayload(baseInput) as { messages: { role: string; content: string }[] };
    expect(payload.messages[0].role).toBe("system");
    expect(payload.messages[0].content).toContain("AEGIBIT");
    expect(payload.messages[0].content).toContain("PayMint");
    expect(payload.messages[0].content).toContain("[CAPTURE_LEAD]");
  });

  it("appends the userMessage as the final 'user' content turn", () => {
    const payload = buildGroqPayload(baseInput) as { messages: { role: string; content: string }[] };
    const last = payload.messages[payload.messages.length - 1];
    expect(last.role).toBe("user");
    expect(last.content).toBe("What's PayMint?");
  });

  it("translates Gemini's 'model' role to OpenAI's 'assistant' role in history", () => {
    const payload = buildGroqPayload({
      history: [
        { role: "user",  text: "Hi" },
        { role: "model", text: "Hello — how can I help?" },
      ],
      userMessage: "Tell me about pricing.",
    }) as { messages: { role: string; content: string }[] };

    // Index 0 is system, then history (user, assistant), then final user.
    expect(payload.messages.map((m) => m.role)).toEqual([
      "system",
      "user",
      "assistant", // <-- translated from "model"
      "user",
    ]);
    expect(payload.messages[1].content).toBe("Hi");
    expect(payload.messages[2].content).toBe("Hello — how can I help?");
    expect(payload.messages[3].content).toBe("Tell me about pricing.");
  });

  it("includes a stop sequence for CAPTURE_LEAD so we don't waste tokens", () => {
    const payload = buildGroqPayload(baseInput) as { stop?: string[] };
    expect(payload.stop).toContain("[CAPTURE_LEAD]");
  });

  it("caps max_tokens (Aira is a guide, not a chatty bot)", () => {
    const payload = buildGroqPayload(baseInput) as { max_tokens?: number };
    expect(payload.max_tokens).toBeLessThanOrEqual(500);
  });

  it("temperature is moderate — creative tone, low hallucination risk", () => {
    const payload = buildGroqPayload(baseInput) as { temperature?: number };
    const t = payload.temperature ?? 1;
    expect(t).toBeGreaterThanOrEqual(0.2);
    expect(t).toBeLessThanOrEqual(0.6);
  });

  it("specifies a model name (so a future provider config bug fails loudly)", () => {
    const payload = buildGroqPayload(baseInput) as { model?: string };
    expect(typeof payload.model).toBe("string");
    expect(payload.model).toBeTruthy();
  });
});
