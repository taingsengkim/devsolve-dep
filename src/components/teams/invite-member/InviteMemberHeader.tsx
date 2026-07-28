import Link from "next/link";
import { ArrowLeft, MailPlus, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function InviteMemberHeader() {
  return (
    <header className="flex flex-col gap-4">
      <Link
        href="/dashboard/teams"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "w-fit rounded-full border-slate-300 bg-white text-slate-700"
        )}
      >
        <ArrowLeft data-icon="inline-start" />
        Back to members
      </Link>

      <Card className="border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              <ShieldCheck />
              Access control
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
              Invitation flow
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Invite a new member
            </CardTitle>
            <p className="max-w-3xl text-base leading-7 text-slate-500">
              Add a teammate with the right role, send a clear invitation, and keep
              access aligned with how your organization works.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <MailPlus className="size-4 text-blue-600" />
              Invitations send instantly to the member email
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Role access can be updated later from the members table
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
