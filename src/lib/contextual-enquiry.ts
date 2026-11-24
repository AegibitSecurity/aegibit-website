import { sanitizeForDisplay } from "@/lib/validators";
export interface EnquiryContext { email: string; name?: string | null; company?: string | null; message?: string | null; source: string; }
/** Deterministic enquiry response: no external AI, invented promises or raw message echo. */
export function composeEnquiryEmail(data: EnquiryContext, followup = false) {
  const name = data.name?.trim().slice(0, 100);
  const company = data.company?.trim().slice(0, 160);
  const context = `${company ?? ""} ${data.message ?? ""}`.toLowerCase();
  const gym = /\b(gym|fitness|membership)\b/.test(context);
  const paymint = data.source === "paymint_demo" || /\b(paymint|expenses?|petty cash)\b/.test(context);
  const website = /\b(website|web site)\b/.test(context);
  const boutique = /\b(boutique|tailoring|vestiq)\b/.test(context);
  const question = gym ? "Are you looking for gym management software, a website, or both? Please share your gym's location and the main task you want to improve."
    : paymint ? "Which expense or approval workflow would you like to improve? Please share how many branches need access and how you manage expenses today."
    : boutique ? "Are you looking for boutique billing, order tracking, a website, or something else? Please share your shop's location and the main workflow you need help with."
    : website ? "What should the website help your customers do? Please share your current website, if any, and the main features you need."
    : "What would you like us to build or improve? Please share the main workflow, who will use it and any preferred timeline.";
  const subject = followup ? "A quick question about your AEGIBIT enquiry" : "We received your enquiry, AEGIBIT";
  const intro = followup ? `Thank you for your earlier enquiry${company ? ` for ${company}` : ""}. We are following up to understand what you need.` : `Thank you for contacting AEGIBIT${company ? ` about ${company}` : ""}. Your enquiry has been saved for our team to review.`;
  const paragraphs = [`Hi ${name || "there"},`, intro, data.message?.trim() && !followup ? "We have received the details you shared. To help us understand the next step:" : "To help us understand your requirements:", question, "Reply to this email and our team will review your response. If you did not make this enquiry or no longer need assistance, please ignore this message. There are no automatic follow-up sequences.", "AEGIBIT Global Consulting"];
  const text = paragraphs.join("\n\n");
  const html = `<div style="max-width:580px;margin:auto;background:#111114;color:#f4f4f5;border:1px solid #333;border-radius:18px;padding:32px;font-family:Arial,sans-serif"><p style="color:#fb923c;letter-spacing:3px">AEGIBIT</p><h1 style="font-size:24px;line-height:1.3">${followup ? "Let's understand your project." : "Your enquiry is with us."}</h1>${paragraphs.slice(0,-1).map(p=>`<p style="font-size:16px;line-height:1.7;color:#d4d4d8">${sanitizeForDisplay(p)}</p>`).join("")}<p style="border-top:1px solid #333;padding-top:20px;font-size:14px;color:#a1a1aa">AEGIBIT Global Consulting · <a href="https://www.aegibit.com" style="color:#fdba74">aegibit.com</a></p></div>`;
  return { subject, text, html };
}
