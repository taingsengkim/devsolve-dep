"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Globe,
  ArrowLeft,
} from "lucide-react";
import {
  useGetOrganizationByIdQuery,
  useGetOrganizationProgramsByIdQuery,
} from "@/lib/redux/services/organizationsApi";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { Program } from "@/lib/types/programs/types";

const defaultCompanyData = {
  name: "Organization Profile",
  handle: "@organization",
  logo: null as string | null,
  verified: true,
  website: "https://cybershield.io",
};

function CompanyProgramsCatalogContent() {
  const [filter, setFilter] = useState<"ALL" | "BOUNTY" | "RESPONSE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const orgId = searchParams.get("id") || searchParams.get("orgId");

  const { data: orgData } = useGetOrganizationByIdQuery(orgId!, {
    skip: !orgId,
  });

  const { data: orgProgramsData, isLoading } = useGetOrganizationProgramsByIdQuery(
    { id: orgId!, page: 1, size: 50 },
    { skip: !orgId }
  );

  const displayCompany = useMemo(() => {
    return {
      name: orgData?.name || defaultCompanyData.name,
      handle: orgData?.slug
        ? `@${orgData.slug}`
        : orgData?.name
        ? `@${orgData.name.toLowerCase().replace(/\s+/g, "-")}`
        : defaultCompanyData.handle,
      logo: orgData?.logoUrl || defaultCompanyData.logo,
      verified: orgData ? (!!orgData.verifiedAt || orgData.status === "ACTIVE") : defaultCompanyData.verified,
      website: orgData?.websiteUrl || (orgData?.domain ? `https://${orgData.domain}` : defaultCompanyData.website),
    };
  }, [orgData]);

  const backHref = orgId ? `/company?id=${orgId}` : "/company";

  const fetchedPrograms: any[] = useMemo(() => {
    if (!orgProgramsData) return [];
    if (Array.isArray(orgProgramsData)) return orgProgramsData;
    return (
      (orgProgramsData as any).content ||
      (Array.isArray((orgProgramsData as any).data)
        ? (orgProgramsData as any).data
        : [])
    );
  }, [orgProgramsData]);

  const rawPrograms: Program[] = useMemo(() => {
    return fetchedPrograms.map((p) => ({
      ...p,
      organizationId: p.organizationId || orgId || p.organization?.id || "",
      organizationName: p.organizationName || p.organization?.name || displayCompany.name,
      organization: {
        id: p.organization?.id || p.organizationId || orgId || "",
        name: p.organization?.name || p.organizationName || displayCompany.name,
        slug: p.organization?.slug || orgData?.slug,
        logoUrl: p.organization?.logoUrl || p.logoUrl || displayCompany.logo,
        websiteUrl: p.organization?.websiteUrl || displayCompany.website,
      },
    }));
  }, [fetchedPrograms, orgId, orgData, displayCompany]);

  const filteredPrograms = useMemo(() => {
    return rawPrograms.filter((p) => {
      const isBounty = p.offersBounties || p.engagementType === "BOUNTY";
      const matchesFilter =
        filter === "ALL" ? true : filter === "BOUNTY" ? isBounty : !isBounty;
      const matchesSearch =
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [rawPrograms, filter, searchQuery]);

  return (
    <div className="min-h-screen w-full text-foreground font-sans p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BACK TO PROFILE BUTTON */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Organization Profile
        </Link>

        {/* 1. CUSTOM COMPANY HEADER BANNER */}
        <div className="bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0 shadow-md overflow-hidden ring-1 ring-foreground/5">
              {displayCompany.logo ? (
                <img
                  src={displayCompany.logo}
                  alt={displayCompany.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-black text-foreground tracking-wider">
                  {(displayCompany.name || "OR")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {displayCompany.name}
                </h1>
                {displayCompany.verified && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">{displayCompany.handle}</p>
              <p className="text-sm text-muted-foreground pt-0.5">
                Browsing all security programs and disclosure targets published by{" "}
                <span className="text-foreground font-semibold">{displayCompany.name}</span>.
              </p>
            </div>
          </div>

          {/* Website Link */}
          <div className="flex items-center gap-3 shrink-0 z-10 self-start md:self-auto">
            <a
              href={displayCompany.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-card hover:bg-accent text-foreground text-xs font-bold px-4 py-2.5 rounded-xl border border-border transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Official Website
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* 2. SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-muted/60 p-1.5 rounded-xl border border-border">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-blue-600 text-white shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({rawPrograms.length})
            </button>
            <button
              onClick={() => setFilter("BOUNTY")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "BOUNTY"
                  ? "bg-blue-600 text-white shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bounty
            </button>
            <button
              onClick={() => setFilter("RESPONSE")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "RESPONSE"
                  ? "bg-blue-600 text-white shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Response
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${displayCompany.name}'s programs...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* 3. PROGRAM MARKETPLACE CARDS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[280px] bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 animate-pulse p-6"
              />
            ))}
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 text-center space-y-3">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No programs found
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              No bug bounty or disclosure programs published for {displayCompany.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function CompanyProgramsCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading catalog...</div>}>
      <CompanyProgramsCatalogContent />
    </Suspense>
  );
}