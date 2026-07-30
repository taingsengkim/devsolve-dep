"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  User,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetReportConfirmationsQuery,
  useUpdateConfirmReportMutation,
  ReportConfirmationItem,
} from "@/lib/redux/services/adminApi";

export default function ReportConfirmationPage() {
  const { data: reports, isLoading } = useGetReportConfirmationsQuery();
  const [updateConfirm] = useUpdateConfirmReportMutation();

  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportConfirmationItem | null>(null);

  const filteredReports = (reports || []).filter((rep) => {
    const matchesSeverity = severityFilter === "ALL" || rep.severity.toUpperCase() === severityFilter;
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.researcherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleAction = async (status: "CONFIRMED" | "REJECTED" | "ESCALATED") => {
    if (!selectedReport) return;
    await updateConfirm({ id: selectedReport.id, status });
    setSelectedReport(null);
  };

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
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Admin Platform / Triage Confirmation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Report Triage & Confirmation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review submitted vulnerability reports, confirm severity tiers, and approve escalation to program owners.
          </p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
            <Button
              key={sev}
              variant={severityFilter === sev ? "default" : "ghost"}
              onClick={() => setSeverityFilter(sev)}
              className={`rounded-xl text-sm font-semibold h-9 px-3.5 cursor-pointer ${
                severityFilter === sev
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {sev === "ALL" ? "All Severities" : sev}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report, researcher, or company..."
            className="pl-9 h-10 bg-white border-slate-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800">No Reports Pending Triage</CardTitle>
          <p className="text-sm text-slate-500">There are no reports matching your current filter criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs transition"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      report.severity === "Critical"
                        ? "bg-rose-50 text-rose-600"
                        : report.severity === "High"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <ShieldAlert className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          report.severity === "Critical"
                            ? "bg-rose-600 text-white"
                            : report.severity === "High"
                            ? "bg-orange-500 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {report.severity}
                      </Badge>
                      <Badge variant="outline" className="rounded-full px-2.5 text-xs border-slate-200">
                        {report.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Researcher: <strong className="text-slate-700">{report.researcherName}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Target: <strong className="text-slate-700">{report.companyName}</strong>
                      </span>
                      <span>•</span>
                      <span>Category: {report.category}</span>
                      <span>•</span>
                      <span>Estimate: {report.rewardEstimate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedReport(report)}
                    className="h-10 px-4 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer shadow-2xs"
                  >
                    Review & Triage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Triage Confirmation Audit
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Confirm report severity before forwarding to {selectedReport?.companyName}.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-3 my-2 text-sm p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900">{selectedReport.title}</div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Researcher:</span>
                <span className="font-semibold text-slate-800">{selectedReport.researcherName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Severity Tier:</span>
                <span className="font-semibold text-rose-600">{selectedReport.severity}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Suggested Bounty:</span>
                <span className="font-semibold text-emerald-600">{selectedReport.rewardEstimate}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="destructive"
              onClick={() => handleAction("REJECTED")}
              className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Invalid / Spam
            </Button>
            <Button
              onClick={() => handleAction("CONFIRMED")}
              className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Confirm & Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
