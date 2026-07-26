"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { KeycloakLoginButton } from "@/features/auth/components/login-button";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks";
import { useAppDispatch } from "@/shared/lib/redux/hooks";
import { baseApi } from "@/shared/lib/redux/services/baseApi";

export function SiteHeader() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const username = user?.name || user?.email;

  const handleSignOut = async () => {
    setIsSigningOut(true);

    dispatch(baseApi.util.resetApiState());
    // The server reads the Keycloak ID token before it deletes the Better Auth
    // session, then sends the browser to Keycloak's provider logout endpoint.
    window.location.assign("/api/auth/keycloak/logout");
  };

  return (
    <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <span className="text-lg font-semibold tracking-tight text-foreground">DevSolve</span>
      <div className="flex items-center gap-3">
        {username ? (
          <>
            <span className="text-sm font-medium text-foreground">{username}</span>
            <Button disabled={isSigningOut} onClick={handleSignOut} type="button" variant="outline">
              <LogOut data-icon="inline-start" />
              {isSigningOut ? "Logging out…" : "Logout"}
            </Button>
          </>
        ) : (
          <>
            <KeycloakLoginButton callbackURL="/" label="Login" />
            <Link className={buttonVariants()} href="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
