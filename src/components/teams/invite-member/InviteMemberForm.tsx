"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  AlertCircle,
  Check,
  Eye,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  UserCog,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  DEFAULT_PERMISSIONS_BY_ROLE,
  INVITE_PERMISSION_OPTIONS,
  INVITE_ROLE_OPTIONS,
} from "@/components/teams/invite-member/mock-data";
import type {
  InvitePermissionOption,
  InviteRoleOption,
} from "@/components/teams/invite-member/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";
import { useInviteOrganizationMemberMutation } from "@/lib/redux/services/organizationsApi";
import { cn } from "@/lib/utils";

const permissionValues = [
  "VIEW_PROGRAMS",
  "CREATE_PROGRAM",
  "EDIT_PROGRAM",
  "MANAGE_PROGRAM_STATE",
  "VIEW_REPORTS",
  "TRIAGE_REPORTS",
  "MANAGE_DISCLOSURE",
  "AWARD_REWARDS",
] as const;

const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Work email is required.")
    .email("Enter a valid work email address."),

  role: z.enum(["MANAGER", "MEMBER", "VIEWER"], {
    message: "Select an organization role.",
  }),

  permissions: z
    .array(z.enum(permissionValues))
    .min(1, "Select at least one permission.")
    .max(8, "You can select up to eight permissions."),
});

type InviteMemberFormValues = z.infer<
  typeof inviteMemberSchema
>;

type PermissionCategory =
  | "Programs"
  | "Reports"
  | "Disclosure"
  | "Rewards"
  | "General";

const roleIcons = {
  MANAGER: UserCog,
  MEMBER: UserRound,
  VIEWER: Eye,
} as const;

const roleCapabilities = {
  MANAGER: [
    "Members",
    "Programs",
    "Reports",
    "Settings",
  ],
  MEMBER: ["Programs", "Reports", "Collaboration"],
  VIEWER: ["Programs", "Reports", "Read only"],
} as const;

function getErrorMessage(error: unknown): string {
  if (
    !error ||
    typeof error !== "object" ||
    !("status" in error)
  ) {
    return "Unable to send the invitation. Please try again.";
  }

  const apiError = error as FetchBaseQueryError & {
    data?: {
      message?: string;
      error?: string;
      details?: string;
    };
  };

  const rawMessage =
    apiError.data?.message ??
    apiError.data?.error ??
    apiError.data?.details ??
    "";

  const normalizedMessage = rawMessage.toLowerCase();

  if (
    normalizedMessage.includes("already") &&
    normalizedMessage.includes("invitation")
  ) {
    return "An invitation has already been sent to this email address.";
  }

  if (
    normalizedMessage.includes("already") &&
    normalizedMessage.includes("member")
  ) {
    return "This user is already a member of your organization.";
  }

  if (
    apiError.status === 401 ||
    apiError.status === 403
  ) {
    return "You do not have permission to invite organization members.";
  }

  if (apiError.status === 404) {
    return "Your organization could not be found.";
  }

  if (rawMessage.trim()) {
    return rawMessage;
  }

  return "Unable to send the invitation. Please try again.";
}

export function InviteMemberForm() {
  const router = useRouter();

  const [
    inviteOrganizationMember,
    { isLoading },
  ] = useInviteOrganizationMemberMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: {
      errors,
      isValid,
    },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "MEMBER",
      permissions: [
        ...DEFAULT_PERMISSIONS_BY_ROLE.MEMBER,
      ],
    },
  });

  const email =
    useWatch({
      control,
      name: "email",
    }) ?? "";

  const selectedRole =
    useWatch({
      control,
      name: "role",
    }) ?? "MEMBER";

  const selectedPermissions =
    useWatch({
      control,
      name: "permissions",
    }) ?? [];

  const selectedRoleTitle =
    INVITE_ROLE_OPTIONS.find(
      (option) => option.role === selectedRole,
    )?.title ?? "Member";

  async function onSubmit(
    values: InviteMemberFormValues,
  ) {
    try {
      const response =
        await inviteOrganizationMember(values).unwrap();

      const expiration =
        typeof response.expiresAt === "string"
          ? new Date(
              response.expiresAt,
            ).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : null;

      toast.success({
        title: "Invitation sent",
        description: expiration
          ? `The invitation was sent to ${values.email}. It expires on ${expiration}.`
          : `The invitation was sent to ${values.email}.`,
      });

      router.push("/dashboard/team-management");
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error);

      setError("root", {
        message,
      });

      toast.destructive({
        title: "Invitation failed",
        description: message,
      });
    }
  }

  function handleRoleChange(values: string[]) {
    const nextRole = values[0] as
      | InviteRoleOption["role"]
      | undefined;

    if (!nextRole) {
      return;
    }

    setValue("role", nextRole, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setValue(
      "permissions",
      [
        ...(
          DEFAULT_PERMISSIONS_BY_ROLE[nextRole] ??
          []
        ),
      ],
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  }

  function handlePermissionChange(values: string[]) {
    setValue(
      "permissions",
      values as InviteMemberFormValues["permissions"],
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  }

  function handleCancel() {
    router.push("/dashboard/team-management");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="order-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 xl:col-start-1">
          <CardHeader className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 sm:px-7">
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Member information
            </CardTitle>

            <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Enter the member&apos;s email address and
              configure their organization access.
            </p>
          </CardHeader>

          <CardContent className="px-6 py-7 sm:px-7">
            <FieldGroup className="gap-6">
              {/* Email */}
              <Field
                data-invalid={Boolean(errors.email)}
              >
                <FieldContent className="gap-3">
                  <FieldLabel
                    htmlFor="member-email"
                    className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Work email
                  </FieldLabel>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="member-email"
                      type="email"
                      autoComplete="email"
                      placeholder="member@company.com"
                      aria-invalid={Boolean(
                        errors.email,
                      )}
                      {...register("email")}
                      className={cn(
                        "h-12 rounded-xl border-slate-300 bg-white pl-12 text-base text-slate-900 shadow-none placeholder:text-slate-400",
                        "focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/15",
                        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
                        errors.email &&
                          "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-500/15",
                      )}
                    />
                  </div>

                  <FieldDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                    The invitation will be sent directly to
                    this email address.
                  </FieldDescription>

                  <FieldError
                    errors={[errors.email]}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="order-2 space-y-4 xl:sticky xl:top-24 xl:col-start-2 xl:row-span-2">
          {/* Role selection */}
          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Organization role
              </CardTitle>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose the access level for this member.
              </p>
            </CardHeader>

            <CardContent className="px-5 py-5">
              <Field
                data-invalid={Boolean(errors.role)}
              >
                <FieldContent className="gap-4">
                  <ToggleGroup
                    multiple={false}
                    value={[selectedRole]}
                    onValueChange={handleRoleChange}
                    className="flex w-full flex-col gap-3"
                  >
                    {INVITE_ROLE_OPTIONS.map(
                      (option) => (
                        <RoleToggleButton
                          key={option.role}
                          option={option}
                          selected={
                            selectedRole ===
                            option.role
                          }
                        />
                      ),
                    )}
                  </ToggleGroup>

                  <FieldError
                    errors={[errors.role]}
                  />
                </FieldContent>
              </Field>
              </CardContent>
            </Card>

          {/* Summary */}
          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-900">
                  <ShieldCheck className="size-5" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Invitation summary
                  </CardTitle>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review before sending
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 px-5 py-5">
              <div className="space-y-3">
                <SummaryField
                  icon={Mail}
                  label="Email address"
                  value={
                    email.trim() ||
                    "Not entered yet"
                  }
                  muted={!email.trim()}
                />

                <SummaryField
                  icon={UserRound}
                  label="Organization role"
                  value={selectedRoleTitle}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Permissions
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPermissions.length > 0 ? (
                    selectedPermissions.map(
                      (permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="rounded-lg border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                        >
                          {formatPermission(
                            permission,
                          )}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-slate-400">
                      No permission selected
                    </span>
                  )}
                </div>
              </div>

              <Separator className="dark:bg-slate-800" />

              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#2563EB] dark:text-blue-400" />

                  <div>
                    <p className="text-sm font-semibold text-blue-950 dark:text-blue-200">
                      Trusted members only
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800 dark:text-blue-300">
                      Review the member&apos;s email, role,
                      and permissions before sending.
                    </p>
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>
        </div>

        <Card className="order-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 xl:col-start-1">
          <CardHeader className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 sm:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Access queue
                </CardTitle>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Assign the permissions this teammate should have from day one.
                </p>
              </div>

              <Badge
                variant="outline"
                className="w-fit rounded-full border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
              >
                {selectedPermissions.length} selected
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-7 sm:px-7">
            <FieldGroup className="gap-6">
              <Field
                data-invalid={Boolean(
                  errors.permissions,
                )}
              >
                <FieldContent className="gap-4">
                  <div>
                    <FieldLabel className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Permissions
                    </FieldLabel>

                    <FieldDescription className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Select what this member can access inside the organization.
                    </FieldDescription>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="p-3">
                      <ToggleGroup
                        multiple
                        orientation="vertical"
                        value={selectedPermissions}
                        onValueChange={
                          handlePermissionChange
                        }
                        className="w-full gap-0"
                      >
                        {INVITE_PERMISSION_OPTIONS.map(
                          (option) => (
                            <PermissionTableRow
                              key={option.value}
                              option={option}
                              selected={selectedPermissions.includes(
                                option.value,
                              )}
                            />
                          ),
                        )}
                      </ToggleGroup>
                    </div>
                  </div>

                  <FieldError
                    errors={[
                      errors.permissions,
                    ]}
                  />
                </FieldContent>
              </Field>

              {errors.root?.message ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0" />

                  <p>{errors.root.message}</p>
                </motion.div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-11 rounded-xl border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 shadow-none hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="h-11 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.20)] hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending invitation...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send invitation
                    </>
                  )}
                </Button>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="order-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50 xl:col-start-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            What happens next?
          </p>

          <ol className="mt-4 space-y-4">
            <Step
              number="1"
              text="The member receives an invitation email."
            />

            <Step
              number="2"
              text="They sign in using their account."
            />

            <Step
              number="3"
              text="Their role and permissions are activated."
            />
          </ol>
        </div>
      </div>
    </form>
  );
}

type PermissionTableRowProps = {
  option: InvitePermissionOption;
  selected: boolean;
};

function PermissionTableRow({
  option,
  selected,
}: PermissionTableRowProps) {
  const category =
    getPermissionCategory(option.value);

  return (
      <ToggleGroupItem
        value={option.value}
        aria-label={`${
          selected ? "Remove" : "Add"
        } ${option.title} permission`}
      className={cn(
        "group block h-auto min-h-0 w-full whitespace-normal rounded-none border-0 bg-transparent px-0 py-0 text-left font-normal shadow-none",
        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]/25",
        "hover:bg-transparent aria-pressed:bg-transparent data-[state=on]:bg-transparent dark:hover:bg-transparent dark:aria-pressed:bg-transparent dark:data-[state=on]:bg-transparent",
        "text-slate-900 dark:text-slate-100",
      )}
      >
        <motion.div
        initial={false}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
        className={cn(
          "flex items-center justify-between gap-4 rounded-lg border border-transparent px-3 py-3.5 transition-all duration-200",
          selected
            ? "bg-slate-50/90 shadow-none dark:bg-slate-900/80"
            : "bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/70",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p
                className={cn(
                  "truncate text-sm font-medium transition-colors duration-200 sm:text-base",
                  selected
                    ? "text-[#2563EB] dark:text-blue-300"
                    : "text-slate-900 group-hover:text-[#2563EB] dark:text-slate-100 dark:group-hover:text-blue-300",
                )}
              >
                {option.title}
              </p>

              <PermissionCategoryBadge
                category={category}
              />
            </div>

            <p
              title={option.description}
              className="mt-0.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400"
            >
              {option.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <motion.span
            initial={false}
            animate={{
              scale: selected ? 1 : 0.95,
            }}
            whileHover={{
              scale: 1.02,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            aria-hidden="true"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
              selected
                ? [
                    "border-[#2563EB]",
                    "bg-[#2563EB]",
                    "text-white",
                    "ring-2 ring-blue-100",
                    "dark:border-blue-400",
                    "dark:bg-blue-500",
                    "dark:ring-blue-900/40",
                  ]
                : [
                    "border-slate-300",
                    "bg-white",
                    "text-transparent",
                    "group-hover:border-blue-300",
                    "group-hover:bg-blue-50/80",
                    "group-hover:text-[#2563EB]",
                    "dark:border-slate-700",
                    "dark:bg-slate-950",
                    "dark:group-hover:border-blue-700",
                    "dark:group-hover:bg-blue-950/30",
                    "dark:group-hover:text-blue-300",
                ],
            )}
          >
            <Check className="size-3.5 stroke-[2.5]" />
          </motion.span>
        </div>
      </motion.div>
    </ToggleGroupItem>
  );
}

type RoleToggleButtonProps = {
  option: InviteRoleOption;
  selected: boolean;
};

function RoleToggleButton({
  option,
  selected,
}: RoleToggleButtonProps) {
  const Icon = roleIcons[option.role];
  const capabilities =
    roleCapabilities[option.role];

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.18,
      }}
      className="w-full"
    >
      <ToggleGroupItem
        value={option.role}
        aria-label={`Select ${option.title} role`}
        className={cn(
          "flex h-auto min-h-0 w-full flex-col items-stretch whitespace-normal rounded-xl border px-4 py-4 text-left transition-all duration-200 aria-pressed:bg-white aria-pressed:text-slate-700 dark:aria-pressed:bg-slate-950 dark:aria-pressed:text-slate-200",
          selected
            ? "border-blue-300 bg-white text-slate-700 shadow-none hover:bg-white dark:border-blue-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-950"
            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900",
        )}
      >
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                selected
                  ? "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
              )}
            >
              <Icon className="size-4" />
            </span>

            <div className="min-w-0">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {option.title}
              </p>

              <p className="mt-1 whitespace-normal text-sm leading-5 text-slate-500 dark:text-slate-400">
                {getRoleSummary(option.role)}
              </p>
            </div>
          </div>

            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border",
                selected
                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-slate-300 bg-white text-transparent dark:border-slate-700 dark:bg-slate-950",
            )}
          >
            <Check className="size-4" />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {capabilities.map((capability) => (
            <span
              key={capability}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-sm font-medium",
                selected
                  ? "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
              )}
            >
              {capability}
            </span>
          ))}
        </div>
      </ToggleGroupItem>
    </motion.div>
  );
}

function PermissionCategoryBadge({
  category,
}: {
  category: PermissionCategory;
}) {
  const styles: Record<
    PermissionCategory,
    string
  > = {
    Programs:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",

    Reports:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",

    Disclosure:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",

    Rewards:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",

    General:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "w-fit min-w-[88px] justify-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[category],
      )}
    >
      {category}
    </Badge>
  );
}

type SummaryFieldProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  muted?: boolean;
};

function SummaryField({
  icon: Icon,
  label,
  value,
  muted = false,
}: SummaryFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-700">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p
            title={value}
            className={cn(
              "mt-1 max-w-full text-sm font-semibold leading-5 [overflow-wrap:anywhere]",
              muted
                ? "text-slate-400"
                : "text-slate-900 dark:text-slate-100",
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#2563EB] ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
        {number}
      </span>

      <p className="pt-0.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {text}
      </p>
    </li>
  );
}

function getPermissionCategory(
  permission: InvitePermissionOption["value"],
): PermissionCategory {
  if (permission.includes("PROGRAM")) {
    return "Programs";
  }

  if (permission.includes("REPORT")) {
    return "Reports";
  }

  if (permission.includes("DISCLOSURE")) {
    return "Disclosure";
  }

  if (permission.includes("REWARD")) {
    return "Rewards";
  }

  return "General";
}

function getRoleSummary(
  role: InviteRoleOption["role"],
): string {
  switch (role) {
    case "MANAGER":
      return "Manage organization operations.";

    case "MEMBER":
      return "Work with programs and reports.";

    case "VIEWER":
      return "View content without editing.";

    default:
      return "";
  }
}

function formatPermission(
  permission: string,
): string {
  return permission
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}
