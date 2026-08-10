"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useCreateProgramMutation,
  useGetProgramByIdQuery,
  useGetMyCompanyProgramByIdQuery,
  useUpdateProgramMutation,
} from "@/lib/redux/services/program/programsApi";
import type { Asset } from "@/lib/types/programs/types";
import type { ScopeTarget, ProgramType, ProgramVisibility } from "./types";

export function useCreateProgramForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("id") || searchParams.get("draftId");

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

  // RTK Query hooks
  const { data: publicProgram, isLoading: isFetchingPublic } = useGetProgramByIdQuery(
    programId || "",
    { skip: !programId }
  );

  const { data: companyProgram, isLoading: isFetchingCompany } = useGetMyCompanyProgramByIdQuery(
    programId || "",
    { skip: !programId }
  );

  const existingProgram = publicProgram || companyProgram;
  const isFetchingDraft = (isFetchingPublic && isFetchingCompany) || (!existingProgram && (isFetchingPublic || isFetchingCompany));

  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

  // Populate form fields with existing draft data when opened via SavedDraftCard
  useEffect(() => {
    if (!existingProgram) return;

    if (existingProgram.name) setProgramName(existingProgram.name);
    if (existingProgram.handle) setHandle(existingProgram.handle);
    if (existingProgram.description) setDescription(existingProgram.description);
    if (existingProgram.engagementType) {
      setProgramType(existingProgram.engagementType === "RESPONSE" ? "RESPONSE" : "BOUNTY");
    }
    if (existingProgram.visibility) {
      setVisibility(existingProgram.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC");
    }
    if (existingProgram.policy) setPolicy(existingProgram.policy);
    if (existingProgram.proofOfConceptRequirements) {
      setPocRequirements(existingProgram.proofOfConceptRequirements);
    }

    if (existingProgram.rulesOfEngagement?.rules?.length) {
      setRulesOfEngagement(
        existingProgram.rulesOfEngagement.rules
          .map((r) => (r.startsWith("•") ? r : `• ${r}`))
          .join("\n")
      );
    }

    if (existingProgram.exclusions?.rules?.length) {
      setExcludedTypes(existingProgram.exclusions.rules);
    }

    if (typeof existingProgram.offersBounties === "boolean") {
      setOfferBounties(existingProgram.offersBounties);
    }

    if (existingProgram.minimumBounty !== undefined || existingProgram.maximumBounty !== undefined) {
      const minStr = (existingProgram.minimumBounty ?? 50).toString();
      const maxStr = (existingProgram.maximumBounty ?? 75000).toString();
      setBountyMatrix({
        critical: { min: "5000", max: maxStr },
        high: { min: "1000", max: "5000" },
        medium: { min: "250", max: "1000" },
        low: { min: minStr, max: "250" },
      });
    }

    const rawAssets = existingProgram.assets || existingProgram.inScopeAssets || [];
    if (rawAssets.length > 0) {
      const inScope: ScopeTarget[] = rawAssets
        .filter((a) => a.isInScope !== false)
        .map((a, i) => ({
          id: (a as { id?: string }).id || `in-${i}`,
          type: a.assetType === "API" ? "API" : a.assetType === "MOBILE_APP" ? "MOBILE" : "WEB",
          target: a.identifier || (a as { target?: string }).target || "",
          description: a.description || "",
        }));
      const outScope: ScopeTarget[] = rawAssets
        .filter((a) => a.isInScope === false)
        .map((a, i) => ({
          id: (a as { id?: string }).id || `out-${i}`,
          type: a.assetType === "API" ? "API" : a.assetType === "MOBILE_APP" ? "MOBILE" : "WEB",
          target: a.identifier || (a as { target?: string }).target || "",
          description: a.description || "",
        }));

      if (inScope.length > 0) setInScopeTargets(inScope);
      if (outScope.length > 0) setOutOfScopeTargets(outScope);
    }

    // Auto-navigate to the last tab (Tab 4) so user can directly click Create Program
    setActiveTab(4);
  }, [existingProgram]);

  type AssetType =
    | "URL"
    | "WILDCARD"
    | "IP_RANGE"
    | "MOBILE_APP"
    | "API"
    | "SOURCE_CODE"
    | "HARDWARE"
    | "OTHER";

  const mapAssetType = (type: string): AssetType => {
    if (type === "MOBILE") return "MOBILE_APP";
    if (type === "IP") return "IP_RANGE";
    if (type === "API") return "API";
    if (type === "OTHER") return "OTHER";
    return "URL";
  };

  const formatHandle = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100);
  };

  const handleNameChange = (val: string) => {
    setProgramName(val);
    setHandle(formatHandle(val));
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

  // Scope Handlers
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

  // Pre-flight reactive form validation checks
  const isHandleValid = useMemo(() => {
    const h = formatHandle(handle);
    return h.length >= 2 && h.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h);
  }, [handle]);

  const isStep1Valid = useMemo(() => {
    const nameValid = programName.trim().length >= 2 && programName.trim().length <= 255;
    const descValid = description.trim().length >= 1;
    const policyValid = policy.trim().length >= 1;
    return nameValid && isHandleValid && descValid && policyValid;
  }, [programName, isHandleValid, description, policy]);

  const isStep2Valid = useMemo(() => {
    return buildAssets().length > 0;
  }, [inScopeTargets, outOfScopeTargets]);

  const isStep3Valid = useMemo(() => {
    const hasRules = rulesOfEngagement.trim().length >= 1;
    const hasExclusions = excludedTypes.length > 0 || newExcludedInput.trim().length > 0;
    return hasRules && hasExclusions;
  }, [rulesOfEngagement, excludedTypes, newExcludedInput]);

  const isFormValid = useMemo(() => {
    return isStep1Valid && isStep2Valid && isStep3Valid;
  }, [isStep1Valid, isStep2Valid, isStep3Valid]);

  const isNextDisabled = useMemo(() => {
    if (activeTab === 1) return !isStep1Valid;
    if (activeTab === 2) return !isStep2Valid;
    if (activeTab === 3) return !isStep3Valid;
    return false;
  }, [activeTab, isStep1Valid, isStep2Valid, isStep3Valid]);

  const submitProgram = async (isDraft = false) => {
    const trimmedName = programName.trim();
    const formattedHandle = formatHandle(handle);

    if (!isDraft) {
      if (trimmedName.length < 2 || trimmedName.length > 255) {
        toast.error("Program name must be between 2 and 255 characters.");
        setActiveTab(1);
        return;
      }

      if (formattedHandle.length < 2 || formattedHandle.length > 100) {
        toast.error("Program handle must be between 2 and 100 characters.");
        setActiveTab(1);
        return;
      }

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formattedHandle)) {
        toast.error(
          "Program handle must contain only lowercase letters, numbers, and single hyphens.",
        );
        setActiveTab(1);
        return;
      }

      if (!description.trim()) {
        toast.error("Program description is required.");
        setActiveTab(1);
        return;
      }

      if (!policy.trim()) {
        toast.error("Responsible disclosure policy is required.");
        setActiveTab(1);
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
    }

    const effectiveExcludedTypes = newExcludedInput.trim()
      ? [...excludedTypes, newExcludedInput.trim()]
      : excludedTypes;

    try {
      const payload = {
        handle: formattedHandle || "draft-program",
        name: trimmedName || "Untitled Draft Program",
        description: description || "Draft program description",
        engagementType:
          programType === "RESPONSE" ? ("RESPONSE" as const) : ("BOUNTY" as const),
        visibility,
        policy: policy || "Responsible disclosure policy draft",
        proofOfConceptRequirements: pocRequirements,
        rulesOfEngagement: buildRuleSection(
          rulesOfEngagement,
          "Rules of engagement",
        ),
        exclusions: {
          description: "Excluded vulnerability types",
          rules: effectiveExcludedTypes.length > 0 ? effectiveExcludedTypes : ["DoS"],
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
        state: isDraft ? "DRAFT" : "PUBLISHED",
      };

      if (programId) {
        await updateProgram({ id: programId, body: payload }).unwrap();
        toast.success(isDraft ? "Draft saved successfully!" : "Program updated successfully!");
      } else {
        await createProgram(payload).unwrap();
        toast.success(isDraft ? "Draft saved successfully!" : "Program created successfully!");
      }

      if (isDraft) {
        router.push("/dashboard/saved-draft");
      } else {
        router.push("/dashboard/program-management");
      }
    } catch (error) {
      console.error("Save program failed", error);

      const apiError = error as FetchBaseQueryError & { data?: unknown };

      const parseValidationMessage = (): string => {
        if (typeof apiError.data === "string") return apiError.data;

        const dataObj = apiError.data as Record<string, unknown> | undefined;
        if (!dataObj) return "Unable to save program. Please try again.";

        const details = (dataObj.details ?? dataObj) as Record<string, unknown>;
        const errorDetails =
          (details?.errorDetails as Record<string, string> | undefined) ??
          (dataObj.errorDetails as Record<string, string> | undefined);

        if (errorDetails && typeof errorDetails === "object") {
          const detailMessages = Object.entries(errorDetails)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(" | ");
          if (detailMessages) return detailMessages;
        }

        const msg =
          typeof details?.message === "string"
            ? details.message
            : typeof dataObj.message === "string"
              ? dataObj.message
              : undefined;

        return (
          msg ||
          "Unable to save program. Please check your inputs and try again."
        );
      };

      const rawMessage = parseValidationMessage();
      toast.error(rawMessage);
    }
  };

  const handleCreateProgram = () => submitProgram(false);
  const handleSaveDraft = () => submitProgram(true);

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

  const activeInScope = useMemo(
    () => inScopeTargets.filter((t) => t.target.trim() !== ""),
    [inScopeTargets],
  );

  return {
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
    isCreating: isCreating || isUpdating,
    isFetchingDraft,
    isEditingDraft: Boolean(programId),
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
  };
}
