import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account | DevSolve",
  description: "Create your DevSolve account securely with Keycloak.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <section className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
        <Link href="/" className="mb-10 flex w-fit items-center gap-3 text-foreground">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">DS</span>
          <span className="text-lg font-semibold tracking-tight">DevSolve</span>
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create your account</h1>
          <p className="text-base leading-7 text-muted-foreground">
            Enter your details to create a DevSolve account.
          </p>
        </div>

        <div className="mt-8">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm leading-6 text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
