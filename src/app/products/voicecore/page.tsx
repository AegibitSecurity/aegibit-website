import { permanentRedirect } from "next/navigation";

/**
 * /products/voicecore is preserved as a 308 permanent redirect to
 * /products/aira. VoiceCore was the working title for the voice-platform
 * thinking that eventually shipped as Aira (the desktop assistant) and
 * informed the MCP Shield security product. All current voice-related
 * marketing + waitlist capture live at the new canonical URL.
 *
 * `permanentRedirect` issues a 308 (vs Next's default 307) so search
 * engines collapse link equity into the new URL. The function never
 * returns — its TS signature is `never` — so no content is rendered.
 *
 * Note: the file path itself is queued for retirement (separate task)
 * once we confirm there are no inbound links worth preserving. The
 * 308 here is the lower-risk path until that decision lands.
 */
export default function VoiceCoreRedirect(): never {
  permanentRedirect("/products/aira");
}
