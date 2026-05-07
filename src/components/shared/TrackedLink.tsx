"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/track";

/**
 * <Link> with click telemetry. Drop-in replacement for next/link
 * on conversion-critical CTAs. Fires a `cta_click` event with the
 * supplied id/label and the link's href as the target. Telemetry
 * is fire-and-forget so navigation never waits on the network.
 *
 * Why a wrapper instead of just `onClick={() => track(...)}` inline:
 * the parent server components (HeroSection, HomeProducts, etc.) can't
 * import `track()` directly because it depends on a client-only zustand
 * store. Wrapping in this thin client component keeps the parents pure
 * server-rendered (cheaper, faster) while still emitting events.
 */

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  ctaId: string;
  ctaLabel?: string;
  ctaSection?: string;
}

export function TrackedLink({
  ctaId,
  ctaLabel,
  ctaSection,
  onClick,
  href,
  children,
  ...rest
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        track("cta_click", {
          cta_id: ctaId,
          cta_label: ctaLabel,
          cta_section: ctaSection,
          target: typeof href === "string" ? href : undefined,
        });
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
