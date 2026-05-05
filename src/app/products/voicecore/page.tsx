import { redirect, permanentRedirect } from "next/navigation";

/**
 * /products/voicecore is preserved as a 308 permanent redirect to
 * /products/aira. VoiceCore was the working title for what is now shipping
 * as Aira — AEGIBIT's voice-first AI co-founder. All voice-platform marketing
 * + waitlist capture live at the new canonical URL.
 *
 * `permanentRedirect` issues a 308 (vs Next's default 307) so search engines
 * collapse link equity into the new URL. No content is rendered — Next short
 * circuits before Navbar / Footer.
 */
export default function VoiceCoreRedirect(): never {
  permanentRedirect("/products/aira");
  // unreachable, but satisfies the `never` return type hint for clarity
  // eslint-disable-next-line no-unreachable
  redirect("/products/aira");
}
