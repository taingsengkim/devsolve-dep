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
      <Card className="border border-border bg-card text-card-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10">
        <CardHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
            <ShieldCheck className="size-5" />
          </div>

          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              Request Contract
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Keep the page aligned with the backend request and response contract.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pt-0">
          <div className="rounded-3xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Endpoint
            </p>
            <p className="mt-2 break-all rounded-2xl bg-card px-3 py-2 font-mono text-sm text-foreground ring-1 ring-border">
              {INVITE_MEMBER_ENDPOINT}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <KeyRound className="size-4 text-blue-600 dark:text-blue-400" />
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

            <div className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                Current permission
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {INVITE_PERMISSION_OPTIONS[0]?.title}:{" "}
                {INVITE_PERMISSION_OPTIONS[0]?.description}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Role reference</p>
            {INVITE_ROLE_OPTIONS.map((option) => (
              <div
                key={option.role}
                className="rounded-3xl border border-border bg-muted/40 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {option.title}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {option.eyebrow}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                    {option.role}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {option.access}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10 px-4 py-3 text-sm leading-relaxed text-blue-700 dark:text-blue-300">
            Invitations should only be sent to trusted company email addresses.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
