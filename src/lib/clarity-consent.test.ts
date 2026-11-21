import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ consent: null as string | null, path: "/" }));
vi.mock("react", () => ({ useEffect: (fn: () => void) => fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => state.path }));
vi.mock("@/lib/consent", () => ({ useConsent: () => state.consent }));
import { ClarityAnalytics } from "@/components/shared/ClarityAnalytics";
beforeEach(() => {
 state.consent = null; state.path = "/";
 vi.stubGlobal("window", {});
 vi.stubGlobal("document", { getElementById: vi.fn(() => null), createElement: vi.fn(() => ({})), head: { appendChild: vi.fn() } });
});
describe("Clarity consent boundary", () => {
 it("does not load without consent", () => { ClarityAnalytics(); expect(document.createElement).not.toHaveBeenCalled(); });
 it("does not load on private routes even with consent", () => { state.consent="granted"; state.path="/dashboard/leads"; ClarityAnalytics(); expect(document.createElement).not.toHaveBeenCalled(); });
 it("queues analytics consent with ads denied before loading the supplied project", () => {
  state.consent="granted"; ClarityAnalytics();
  expect(window.clarity?.q?.[0]).toEqual(["consentv2", { analytics_Storage:"granted", ad_Storage:"denied" }]);
  expect(document.head.appendChild).toHaveBeenCalledWith(expect.objectContaining({src:"https://www.clarity.ms/tag/zh9bino7kd"}));
 });
 it("stops existing recording when consent is denied", () => { window.clarity=vi.fn<(...args: unknown[]) => void>(); state.consent="denied"; ClarityAnalytics(); expect(window.clarity).toHaveBeenCalledWith("stop"); });
});
