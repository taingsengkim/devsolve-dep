import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicAboutContact() {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900">
      <div className="relative grid gap-6 px-6 py-7 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.10),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_18%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_18%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.72),rgba(255,255,255,0.92),rgba(255,255,255,0.74))] dark:bg-[linear-gradient(90deg,rgba(15,23,42,0.70),rgba(15,23,42,0.90),rgba(15,23,42,0.74))]" />

        <div className="relative flex size-20 items-center justify-center rounded-full border border-blue-100 bg-blue-50 shadow-[0_8px_20px_rgba(37,99,235,0.08)] dark:border-blue-400/15 dark:bg-blue-500/10">
          <UsersRound className="size-10 text-blue-600 dark:text-blue-300" />
        </div>

        <div className="relative">
          <p className="text-4xl font-bold tracking-[-0.05em] text-slate-900 dark:text-white">
            Join the DevSolve Community
          </p>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Whether you&apos;re an organization, an ethical hacker, or a developer,
            DevSolve is the place to collaborate, learn, and make an impact.
          </p>
        </div>

        <div className="relative flex items-center">
          <Link
            href="/account-type"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "rounded-xl bg-blue-600 px-6 text-white shadow-[0_10px_24px_rgba(37,99,235,0.20)] hover:-translate-y-0.5 hover:bg-blue-700"
            )}
          >
            Get Started Now
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </section>
  );
}
