"use client";

import { useCallback, useState } from "react";
import type React from "react";

import { authClient } from "@/lib/auth/auth-client";

/**
 * Click-time login check for actions that only make sense signed in — posting
 * a showcase, filing a problem.
 *
 * The gate lives on the click rather than on the render, so the entry points
 * stay real `<a href>`s: they look the same to everyone, they still open in a
 * new tab, and a signed-in reader never waits on a session round trip before
 * the button appears.
 */
export function useAuthGate() {
  const { data: session, isPending } = authClient.useSession();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const guard = useCallback(
    (event: React.MouseEvent<HTMLElement>, href: string) => {
      // "Open elsewhere" gestures never navigate this tab — the destination
      // does its own gating when it loads.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      // While the session is still resolving we cannot tell the two cases
      // apart. Letting the click through is the safe miss: the create page
      // guards itself, so an anonymous visitor still lands on the prompt,
      // whereas blocking here would stop a signed-in author for no reason.
      if (isPending || session) {
        return;
      }

      event.preventDefault();
      setPendingHref(href);
    },
    [isPending, session],
  );

  const dismiss = useCallback(() => setPendingHref(null), []);

  return {
    isAuthenticated: Boolean(session),
    isPending,
    /** The href the visitor tried to reach — non-null while the prompt is up. */
    pendingHref,
    guard,
    dismiss,
  };
}
