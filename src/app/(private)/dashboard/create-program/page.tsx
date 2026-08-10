"use client";

import React, { Suspense } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Target,
  BookOpen,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProgramHeader } from "@/components/create-program/CreateProgramHeader";
import { CreateProgramStepper } from "@/components/create-program/CreateProgramStepper";
import { Step1BasicInfo } from "@/components/create-program/Step1BasicInfo";
import { Step2Scope } from "@/components/create-program/Step2Scope";
import { Step3Rules } from "@/components/create-program/Step3Rules";
import { Step4BountyMatrix } from "@/components/create-program/Step4BountyMatrix";
import { CreateProgramPreview } from "@/components/create-program/CreateProgramPreview";
import { CreateProgramChecklist } from "@/components/create-program/CreateProgramChecklist";
import { CreateProgramTipCard } from "@/components/create-program/CreateProgramTipCard";
import { useCreateProgramForm } from "@/components/create-program/useCreateProgramForm";

function CreateProgramContent() {
  const {
    activeTab,
    setActiveTab,
    programName,
    setProgramName,
    handle,
    setHandle,
    description,
    setDescription,
    programType,
    setProgramType,
    visibility,
    setVisibility,
    policy,
    setPolicy,
    inScopeTargets,
    setInScopeTargets,
    outOfScopeTargets,
    setOutOfScopeTargets,
    rulesOfEngagement,
    setRulesOfEngagement,
    excludedTypes,
    setExcludedTypes,
    newExcludedInput,
    setNewExcludedInput,
    pocRequirements,
    setPocRequirements,
    offerBounties,
    setOfferBounties,
    bountyMatrix,
    setBountyMatrix,
    pointsMatrix,
    setPointsMatrix,
    isCreating,
    isEditingDraft,
    isFormValid,
    isNextDisabled,
    formatHandle,
    handleNameChange,
    addInScope,
    removeInScope,
    addOutOfScope,
    removeOutOfScope,
    handleAddExcludedType,
    handleCreateProgram,
    handleSaveDraft,
    getStepTip,
    getRewardRange,
    activeInScope,
  } = useCreateProgramForm();

  const steps = [
    { id: 1, label: "Basic Info", icon: FileText },
    { id: 2, label: "Scope", icon: Target },
    { id: 3, label: "Rules", icon: BookOpen },
    { id: 4, label: "Bounty Matrix", icon: DollarSign },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER & BREADCRUMB */}
      <CreateProgramHeader />

      {/* STEPPER TABS */}
      <CreateProgramStepper
        steps={steps}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT 2 COLUMNS: FORM STEPS */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          {activeTab === 1 && (
            <Step1BasicInfo
              programName={programName}
              handle={handle}
              description={description}
              programType={programType}
              visibility={visibility}
              policy={policy}
              onNameChange={handleNameChange}
              setHandle={setHandle}
              setDescription={setDescription}
              setProgramType={setProgramType}
              setVisibility={setVisibility}
              setPolicy={setPolicy}
              formatHandle={formatHandle}
            />
          )}

          {activeTab === 2 && (
            <Step2Scope
              inScopeTargets={inScopeTargets}
              outOfScopeTargets={outOfScopeTargets}
              setInScopeTargets={setInScopeTargets}
              setOutOfScopeTargets={setOutOfScopeTargets}
              addInScope={addInScope}
              removeInScope={removeInScope}
              addOutOfScope={addOutOfScope}
              removeOutOfScope={removeOutOfScope}
            />
          )}

          {activeTab === 3 && (
            <Step3Rules
              rulesOfEngagement={rulesOfEngagement}
              setRulesOfEngagement={setRulesOfEngagement}
              excludedTypes={excludedTypes}
              setExcludedTypes={setExcludedTypes}
              newExcludedInput={newExcludedInput}
              setNewExcludedInput={setNewExcludedInput}
              handleAddExcludedType={handleAddExcludedType}
              pocRequirements={pocRequirements}
              setPocRequirements={setPocRequirements}
            />
          )}

          {activeTab === 4 && (
            <Step4BountyMatrix
              programType={programType}
              offerBounties={offerBounties}
              setOfferBounties={setOfferBounties}
              bountyMatrix={bountyMatrix}
              setBountyMatrix={setBountyMatrix}
              pointsMatrix={pointsMatrix}
              setPointsMatrix={setPointsMatrix}
            />
          )}

          {/* FOOTER NAVIGATION BUTTONS */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={activeTab === 1}
              onClick={() => setActiveTab(Math.max(activeTab - 1, 1))}
              className="rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm h-11 px-5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isCreating}
                className="rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm h-11 px-5 gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-500" />
                Save as Draft
              </Button>

              {activeTab < 4 ? (
                <Button
                  type="button"
                  onClick={() => setActiveTab(Math.min(activeTab + 1, 4))}
                  disabled={isNextDisabled}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm h-11 px-6 gap-1.5 cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleCreateProgram}
                  disabled={!isFormValid || isCreating}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm h-11 px-6 gap-2 cursor-pointer"
                >
                  {isCreating
                    ? isEditingDraft
                      ? "Updating..."
                      : "Creating..."
                    : isEditingDraft
                      ? "Update Program"
                      : "Create Program"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: LIVE PREVIEW & GUIDANCE SIDEBAR */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <CreateProgramPreview
            programName={programName}
            description={description}
            programType={programType}
            activeInScope={activeInScope}
            getRewardRange={getRewardRange}
          />

          <CreateProgramChecklist
            steps={steps}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <CreateProgramTipCard tip={getStepTip()} />
        </div>
      </div>
    </motion.div>
  );
}

export default function CreateProgramPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full space-y-6 pb-12 animate-pulse">
          <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
        </div>
      }
    >
      <CreateProgramContent />
    </Suspense>
  );
}
