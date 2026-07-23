import type { Metadata } from "next";
import { ArrowRight, KeyRound, ShieldCheck, Sparkles } from "lucide-react";

import { KeycloakLoginButton } from "@/components/auth/login-button";

export const metadata: Metadata = {
  title: "Sign in | DevSolve",
  description: "Sign in to DevSolve securely with Keycloak.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-sm sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_0.95fr] lg:min-h-[calc(100vh-4rem)]">
        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="flex items-center gap-3 text-foreground">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
              DS
            </div>
            <span className="text-lg font-semibold tracking-tight">DevSolve</span>
          </div>

          <div className="my-auto flex max-w-md flex-col gap-8 py-16 lg:py-0">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Sign in to your workspace.
              </h1>
              <p className="max-w-sm text-base leading-7 text-muted-foreground">
                Continue securely with your organization&apos;s DevSolve account.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <KeycloakLoginButton callbackURL="/" className="w-full" />
              <p className="text-center text-sm leading-6 text-muted-foreground">
                You&apos;ll be redirected to Keycloak to securely authenticate.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-background p-4 text-sm text-muted-foreground">
              <ShieldCheck className="size-5 shrink-0 text-foreground" aria-hidden="true" />
              <p>Your credentials are managed by your organization and never stored in DevSolve.</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DevSolve</p>
        </section>

        <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col">
          <div className="absolute -right-28 -top-24 size-80 rounded-full border border-primary-foreground/15" />
          <div className="absolute -bottom-40 -left-24 size-96 rounded-full border border-primary-foreground/15" />

          <div className="relative flex items-center gap-2 text-sm font-medium text-primary-foreground/75">
            <Sparkles className="size-4" aria-hidden="true" />
            Built for focused teams
          </div>

          <div className="relative my-auto flex max-w-sm flex-col gap-6">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <KeyRound className="size-7" aria-hidden="true" />
            </div>
            <blockquote className="text-3xl font-medium leading-tight tracking-tight">
              Solve the important problems. Keep the work moving.
            </blockquote>
            <p className="text-base leading-7 text-primary-foreground/70">
              One secure sign-in gives your team a shared place to manage, collaborate, and deliver.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-sm text-primary-foreground/70">
            Secure access
            <ArrowRight className="size-4" aria-hidden="true" />
            Authorization Code + PKCE
          </div>
        </aside>
      </div>
    </main>
  );
}
