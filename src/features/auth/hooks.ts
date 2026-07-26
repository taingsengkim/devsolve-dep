"use client";

import { authClient } from "@/features/auth/auth-client";

/**
 * Thin wrapper around Better Auth's useSession hook.
 * All client components that need session data should call useAuth()
 * instead of reaching into authClient directly.
 */
export function useAuth() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return {
    /** The full Better Auth session object, or null when unauthenticated. */
    session,
    /** Convenience shortcut to the session user. */
    user: session?.user ?? null,
    /** True when a valid session exists. */
    isAuthenticated: !!session,
    /** True while the initial session fetch is in-flight. */
    isPending,
    /** Any error returned by Better Auth. */
    error,
    /** Force-refetch the session (e.g. after an OAuth callback). */
    refetch,
  };
}
