"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";

export function useKeycloakLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const reset = () => setIsLoggingIn(false);
    window.addEventListener("pageshow", reset);
    window.addEventListener("focus", reset);
    return () => {
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("focus", reset);
    };
  }, []);

  const handleLogin = async (callbackURL: string = "/") => {
    setIsLoggingIn(true);
    try {
      const targetUrl = callbackURL || "/";
      const result = await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL: targetUrl,
        disableRedirect: true,
      });

      if (result?.error) {
        const err = result.error as any;
        const errorMsg =
          err?.message ||
          err?.statusText ||
          (typeof err === "object" ? JSON.stringify(err) : String(err));
        console.error("[Auth] Keycloak sign-in failed:", errorMsg, err);
        setIsLoggingIn(false);
        return;
      }

      if (result?.data?.url) {
        console.log("[Auth] Redirecting to Keycloak:", result.data.url);
        window.location.href = result.data.url;
      } else {
        console.error("[Auth] No redirect URL returned:", result);
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("[Auth] Keycloak sign-in error:", error);
      setIsLoggingIn(false);
    }
  };

  return { isLoggingIn, handleLogin };
}

