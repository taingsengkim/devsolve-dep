"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Globe,
  ExternalLink,
  Filter,
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
  useGetCompanyVerificationsQuery,
  useUpdateCompanyVerificationStatusMutation,
  CompanyVerificationItem,
} from "@/lib/redux/services/adminApi";

export default function CompanyVerificationPage() {
  const { data: verifications, isLoading } = useGetCompanyVerificationsQuery();
  const [updateStatus] = useUpdateCompanyVerificationStatusMutation();

  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyVerificationItem | null>(null);
  const [notes, setNotes] = useState("");

  const filteredItems = (verifications || []).filter((item) => {
    const matchesFilter = statusFilter === "ALL" || item.status === statusFilter;
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.taxId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedCompany) return;
    await updateStatus({ id: selectedCompany.id, status, notes });
    setSelectedCompany(null);
    setNotes("");
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
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Platform / Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Company KYB & Verification Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit registered organizations, verify corporate tax credentials, and approve VDP program creation rights.
          </p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "ghost"}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl text-sm font-semibold h-9 px-3.5 cursor-pointer ${
                statusFilter === status
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status === "ALL" && "All Registrations"}
              {status === "PENDING" && "Pending Review"}
              {status === "APPROVED" && "Approved"}
              {status === "REJECTED" && "Rejected"}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or tax ID..."
            className="pl-9 h-10 bg-white border-slate-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Verification List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800">No Verifications Found</CardTitle>
          <p className="text-sm text-slate-500">There are no company verification records matching your current filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs transition"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900">{item.companyName}</h3>
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : item.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {item.domain}
                      </span>
                      <span>•</span>
                      <span>Tax ID: {item.taxId}</span>
                      <span>•</span>
                      <span>Category: {item.businessType}</span>
                      <span>•</span>
                      <span>Registered: {item.registrationDate}</span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCompany(item)}
                    className="h-10 px-4 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer shadow-2xs"
                  >
                    Review KYB Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Company Verification Audit
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Review KYB registration credentials for {selectedCompany?.companyName}.
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-4 my-2 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Domain:</span>
                  <span className="font-semibold text-slate-800">{selectedCompany.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Tax Identifier:</span>
                  <span className="font-semibold text-slate-800">{selectedCompany.taxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Contact Email:</span>
                  <span className="font-semibold text-slate-800">{selectedCompany.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Attached Docs:</span>
                  <span className="font-semibold text-blue-600">{selectedCompany.documentsCount} Documents Verified</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Admin Verification Notes
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason or approval note..."
                  className="bg-white border-slate-300 rounded-xl text-sm"
                />
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
              Reject KYB
            </Button>
            <Button
              onClick={() => handleAction("APPROVED")}
              className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Approve & Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
