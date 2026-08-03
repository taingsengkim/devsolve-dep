"use client";

import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";

import { useRegisterCompanyMutation } from "@/lib/redux/services/authApi";
import { AuthHeroPanel, type HeroBadge } from "@/components/auth/AuthHeroPanel";
import { CompanyRegisterStepper } from "@/components/auth/CompanyRegisterStepper";
import { CompanyStep1Form } from "@/components/auth/CompanyStep1Form";
import { CompanyStep2Form } from "@/components/auth/CompanyStep2Form";
import {
  companyRegisterSchema,
  type CompanyRegisterFormValues,
} from "@/lib/validations/auth";
import { CompanyStep3Success } from "@/components/auth/CompanyStep3Success";

const COMPANY_HERO_BADGES: HeroBadge[] = [
  {
    icon: Building2,
    label: "Verified Organizations",
    borderColorClass: "border-blue-200/80",
    iconColorClass: "text-blue-600",
  },
  {
    icon: ShieldCheck,
    label: "Enterprise Bug Bounty",
    borderColorClass: "border-indigo-200/80",
    iconColorClass: "text-indigo-600",
  },
  {
    icon: Sparkles,
    label: "Compliance Ready",
    borderColorClass: "border-emerald-200/80",
    iconColorClass: "text-emerald-600",
  },
];

export default function CompanyRegisterPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [registerCompany, { isLoading: isApiLoading }] = useRegisterCompanyMutation();

  const form = useForm<CompanyRegisterFormValues>({
    resolver: zodResolver(companyRegisterSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      jobTitle: "",
      email: "",
      password: "",
      agreeTermsStep1: false,

      companyName: "",
      companyWebsite: "",
      industry: "",
      companySize: "",
      country: "Cambodia",
      reason: "",
      agreeTermsStep2: false,
    },
  });

  const handleNextStep = async () => {
    const isValidStep1 = await form.trigger([
      "fullName",
      "jobTitle",
      "email",
      "password",
      "agreeTermsStep1",
    ]);
    if (isValidStep1) {
      setCurrentStep(2);
    }
  };

  const onSubmit = async (data: CompanyRegisterFormValues) => {
    try {
      const res = await registerCompany({
        fullName: data.fullName,
        jobTitle: data.jobTitle,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
        industry: data.industry,
        companySize: data.companySize,
        country: data.country,
        reason: data.reason,
      }).unwrap();

      if (res.success) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Failed to submit company registration:", error);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased overflow-x-hidden">
      {/* LEFT PANEL - Hero Section */}
      <AuthHeroPanel
        lottieSrc="/lottie/company.lottie"
        badges={COMPANY_HERO_BADGES}
        headline="Protect your organization"
        description="Connect with elite security researchers, receive verified vulnerability reports, and secure your digital assets."
        glowColor1="bg-blue-400/20"
        glowColor2="bg-indigo-400/20"
      />

      {/* RIGHT PANEL - Multi-Step Form Container */}
      <div className="bg-white p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center items-center overflow-y-auto">
        <div className="w-full max-w-xl lg:max-w-2xl mx-auto my-auto flex flex-col justify-center">
          {/* Stepper Header (only visible on steps 1 & 2) */}
          {currentStep < 3 && <CompanyRegisterStepper currentStep={currentStep} />}

          {/* Animated Step Transitions */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <CompanyStep1Form form={form} onNext={handleNextStep} />
            )}

            {currentStep === 2 && (
              <CompanyStep2Form
                form={form}
                onBack={() => setCurrentStep(1)}
                onSubmit={onSubmit}
                isApiLoading={isApiLoading}
              />
            )}

            {currentStep === 3 && <CompanyStep3Success />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}