import { describe, it, expect, vi, afterEach } from "vitest";
const mocks = vi.hoisted(() => ({ consent: vi.fn(), state: vi.fn() }));
vi.mock("@/lib/consent", () => ({ hasAnalyticsConsent: mocks.consent }));
vi.mock("@/stores/visitor-store", () => ({ useVisitorStore: { getState: mocks.state } }));
import { track } from "./track";
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
describe("telemetry consent", () => {
 it("does not send when a tracked visitor later declines", () => {
  const fetch = vi.fn(); vi.stubGlobal("window", {location:{pathname:"/contact"}}); vi.stubGlobal("fetch",fetch);
  mocks.consent.mockReturnValue(false); mocks.state.mockReturnValue({visitorId:"existing-id"});
  track("contact_step_view",{step:2}); expect(fetch).not.toHaveBeenCalled(); expect(mocks.state).not.toHaveBeenCalled();
 });
 it("sends safe event data when consent and visitor identity are present", () => {
  const fetch = vi.fn().mockResolvedValue({}); vi.stubGlobal("window", {location:{pathname:"/contact"}}); vi.stubGlobal("fetch",fetch);
  mocks.consent.mockReturnValue(true); mocks.state.mockReturnValue({visitorId:"existing-id"});
  track("contact_validation_error",{step:1,fields:["email"]});
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({visitorId:"existing-id",eventType:"contact_validation_error",eventData:{step:1,fields:["email"]},page:"/contact"});
 });
});
