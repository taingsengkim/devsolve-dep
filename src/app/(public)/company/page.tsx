"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Globe,
  Building2,
  Users,
  MapPin,
  ShieldCheck,
  Send,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Award,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  useGetOrganizationByIdQuery,
  useGetOrganizationProgramsByIdQuery,
} from "@/lib/redux/services/organizationsApi";

const defaultCompanyProfile = {
  name: "CyberShield Security",
  handle: "@cybershield",
  logo: null as string | null,
  verified: true,
  description:
    "Official CyberShield Security Organization. We invite security researchers to help us keep our web applications, core API infrastructure, and payment gateways secure.",
  stats: {
    activePrograms: 0,
    resolvedReports: 0,
    totalBountyPaid: "$0",
    maxBounty: "$0",
  },
  details: {
    industry: "Cybersecurity & SaaS",
    companySize: "51-200 employees",
    country: "United States",
    domain: "cybershield.io",
    websiteUrl: "https://cybershield.io",
  },
};

function CompanyProfileContent() {
  const [isFollowing, setIsFollowing] = useState(false);
  const searchParams = useSearchParams();
  const orgId = searchParams.get("id") || searchParams.get("orgId");

  const { data: orgData } = useGetOrganizationByIdQuery(orgId!, {
    skip: !orgId,
  });

  const { data: orgProgramsData } = useGetOrganizationProgramsByIdQuery(
    { id: orgId!, page: 1, size: 20 },
    { skip: !orgId }
  );

  const fetchedPrograms: any[] = Array.isArray(orgProgramsData)
    ? orgProgramsData
    : (orgProgramsData as any)?.content ||
      (Array.isArray((orgProgramsData as any)?.data)
        ? (orgProgramsData as any).data
        : []);
  const activeProgramsCount =
    (orgProgramsData as any)?.totalElements ?? fetchedPrograms.length;

  const displayProfile = {
    name: orgData?.name || defaultCompanyProfile.name,
    handle: orgData?.slug
      ? `@${orgData.slug}`
      : orgData?.name
      ? `@${orgData.name.toLowerCase().replace(/\s+/g, "-")}`
      : defaultCompanyProfile.handle,
    logo: orgData?.logoUrl || defaultCompanyProfile.logo,
    verified: orgData ? (!!orgData.verifiedAt || orgData.status === "ACTIVE") : defaultCompanyProfile.verified,
    description: orgData?.description || defaultCompanyProfile.description,
    stats: {
      activePrograms: activeProgramsCount,
      resolvedReports: 0,
      totalBountyPaid: "$0",
      maxBounty: "$0",
    },
    details: {
      industry: orgData?.industry || defaultCompanyProfile.details.industry,
      companySize: orgData?.companySize || defaultCompanyProfile.details.companySize,
      country: orgData?.country || defaultCompanyProfile.details.country,
      domain: orgData?.domain || defaultCompanyProfile.details.domain,
      websiteUrl: orgData?.websiteUrl || (orgData?.domain ? `https://${orgData.domain}` : defaultCompanyProfile.details.websiteUrl),
    },
  };

  const logoUrl = orgData?.logoUrl;
  const companyInitials = (displayProfile.name || "OR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const displayPrograms = fetchedPrograms.slice(0, 2);
  const catalogHref = orgId ? `/company/programs?id=${orgId}` : "/company/programs";

  return (
    <div className="min-h-screen w-full text-foreground font-sans p-6 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* BACK TO MARKETPLACE BUTTON */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs Marketplace
        </Link>

        {/* 1. HEADER HERO SECTION */}
        <div className="bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Logo & Company Title Info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0 shadow-md overflow-hidden ring-1 ring-foreground/5">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={displayProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black text-foreground tracking-wider">
                    {companyInitials}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {displayProfile.name}
                  </h1>
                  {displayProfile.verified && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active / Verified
                    </span>
                  )}
                  <span className="bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-lg ring-1 ring-foreground/5 dark:ring-foreground/10">
                    Organization Profile
                  </span>
                </div>

                <p className="text-sm text-muted-foreground font-mono">
                  {displayProfile.handle}
                </p>

                <p className="text-sm text-muted-foreground max-w-2xl pt-1 leading-relaxed">
                  {displayProfile.description}
                </p>
              </div>
            </div>

            {/* EXTERNAL ACTION BUTTONS */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isFollowing
                    ? "bg-card text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-card hover:bg-accent text-foreground border-border"
                }`}
              >
                {isFollowing ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Following
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-muted-foreground" />
                    Follow
                  </>
                )}
              </button>

              <a
                href={displayProfile.details.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                Visit website
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

          </div>

          {/* PUBLIC STATS METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
            
            <div className="bg-muted/50 dark:bg-muted/30 p-4 rounded-xl ring-1 ring-foreground/5 dark:ring-foreground/10 space-y-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Active Programs
              </div>
              <div className="text-2xl font-black text-foreground">
                {displayProfile.stats.activePrograms}
              </div>
              <p className="text-[11px] text-muted-foreground">Currently accepting reports</p>
            </div>

            <div className="bg-muted/50 dark:bg-muted/30 p-4 rounded-xl ring-1 ring-foreground/5 dark:ring-foreground/10 space-y-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Resolved Reports
              </div>
              <div className="text-2xl font-black text-foreground">
                {displayProfile.stats.resolvedReports}
              </div>
              <p className="text-[11px] text-muted-foreground">Closed vulnerabilities</p>
            </div>

            <div className="bg-muted/50 dark:bg-muted/30 p-4 rounded-xl ring-1 ring-foreground/5 dark:ring-foreground/10 space-y-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Total Disbursed
              </div>
              <div className="text-2xl font-black text-foreground">
                {displayProfile.stats.totalBountyPaid}
              </div>
              <p className="text-[11px] text-muted-foreground">Bounties paid to researchers</p>
            </div>

            <div className="bg-muted/50 dark:bg-muted/30 p-4 rounded-xl ring-1 ring-foreground/5 dark:ring-foreground/10 space-y-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Top Bounty Award
              </div>
              <div className="text-2xl font-black text-foreground">
                {displayProfile.stats.maxBounty}
              </div>
              <p className="text-[11px] text-muted-foreground">For Critical findings</p>
            </div>

          </div>
        </div>

        {/* 2. MAIN BODY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ACTIVE PROGRAMS DIRECTORY (2 COLUMNS) */}
          <div className="lg:col-span-2 bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-6 space-y-5">
            
            {/* SECTION HEADER WITH LINK TO CATALOG */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">
                  Security Programs
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Public programs owned and operated by {displayProfile.name}.
                </p>
              </div>

              <Link
                href={catalogHref}
                className="flex items-center gap-1.5 bg-muted/60 hover:bg-muted text-primary border border-border text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer group shadow-2xs"
              >
                View Catalog ({activeProgramsCount})
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Preview Program Items (Max 2 items) */}
            {displayPrograms.length === 0 ? (
              <div className="p-8 text-center bg-muted/30 rounded-xl ring-1 ring-foreground/5 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  No security programs published yet
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayProfile.name} has not published any public bug bounty or response programs.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayPrograms.map((program) => {
                  const title = program.name || (program as any).title || "Program";
                  const rawHandle = program.handle || title.toLowerCase().replace(/\s+/g, "-");
                  const handle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;
                  const isBounty = program.offersBounties || (program.engagementType as string) === "BOUNTY";
                  const maxBounty = program.maximumBounty ?? 0;
                  const rewardBadgeText = isBounty
                    ? maxBounty > 0
                      ? `Up to $${maxBounty.toLocaleString()}`
                      : "Up to $15,000"
                    : "Points Only";

                  return (
                    <Link
                      key={program.id}
                      href={`/programs/${program.id}`}
                      className="bg-muted/40 hover:bg-accent/60 ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-xl p-4 flex items-center justify-between gap-4 transition-all group cursor-pointer"
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          {handle}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {isBounty ? (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                            {rewardBadgeText}
                          </span>
                        ) : (
                          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full">
                            {rewardBadgeText}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
                          <Send className="w-3.5 h-3.5" />
                          Submit
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* COMPANY DETAILS SIDEBAR (1 COLUMN) */}
          <div className="bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-6 space-y-5 h-fit">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 tracking-tight">
              Company details
            </h3>

            <div className="space-y-4 text-sm pt-1">
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-muted-foreground" /> Industry
                </span>
                <span className="text-foreground font-medium">
                  {displayProfile.details.industry}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-muted-foreground" /> Size
                </span>
                <span className="text-foreground font-medium">
                  {displayProfile.details.companySize}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Country
                </span>
                <span className="text-foreground font-medium">
                  {displayProfile.details.country}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-muted-foreground" /> Domain
                </span>
                <a
                  href={displayProfile.details.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs inline-flex items-center gap-1"
                >
                  {displayProfile.details.domain}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function PublicOrganizationProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading organization profile...</div>}>
      <CompanyProfileContent />
    </Suspense>
  );
}