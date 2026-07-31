import { ShieldCheck } from "lucide-react";

import { INVITE_ROLE_OPTIONS } from "@/components/teams/invite-member/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InviteMemberSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border border-slate-200/80 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <CardHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
            <ShieldCheck className="size-5" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-950">
              Role Permissions
            </CardTitle>
            <p className="text-sm leading-6 text-slate-500">
              Match the invitation role to the lowest access level the teammate actually needs.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Role</span>
              <span>Access</span>
            </div>

            {INVITE_ROLE_OPTIONS.map((option, index) => (
              <div
                key={option.role}
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm text-slate-600"
              >
                <span className="font-semibold text-slate-900">{option.title}</span>
                <span className={index < INVITE_ROLE_OPTIONS.length - 1 ? "border-b border-slate-100 pb-3" : ""}>
                  {option.access}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
            Invitations should only be sent to trusted company email addresses.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
