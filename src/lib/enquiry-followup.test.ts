import { describe,it,expect,vi,beforeEach } from "vitest";
import { NextRequest } from "next/server";
const m=vi.hoisted(()=>({guard:vi.fn(),service:vi.fn(),set:vi.fn(),send:vi.fn()}));
vi.mock("@/lib/auth",()=>({requireAdmin:m.guard}));
vi.mock("@/lib/supabase-admin",()=>({getServiceClient:m.service}));
vi.mock("@upstash/redis",()=>({Redis:{fromEnv:()=>({set:m.set})}}));
vi.mock("@/lib/send-enquiry-email",()=>({sendEnquiryEmail:m.send}));
import { POST } from "@/app/api/admin/enquiry-followup/route";
const id="00000000-0000-4000-8000-000000000001";
function request(send=true,origin="https://example.com") {return new NextRequest("https://example.com/api/admin/enquiry-followup",{method:"POST",headers:{origin},body:JSON.stringify({leadId:id,send})});}
beforeEach(()=>{
 vi.resetAllMocks();m.guard.mockResolvedValue(null);
 for(const key of ["RESEND_API_KEY","UPSTASH_REDIS_REST_URL","UPSTASH_REDIS_REST_TOKEN"])vi.stubEnv(key,"test-only");
 const q={select:vi.fn(),eq:vi.fn(),single:vi.fn().mockResolvedValue({data:{id,email:"test@example.com",company:"Test Gym",source:"contact"},error:null}),update:vi.fn()};
 q.select.mockReturnValue(q);q.eq.mockReturnValue(q);q.update.mockReturnValue(q);m.service.mockReturnValue({from:()=>q});
 m.set.mockResolvedValue("OK");m.send.mockResolvedValue({ok:true,id:"message-id"});
});
describe("manual contextual follow-up",()=>{
 it("requires admin authentication",async()=>{m.guard.mockResolvedValue(new Response("Unauthorized",{status:401}));expect((await POST(request())).status).toBe(401);expect(m.service).not.toHaveBeenCalled();});
 it("rejects cross-origin requests",async()=>{expect((await POST(request(true,"https://other.example"))).status).toBe(403);expect(m.send).not.toHaveBeenCalled();});
 it("previews without reserving or sending",async()=>{const r=await POST(request(false));expect(r.status).toBe(200);expect((await r.json()).text).toContain("gym management");expect(m.set).not.toHaveBeenCalled();expect(m.send).not.toHaveBeenCalled();});
 it("blocks duplicate or uncertain prior attempts",async()=>{m.set.mockResolvedValue(null);expect((await POST(request())).status).toBe(409);expect(m.send).not.toHaveBeenCalled();});
 it("fails closed when deduplication is unavailable",async()=>{vi.stubEnv("UPSTASH_REDIS_REST_TOKEN","");expect((await POST(request())).status).toBe(503);expect(m.send).not.toHaveBeenCalled();});
 it("records provider acceptance without claiming delivery",async()=>{const r=await POST(request());expect(r.status).toBe(200);expect((await r.json()).message).toContain("Inbox delivery is not yet verified");expect(m.send).toHaveBeenCalledOnce();expect(m.set.mock.calls[0][2]).toEqual({nx:true});});
 it("retains the reservation on network uncertainty",async()=>{m.send.mockRejectedValue(new Error("network"));expect((await POST(request())).status).toBe(503);expect(m.set).toHaveBeenCalledOnce();});
});
