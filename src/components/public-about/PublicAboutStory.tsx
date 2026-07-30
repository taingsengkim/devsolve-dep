import {
  Eye,
  ShieldCheck,
  Target,
  Trophy,
  UsersRound,
  Bug,
  ArrowUpRight,
} from "lucide-react";

import { ABOUT_STATS, ABOUT_VALUES } from "@/components/public-about/mock-data";

export function PublicAboutStory() {
  const valueIcons = [ShieldCheck, UsersRound, ArrowUpRight, Trophy];
  const statIcons = [ShieldCheck, Bug, UsersRound, Trophy];

  return (
    <section className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900">
      <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-10">
        <div className="space-y-10 lg:border-r lg:border-slate-200 lg:pr-8 dark:lg:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                <Target className="size-5 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-300">
                Our mission
              </p>
            </div>
            <p className="mt-4 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
              To create a trusted platform where security meets community, helping
              organizations strengthen their defenses while empowering developers to
              learn, collaborate, and achieve more together.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                <Eye className="size-5 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-300">
                Our vision
              </p>
            </div>
            <p className="mt-4 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
              To become the leading platform that bridges security and developer
              communities, driving a safer digital world and a stronger developer
              ecosystem.
            </p>
          </div>
        </div>

        <div>
          <p className="text-3xl font-bold tracking-[-0.04em] text-slate-900 dark:text-white">
            Our Core Values
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ABOUT_VALUES.map((value, index) => {
              const Icon = valueIcons[index];

              return (
                <div
                  key={value.title}
                  className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] dark:border-white/10 dark:bg-slate-950"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <Icon
                      className={`size-7 ${
                        index === 2
                          ? "text-emerald-600 dark:text-emerald-300"
                          : index === 3
                            ? "text-violet-600 dark:text-violet-300"
                            : "text-blue-600 dark:text-blue-300"
                      }`}
                    />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-white/10 dark:bg-slate-950/60 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          {ABOUT_STATS.map((item, index) => {
            const Icon = statIcons[index];

            return (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-slate-900"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                  <Icon
                    className={`size-7 ${
                      index === 1
                        ? "text-blue-600 dark:text-blue-300"
                        : index === 2
                          ? "text-blue-600 dark:text-blue-300"
                          : index === 3
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-blue-600 dark:text-blue-300"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-300">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
