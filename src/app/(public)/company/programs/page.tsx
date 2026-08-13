"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Bookmark,
  ExternalLink,
  ArrowRight,
  Globe,
  ArrowLeft,
} from "lucide-react";

// Mock Data for the specific company
const companyData = {
  name: "CyberShield Security",
  handle: "@cybershield",
  logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Pepsi_logo_2014.svg",
  verified: true,
  website: "https://cybershield.io",
};

// Mock Programs belonging ONLY to CyberShield
const companyPrograms = [
  {
    id: "prog-1",
    title: "Ky Reaksa AUPP Queen",
    handle: "ky-reaksa-aupp-queen",
    type: "Bounty",
    status: "Open",
    description: "Welcome to our core platform bug bounty program. We invite researchers to audit our main consumer API endpoints.",
    inScopeAssets: ["*.example.com", "api.example.com/v2"],
    minReward: "$50",
    maxReward: "$15,000",
  },
  {
    id: "prog-2",
    title: "acme-corp-nextgen-vdp",
    handle: "acme-corp-nextgen-vdp",
    type: "Bounty",
    status: "Open",
    description: "Welcome to the ACME NextGen Security Bounty program! ACME Corp invites security researchers to test our portal.",
    inScopeAssets: ["portal.acme.com", "https://api.acme.com/v1/"],
    minReward: "$50",
    maxReward: "$15,000",
  },
  {
    id: "prog-3",
    title: "Application Security & Mobile SDK",
    handle: "application-security",
    type: "Response",
    status: "Open",
    description: "We prioritize actionable vulnerabilities with a demonstrable impact on user data or core systems.",
    inScopeAssets: ["*.example.com", "api.example.com/v2"],
    minReward: "Points Only",
    maxReward: "",
  },
];

export default function CompanyProgramsCatalogPage() {
  const [filter, setFilter] = useState<"ALL" | "BOUNTY" | "RESPONSE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrograms = companyPrograms.filter((p) => {
    const matchesFilter =
      filter === "ALL" ? true : filter === "BOUNTY" ? p.type === "Bounty" : p.type === "Response";
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full text-foreground font-sans p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BACK TO PROFILE BUTTON */}
        <Link
          href="/company"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Organization Profile
        </Link>

        {/* 1. CUSTOM COMPANY HEADER BANNER */}
        <div className="bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card p-2.5 flex items-center justify-center shrink-0 ring-1 ring-foreground/10 dark:ring-foreground/20 shadow-md">
              <img
                src={companyData.logo}
                alt={companyData.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {companyData.name}
                </h1>
                {companyData.verified && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">{companyData.handle}</p>
              <p className="text-sm text-muted-foreground pt-0.5">
                Browsing all security programs and disclosure targets published by{" "}
                <span className="text-foreground font-semibold">{companyData.name}</span>.
              </p>
            </div>
          </div>

          {/* Website Link */}
          <div className="flex items-center gap-3 shrink-0 z-10 self-start md:self-auto">
            <a
              href={companyData.website}
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
              All ({companyPrograms.length})
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
              placeholder={`Search ${companyData.name}'s programs...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* 3. PROGRAM MARKETPLACE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:ring-blue-500/40 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 group"
            >
              <div className="space-y-4">
                {/* Header: Logo, Company Name, Type Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-card p-1.5 flex items-center justify-center ring-1 ring-foreground/10 shrink-0">
                      <img
                        src={companyData.logo}
                        alt={companyData.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {companyData.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-blue-500/20">
                          {program.type}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-semibold">
                          • {program.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {program.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* In-Scope Assets Chips */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    In-Scope Assets
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {program.inScopeAssets.map((asset, idx) => (
                      <span
                        key={idx}
                        className="bg-muted text-foreground/80 font-mono text-[11px] px-2.5 py-1 rounded-lg ring-1 ring-foreground/5 dark:ring-foreground/10"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Rewards
                  </div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {program.maxReward ? `${program.minReward} - ${program.maxReward}` : program.minReward}
                  </div>
                </div>

                <Link
                  href={`/dashboard/programs/${program.handle}`}
                  className="flex items-center gap-1.5 bg-muted ring-1 ring-foreground/5 dark:ring-foreground/10 group-hover:bg-primary group-hover:text-primary-foreground text-foreground text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs transition-colors"
                >
                  See Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}