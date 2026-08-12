"use client";

import { motion } from "motion/react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetProfileProvisioningStatusQuery } from "@/lib/redux/services/profileApi";

/**
 * The backend creates a user's `user_profiles` row on their first authenticated
 * request. Email/password sign-ups get one from the registration call, but
 * social sign-ups have no registration call at all — the OIDC redirect is the
 * whole flow — so this request is what provisions them.
 *
 * A 404 therefore means authenticated but unprovisioned: a backend or Keycloak
 * misconfiguration rather than anything the user did or can fix by filling
 * something in. It is the one outcome worth stopping for, since everything past
 * here reads a profile that does not exist.
 *
 * Every other outcome falls through to the app. A slow or briefly unreachable
 * backend is not a provisioning failure, and locking people out of the whole
 * dashboard over one is worse than the pages showing their own empty states.
 */
export function ProfileProvisioningGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { error, isFetching, refetch } =
    useGetProfileProvisioningStatusQuery();

  const isUnprovisioned =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: number | string }).status === 404;

  if (!isUnprovisioned) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex min-h-[60vh] w-full items-center justify-center pb-12"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertTriangle className="size-6" />
        </div>

        <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          We couldn&apos;t finish setting up your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
          You&apos;re signed in, but your profile isn&apos;t ready yet. This is
          on our side, not yours — trying again usually sorts it out.
        </p>

        <Button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-6 h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {isFetching ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              Try again
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default ProfileProvisioningGate;
