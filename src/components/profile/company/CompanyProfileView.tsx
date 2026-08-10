"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Globe2,
  Layers3,
  MapPin,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  useGetMyOrganizationQuery,
  useGetOrganizationMembersQuery,
} from "@/lib/redux/services/organizationsApi";
import { useGetMyCompanyProgramsQuery } from "@/lib/redux/services/program/programsApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrgStatusBadge } from "@/components/organizations/OrgStatusBadge";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CO"
  );
}

function safeExternalUrl(value?: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function formatDisplayValue(value?: string) {
  if (!value) return "Not specified";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function CompanyProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12 animate-pulse"
    >
      <div className="h-20 rounded-2xl bg-muted" />
      <div className="h-64 rounded-2xl bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-28 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-muted" />
        <div className="h-72 rounded-2xl bg-muted" />
      </div>
    </motion.div>
  );
}

export default function CompanyProfileView() {
  const {
    data: organization,
    isLoading: isOrganizationLoading,
    isError,
    refetch,
  } = useGetMyOrganizationQuery();
  const { data: programsResponse, isLoading: isProgramsLoading } =
    useGetMyCompanyProgramsQuery({ size: 100 });
  const { data: members = [], isLoading: isMembersLoading } =
    useGetOrganizationMembersQuery();

  if (isOrganizationLoading || isProgramsLoading || isMembersLoading) {
    return <CompanyProfileSkeleton />;
  }

  if (isError || !organization) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <Card className="mx-auto max-w-xl rounded-2xl text-center">
          <CardHeader className="justify-items-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Building2 className="size-7" aria-hidden="true" />
            </span>
            <CardTitle className="text-xl font-bold">
              Company profile unavailable
            </CardTitle>
            <CardDescription className="max-w-md text-base">
              We couldn&apos;t load the organization connected to this account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
            <Link href="/dashboard" className={buttonVariants()}>
              Back to dashboard
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const programs = programsResponse?.content ?? [];
  const activePrograms = programs.filter(
    (program) => program.state === "ACTIVE"
  ).length;
  const pendingPrograms = programs.filter(
    (program) => program.submissionState === "PENDING_REVIEW"
  ).length;
  const recentPrograms = [...programs]
    .sort((first, second) => {
      const firstDate = Date.parse(first.createdAt || "");
      const secondDate = Date.parse(second.createdAt || "");
      return (Number.isNaN(secondDate) ? 0 : secondDate) -
        (Number.isNaN(firstDate) ? 0 : firstDate);
    })
    .slice(0, 4);
  const websiteUrl = safeExternalUrl(organization.websiteUrl);

  const details = [
    {
      label: "Industry",
      value: formatDisplayValue(organization.industry),
      icon: BriefcaseBusiness,
    },
    {
      label: "Company size",
      value: organization.companySize
        ? `${organization.companySize} employees`
        : "Not specified",
      icon: Users,
    },
    {
      label: "Country",
      value: organization.country || "Not specified",
      icon: MapPin,
    },
    {
      label: "Domain",
      value: organization.domain || "Not specified",
      icon: Globe2,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="flex w-fit items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Company Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Your organization identity, security programs, and team presence.
          </p>
        </div>
        <Link
          href="/dashboard/organizations"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-xl"
          )}
        >
          <Settings2 data-icon="inline-start" />
          Edit organization profile
        </Link>
      </header>

      <Card className="rounded-2xl border-l-4 border-l-primary shadow-xs">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-24 rounded-2xl" aria-label={organization.name}>
              {organization.logoUrl && (
                <AvatarImage
                  src={organization.logoUrl}
                  alt={`${organization.name} logo`}
                  className="rounded-2xl"
                />
              )}
              <AvatarFallback className="rounded-2xl text-xl font-bold">
                {initialsOf(organization.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {organization.name}
                </CardTitle>
                <OrgStatusBadge status={organization.status} />
                <Badge variant="secondary">Organization profile</Badge>
              </div>
              <CardDescription className="text-base">
                {organization.slug ? `@${organization.slug}` : "Organization account"}
              </CardDescription>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                {organization.description ||
                  "Add an organization description to introduce your security team and program goals."}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-xl bg-muted/50 p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Organization handle
            </span>
            <strong className="truncate text-base font-semibold">
              {organization.slug ? `@${organization.slug}` : "Not assigned"}
            </strong>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-muted/50 p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Primary domain
            </span>
            <strong className="truncate text-base font-semibold">
              {organization.domain || "Not specified"}
            </strong>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-muted/50 p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Verification
            </span>
            <strong className="truncate text-base font-semibold">
              {formatDisplayValue(organization.status)}
            </strong>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-3 border-t bg-muted/20">
          <Link
            href="/dashboard/program-management"
            className={buttonVariants({ size: "lg" })}
          >
            <Layers3 data-icon="inline-start" />
            Manage programs
          </Link>
          <Link
            href="/dashboard/team-management"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Users data-icon="inline-start" />
            Manage team
          </Link>
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              <Globe2 data-icon="inline-start" />
              Visit website
              <ArrowUpRight data-icon="inline-end" />
            </a>
          )}
        </CardFooter>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Organization summary">
        {[
          {
            label: "All programs",
            value: programs.length,
            helper: "Owned by this company",
            icon: Layers3,
          },
          {
            label: "Active programs",
            value: activePrograms,
            helper: "Currently running",
            icon: ShieldCheck,
          },
          {
            label: "Team members",
            value: members.length,
            helper: "Organization workspace",
            icon: Users,
          },
          {
            label: "Review queue",
            value: pendingPrograms,
            helper: pendingPrograms === 1 ? "Program pending" : "Programs pending",
            icon: ShieldCheck,
          },
        ].map((stat) => (
          <Card key={stat.label} size="sm" className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <stat.icon className="size-4" aria-hidden="true" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <strong className="text-3xl font-bold tracking-tight">
                {stat.value}
              </strong>
              <span className="text-sm text-muted-foreground">
                {stat.helper}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <Card className="rounded-2xl lg:order-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Company details</CardTitle>
            <CardDescription>
              Public-facing organization information.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {details.map((detail, index) => (
              <div key={detail.label} className="flex flex-col gap-4">
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <detail.icon className="size-4" aria-hidden="true" />
                    {detail.label}
                  </span>
                  <span className="max-w-[60%] truncate text-sm font-semibold">
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
            {organization.createdAt && (
              <>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    Registered
                  </span>
                  <span className="text-sm font-semibold">
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl lg:order-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent programs</CardTitle>
            <CardDescription>
              Programs owned by {organization.name}.
            </CardDescription>
            <CardAction>
              <Link
                href="/dashboard/program-management"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                View all
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentPrograms.length > 0 ? (
              recentPrograms.map((program, index) => (
                <div key={program.id} className="flex flex-col gap-4">
                  {index > 0 && <Separator />}
                  <Link
                    href={`/dashboard/program-management/${program.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl transition-colors hover:text-primary"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {program.name}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        @{program.handle}
                      </span>
                    </span>
                    <Badge variant="secondary">
                      {formatDisplayValue(program.submissionState)}
                    </Badge>
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Layers3 className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-semibold">No programs yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first security program for this organization.
                  </p>
                </div>
                <Link
                  href="/dashboard/create-program"
                  className={buttonVariants({ size: "sm" })}
                >
                  Create program
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
