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
      const result = await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL,
        disableRedirect: true,
      });

      if (result?.error) {
        console.error("[Auth] Keycloak sign-in failed:", result.error);
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
