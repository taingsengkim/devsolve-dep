/**
 * Mirrors the profile layout so the page doesn't jump when data lands.
 * Shared by the `[username]` page and the `/dashboard/profile` resolver.
 */
export default function ProfileSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6 pb-12">
      <div className="space-y-3 border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="hidden gap-2 sm:flex">
            <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-4 xl:col-span-3">
          <div className="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
