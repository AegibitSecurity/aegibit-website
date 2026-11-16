import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ guard: vi.fn(), service: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.guard }));
vi.mock("@/lib/supabase-admin", () => ({ getServiceClient: mocks.service }));
import { GET } from "@/app/api/admin/growth/route";
function query(result: {count: number | null; error: unknown}) {
 const chain = { select: vi.fn(), in: vi.fn(), gte: vi.fn(), lt: vi.fn(), not: vi.fn(), then: (resolve: (r: typeof result) => unknown) => Promise.resolve(resolve(result)) };
 for (const method of [chain.select, chain.in, chain.gte, chain.lt, chain.not]) method.mockReturnValue(chain);
 return chain;
}
beforeEach(() => vi.resetAllMocks());
describe("growth API", () => {
 it("refuses unauthenticated access before reading the database", async () => {
  mocks.guard.mockResolvedValue(new Response("Unauthorized", {status:401}));
  expect((await GET()).status).toBe(401); expect(mocks.service).not.toHaveBeenCalled();
 });
 it("returns exact aggregate counts without personal records", async () => {
  mocks.guard.mockResolvedValue(null);
  const from = vi.fn();
  for (const count of [1234,12,9,2]) from.mockReturnValueOnce(query({count,error:null}));
  mocks.service.mockReturnValue({from});
  const response = await GET(); const body = await response.json();
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(body).toMatchObject({sessions:1234,capturedInquiries:12,attributedInquiries:9,qualifiedRecords:2,attributionCoverage:75,partial:false});
  expect(body).not.toHaveProperty("leads"); expect(body).not.toHaveProperty("visitors");
 });
 it("preserves unavailable metrics instead of reporting success with zeros", async () => {
  mocks.guard.mockResolvedValue(null); mocks.service.mockReturnValue({from:() => query({count:null,error:{message:"offline"}})});
  expect(await (await GET()).json()).toMatchObject({partial:true,sessions:null,capturedInquiries:null,attributionCoverage:null});
 });
 it("does not leak configuration errors", async () => {
  mocks.guard.mockResolvedValue(null); mocks.service.mockImplementation(() => { throw new Error("private configuration detail"); });
  const response = await GET(); expect(response.status).toBe(503); expect(await response.text()).not.toContain("private configuration detail");
 });
});
