import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/**
 * /api/admin/health — operator pipeline diagnostic.
 *
 * Auth: Bearer token must equal DASHBOARD_SECRET env var. Single endpoint
 * to verify Supabase connectivity, Resend connectivity, recent lead
 * activity, and email send capability — without polluting production
 * logs with test traffic. Use this anytime the lead funnel feels off.
 *
 * Optional query params:
 *   ?test_email=you@example.com   → triggers a real Resend send to that
 *                                   address using the same `from` and
 *                                   transport as production lead emails.
 *                                   Shows the unfiltered Resend response
 *                                   (success or full error JSON) so
 *                                   misconfigurations surface in seconds.
 *
 * Curl:
 *   curl -H "Authorization: Bearer $DASHBOARD_SECRET" \
 *     "https://www.aegibit.com/api/admin/health?test_email=you@example.com"
 */
export async function GET(req: NextRequest) {
  // ── Auth gate ──────────────────────────────────────────────────────
  const auth = req.headers.get("authorization");
  if (!process.env.DASHBOARD_SECRET || auth !== `Bearer ${process.env.DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const testEmail = url.searchParams.get("test_email");

  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    region: process.env.VERCEL_REGION ?? "unknown",
  };

  // ── Env var presence (don't leak values) ──────────────────────────
  report.env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    DASHBOARD_SECRET: !!process.env.DASHBOARD_SECRET,
  };

  // ── Supabase health ────────────────────────────────────────────────
  try {
    const supabase = getServiceClient();
    const { data, error, count } = await supabase
      .from("leads")
      .select("id, email, source, created_at, status", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      report.supabase = { ok: false, error: error.message };
    } else {
      report.supabase = {
        ok: true,
        total_leads: count,
        recent_5: data?.map((d) => ({
          email: d.email,
          source: d.source,
          status: d.status,
          created_at: d.created_at,
        })),
      };
    }
  } catch (err) {
    report.supabase = { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  // ── Resend live send test (only if test_email provided) ───────────
  if (testEmail) {
    if (!process.env.RESEND_API_KEY) {
      report.resend = { ok: false, error: "RESEND_API_KEY env var not set" };
    } else {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const result = await resend.emails.send({
          from: "AEGIBIT <noreply@aegibit.com>",
          to: [testEmail],
          replyTo: ["contact@aegibit.com"],
          subject: "AEGIBIT health check — pipeline OK",
          html: `<div style="font-family:sans-serif;padding:24px;background:#0a0a0a;color:#fff;border-radius:8px;">
            <h2 style="color:#F97316;margin:0 0 12px;">✓ Pipeline operational</h2>
            <p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0;">
              This message confirms that the Resend transactional pipeline from
              www.aegibit.com is healthy. Sent at ${new Date().toISOString()}.
            </p>
          </div>`,
        });
        if (result.error) {
          report.resend = {
            ok: false,
            from: "noreply@aegibit.com",
            to: testEmail,
            error: result.error,
          };
        } else {
          report.resend = {
            ok: true,
            from: "noreply@aegibit.com",
            to: testEmail,
            id: result.data?.id,
          };
        }
      } catch (err) {
        report.resend = {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }
  } else {
    report.resend = {
      ok: "skipped",
      hint: "append ?test_email=you@example.com to fire a live Resend test",
    };
  }

  return NextResponse.json(report, { status: 200 });
}
