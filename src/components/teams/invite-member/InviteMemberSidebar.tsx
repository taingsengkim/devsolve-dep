import { Clock3, MailCheck, Shield, UsersRound } from "lucide-react";

import { PENDING_INVITES } from "@/components/teams/invite-member/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InviteMemberSidebar() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold text-slate-950">
            Invitation checklist
          </CardTitle>
          <p className="text-sm leading-6 text-slate-500">
            Keep access clean and intentional before you add someone to the workspace.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ChecklistItem
            icon={UsersRound}
            title="Confirm the correct team owner"
            description="Managers should be limited to people handling approvals or access changes."
          />
          <ChecklistItem
            icon={Shield}
            title="Match the lowest required privilege"
            description="Choose the smallest role needed so permissions stay easy to audit later."
          />
          <ChecklistItem
            icon={MailCheck}
            title="Verify the company email address"
            description="Use the work address the teammate can access right away to reduce friction."
          />
        </CardContent>
      </Card>

      <Card className="border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl font-semibold text-slate-950">
              Pending invitations
            </CardTitle>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
              {PENDING_INVITES.length} pending
            </Badge>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Recent invites that still need acceptance from the member.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {PENDING_INVITES.map((invite) => (
            <div
              key={invite.id}
              className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold text-slate-900">{invite.name}</p>
                    <p className="text-sm text-slate-500">{invite.email}</p>
                  </div>
                  <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                    {invite.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 className="size-4 text-slate-400" />
                  Sent {invite.sentAt}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

type ChecklistItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

function ChecklistItem({ icon: Icon, title, description }: ChecklistItemProps) {
  return (
    <div className="flex gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
