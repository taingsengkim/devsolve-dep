import {
  Building2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminOverviewResponse } from "@/lib/types/admin/types";

interface SnapshotGroup {
  title: string;
  description: string;
  icon: LucideIcon;
  items: Array<{ label: string; value: number }>;
}

export function AdminOverviewSnapshot({
  overview,
}: {
  overview: AdminOverviewResponse;
}) {
  const groups: SnapshotGroup[] = [
    {
      title: "Users",
      description: `${overview.users.total.toLocaleString()} registered accounts`,
      icon: Users,
      items: [
        { label: "Active", value: overview.users.active },
        { label: "Suspended", value: overview.users.suspended },
        { label: "Removed", value: overview.users.removed },
      ],
    },
    {
      title: "Organizations",
      description: `${overview.organizations.total.toLocaleString()} company workspaces`,
      icon: Building2,
      items: [
        { label: "Active", value: overview.organizations.active },
        { label: "Pending review", value: overview.organizations.pendingReview },
        { label: "Rejected", value: overview.organizations.rejected },
      ],
    },
    {
      title: "Programs",
      description: `${overview.programs.total.toLocaleString()} security programs`,
      icon: ShieldCheck,
      items: [
        { label: "Active", value: overview.programs.active },
        { label: "Draft", value: overview.programs.draft },
        { label: "Paused", value: overview.programs.paused },
        { label: "Closed", value: overview.programs.closed },
      ],
    },
  ];

  return (
    <Card className="rounded-2xl lg:col-span-8">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Operational snapshot</CardTitle>
        <CardDescription>
          Current account, organization, and program states from the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {groups.map((group) => (
          <section key={group.title} className="flex min-w-0 flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <group.icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{group.title}</h3>
                <p className="truncate text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {group.items.map((item, index) => (
                <div key={item.label} className="flex flex-col gap-3">
                  {index > 0 && <Separator />}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <Badge variant="secondary">{item.value.toLocaleString()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
