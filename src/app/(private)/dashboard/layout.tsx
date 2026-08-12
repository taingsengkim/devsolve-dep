export const dynamic = "force-dynamic";

import Sidebar from "@/components/Sidebar";
import { ProfileProvisioningGate } from "@/components/auth/ProfileProvisioningGate";
import { NotificationProvider } from "@/components/notifications/NotificationContext";
import { NotificationTrigger } from "@/components/notifications/NotificationTrigger";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/60 dark:bg-neutral-950">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Dashboard Top Navigation Bar with Notification Bell Icon in top-right.
              Hidden on mobile — Sidebar's own mobile header already has this bell. */}
          <header className="hidden lg:flex h-16 px-6 md:px-8 border-b border-slate-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 items-center justify-end">
            <NotificationTrigger />
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0 w-full">
            {/* The landing point for every signed-in user, social or not, so
                it is where an unprovisioned profile gets caught. */}
            <ProfileProvisioningGate>{children}</ProfileProvisioningGate>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
