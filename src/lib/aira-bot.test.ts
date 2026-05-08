import { describe, expect, it } from "vitest";
import { buildGeminiPayload, parseAiraOutput, type ChatMessage } from "./aira-bot";

/**
 * Pure-function tests for the Aira chatbot. We don't test the
 * Gemini network call (that's an external service); we test the
 * boundary code that turns raw model output into the
 * captureLead/text contract the frontend depends on, plus the
 * payload assembly so the system prompt + history + user message
 * thread correctly.
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

describe("buildGeminiPayload", () => {
  const baseInput = {
    history: [] as ChatMessage[],
    userMessage: "What's PayMint?",
  };

  it("emits a systemInstruction with the bot prompt", () => {
    const payload = buildGeminiPayload(baseInput) as { systemInstruction?: { parts?: { text?: string }[] } };
    const text = payload.systemInstruction?.parts?.[0]?.text ?? "";
    expect(text).toContain("AEGIBIT");
    expect(text).toContain("PayMint");
    expect(text).toContain("[CAPTURE_LEAD]");
  });

  it("appends the userMessage as the final 'user' content turn", () => {
    const payload = buildGeminiPayload(baseInput) as { contents: { role: string; parts: { text: string }[] }[] };
    const last = payload.contents[payload.contents.length - 1];
    expect(last.role).toBe("user");
    expect(last.parts[0].text).toBe("What's PayMint?");
  });

  it("threads conversation history with correct roles before the user message", () => {
    const payload = buildGeminiPayload({
      history: [
        { role: "user",  text: "Hi" },
        { role: "model", text: "Hello — how can I help?" },
      ],
      userMessage: "Tell me about pricing.",
    }) as { contents: { role: string; parts: { text: string }[] }[] };

    expect(payload.contents.map((c) => c.role)).toEqual(["user", "model", "user"]);
    expect(payload.contents[0].parts[0].text).toBe("Hi");
    expect(payload.contents[1].parts[0].text).toBe("Hello — how can I help?");
    expect(payload.contents[2].parts[0].text).toBe("Tell me about pricing.");
  });

  it("includes stopSequences for CAPTURE_LEAD so we don't waste tokens", () => {
    const payload = buildGeminiPayload(baseInput) as {
      generationConfig?: { stopSequences?: string[] };
    };
    expect(payload.generationConfig?.stopSequences).toContain("[CAPTURE_LEAD]");
  });

  it("caps maxOutputTokens (Aira is a guide, not a chatty bot)", () => {
    const payload = buildGeminiPayload(baseInput) as {
      generationConfig?: { maxOutputTokens?: number };
    };
    expect(payload.generationConfig?.maxOutputTokens).toBeLessThanOrEqual(500);
  });

  it("temperature is moderate — creative tone, low hallucination risk", () => {
    const payload = buildGeminiPayload(baseInput) as {
      generationConfig?: { temperature?: number };
    };
    const t = payload.generationConfig?.temperature ?? 1;
    expect(t).toBeGreaterThanOrEqual(0.2);
    expect(t).toBeLessThanOrEqual(0.6);
  });
});
