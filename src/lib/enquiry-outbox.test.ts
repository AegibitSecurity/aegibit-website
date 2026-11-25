import {beforeEach,describe,it,expect,vi} from "vitest";
const m=vi.hoisted(()=>({get:vi.fn(),set:vi.fn(),zadd:vi.fn(),zrem:vi.fn(),del:vi.fn(),eval:vi.fn(),db:vi.fn(),ack:vi.fn(),team:vi.fn()}));
vi.mock("@upstash/redis",()=>({Redis:{fromEnv:()=>m}}));
vi.mock("./supabase-admin",()=>({getServiceClient:()=>({from:()=>({select:()=>({eq:()=>({maybeSingle:m.db})})})})}));
vi.mock("./send-enquiry-email",()=>({sendEnquiryEmail:m.ack}));
vi.mock("./notify-enquiry-team",()=>({notifyTeam:m.team}));
import {queueEnquiry,processEnquiry} from "./enquiry-outbox";
beforeEach(()=>{
 vi.resetAllMocks();for(const k of ["RESEND_API_KEY","UPSTASH_REDIS_REST_URL","UPSTASH_REDIS_REST_TOKEN"])vi.stubEnv(k,"test");
 m.set.mockResolvedValue("OK");m.get.mockResolvedValue({created:Date.now(),attempts:0,state:"pending"});m.db.mockResolvedValue({data:{id:"test",email:"test@example.com"},error:null});m.ack.mockResolvedValue({ok:true,id:"ack"});m.team.mockResolvedValue({ok:true,id:"team"});
});
describe("durable enquiry email queue",()=>{
 it("persists the job before making it runnable",async()=>{await queueEnquiry("test");expect(m.set).toHaveBeenCalledOnce();expect(m.zadd).toHaveBeenCalledOnce();expect(m.ack).not.toHaveBeenCalled();});
 it("never sends without a saved enquiry",async()=>{m.db.mockResolvedValue({data:null,error:null});await processEnquiry("test");expect(m.ack).not.toHaveBeenCalled();expect(m.team).not.toHaveBeenCalled();});
 it("sends both channels with stable idempotency keys",async()=>{expect(await processEnquiry("test")).toEqual({ok:true});expect(m.ack.mock.calls[0][1].idempotencyKey).toBe("enquiry:test:ack:v1");expect(m.team.mock.calls[0][0].idempotencyKey).toBe("enquiry:test:team:v1");expect(m.zrem).toHaveBeenCalled();});
 it("does not resend an accepted channel",async()=>{m.get.mockResolvedValue({created:Date.now(),attempts:1,state:"pending",acknowledgement:"ack"});await processEnquiry("test");expect(m.ack).not.toHaveBeenCalled();expect(m.team).toHaveBeenCalledOnce();});
 it("retains failed jobs for later retry",async()=>{m.ack.mockRejectedValue(new Error("network"));expect(await processEnquiry("test")).toEqual({ok:false});expect(m.zadd).toHaveBeenCalled();expect(m.zrem).not.toHaveBeenCalled();});
 it("stops uncertain retries before provider deduplication expires",async()=>{m.get.mockResolvedValue({created:Date.now()-86400000,firstAttempt:Date.now()-86400000,attempts:1,state:"pending"});await processEnquiry("test");expect(m.ack).not.toHaveBeenCalled();expect(m.set).toHaveBeenCalledWith("enquiry-outbox:v1:test",expect.objectContaining({state:"needs_review"}));});
 it("blocks concurrent workers",async()=>{m.set.mockResolvedValue(null);await processEnquiry("test");expect(m.db).not.toHaveBeenCalled();});
});
