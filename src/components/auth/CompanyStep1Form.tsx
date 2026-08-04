"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { UseFormReturn } from "react-hook-form";
import { User, Mail, Key, Eye, EyeOff, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/auth/CustomSelect";
import { JOB_TITLES } from "@/lib/constants/auth";
import type { CompanyRegisterFormValues } from "@/lib/validations/auth";

interface CompanyStep1FormProps {
  form: UseFormReturn<CompanyRegisterFormValues>;
  onNext: () => void;
}

export function CompanyStep1Form({ form, onNext }: CompanyStep1FormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const fullName = watch("fullName");
  const jobTitle = watch("jobTitle");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const agreeTermsStep1 = watch("agreeTermsStep1");

  const isStep1Complete =
    Boolean(fullName?.trim()) &&
    Boolean(jobTitle) &&
    Boolean(email?.trim()) &&
    Boolean(password && password.length >= 8) &&
    Boolean(confirmPassword && confirmPassword.length >= 8) &&
    Boolean(agreeTermsStep1);


  return (
    <motion.form
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
          Welcome to the technical elite. Begin your journey today.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <Label
          htmlFor="fullName"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide"
        >
          FULL NAME <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <Input
            id="fullName"
            type="text"
            placeholder="Tada Battambang"
            {...register("fullName")}
            className={`w-full h-11 pl-10 pr-4 bg-white border ${
              errors.fullName ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
            } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Job Title Custom Select */}
      <div>
        <Label
          htmlFor="jobTitle"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide"
        >
          JOB TITLE <span className="text-red-500">*</span>
        </Label>
        <CustomSelect
          value={jobTitle}
          options={JOB_TITLES}
          placeholder="Select job title (e.g. IT Company)"
          icon={<Briefcase className="w-4 h-4" />}
          error={Boolean(errors.jobTitle)}
          onSelect={(selectedVal) => {
            setValue("jobTitle", selectedVal, { shouldValidate: true });
          }}
        />
        {errors.jobTitle && (
          <p className="text-xs text-red-500 mt-1">{errors.jobTitle.message}</p>
        )}
      </div>

      {/* Work Email */}
      <div>
        <Label
          htmlFor="email"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide"
        >
          WORK EMAIL <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="tada@battambang.org"
            {...register("email")}
            className={`w-full h-11 pl-10 pr-4 bg-white border ${
              errors.email ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
            } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label
          htmlFor="password"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide"
        >
          PASSWORD <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Key className="w-4 h-4" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            {...register("password")}
            className={`w-full h-11 pl-10 pr-10 bg-white border ${
              errors.password ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
            } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label
          htmlFor="confirmPassword"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide"
        >
          CONFIRM PASSWORD <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            className={`w-full h-11 pl-10 pr-10 bg-white border ${
              errors.confirmPassword ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
            } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Checkbox Terms Step 1 */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            {...register("agreeTermsStep1")}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-snug">
            I agree to DevSolve&apos;s{" "}
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.agreeTermsStep1 && (
          <p className="text-xs text-red-500 mt-1 pl-6.5">
            {errors.agreeTermsStep1.message}
          </p>
        )}
      </div>

      {/* Continue to Step 2 Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={!isStep1Complete}
          className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span>Continue to Company details</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      <div className="mt-4 text-center text-xs sm:text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/account-type" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
          Log in
        </Link>
      </div>
    </motion.form>
  );
}
