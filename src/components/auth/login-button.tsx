"use client";

import { signInWithKeycloak } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";

interface LoginButtonProps {
  callbackURL?: string;
  className?: string;
}

export function KeycloakLoginButton({
  callbackURL = "/",
  className,
}: LoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithKeycloak(callbackURL);
    } catch (err) {
      console.error("Keycloak login error:", err);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={loading}
      size="lg"
      className={className}
    >
      {loading ? (
        "Connecting…"
      ) : (
        <>
          <LogIn data-icon="inline-start" />
          Sign in with Keycloak
        </>
      )}
    </Button>
  );
}
