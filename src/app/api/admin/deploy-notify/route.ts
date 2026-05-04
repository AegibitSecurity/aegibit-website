import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/admin/deploy-notify — Aira's "I just shipped X" notifier.
 *
 * Auth: Bearer token must equal DASHBOARD_SECRET env var.
 *
 * Aira (the autonomous co-founder agent) calls this endpoint after each
 * meaningful production deploy so the human founders get a clean,
 * branded summary email instead of having to dig through Vercel logs.
 *
 * Email is sent via Resend to every address in TEAM_NOTIFY_EMAILS env var.
 *
 * Body shape (POST JSON):
 *   {
 *     "title":     "string — short ship label",
 *     "category":  "feature" | "fix" | "content" | "infra" | "ops" | "security",
 *     "summary":   "1-3 sentences — what shipped and why",
 *     "impact":    "1-2 sentences — expected business effect",
 *     "commit":    "git short SHA",
 *     "urls":      [{ "label": "name", "url": "/path" }, ...]
 *     "nextMove":  "optional — what Aira is building next"
 *   }
 */

interface DeployNotifyBody {
  title: string;
  category: "feature" | "fix" | "content" | "infra" | "ops" | "security";
  summary: string;
  impact?: string;
  commit?: string;
  urls?: { label: string; url: string }[];
  nextMove?: string;
}

const CATEGORY_META: Record<DeployNotifyBody["category"], { label: string; color: string }> = {
  feature:  { label: "FEATURE",  color: "#F97316" },
  fix:      { label: "FIX",      color: "#10B981" },
  content:  { label: "CONTENT",  color: "#A855F7" },
  infra:    { label: "INFRA",    color: "#60A5FA" },
  ops:      { label: "OPS",      color: "#F59E0B" },
  security: { label: "SECURITY", color: "#EF4444" },
};

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────
  const auth = req.headers.get("authorization");
  if (!process.env.DASHBOARD_SECRET || auth !== `Bearer ${process.env.DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Validate body ────────────────────────────────────────────────
  let body: Partial<DeployNotifyBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title || !body.category || !body.summary) {
    return NextResponse.json(
      { error: "Missing required fields: title, category, summary" },
      { status: 400 },
    );
  }
  if (!CATEGORY_META[body.category]) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${Object.keys(CATEGORY_META).join(", ")}` },
      { status: 400 },
    );
  }

  // ── Recipients (multi-recipient, env-driven) ─────────────────────
  const recipients = (process.env.TEAM_NOTIFY_EMAILS ?? "contact@aegibit.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  // ── Build email ──────────────────────────────────────────────────
  const cat = CATEGORY_META[body.category];
  const subject = `🛡️  [Aira ship] ${body.title}`;

  const urlListHtml = (body.urls ?? [])
    .map(
      (u) => `
        <tr>
          <td style="padding:6px 0;">
            <a href="https://www.aegibit.com${u.url}" style="color:#F97316;text-decoration:none;font-size:13px;">
              ${escape(u.label)} →
            </a>
            <div style="color:#52525B;font-size:11px;font-family:monospace;margin-top:2px;">
              www.aegibit.com${escape(u.url)}
            </div>
          </td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:32px 16px;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#0A0A0A;color:#E4E4E7;padding:36px 32px;border-radius:14px;border:1px solid rgba(255,255,255,0.06);">
    <!-- Header / brand -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="width:32px;height:32px;border-radius:7px;background:#000;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(249,115,22,0.4);">
        <span style="color:#F97316;font-size:18px;font-weight:700;">✓</span>
      </div>
      <div>
        <div style="font-size:14px;font-weight:300;letter-spacing:0.18em;">
          <span style="color:#fff;">AEGI</span><span style="color:#F97316;">BIT</span>
        </div>
        <div style="color:#52525B;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin-top:2px;">
          Aira ship notification
        </div>
      </div>
    </div>

    <!-- Category pill -->
    <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:${cat.color}20;border:1px solid ${cat.color}50;color:${cat.color};font-size:10px;font-weight:700;letter-spacing:0.15em;margin-bottom:16px;">
      ${cat.label}
    </div>

    <!-- Title -->
    <h1 style="font-size:22px;font-weight:300;color:#fff;margin:0 0 16px;letter-spacing:-0.01em;line-height:1.25;">
      ${escape(body.title)}
    </h1>

    <!-- Summary -->
    <p style="font-size:14px;color:#A1A1AA;line-height:1.7;margin:0 0 24px;">
      ${escape(body.summary)}
    </p>

    ${
      body.impact
        ? `<div style="background:#0D0D0D;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;margin-bottom:24px;">
            <div style="font-size:10px;color:#F97316;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:6px;font-weight:600;">
              Expected Impact
            </div>
            <div style="font-size:13px;color:#E4E4E7;line-height:1.6;">
              ${escape(body.impact)}
            </div>
          </div>`
        : ""
    }

    ${
      body.urls && body.urls.length > 0
        ? `<div style="margin-bottom:24px;">
            <div style="font-size:10px;color:#71717A;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:10px;font-weight:600;">
              Verify Live
            </div>
            <table style="width:100%;border-collapse:collapse;">
              ${urlListHtml}
            </table>
          </div>`
        : ""
    }

    ${
      body.nextMove
        ? `<div style="background:#0D0D0D;border-left:2px solid #F97316;padding:14px 16px;margin-bottom:24px;border-radius:0 8px 8px 0;">
            <div style="font-size:10px;color:#F97316;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:6px;font-weight:600;">
              Aira is building next
            </div>
            <div style="font-size:12px;color:#CBD5E1;line-height:1.6;">
              ${escape(body.nextMove)}
            </div>
          </div>`
        : ""
    }

    ${
      body.commit
        ? `<div style="font-size:11px;color:#52525B;font-family:monospace;margin-bottom:24px;">
            Commit: <a href="https://github.com/AegibitSecurity/aegibit-website/commit/${escape(body.commit)}" style="color:#71717A;text-decoration:none;">${escape(body.commit)}</a>
          </div>`
        : ""
    }

    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;"/>

    <div style="font-size:11px;color:#52525B;line-height:1.6;">
      Sent automatically by <strong style="color:#71717A;">Aira</strong> — your AI co-founder.<br/>
      Reply to this email to course-correct. The next ship will reflect your input.<br/><br/>
      <a href="https://www.aegibit.com/dashboard/aira" style="color:#F97316;text-decoration:none;">Open Aira Ops dashboard →</a>
    </div>
  </div>
</body>
</html>`;

  // ── Send via Resend ──────────────────────────────────────────────
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: "Aira (AEGIBIT) <noreply@aegibit.com>",
      to: recipients,
      replyTo: ["contact@aegibit.com"],
      subject,
      html,
    });

    if (result.error) {
      return NextResponse.json(
        { ok: false, error: JSON.stringify(result.error) },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, id: result.data?.id, recipients });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// ── Helper: escape HTML to prevent injection in summary fields ─────
function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
