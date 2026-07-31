"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Check,
  Eye,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  UserCog,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { INVITE_ROLE_OPTIONS } from "@/components/teams/invite-member/mock-data";
import type { InviteRoleOption } from "@/components/teams/invite-member/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useInviteOrganizationMemberMutation } from "@/lib/redux/services/organizationsApi";
import { cn } from "@/lib/utils";

const inviteMemberSchema = z.object({
  email: z.email("Enter a valid work email address."),
  role: z.enum(["MANAGER", "MEMBER", "VIEWER"], {
    message: "Select an organization role.",
  }),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

const roleIcons = {
  MANAGER: UserCog,
  MEMBER: ShieldCheck,
  VIEWER: Eye,
} as const;

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unable to send the invitation. Please try again.";
  }

  if ("status" in error) {
    const apiError = error as FetchBaseQueryError & {
      data?: {
        message?: string;
        error?: string;
        details?: string;
      };
    };

    const rawMessage =
      typeof apiError.data?.message === "string"
        ? apiError.data.message
        : typeof apiError.data?.error === "string"
          ? apiError.data.error
          : typeof apiError.data?.details === "string"
            ? apiError.data.details
            : "";

    const message = rawMessage.toLowerCase();

    if (message.includes("already") && message.includes("invitation")) {
      return "An invitation has already been sent to this email.";
    }

    if (
      message.includes("already") &&
      (message.includes("member") || message.includes("organization"))
    ) {
      return "This user is already a member of the organization.";
    }

    if (apiError.status === 401 || apiError.status === 403) {
      return "You do not have permission to invite organization members.";
    }

    if (apiError.status === 404) {
      return "Your organization could not be found.";
    }
  }

  return "Unable to send the invitation. Please try again.";
}

export function InviteMemberForm() {
  const router = useRouter();
  const [inviteOrganizationMember, { isLoading }] =
    useInviteOrganizationMemberMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isValid },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });
  const selectedRoleOption =
    INVITE_ROLE_OPTIONS.find((option) => option.role === selectedRole) ??
    INVITE_ROLE_OPTIONS[1];

  async function onSubmit(values: InviteMemberFormValues) {
    try {
      await inviteOrganizationMember(values).unwrap();

      toast.success({
        title: "Invitation sent successfully.",
        description: `An invitation was sent to ${values.email}.`,
      });

      router.push("/dashboard/teams");
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error);

      setError("root", { message });
      toast.destructive({
        title: "Invitation failed",
        description: message,
      });
    }
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <CardHeader className="gap-2">
        <CardTitle className="text-xl font-semibold tracking-tight text-slate-950">
          Invitation Details
        </CardTitle>
        <p className="text-sm leading-6 text-slate-500">
          Enter the teammate email and assign the role that matches their organization access.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="member-email" className="text-sm font-medium text-slate-900">
              Work email
            </Label>

            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="member-email"
                type="email"
                placeholder="member@company.com"
                {...register("email")}
                className={cn(
                  "h-11 rounded-2xl border border-slate-200 bg-white pl-9 text-base text-slate-800",
                  errors.email &&
                    "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-500/20"
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Required
              </p>
              <p className="text-sm leading-6 text-slate-500">
                The invitation will be sent to this address.
              </p>
              {errors.email ? (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">Organization role</p>
              <p className="text-sm leading-6 text-slate-500">
                Select one role using the exact enum expected by the backend.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {INVITE_ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.role}
                  option={option}
                  selected={option.role === selectedRole}
                  onSelect={(role) => {
                    setValue("role", role, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                />
              ))}
            </div>

            {errors.role ? (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <p className="text-sm font-medium text-slate-900">
              Selected role: {selectedRoleOption.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {selectedRoleOption.description}
            </p>
            {selectedRoleOption.caution ? (
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  selectedRoleOption.role === "MEMBER" ? "text-[#2563EB]" : "text-slate-600"
                )}
              >
                {selectedRoleOption.caution}
              </p>
            ) : null}
          </div>

          {errors.root?.message ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errors.root.message}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/teams")}
              className="h-11 rounded-2xl border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="h-11 rounded-2xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.18)] hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Sending invitation...
                </>
              ) : (
                <>
                  <Send data-icon="inline-start" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type RoleCardProps = {
  option: InviteRoleOption;
  selected: boolean;
  onSelect: (role: InviteRoleOption["role"]) => void;
};

function RoleCard({ option, selected, onSelect }: RoleCardProps) {
  const Icon = roleIcons[option.role];

  return (
    <button
      type="button"
      onClick={() => onSelect(option.role)}
      aria-pressed={selected}
      className={cn(
        "flex min-h-[218px] flex-col rounded-[14px] border p-4 text-left transition-all duration-200",
        selected
          ? "border-[#2563EB] bg-blue-50 shadow-[0_8px_20px_rgba(37,99,235,0.08)]"
          : "border-[#E2E8F0] bg-white hover:border-blue-200 hover:bg-slate-50/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border",
            selected
              ? "border-blue-200 bg-white text-[#2563EB]"
              : "border-slate-200 bg-slate-50 text-slate-500"
          )}
        >
          <Icon className="size-5" />
        </div>

        <div
          className={cn(
            "flex size-6 items-center justify-center rounded-full border",
            selected
              ? "border-blue-200 bg-white text-[#2563EB]"
              : "border-slate-200 bg-white text-transparent"
          )}
        >
          <Check className="size-3.5" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-base font-semibold text-slate-900">{option.title}</h3>
        <p className="min-h-[72px] text-sm leading-6 text-slate-500">
          {option.description}
        </p>
      </div>

      <div className="mt-auto space-y-2 pt-4">
        <p className="text-sm font-medium text-slate-700">{option.access}</p>
        <p className="text-sm text-slate-500">
          {option.caution ?? "Suitable for stakeholders or observers."}
        </p>
      </div>
    </button>
  );
}
