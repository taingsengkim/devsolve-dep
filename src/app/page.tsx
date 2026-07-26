import { SiteHeader } from "@/shared/components/layout/site-header";
import { ReportsList } from "@/features/reports/components/reports-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My reports</h1>
          <p className="text-sm text-muted-foreground">Reports submitted from your account.</p>
        </div>
        <ReportsList />
      </section>
    </main>
  );
}
