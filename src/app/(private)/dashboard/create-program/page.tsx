"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  FileText,
  Target,
  BookOpen,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Save,
  Send,
  Info,
  Eye,
  CheckCircle2,
  HelpCircle,
  Bookmark,
  ArrowRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProgramMutation } from "@/lib/redux/services/program/programsApi";
import type { Asset } from "@/lib/types/programs/types";

export type ProgramType = "RESPONSE" | "BOUNTY";
export type ProgramVisibility = "PUBLIC" | "PRIVATE";
export type ProgramStatus = "DRAFT" | "SCHEDULED" | "OPEN";

interface ScopeTarget {
  id: string;
  type: string;
  target: string;
  description: string;
}

export default function CreateProgramPage() {
  const [activeTab, setActiveTab] = useState<number>(1);

  // Form State
  const [programName, setProgramName] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [programType, setProgramType] = useState<ProgramType>("BOUNTY");
  const [visibility, setVisibility] = useState<ProgramVisibility>("PUBLIC");
  const [policy, setPolicy] = useState("");

  // Scope State
  const [inScopeTargets, setInScopeTargets] = useState<ScopeTarget[]>([
    { id: "1", type: "WEB", target: "*.example.com", description: "" },
    { id: "2", type: "API", target: "api.example.com/v2", description: "" },
  ]);
  const [outOfScopeTargets, setOutOfScopeTargets] = useState<ScopeTarget[]>([
    { id: "1", type: "WEB", target: "", description: "" },
  ]);
  // Rules State
  const [rulesOfEngagement, setRulesOfEngagement] = useState(
    "• Automated scanning is allowed up to 5 req/sec\n• DoS attacks are strictly prohibited\n• Social engineering is not allowed\n• Test only on your own test accounts",
  );
  const [excludedTypes, setExcludedTypes] = useState<string[]>([]);
  const [newExcludedInput, setNewExcludedInput] = useState("");
  const [pocRequirements, setPocRequirements] = useState(
    "• Step-by-step reproduction guide\n• The exact HTTP request / payload\n• Screenshot or video recording",
  );

  // Bounty / Reward Matrix State
  const [offerBounties, setOfferBounties] = useState(true);
  const [bountyMatrix, setBountyMatrix] = useState({
    critical: { min: "5000", max: "15000" },
    high: { min: "1000", max: "5000" },
    medium: { min: "250", max: "1000" },
    low: { min: "50", max: "250" },
  });

  const [pointsMatrix, setPointsMatrix] = useState({
    critical: { min: "80", max: "150" },
    high: { min: "40", max: "80" },
    medium: { min: "20", max: "40" },
    low: { min: "5", max: "20" },
  });

  const router = useRouter();
  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();

  type AssetType = "URL" | "IP" | "MOBILE" | "OTHER";

  const mapAssetType = (type: string): AssetType => {
    if (type === "MOBILE") return "MOBILE";
    if (type === "OTHER") return "OTHER";
    if (type === "IP") return "IP";
    return "URL";
  };

  const buildRuleSection = (text: string, description: string) => ({
    description,
    rules: text
      .split(/\r?\n/)
      .map((line) => line.replace(/^[•\-\s]+/, "").trim())
      .filter(Boolean),
  });

  const buildAssets = (): Asset[] => {
    const inScopeAssets: Asset[] = inScopeTargets
      .filter((item) => item.target.trim() !== "")
      .map((item) => ({
        assetType: mapAssetType(item.type),
        identifier: item.target.trim(),
        description: item.description.trim() || item.target.trim(),
        isInScope: true,
        maxSeverity: "MEDIUM",
      }));

    const outOfScopeAssets: Asset[] = outOfScopeTargets
      .filter((item) => item.target.trim() !== "")
      .map((item) => ({
        assetType: mapAssetType(item.type),
        identifier: item.target.trim(),
        description: item.description.trim() || item.target.trim(),
        isInScope: false,
        maxSeverity: "LOW",
      }));

    return [...inScopeAssets, ...outOfScopeAssets];
  };

  type RewardLevelKey = "critical" | "high" | "medium" | "low";

  const buildRewards = () => {
    const levels: Array<{
      key: RewardLevelKey;
      severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    }> = [
      { key: "critical", severity: "CRITICAL" },
      { key: "high", severity: "HIGH" },
      { key: "medium", severity: "MEDIUM" },
      { key: "low", severity: "LOW" },
    ];

    return levels.map(({ key, severity }) => ({
      severity,
      minAmount: offerBounties ? parseInt(bountyMatrix[key].min || "0", 10) : 0,
      maxAmount: offerBounties ? parseInt(bountyMatrix[key].max || "0", 10) : 0,
      points: parseInt(pointsMatrix[key].max || "0", 10),
    }));
  };

  const handleCreateProgram = async () => {
    if (!programName.trim() || !handle.trim() || !description.trim()) {
      toast.error("Program name, handle, and description are required.");
      return;
    }

    const effectiveExcludedTypes = newExcludedInput.trim()
      ? [...excludedTypes, newExcludedInput.trim()]
      : excludedTypes;

    if (effectiveExcludedTypes.length === 0) {
      toast.error("Please add at least one exclusion rule.");
      setActiveTab(3);
      return;
    }

    if (buildAssets().length === 0) {
      toast.error("Please add at least one in-scope or out-of-scope asset.");
      setActiveTab(2);
      return;
    }

    try {
      const payload = {
        handle,
        name: programName,
        description,
        engagementType:
          programType === "RESPONSE" ? ("VDP" as const) : ("BOUNTY" as const),
        visibility,
        policy,
        proofOfConceptRequirements: pocRequirements,
        rulesOfEngagement: buildRuleSection(
          rulesOfEngagement,
          "Rules of engagement",
        ),
        exclusions: {
          description: "Excluded vulnerability types",
          rules: effectiveExcludedTypes,
        },
        offersBounties: offerBounties,
        minimumBounty: offerBounties
          ? parseInt(bountyMatrix.low.min || "0", 10)
          : 0,
        maximumBounty: offerBounties
          ? parseInt(bountyMatrix.critical.max || "0", 10)
          : 0,
        assets: buildAssets(),
        rewards: buildRewards(),
      };

      const result = await createProgram(payload).unwrap();
      toast.success("Program created successfully.");
      if (result?.id) {
        router.push(`/dashboard/programs/${result.id}`);
      } else {
        router.push("/dashboard/programs");
      }
    } catch (error) {
      console.error("Create program failed", error);

      const apiError = error as FetchBaseQueryError & {
        data?:
          | string
          | {
              message?: string;
              error?: string;
              details?: string;
              title?: string;
              violations?: Array<{ field?: string; message?: string }>;
              errors?: Array<string | { message?: string }>;
            };
      };

      const parseValidationMessage = () => {
        if (typeof apiError.data === "string") {
          return apiError.data;
        }

        const data = apiError.data ?? {};
        const message =
          typeof data.message === "string" ? data.message : undefined;
        const errorText =
          typeof data.error === "string" ? data.error : undefined;
        const details =
          typeof data.details === "string" ? data.details : undefined;
        const title = typeof data.title === "string" ? data.title : undefined;
        const errorDetails =
          data && typeof data === "object" && "errorDetails" in data
            ? (data as { errorDetails?: unknown }).errorDetails
            : undefined;

        const violations = Array.isArray(data.violations)
          ? data.violations
              .map((item) =>
                item && typeof item === "object"
                  ? item.message || item.field || JSON.stringify(item)
                  : String(item),
              )
              .filter(Boolean)
          : [];

        const errors = Array.isArray(data.errors)
          ? data.errors
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item && typeof item === "object"
                    ? item.message || JSON.stringify(item)
                    : String(item),
              )
              .filter(Boolean)
          : [];

        const errorDetailsMessages =
          errorDetails && typeof errorDetails === "object"
            ? Object.entries(errorDetails).map(
                ([key, value]) =>
                  `${key}: ${
                    typeof value === "string" ? value : JSON.stringify(value)
                  }`,
              )
            : [];

        return (
          message ||
          errorText ||
          details ||
          title ||
          violations.join(" \n") ||
          errors.join(" \n") ||
          errorDetailsMessages.join(" \n") ||
          String(apiError.status) ||
          "Unable to create program. Please check your details and try again."
        );
      };

      const rawMessage = parseValidationMessage();
      toast.error(rawMessage);
    }
  };

  // Handle Name Change & Auto Handle Generation
  const handleNameChange = (val: string) => {
    setProgramName(val);
    setHandle(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    );
  };

  // Scope handlers
  const addInScope = () => {
    setInScopeTargets([
      ...inScopeTargets,
      { id: Date.now().toString(), type: "WEB", target: "", description: "" },
    ]);
  };
  const removeInScope = (id: string) => {
    setInScopeTargets(inScopeTargets.filter((item) => item.id !== id));
  };

  const addOutOfScope = () => {
    setOutOfScopeTargets([
      ...outOfScopeTargets,
      { id: Date.now().toString(), type: "WEB", target: "", description: "" },
    ]);
  };
  const removeOutOfScope = (id: string) => {
    setOutOfScopeTargets(outOfScopeTargets.filter((item) => item.id !== id));
  };

  const handleAddExcludedType = () => {
    if (newExcludedInput.trim()) {
      setExcludedTypes([...excludedTypes, newExcludedInput.trim()]);
      setNewExcludedInput("");
    }
  };

  const steps = [
    { id: 1, label: "Basic Info", icon: FileText },
    { id: 2, label: "Scope", icon: Target },
    { id: 3, label: "Rules", icon: BookOpen },
    { id: 4, label: "Bounty Matrix", icon: DollarSign },
  ];

  // Helper for right sidebar tips based on step
  const getStepTip = () => {
    switch (activeTab) {
      case 1:
        return {
          title: "Crafting a Clear Title",
          text: "Choose a program name that clearly indicates the scope. Handles should be clean, unique, and lowercase.",
        };
      case 2:
        return {
          title: "Defining Scope Accurately",
          text: "Be explicit about wildcards (*.domain.com). Clearly state out-of-scope services to prevent invalid reports.",
        };
      case 3:
        return {
          title: "Clear Rules Build Trust",
          text: "Mention maximum request rates and forbidden test types clearly. Well-defined PoC requirements lead to better submissions.",
        };
      case 4:
        return {
          title: "Rewards Strategy",
          text:
            programType === "BOUNTY"
              ? "Competitive cash bounties attract top researchers. You can adjust your range anytime."
              : "Points-based programs track reputation for researchers on vulnerability disclosure programs.",
        };
      default:
        return { title: "", text: "" };
    }
  };

  // Compute lowest & highest reward for preview
  const getRewardRange = () => {
    if (programType === "BOUNTY") {
      const minVal = parseInt(bountyMatrix.low.min || "0").toLocaleString();
      const maxVal = parseInt(
        bountyMatrix.critical.max || "0",
      ).toLocaleString();
      return `$${minVal} - $${maxVal}`;
    } else {
      const minVal = pointsMatrix.low.min || "0";
      const maxVal = pointsMatrix.critical.max || "0";
      return `${minVal} - ${maxVal} pts`;
    }
  };

  const activeInScope = inScopeTargets.filter((t) => t.target.trim() !== "");

  return (
    <div className="min-h-screen w-full text-slate-800 font-sans py-6 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6 w-full"
      >
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Program
          </h1>
          <p className="text-base text-slate-500 mt-1 font-normal">
            Fill in the details to launch your security program
          </p>
        </div>

        {/* STEPPER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;
            const isCompleted = activeTab > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : isCompleted
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100/70"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200/70"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-blue-600" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: FORM STEPS */}
          <div className="lg:col-span-2 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* STEP 1: BASIC INFO */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Program Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Program Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="ACME Web Application Security"
                      value={programName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500"
                    />
                  </div>

                  {/* Handle */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Handle <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="acme-web-security"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 text-base font-mono focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Describe what hackers can test and what you're looking for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 resize-none p-3.5"
                  />
                </div>

                {/* Program Type & Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Program Type
                    </label>
                    <select
                      value={programType}
                      onChange={(e) =>
                        setProgramType(e.target.value as ProgramType)
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BOUNTY">
                        Bounty (Offers Cash Rewards)
                      </option>
                      <option value="RESPONSE">
                        Response (Points / Reputation Only)
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Visibility
                    </label>
                    <select
                      value={visibility}
                      onChange={(e) =>
                        setVisibility(e.target.value as ProgramVisibility)
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </div>
                </div>

                {/* Policy */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Policy
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Describe your responsible disclosure policy..."
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    className="rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 resize-none p-3.5"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: SCOPE DEFINITION */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Scope Definition
                </h2>

                {/* IN-SCOPE TARGETS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <label className="text-sm font-semibold text-slate-800">
                      In-Scope Targets
                    </label>
                  </div>

                  {inScopeTargets.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = [...inScopeTargets];
                          updated[index].type = e.target.value;
                          setInScopeTargets(updated);
                        }}
                        className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 shrink-0"
                      >
                        <option value="WEB">Web</option>
                        <option value="API">API</option>
                        <option value="MOBILE">Mobile</option>
                        <option value="OTHER">Other</option>
                      </select>

                      <Input
                        type="text"
                        placeholder="app.example.com or api.example.com/*"
                        value={item.target}
                        onChange={(e) => {
                          const updated = [...inScopeTargets];
                          updated[index].target = e.target.value;
                          setInScopeTargets(updated);
                        }}
                        className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 flex-1"
                      />

                      <Input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...inScopeTargets];
                          updated[index].description = e.target.value;
                          setInScopeTargets(updated);
                        }}
                        className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 flex-1 hidden md:block"
                      />

                      {inScopeTargets.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInScope(item.id)}
                          className="h-11 w-11 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={addInScope}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm h-10 px-4"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add In-Scope Target
                  </Button>
                </div>

                <hr className="border-slate-100" />

                {/* OUT-OF-SCOPE TARGETS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                      ✕
                    </span>
                    <label className="text-sm font-semibold text-slate-800">
                      Out-of-Scope Targets
                    </label>
                  </div>

                  {outOfScopeTargets.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = [...outOfScopeTargets];
                          updated[index].type = e.target.value;
                          setOutOfScopeTargets(updated);
                        }}
                        className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 shrink-0"
                      >
                        <option value="WEB">Web</option>
                        <option value="API">API</option>
                        <option value="MOBILE">Mobile</option>
                        <option value="OTHER">Other</option>
                      </select>

                      <Input
                        type="text"
                        placeholder="*.internal.example.com"
                        value={item.target}
                        onChange={(e) => {
                          const updated = [...outOfScopeTargets];
                          updated[index].target = e.target.value;
                          setOutOfScopeTargets(updated);
                        }}
                        className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 flex-1"
                      />

                      <Input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...outOfScopeTargets];
                          updated[index].description = e.target.value;
                          setOutOfScopeTargets(updated);
                        }}
                        className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 flex-1 hidden md:block"
                      />

                      {outOfScopeTargets.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOutOfScope(item.id)}
                          className="h-11 w-11 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={addOutOfScope}
                    className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm h-10 px-4"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Out-Of-Scope Target
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: RULES & EXCLUSIONS */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Rules & Exclusions
                </h2>

                {/* Rules of Engagement */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Rules of Engagement
                  </label>
                  <Textarea
                    rows={5}
                    value={rulesOfEngagement}
                    onChange={(e) => setRulesOfEngagement(e.target.value)}
                    className="rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 font-mono resize-none p-3.5"
                  />
                </div>

                {/* Excluded Vulnerabilities */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Excluded Vulnerability Types ({excludedTypes.length})
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. DDoS attacks, Spam, Self-XSS"
                      value={newExcludedInput}
                      onChange={(e) => setNewExcludedInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddExcludedType())
                      }
                      className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddExcludedType}
                      className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm h-11 px-6"
                    >
                      Add
                    </Button>
                  </div>

                  {excludedTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {excludedTypes.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() =>
                              setExcludedTypes(
                                excludedTypes.filter((_, i) => i !== idx),
                              )
                            }
                            className="hover:text-rose-600"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Proof of Concept Requirements */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Proof of Concept (PoC) Requirements
                  </label>
                  <Textarea
                    rows={4}
                    value={pocRequirements}
                    onChange={(e) => setPocRequirements(e.target.value)}
                    className="rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 font-mono resize-none p-3.5"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: BOUNTY MATRIX */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900">
                  {programType === "BOUNTY"
                    ? "Bounty Matrix"
                    : "Response Matrix"}
                </h2>

                {/* Checkbox Offer Financial Bounties */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="offerBounties"
                    checked={offerBounties}
                    onChange={(e) => setOfferBounties(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="offerBounties"
                    className="text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    {programType === "BOUNTY"
                      ? "Offer financial bounties (Bounty Program)"
                      : "Offer reputation points (Response Program)"}
                  </label>
                </div>

                {/* REWARD MATRIX TABLE (DYNAMIC $ vs pts) */}
                {offerBounties && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                          <th className="py-3.5 px-6">Severity</th>
                          <th className="py-3.5 px-4">
                            Min ({programType === "BOUNTY" ? "$" : "pts"})
                          </th>
                          <th className="py-3.5 px-6">
                            Max ({programType === "BOUNTY" ? "$" : "pts"})
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* CRITICAL */}
                        <tr>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                              CRITICAL
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.critical.min
                                  : pointsMatrix.critical.min
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    critical: {
                                      ...bountyMatrix.critical,
                                      min: val,
                                    },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    critical: {
                                      ...pointsMatrix.critical,
                                      min: val,
                                    },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.critical.max
                                  : pointsMatrix.critical.max
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    critical: {
                                      ...bountyMatrix.critical,
                                      max: val,
                                    },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    critical: {
                                      ...pointsMatrix.critical,
                                      max: val,
                                    },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                        </tr>

                        {/* HIGH */}
                        <tr>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                              HIGH
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.high.min
                                  : pointsMatrix.high.min
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    high: { ...bountyMatrix.high, min: val },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    high: { ...pointsMatrix.high, min: val },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.high.max
                                  : pointsMatrix.high.max
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    high: { ...bountyMatrix.high, max: val },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    high: { ...pointsMatrix.high, max: val },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                        </tr>

                        {/* MEDIUM */}
                        <tr>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-sky-50 text-sky-600 border border-sky-200">
                              MEDIUM
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.medium.min
                                  : pointsMatrix.medium.min
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    medium: {
                                      ...bountyMatrix.medium,
                                      min: val,
                                    },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    medium: {
                                      ...pointsMatrix.medium,
                                      min: val,
                                    },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.medium.max
                                  : pointsMatrix.medium.max
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    medium: {
                                      ...bountyMatrix.medium,
                                      max: val,
                                    },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    medium: {
                                      ...pointsMatrix.medium,
                                      max: val,
                                    },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                        </tr>

                        {/* LOW */}
                        <tr>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                              LOW
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.low.min
                                  : pointsMatrix.low.min
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    low: { ...bountyMatrix.low, min: val },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    low: { ...pointsMatrix.low, min: val },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <Input
                              type="number"
                              value={
                                programType === "BOUNTY"
                                  ? bountyMatrix.low.max
                                  : pointsMatrix.low.max
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (programType === "BOUNTY") {
                                  setBountyMatrix({
                                    ...bountyMatrix,
                                    low: { ...bountyMatrix.low, max: val },
                                  });
                                } else {
                                  setPointsMatrix({
                                    ...pointsMatrix,
                                    low: { ...pointsMatrix.low, max: val },
                                  });
                                }
                              }}
                              className="h-10 w-32 rounded-xl text-base font-semibold border-slate-200"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* INFO BOX */}
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-3 text-blue-900">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {programType === "BOUNTY"
                      ? "Financial rewards are displayed on resolved reports and agreed on-platform. Actual payment transfers occur off-platform via email or direct communication."
                      : "Points are rewarded upon valid vulnerability resolution and count towards researcher platform rankings."}
                  </p>
                </div>
              </div>
            )}

            {/* FOOTER NAVIGATION BUTTONS */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={activeTab === 1}
                onClick={() => setActiveTab((prev) => Math.max(prev - 1, 1))}
                className="rounded-xl border-slate-200 text-slate-700 font-semibold text-sm h-11 px-5"
              >
                <ChevronLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-slate-200 text-slate-700 font-semibold text-sm h-11 px-5 gap-2"
                >
                  <Save className="w-4 h-4 text-slate-500" />
                  Save as Draft
                </Button>

                {activeTab < 4 ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setActiveTab((prev) => Math.min(prev + 1, 4))
                    }
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm h-11 px-6 gap-1.5"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCreateProgram}
                    disabled={isCreating}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-11 px-6 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isCreating ? "Creating..." : "Create Program"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: LIVE PREVIEW & GUIDANCE SIDEBAR */}
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* 1. EXACT IMAGE PREVIEW CARD MATCH */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Card Preview
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-blue-200/80 p-6 shadow-sm space-y-5">
                {/* Header: Logo, Org Name, Badge & Bookmark */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Placeholder Icon / Logo */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-blue-600 leading-tight">
                          CyberShield Inc.
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {programType === "BOUNTY" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                            Bounty
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Response
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          •
                        </span>
                        <span className="text-xs text-slate-500 font-medium capitalize">
                          {programType === "BOUNTY" ? "open" : "open"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Program Title & Short Description */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {programName || "Program Name Security"}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-3">
                    {description ||
                      "Protecting core infrastructure, including checkout, merchant services, and peer-to-peer transfers..."}
                  </p>
                </div>

                {/* In-Scope Assets Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    IN-SCOPE ASSETS
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeInScope.length > 0 ? (
                      activeInScope.slice(0, 2).map((item) => (
                        <span
                          key={item.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium"
                        >
                          {item.target}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 text-xs font-mono">
                        *.example.com
                      </span>
                    )}

                    {activeInScope.length > 2 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                        +{activeInScope.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer / Rewards & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Rewards
                    </span>
                    <span
                      className={`text-base font-extrabold ${
                        programType === "BOUNTY"
                          ? "text-emerald-600"
                          : "text-blue-600"
                      }`}
                    >
                      {getRewardRange()}
                    </span>
                  </div>

                  {programType === "BOUNTY" ? (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-4 h-9"
                    >
                      See Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl px-4 h-9"
                    >
                      See Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. PROGRESS STEP CHECKLIST */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                Setup Progress
              </h3>

              <div className="space-y-3">
                {steps.map((s) => {
                  const isDone = activeTab > s.id;
                  const isCurrent = activeTab === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveTab(s.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                        isCurrent
                          ? "bg-blue-50/70 border border-blue-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? "border-blue-600 text-blue-600"
                                : "border-slate-300 text-slate-400"
                            }`}
                          >
                            {s.id}
                          </div>
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            isCurrent
                              ? "text-blue-700"
                              : isDone
                                ? "text-slate-800"
                                : "text-slate-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {isDone
                          ? "Done"
                          : isCurrent
                            ? "In Progress"
                            : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. STEP CONTEXTUAL TIP CARD */}
            <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-5 space-y-2 text-blue-900">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-blue-900">
                  {getStepTip().title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm font-medium text-blue-800 leading-relaxed">
                {getStepTip().text}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
