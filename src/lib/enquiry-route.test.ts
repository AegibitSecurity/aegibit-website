import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ insert: vi.fn(), service: vi.fn(), after: vi.fn(), guard: vi.fn(), send: vi.fn(), slack: vi.fn(), journey: vi.fn() }));
vi.mock("next/server", async (original) => ({ ...await original<typeof import("next/server")>(), after: mocks.after }));
vi.mock("@/lib/supabase-admin", () => ({ getServiceClient: mocks.service }));
vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.guard }));
vi.mock("@/lib/rate-limiter", () => ({ leadLimiter: {}, checkRateLimit: async () => ({ allowed: true }) }));
vi.mock("@/lib/hot-lead", () => ({ fetchVisitorJourney: mocks.journey, classifyLead: () => "warm", renderJourneyHtml: () => "" }));
vi.mock("@/lib/slack-hot-lead", () => ({ notifySlackLead: mocks.slack }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));
import { POST, GET } from "@/app/api/leads/route";
import { POST as contact } from "@/app/api/contact/route";
const request = (body: unknown) => new NextRequest("https://example.com/api/leads", { method: "POST", body: JSON.stringify(body) });
const lead = { email: "test@example.com", name: "Test", source: "contact", page: "/contact", message: "Test enquiry only" };
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Unexpected external request in unit test"); }));
  vi.clearAllMocks();
  vi.stubEnv("RESEND_API_KEY", "test-only");
  mocks.service.mockReturnValue({ from: () => ({ insert: mocks.insert }) });
  mocks.insert.mockResolvedValue({ error: null });
  mocks.journey.mockResolvedValue(null);
  mocks.send.mockResolvedValue({ data: { id: "test-message" }, error: null });
  mocks.slack.mockResolvedValue(false);
});
describe("enquiry persistence and notifications", () => {
  it("acknowledges saved enquiries before running notifications", async () => {
    const response = await POST(request(lead));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
    expect(mocks.insert).toHaveBeenCalledOnce();
    expect(mocks.send).not.toHaveBeenCalled();
    expect(mocks.after).toHaveBeenCalledOnce();
    await mocks.after.mock.calls[0][0]();
    expect(mocks.send).toHaveBeenCalledTimes(2);
  });
  it("does not acknowledge or notify an enquiry that failed to save", async () => {
    mocks.insert.mockResolvedValue({ error: { code: "offline" } });
    expect((await POST(request(lead))).status).toBe(500);
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it("does not send duplicate notifications", async () => {
    mocks.insert.mockResolvedValue({ error: { code: "23505" } });
    expect(await (await POST(request(lead))).json()).toEqual({ ok: true, duplicate: true });
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it("isolates notification failure after persistence", async () => {
    mocks.send.mockResolvedValue({ error: { name: "validation_error" } });
    mocks.slack.mockRejectedValue(new Error("offline"));
    expect((await POST(request(lead))).status).toBe(201);
    await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined();
  });
  it("requires authentication before retrieving private enquiries", async () => {
    mocks.guard.mockResolvedValue(new Response("Unauthorized", { status: 401 }));
    expect((await GET()).status).toBe(401);
    expect(mocks.service).not.toHaveBeenCalled();
  });
  it("logs a rejected legacy contact notification without losing the saved enquiry", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.send.mockResolvedValue({ error: { name: "validation_error" } });
    expect((await contact(request(lead))).status).toBe(201);
    expect(mocks.send).not.toHaveBeenCalled();
    await mocks.after.mock.calls[0][0]();
    expect(log).toHaveBeenCalledWith("[email][contact] provider rejected notification", "validation_error");
    log.mockRestore();
  });
});
