"use client";

import { useState } from "react";
import {
  Organization,
  OrganizationIndustry,
  useUpdateMyOrganizationMutation,
} from "@/lib/redux/services/organizationsApi";
import { OrgStatusBadge } from "./OrgStatusBadge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Building2, Globe, MapPin, Users, Calendar, Edit3, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MyOrgCardProps {
  organization: Organization;
}

const INDUSTRIES: { value: OrganizationIndustry; label: string }[] = [
  { value: "TECHNOLOGY", label: "Technology & Software" },
  { value: "FINANCE", label: "Financial Services & Fintech" },
  { value: "HEALTHCARE", label: "Healthcare & Biotech" },
  { value: "ECOMMERCE", label: "E-Commerce & Retail" },
  { value: "GOVERNMENT", label: "Government & Public Sector" },
  { value: "EDUCATION", label: "Education & Academia" },
  { value: "OTHER", label: "Other Industry" },
];

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

export function MyOrgCard({ organization }: MyOrgCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updateOrg, { isLoading: isUpdating }] = useUpdateMyOrganizationMutation();

  const [formData, setFormData] = useState({
    name: organization.name || "",
    domain: organization.domain || "",
    websiteUrl: organization.websiteUrl || "",
    logoUrl: organization.logoUrl || "",
    description: organization.description || "",
    industry: (organization.industry || "TECHNOLOGY") as OrganizationIndustry,
    companySize: organization.companySize || "11-50",
    country: organization.country || "",
  });

  const handleOpenEdit = () => {
    setFormData({
      name: organization.name || "",
      domain: organization.domain || "",
      websiteUrl: organization.websiteUrl || "",
      logoUrl: organization.logoUrl || "",
      description: organization.description || "",
      industry: (organization.industry || "TECHNOLOGY") as OrganizationIndustry,
      companySize: organization.companySize || "11-50",
      country: organization.country || "",
    });
    setIsEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrg(formData).unwrap();
      toast.success("Organization Details Updated", {
        description: "Your organization profile changes have been saved.",
      });
      setIsEditOpen(false);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to update organization details.";
      toast.error("Update Failed", { description: msg });
    }
  };

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {organization.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={organization.logoUrl}
                  alt={organization.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                  {organization.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {organization.name}
                  </CardTitle>
                  <OrgStatusBadge status={organization.status} />
                </div>
                {organization.slug && (
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" /> slug: <span className="font-mono text-slate-700 dark:text-slate-300">{organization.slug}</span>
                  </CardDescription>
                )}
              </div>
            </div>

            <Button
              onClick={handleOpenEdit}
              variant="outline"
              size="sm"
              className="gap-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {organization.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                About Organization
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {organization.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Industry
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {organization.industry || "Not specified"}
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Users className="w-4 h-4 text-indigo-500" />
                Company Size
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {organization.companySize ? `${organization.companySize} employees` : "Not specified"}
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Country
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {organization.country || "Not specified"}
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Globe className="w-4 h-4 text-indigo-500" />
                Domain / Website
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                {organization.websiteUrl ? (
                  <a
                    href={organization.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {organization.domain || organization.websiteUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  organization.domain || "Not specified"
                )}
              </p>
            </div>
          </div>
        </CardContent>

        {organization.createdAt && (
          <CardFooter className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 py-3 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Registered on {new Date(organization.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
          </CardFooter>
        )}
      </Card>

      {/* Edit Organization Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Edit Organization Details
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                Update your organization profile parameters.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="org-name" className="text-sm font-medium">Organization Name</Label>
                <Input
                  id="org-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Corp"
                  className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="org-domain" className="text-sm font-medium">Domain</Label>
                <Input
                  id="org-domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="acme.com"
                  className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="org-country" className="text-sm font-medium">Country</Label>
                <Input
                  id="org-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                  className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="org-website" className="text-sm font-medium">Website URL</Label>
                <Input
                  id="org-website"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://acme.com"
                  className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="org-logo" className="text-sm font-medium">Logo URL</Label>
                <Input
                  id="org-logo"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://acme.com/logo.png"
                  className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(val: string | null) => {
                    if (val) setFormData({ ...formData, industry: val as OrganizationIndustry });
                  }}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Company Size</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(val: string | null) => {
                    if (val) setFormData({ ...formData, companySize: val });
                  }}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {COMPANY_SIZES.map((sz) => (
                      <SelectItem key={sz} value={sz}>
                        {sz} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="org-desc" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="org-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of your company's core mission and services..."
                  className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="border-slate-300 dark:border-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
