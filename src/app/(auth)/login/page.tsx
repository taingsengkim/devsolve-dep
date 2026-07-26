import type { Metadata } from "next";
import Link from "next/link";

import { KeycloakLoginButton } from "@/features/auth/components/login-button";

export const metadata: Metadata = {
  title: "Sign in | DevSolve",
  description: "Sign in to DevSolve with your Keycloak account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <section className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
        <Link href="/" className="mb-10 flex w-fit items-center gap-3 text-foreground">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">DS</span>
          <span className="text-lg font-semibold tracking-tight">DevSolve</span>
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-base leading-7 text-muted-foreground">
            Sign in through Keycloak to continue to your workspace.
          </p>
        </div>

        <div className="mt-8">
          <KeycloakLoginButton callbackURL="/" className="w-full" />
        </div>

        <p className="mt-6 text-center text-sm leading-6 text-muted-foreground">
          New to DevSolve? <Link href="/signup" className="text-foreground underline underline-offset-4">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
