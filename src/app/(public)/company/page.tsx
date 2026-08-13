"use client";

import React, { useState } from "react";
import Link from "next/link";
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

// Mock data for company profile
const companyProfile = {
  name: "CyberShield Security",
  handle: "@cybershield",
  logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Pepsi_logo_2014.svg",
  verified: true,
  description:
    "Official CyberShield Security Organization. We invite security researchers to help us keep our web applications, core API infrastructure, and payment gateways secure.",
  stats: {
    activePrograms: 3,
    resolvedReports: 142,
    totalBountyPaid: "$42,500",
    maxBounty: "$15,000",
  },
  details: {
    industry: "Cybersecurity & SaaS",
    companySize: "51-200 employees",
    country: "United States",
    domain: "cybershield.io",
    websiteUrl: "https://cybershield.io",
  },
  programs: [
    {
      id: "prog-001",
      title: "Ky Reaksa AUPP Queen",
      handle: "@ky-reaksa-aupp-queen",
      type: "BOUNTY",
      rewardText: "Up to $15,000",
    },
    {
      id: "prog-002",
      title: "CyberShield Mobile SDK & Auth Services",
      handle: "@cybershield-mobile-2026",
      type: "RESPONSE",
      rewardText: "Points Only",
    },
  ],
};

export default function PublicOrganizationProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-6 sm:p-8 space-y-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* BACK TO MARKETPLACE BUTTON */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs Marketplace
        </Link>

        {/* 1. HEADER HERO SECTION */}
        <div className="bg-[#131926] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Logo & Company Title Info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 border border-slate-700 shadow-md">
                <img
                  src={companyProfile.logo}
                  alt={companyProfile.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {companyProfile.name}
                  </h1>
                  {companyProfile.verified && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active / Verified
                    </span>
                  )}
                  <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-700">
                    Organization Profile
                  </span>
                </div>

                <p className="text-sm text-slate-400 font-mono">
                  {companyProfile.handle}
                </p>

                <p className="text-sm text-slate-300 max-w-2xl pt-1 leading-relaxed">
                  {companyProfile.description}
                </p>
              </div>
            </div>

            {/* EXTERNAL ACTION BUTTONS */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isFollowing
                    ? "bg-slate-800 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
              >
                {isFollowing ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    Following
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Follow
                  </>
                )}
              </button>

              <a
                href={companyProfile.details.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                Visit website
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

          </div>

          {/* PUBLIC STATS METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            
            <div className="bg-[#1a2133] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Active Programs
              </div>
              <div className="text-2xl font-black text-white">
                {companyProfile.stats.activePrograms}
              </div>
              <p className="text-[11px] text-slate-500">Currently accepting reports</p>
            </div>

            <div className="bg-[#1a2133] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resolved Reports
              </div>
              <div className="text-2xl font-black text-white">
                {companyProfile.stats.resolvedReports}
              </div>
              <p className="text-[11px] text-slate-500">Closed vulnerabilities</p>
            </div>

            <div className="bg-[#1a2133] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Total Disbursed
              </div>
              <div className="text-2xl font-black text-white">
                {companyProfile.stats.totalBountyPaid}
              </div>
              <p className="text-[11px] text-slate-500">Bounties paid to researchers</p>
            </div>

            <div className="bg-[#1a2133] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                Top Bounty Award
              </div>
              <div className="text-2xl font-black text-white">
                {companyProfile.stats.maxBounty}
              </div>
              <p className="text-[11px] text-slate-500">For Critical findings</p>
            </div>

          </div>
        </div>

        {/* 2. MAIN BODY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ACTIVE PROGRAMS DIRECTORY (2 COLUMNS) */}
          <div className="lg:col-span-2 bg-[#131926] border border-slate-800 rounded-2xl p-6 space-y-5">
            
            {/* SECTION HEADER WITH LINK TO PAGE 2 */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Security Programs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Public programs owned and operated by {companyProfile.name}.
                </p>
              </div>

              {/* 🚀 BUTTON NAVIGATING TO COMPANY CATALOG PAGE */}
              <Link
                href="/company/programs"
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer group shadow-sm"
              >
                View Catalog ({companyProfile.stats.activePrograms})
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Preview Program Items */}
            <div className="space-y-3">
              {companyProfile.programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-[#1a2133] hover:bg-[#20293d] border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      {program.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {program.handle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {program.type === "BOUNTY" ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-lg">
                        {program.rewardText}
                      </span>
                    ) : (
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-lg">
                        {program.rewardText}
                      </span>
                    )}

                    <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer">
                      <Send className="w-3.5 h-3.5" />
                      Submit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPANY DETAILS SIDEBAR (1 COLUMN) */}
          <div className="bg-[#131926] border border-slate-800 rounded-2xl p-6 space-y-5 h-fit">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 tracking-tight">
              Company details
            </h3>

            <div className="space-y-4 text-sm pt-1">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-slate-500" /> Industry
                </span>
                <span className="text-white font-medium">
                  {companyProfile.details.industry}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-slate-500" /> Size
                </span>
                <span className="text-white font-medium">
                  {companyProfile.details.companySize}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-slate-500" /> Country
                </span>
                <span className="text-white font-medium">
                  {companyProfile.details.country}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-slate-500" /> Domain
                </span>
                <a
                  href={`https://${companyProfile.details.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline font-mono text-xs inline-flex items-center gap-1"
                >
                  {companyProfile.details.domain}
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