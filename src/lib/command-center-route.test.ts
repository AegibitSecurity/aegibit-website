import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ guard: vi.fn(), service: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.guard }));
vi.mock("@/lib/supabase-admin", () => ({ getServiceClient: mocks.service }));
import { GET } from "@/app/api/admin/command-center/route";
function query(result: object) {
  const chain = { select: vi.fn(), eq: vi.fn(), in: vi.fn(), order: vi.fn(), limit: vi.fn(), then: (resolve: (r: object) => unknown) => Promise.resolve(resolve(result)) };
  for (const method of [chain.select, chain.eq, chain.in, chain.order, chain.limit]) method.mockReturnValue(chain);
  return chain;
}
beforeEach(() => vi.resetAllMocks());
describe("command center privacy and missing data", () => {
 it("does not query records without admin authentication", async () => {
  mocks.guard.mockResolvedValue(new Response("Unauthorized", {status:401}));
  expect((await GET()).status).toBe(401); expect(mocks.service).not.toHaveBeenCalled();
 });
 it("requests only non-personal activity fields and prevents shared caching", async () => {
  mocks.guard.mockResolvedValue(null);
  const pending = query({count:3,error:null}); const recent = query({data:[],error:null});
  mocks.service.mockReturnValue({from:vi.fn().mockReturnValueOnce(pending).mockReturnValueOnce(recent)});
  const response = await GET();
  expect(recent.select).toHaveBeenCalledWith("id, source, status, created_at");
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(await response.json()).toMatchObject({pending:3,recent:[],partial:false});
 });
 it("preserves unavailable data separately from an empty queue", async () => {
  mocks.guard.mockResolvedValue(null); mocks.service.mockReturnValue({from:()=>query({count:null,data:null,error:{message:"failure"}})});
  expect(await (await GET()).json()).toMatchObject({pending:null,recent:null,partial:true});
 });
 it("does not expose configuration details", async () => {
  mocks.guard.mockResolvedValue(null); mocks.service.mockImplementation(()=>{throw new Error("secret")});
  const response=await GET(); expect(response.status).toBe(503); expect(await response.text()).not.toContain("secret");
 });
});
