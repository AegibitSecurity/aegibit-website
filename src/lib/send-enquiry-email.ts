import { Resend } from "resend";
import { composeEnquiryEmail, type EnquiryContext } from "./contextual-enquiry";
export async function sendEnquiryEmail(data: EnquiryContext, options?: { followup?: boolean; idempotencyKey?: string }): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "Email service is not configured" };
  const content = composeEnquiryEmail(data, options?.followup);
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "AEGIBIT <noreply@aegibit.com>", to: [data.email], replyTo: ["contact@aegibit.com"], ...content,
  }, options?.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined);
  if (result.error || !result.data?.id) return { ok: false, error: "Email provider did not accept the message" };
  return { ok: true, id: result.data.id };
}
