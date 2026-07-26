"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { signInWithKeycloak } from "@/features/auth/auth-client";

type LoginButtonProps = {
  callbackURL?: string;
  className?: string;
  label?: string;
};

export function KeycloakLoginButton({ callbackURL = "/", className, label = "Continue with Keycloak" }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    try {
      await signInWithKeycloak(callbackURL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className={className} disabled={loading} onClick={handleSignIn} size="lg" type="button">
      {loading ? "Redirecting to Keycloak…" : label}
    </Button>
  );
}
