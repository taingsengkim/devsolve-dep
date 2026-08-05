import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";

import {
  INVITE_MEMBER_ENDPOINT,
  INVITE_PERMISSION_OPTIONS,
  INVITE_ROLE_OPTIONS,
} from "@/components/teams/invite-member/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function InviteMemberSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
        <CardHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
            <ShieldCheck className="size-5" />
          </div>

          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold text-slate-950">
              Request Contract
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-500">
              Keep the page aligned with the backend request and response contract.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pt-0">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Endpoint
            </p>
            <p className="mt-2 break-all rounded-2xl bg-white px-3 py-2 font-mono text-sm text-slate-700 ring-1 ring-slate-200">
              {INVITE_MEMBER_ENDPOINT}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <KeyRound className="size-4 text-blue-600" />
                Required payload
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                  email
                </Badge>
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                  role
                </Badge>
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                  permissions[]
                </Badge>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Current permission
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {INVITE_PERMISSION_OPTIONS[0]?.title}:{" "}
                {INVITE_PERMISSION_OPTIONS[0]?.description}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-900">Role reference</p>
            {INVITE_ROLE_OPTIONS.map((option) => (
              <div
                key={option.role}
                className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {option.title}
                    </p>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                      {option.eyebrow}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                    {option.role}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {option.access}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
            Invitations should only be sent to trusted company email addresses.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
