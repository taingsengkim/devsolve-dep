import Link from "next/link";
import { ArrowRight, Mail, Shield } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicAboutContact() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            Get in touch
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Let&apos;s build trusted security experiences together
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Whether you are a researcher, a company, or a student collaborator,
            DevSolve is open to meaningful partnerships around vulnerability
            workflows, responsible disclosure, and product design.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-white/10 dark:bg-slate-950/70">
              <Mail className="size-4 text-blue-600" />
              hello@devsolve.io
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-white/10 dark:bg-slate-950/70">
              <Shield className="size-4 text-emerald-600" />
              Responsible disclosure friendly
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/account-type"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "rounded-full bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)] hover:bg-blue-700"
            )}
          >
            Start with DevSolve
            <ArrowRight data-icon="inline-end" />
          </Link>
          <Link
            href="/program"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-slate-300 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/12 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
            )}
          >
            Explore Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
