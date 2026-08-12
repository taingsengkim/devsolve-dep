"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";

/**
 * Identity providers configured on the `devsolve` realm. Passed to Keycloak as
 * `kc_idp_hint`, which makes it skip its own login form and hand straight off
 * to that provider.
 */
export type IdpHint = "google" | "github";

export function useKeycloakLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Which provider a redirect is in flight for, so a caller rendering several
  // buttons can spin only the one that was pressed.
  const [pendingIdpHint, setPendingIdpHint] = useState<IdpHint | null>(null);

  useEffect(() => {
    const reset = () => {
      setIsLoggingIn(false);
      setPendingIdpHint(null);
    };
    window.addEventListener("pageshow", reset);
    window.addEventListener("focus", reset);
    return () => {
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("focus", reset);
    };
  }, []);

  /**
   * `idpHint` is the only difference between "log in" and "sign up with
   * Google/GitHub". In OIDC both are the same authorization request, so there
   * is no second flow to write: Keycloak decides on its own whether the
   * account is new, and the callback is the one already in use.
   */
  const handleLogin = async (
    callbackURL: string = "/",
    idpHint?: IdpHint,
  ) => {
    setIsLoggingIn(true);
    setPendingIdpHint(idpHint ?? null);

    const fail = (...log: unknown[]) => {
      console.error(...(log as [unknown, ...unknown[]]));
      setIsLoggingIn(false);
      setPendingIdpHint(null);
    };

    try {
      const targetUrl = callbackURL || "/";
      const result = await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL: targetUrl,
        disableRedirect: true,
      });

      if (result?.error) {
        const err: { message?: string; statusText?: string } = result.error;
        const errorMsg =
          err?.message ||
          err?.statusText ||
          (typeof err === "object" ? JSON.stringify(err) : String(err));
        fail("[Auth] Keycloak sign-in failed:", errorMsg, err);
        return;
      }

      if (result?.data?.url) {
        // The URL better-auth hands back already carries state, nonce and the
        // PKCE challenge. The hint is appended to it rather than threaded
        // through the plugin, so none of that has to be reproduced here.
        const authorizeUrl = new URL(result.data.url, window.location.origin);
        if (idpHint) {
          authorizeUrl.searchParams.set("kc_idp_hint", idpHint);
        }

        console.log("[Auth] Redirecting to Keycloak:", authorizeUrl.toString());
        window.location.href = authorizeUrl.toString();
      } else {
        fail("[Auth] No redirect URL returned:", result);
      }
    } catch (error) {
      fail("[Auth] Keycloak sign-in error:", error);
    }
  };

  return { isLoggingIn, pendingIdpHint, handleLogin };
}
