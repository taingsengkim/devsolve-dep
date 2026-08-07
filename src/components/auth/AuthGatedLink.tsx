"use client";

import React from "react";
import Link from "next/link";

import { LoginRequiredDialog } from "@/components/auth/LoginRequiredDialog";
import { useAuthGate } from "@/hooks/useAuthGate";

interface AuthGatedLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  /** Copy for the sign-in prompt, when the default is too generic. */
  promptTitle?: string;
  promptDescription?: string;
}

/**
 * A `Link` that only navigates for signed-in visitors. Anyone else gets the
 * sign-in prompt, and lands on `href` once they come back from Keycloak.
 *
 * Drop-in for the create-post entry points: same markup, same styling hooks,
 * so the button reads identically whether or not there is a session.
 */
export function AuthGatedLink({
  href,
  promptTitle,
  promptDescription,
  onClick,
  children,
  ...props
}: AuthGatedLinkProps) {
  const { pendingHref, guard, dismiss } = useAuthGate();

  return (
    <>
      <Link
        href={href}
        onClick={(event) => {
          onClick?.(event);
          guard(event, href);
        }}
        {...props}
      >
        {children}
      </Link>

      <LoginRequiredDialog
        open={pendingHref !== null}
        onOpenChange={(open) => {
          if (!open) {
            dismiss();
          }
        }}
        redirectTo={pendingHref ?? href}
        title={promptTitle}
        description={promptDescription}
      />
    </>
  );
}
