"use client";

import { useMemo, useState } from "react";
import { Check, Send, UserRound } from "lucide-react";

import { INVITE_ROLE_OPTIONS } from "@/components/teams/invite-member/mock-data";
import type { InviteRoleOption } from "@/components/teams/invite-member/types";
import type { MemberRole } from "@/components/teams/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const roleTone: Record<MemberRole, string> = {
  Manager: "border-blue-200 bg-blue-50 text-blue-700",
  Member: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Viewer: "border-slate-200 bg-slate-100 text-slate-700",
};

export function InviteMemberForm() {
  const [selectedRole, setSelectedRole] = useState<MemberRole>("Member");
  const selectedRoleOption = useMemo(
    () =>
      INVITE_ROLE_OPTIONS.find((option) => option.role === selectedRole) ??
      INVITE_ROLE_OPTIONS[1],
    [selectedRole]
  );

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
          Invitation details
        </CardTitle>
        <p className="text-base text-slate-500">
          Choose who you are inviting and the access level they should receive on day one.
        </p>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <FieldGroup className="grid gap-5 xl:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="member-name">Full name</FieldLabel>
              <FieldContent>
                <Input
                  id="member-name"
                  placeholder="Elena Vasquez"
                  className="h-11 rounded-2xl border border-slate-200 bg-white text-base"
                />
                <FieldDescription>
                  Use the display name your teammate will recognize in the workspace.
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="member-email">Work email</FieldLabel>
              <FieldContent>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="elena@cloudvault.io"
                  className="h-11 rounded-2xl border border-slate-200 bg-white text-base"
                />
                <FieldDescription>
                  Invitations will be sent to this address immediately after submission.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldSet className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <FieldLegend>Select role access</FieldLegend>
            <div className="grid gap-4 lg:grid-cols-3">
              {INVITE_ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.role}
                  option={option}
                  selected={option.role === selectedRole}
                  onSelect={setSelectedRole}
                />
              ))}
            </div>
          </FieldSet>

          <Card className="border border-slate-200 bg-slate-50/80 shadow-none">
            <CardHeader className="gap-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={roleTone[selectedRole]}>
                  {selectedRoleOption.title}
                </Badge>
                <p className="text-sm text-slate-500">Selected role preview</p>
              </div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                {selectedRoleOption.description}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 pt-0 sm:grid-cols-3">
              {selectedRoleOption.access.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-slate-900">
                Ready to send the invitation?
              </p>
              <p className="text-sm text-slate-500">
                The member will appear as pending until they accept from email.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-full border-slate-300">
                <UserRound data-icon="inline-start" />
                Save as draft
              </Button>
              <Button className="rounded-full">
                <Send data-icon="inline-start" />
                Send invite
              </Button>
            </div>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

type RoleCardProps = {
  option: InviteRoleOption;
  selected: boolean;
  onSelect: (role: MemberRole) => void;
};

function RoleCard({ option, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.role)}
      className={cn(
        "flex flex-col gap-4 rounded-3xl border bg-white p-5 text-left transition-all",
        selected
          ? "border-blue-300 shadow-sm ring-2 ring-blue-100"
          : "border-slate-200 hover:border-slate-300"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-slate-950">{option.title}</span>
          <span className="text-sm leading-6 text-slate-500">{option.description}</span>
        </div>
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-full border",
            selected
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-transparent"
          )}
        >
          <Check className="size-4" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={roleTone[option.role]}>
          {option.role}
        </Badge>
      </div>
    </button>
  );
}
