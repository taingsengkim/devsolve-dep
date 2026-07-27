import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0 w-full">
        {children}
      </main>
    </div>
  );
}
