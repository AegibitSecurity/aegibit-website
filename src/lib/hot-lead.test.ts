import { describe, expect, it } from "vitest";
import { classifyLead, type VisitorJourney } from "./hot-lead";

/**
 * Hot-lead classification tests. The classifier directly drives which
 * email template the founder receives. Wrong classification = wrong
 * urgency cue = lost conversion. The cases below cover the actual
 * production surface (every source enum value + the keyword set).
 */

const cold: VisitorJourney = {
  visitor_id: "v1",
  pages_viewed: ["/"],
  time_on_site_seconds: 5,
  scroll_depth_max: 10,
  behavior_score: 5,
  cta_clicks: [],
  experiment_exposures: [],
  visited_pricing: false,
  visited_alternatives: false,
  utm_source: null,
  utm_campaign: null,
  referrer: null,
  device: "desktop",
  country: null,
};

describe("classifyLead", () => {
  it("paymint_demo source is always hot", () => {
    expect(classifyLead({ source: "paymint_demo" })).toBe("hot");
  });

  it("demo source is hot", () => {
    expect(classifyLead({ source: "demo" })).toBe("hot");
  });

  it("voicecore_waitlist + aira_waitlist are hot", () => {
    expect(classifyLead({ source: "voicecore_waitlist" })).toBe("hot");
    expect(classifyLead({ source: "aira_waitlist" })).toBe("hot");
  });

  it("chat source is always hot (visitor explicitly handed over email after a conversation)", () => {
    expect(classifyLead({ source: "chat" })).toBe("hot");
  });

  it("contact source with no signal is warm", () => {
    expect(classifyLead({ source: "contact" })).toBe("warm");
  });

  it("waitlist source with no signal is warm", () => {
    expect(classifyLead({ source: "waitlist" })).toBe("warm");
  });

  it("intent keywords in message promote a warm source to hot", () => {
    expect(classifyLead({ source: "contact", message: "want to schedule a demo" })).toBe("hot");
    expect(classifyLead({ source: "contact", message: "Need a quote please" })).toBe("hot");
    expect(classifyLead({ source: "contact", message: "interested in pricing for 5 branches" })).toBe("hot");
    expect(classifyLead({ source: "contact", message: "wanting to evaluate paymint" })).toBe("hot");
  });

  it("non-intent message stays warm", () => {
    expect(classifyLead({ source: "contact", message: "general question about your blog" })).toBe("warm");
    expect(classifyLead({ source: "contact", message: "love what you're doing!" })).toBe("warm");
  });

  it("high-intent journey signal promotes warm source to hot", () => {
    const j: VisitorJourney = {
      ...cold,
      visited_pricing: true,
      cta_clicks: [{ cta_id: "navbar_book_demo", page: "/pricing" }],
    };
    expect(classifyLead({ source: "contact", journey: j })).toBe("hot");
  });

  it("alternatives visit + cta click is hot", () => {
    const j: VisitorJourney = {
      ...cold,
      visited_alternatives: true,
      cta_clicks: [{ cta_id: "hero_explore_products", page: "/" }],
    };
    expect(classifyLead({ source: "contact", journey: j })).toBe("hot");
  });

  it("very high behavior score alone is hot", () => {
    const j: VisitorJourney = { ...cold, behavior_score: 80 };
    expect(classifyLead({ source: "contact", journey: j })).toBe("hot");
  });

  it("behavior score 70 (just below threshold) stays warm without other signals", () => {
    const j: VisitorJourney = { ...cold, behavior_score: 70 };
    expect(classifyLead({ source: "contact", journey: j })).toBe("warm");
  });

  it("pricing visit alone (no CTA click) is NOT enough — stays warm", () => {
    const j: VisitorJourney = { ...cold, visited_pricing: true };
    expect(classifyLead({ source: "contact", journey: j })).toBe("warm");
  });
});
