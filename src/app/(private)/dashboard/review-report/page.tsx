"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileSearch,
  Search,
  ShieldCheck,
  Award,
  Building2,
  User,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewReportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const auditReports = [
    {
      id: "aud_1",
      title: "SQL Injection in User Authentication Flow",
      company: "Nexus Financial",
      researcher: "alex_sec",
      severity: "Critical",
      reward: "$5,000",
      status: "COMPLETED",
      auditDate: "2026-07-29",
    },
    {
      id: "aud_2",
      title: "Stored XSS in Profile Preferences Comment Box",
      company: "ACME Corp",
      researcher: "byte_wizard",
      severity: "Medium",
      reward: "$600",
      status: "AUDITED",
      auditDate: "2026-07-28",
    },
    {
      id: "aud_3",
      title: "Privilege Escalation via JWT Role Parameter Manipulation",
      company: "CloudPulse Systems",
      researcher: "bug_hunter_pro",
      severity: "Critical",
      reward: "$8,500",
      status: "COMPLETED",
      auditDate: "2026-07-27",
    },
  ];

  const filtered = auditReports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.researcher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Review Report Audit & Compliance Log
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit historic vulnerability payouts, report resolution logs, and platform compliance records.
          </p>
        </div>
      </header>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-800">Audited Reports ({filtered.length})</h2>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report, researcher or company..."
            className="pl-9 h-10 bg-white border-slate-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-bold">
                    {item.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Target: <strong className="text-slate-700">{item.company}</strong></span>
                  <span>•</span>
                  <span>Researcher: <strong className="text-slate-700">{item.researcher}</strong></span>
                  <span>•</span>
                  <span>Bounty: <strong className="text-emerald-600">{item.reward}</strong></span>
                  <span>•</span>
                  <span>Audit Date: {item.auditDate}</span>
                </div>
              </div>

              <div className="shrink-0">
                <Badge variant="outline" className="rounded-xl px-3 py-1 text-xs font-bold border-slate-200 bg-slate-50">
                  Verified Audit Logged
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
