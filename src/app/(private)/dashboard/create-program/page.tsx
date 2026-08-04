"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Target,
  BookOpen,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Save,
  Send,
  Info,
  Clock,
  Play,
  FileEdit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    { id: "1", type: "WEB", target: "", description: "" },
  ]);
  const [outOfScopeTargets, setOutOfScopeTargets] = useState<ScopeTarget[]>([
    { id: "1", type: "WEB", target: "", description: "" },
  ]);
  const [openScope, setOpenScope] = useState(false);

  // Rules State
  const [rulesOfEngagement, setRulesOfEngagement] = useState(
    "• Automated scanning is allowed up to 5 req/sec\n• DoS attacks are strictly prohibited\n• Social engineering is not allowed\n• Test only on your own test accounts"
  );
  const [excludedTypes, setExcludedTypes] = useState<string[]>([]);
  const [newExcludedInput, setNewExcludedInput] = useState("");
  const [pocRequirements, setPocRequirements] = useState(
    "• Step-by-step reproduction guide\n• The exact HTTP request / payload\n• Screenshot or video recording"
  );

  // Bounty Matrix State
  const [offerBounties, setOfferBounties] = useState(true);
  const [bountyMatrix, setBountyMatrix] = useState({
    critical: { min: "5000", max: "15000" },
    high: { min: "1000", max: "5000" },
    medium: { min: "250", max: "1000" },
    low: { min: "50", max: "250" },
  });

  // Timing State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initialState, setInitialState] = useState<ProgramStatus>("DRAFT");

  // Handle Name Change & Auto Handle Generation
  const handleNameChange = (val: string) => {
    setProgramName(val);
    setHandle(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
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

  // Add Excluded Vulnerability
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
    { id: 5, label: "Timing", icon: Calendar },
  ];

  return (
    <div className="min-h-screen w-full text-slate-800 font-sans py-6 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6"
      >
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Program
            </h1>
            <p className="text-base text-slate-500 mt-1 font-normal">
              Fill in the details to launch your security program
            </p>
          </div>
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

        {/* FORM CONTAINER CARD */}
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
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
                    onChange={(e) => setProgramType(e.target.value as ProgramType)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BOUNTY">Bounty (Offers Cash Rewards)</option>
                    <option value="RESPONSE">Response (Vulnerability Disclosure Only)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as ProgramVisibility)}
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

              {/* OPEN SCOPE CHECKBOX */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="openScope"
                  checked={openScope}
                  onChange={(e) => setOpenScope(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="openScope"
                  className="text-sm font-semibold text-slate-800 cursor-pointer"
                >
                  Open Scope — all assets belonging to the organization are in scope
                </label>
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
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddExcludedType())}
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
                          onClick={() => setExcludedTypes(excludedTypes.filter((_, i) => i !== idx))}
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
                Bounty Matrix
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
                  Offer financial bounties (Bounty Program)
                </label>
              </div>

              {/* BOUNTY TABLE */}
              {offerBounties && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                        <th className="py-3.5 px-6">Severity</th>
                        <th className="py-3.5 px-4">Min ($)</th>
                        <th className="py-3.5 px-6">Max ($)</th>
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
                            value={bountyMatrix.critical.min}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                critical: { ...bountyMatrix.critical, min: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <Input
                            type="number"
                            value={bountyMatrix.critical.max}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                critical: { ...bountyMatrix.critical, max: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
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
                            value={bountyMatrix.high.min}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                high: { ...bountyMatrix.high, min: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <Input
                            type="number"
                            value={bountyMatrix.high.max}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                high: { ...bountyMatrix.high, max: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
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
                            value={bountyMatrix.medium.min}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                medium: { ...bountyMatrix.medium, min: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <Input
                            type="number"
                            value={bountyMatrix.medium.max}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                medium: { ...bountyMatrix.medium, max: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
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
                            value={bountyMatrix.low.min}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                low: { ...bountyMatrix.low, min: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <Input
                            type="number"
                            value={bountyMatrix.low.max}
                            onChange={(e) =>
                              setBountyMatrix({
                                ...bountyMatrix,
                                low: { ...bountyMatrix.low, max: e.target.value },
                              })
                            }
                            className="h-10 w-36 rounded-xl text-base font-semibold border-slate-200"
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
                  Financial rewards are displayed on resolved reports and agreed on-platform. Actual payment transfers occur off-platform via email or direct communication.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: TIMING & PUBLICATION */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                Timing & Publication
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    End Date / Deadline
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {/* Initial State Selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  Initial State
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Draft */}
                  <div
                    onClick={() => setInitialState("DRAFT")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      initialState === "DRAFT"
                        ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <FileEdit className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Draft</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Save privately, keep editing
                      </p>
                    </div>
                  </div>

                  {/* Scheduled */}
                  <div
                    onClick={() => setInitialState("SCHEDULED")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      initialState === "SCHEDULED"
                        ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Scheduled
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Go live on start date
                      </p>
                    </div>
                  </div>

                  {/* Open */}
                  <div
                    onClick={() => setInitialState("OPEN")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      initialState === "OPEN"
                        ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Play className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Open</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Publish immediately
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUMMARY BOX */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">
                      Name
                    </span>
                    <span className="font-semibold text-slate-900">
                      {programName || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">
                      Type
                    </span>
                    <span className="font-semibold text-slate-900">
                      {programType === "BOUNTY" ? "Bug Bounty" : "Vulnerability Disclosure"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">
                      Visibility
                    </span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {visibility.toLowerCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">
                      In-Scope Targets
                    </span>
                    <span className="font-semibold text-slate-900">
                      {inScopeTargets.filter((t) => t.target.trim()).length} targets
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase">
                      Max Bounty
                    </span>
                    <span className="font-extrabold text-emerald-600 text-xl">
                      ${parseInt(bountyMatrix.critical.max || "0").toLocaleString()}
                    </span>
                  </div>
                </div>
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

              {activeTab < 5 ? (
                <Button
                  type="button"
                  onClick={() => setActiveTab((prev) => Math.min(prev + 1, 5))}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm h-11 px-6 gap-1.5"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-11 px-6 gap-2"
                >
                  <Send className="w-4 h-4" />
                  Create Program
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}