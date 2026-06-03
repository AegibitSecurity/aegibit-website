/**
 * Shared "send a report" plumbing for /api/paymint-snapshot/email
 * and /api/mcp-scan/email.
 *
 * Two concerns kept separate from the route handlers so they're
 * unit-testable and so the two endpoints can't accidentally diverge
 * on the lead-write contract:
 *
 *   1. sendReportEmail(), Resend send with html + text + subject.
 *      No-throw: returns { ok, error? } so the route can decide
 *      what to surface.
 *
 *   2. writeReportLead(), INSERT into Supabase `leads` table with
 *      source="snapshot_export" or "scan_export". Mirrors what
 *      /api/leads writes for first-touch leads, minus the Resend
 *      confirmation (the visitor is about to receive a real report
 *, they don't also need a "we got your request" reply).
 */

import { getServiceClient } from "@/lib/supabase-admin";

export type ReportSource = "snapshot_export" | "scan_export";

export interface SendReportInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendReportEmail(
  input: SendReportInput,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "AEGIBIT <noreply@aegibit.com>",
      to: [input.to],
      replyTo: ["contact@aegibit.com"],
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    if (result.error) {
      return { ok: false, error: String(result.error.message ?? result.error) };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function writeReportLead(args: {
  email: string;
  source: ReportSource;
  page: string;
  summary: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        email: args.email,
        source: args.source,
        page: args.page,
        message: args.summary,
      })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
