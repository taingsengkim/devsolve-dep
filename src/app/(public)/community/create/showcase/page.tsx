"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { CreateShowcaseForm } from "@/components/showcases/create/CreateShowcaseForm";
import SectionBackdrop, { useInk } from "@/components/landing/SectionBackdrop";

export default function PublicCreateShowcasePage() {
  const ink = useInk();

  return (
    /* The landing page's section shell — grid paper, drifting aurora, and the
       same slate ground the showcase section sits on. Motes and scan beams are
       off: they belong behind a page you read, not one you type into.

       Deliberately no `overflow-hidden`, unlike the landing sections: it would
       make this element the scroll container and the form's sticky sidebar
       would scroll away with the page. `SectionBackdrop` clips itself. */
    <section className="relative min-h-[calc(100dvh-var(--navbar-height))] bg-slate-50 py-10 sm:py-14 dark:bg-slate-950">
      <SectionBackdrop seed={5} gridSize={88} particles={false} beams={false} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="border-b border-slate-200 pb-8 dark:border-slate-800"
        >
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            <Link
              href="/community"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              Community
            </Link>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-600" />
            <Link
              href="/community/create"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              New post
            </Link>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-slate-200">Showcase</span>
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              {/* The landing header motif: a hairline rule, an eyebrow, then
                  the headline closed with a blue full stop. */}
              <div className="mb-4 flex items-center gap-2.5">
                <span className="h-px w-8" style={{ backgroundColor: ink }} />
                <span
                  className="text-xs font-bold uppercase tracking-[0.22em]"
                  style={{ color: ink }}
                >
                  New showcase
                </span>
              </div>

              <h1
                className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
                style={{ color: ink }}
              >
                Show what you built
                <span className="text-[#2563EB] dark:text-blue-400">.</span>
              </h1>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Publish the project alongside the build guide that made it work.
              Steps, code and diagrams stay together, so anyone landing on it can
              follow the whole thing end to end.
            </p>
          </div>
        </motion.header>

        <div className="mt-8">
          {/* Covers the routes into this page that skip the gated link — a
              pasted URL, a bookmark, back/forward. */}
          <RequireAuth
            title="Sign in to post a showcase"
            description="Publishing a showcase needs an account, so the project stays attached to your profile. It only takes a moment."
          >
            <CreateShowcaseForm
              successHref="/showcases"
              cancelHref="/community/create"
              stickyTop="calc(var(--navbar-height) + 1.5rem)"
            />
          </RequireAuth>
        </div>
      </div>
    </section>
  );
}
