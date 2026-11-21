import { describe, expect, it } from "vitest";
import { buildChatLeadMessage } from "./chat-lead";
import { leadSchema } from "./validators";
import { parseAiraOutput } from "./aira-bot";

describe("chat handoff", () => {
  const base = { email: "buyer@example.com", source: "chat", page: "/" };
  it("rejects handoff without affirmative consent at the API boundary", () => {
    expect(leadSchema.safeParse(base).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, contactConsent: false }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, contactConsent: true }).success).toBe(true);
  });
  it("keeps a long conversation inside the API limit and preserves qualification", () => {
    const message = buildChatLeadMessage([{ role: "model", text: "Invented AI claim" }, { role: "user", text: "x".repeat(8000) }], "UK / GMT", "January");
    expect(message).toContain("UK / GMT");
    expect(message).toContain("January");
    expect(message).not.toContain("Invented AI claim");
    expect(leadSchema.safeParse({ ...base, contactConsent: true, message }).success).toBe(true);
  });
  it("does not block other existing form sources", () => {
    expect(leadSchema.safeParse({ ...base, source: "demo" }).success).toBe(true);
  });
  it("removes all internal capture markers", () => {
    expect(parseAiraOutput("[CAPTURE_LEAD]Hello[CAPTURE_LEAD]")).toEqual({ text: "Hello", captureLead: true });
  });
});
