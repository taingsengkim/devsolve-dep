"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Key,
  MapPin,
  Eye,
  EyeOff,
  Building2,
  Globe,
  Briefcase,
  Users,
  ShieldCheck,
  Check,
  ChevronDown,
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRegisterCompanyMutation } from "@/lib/redux/services/authApi";

interface CountryOption {
  name: string;
  code: string;
}

const DEFAULT_COUNTRIES: CountryOption[] = [
  { name: "Cambodia", code: "kh" },
  { name: "United States", code: "us" },
  { name: "United Kingdom", code: "gb" },
  { name: "Vietnam", code: "vn" },
  { name: "Thailand", code: "th" },
  { name: "Singapore", code: "sg" },
  { name: "Japan", code: "jp" },
  { name: "Australia", code: "au" },
  { name: "Canada", code: "ca" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "India", code: "in" },
  { name: "Indonesia", code: "id" },
  { name: "Malaysia", code: "my" },
  { name: "Philippines", code: "ph" },
  { name: "South Korea", code: "kr" },
];

const JOB_TITLES = [
  "CTO / VP Engineering",
  "Security Lead / CISO",
  "Software Engineer",
  "IT Manager",
  "IT Company",
  "Security Researcher",
  "Product Manager",
  "Other",
];

const INDUSTRIES = [
  "Software & Technology",
  "Financial Services",
  "Healthcare & Biotech",
  "E-Commerce & Retail",
  "Government & Public Sector",
  "Telecommunications",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const REASONS = [
  "Launch a Bug Bounty Program",
  "Vulnerability Disclosure (VDP)",
  "Penetration Testing",
  "Security Assessment & Compliance",
  "Other",
];

// Zod Schema for Company Registration Form
const companyRegisterSchema = z.object({
  // Step 1 fields
  fullName: z.string().min(2, "Full name is required"),
  jobTitle: z.string().min(1, "Please select a job title"),
  email: z.string().email("Please enter a valid work email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTermsStep1: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),

  // Step 2 fields
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().url("Please enter a valid website URL (e.g. https://readme.org)"),
  industry: z.string().min(1, "Please select an industry"),
  companySize: z.string().min(1, "Please select company size"),
  country: z.string().min(1, "Please select your country"),
  reason: z.string().min(1, "Please select why you are joining"),
  agreeTermsStep2: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service and Privacy Policy",
  }),
});

type CompanyRegisterFormValues = z.infer<typeof companyRegisterSchema>;

// Generic Custom Select Dropdown Component
interface CustomSelectProps {
  value: string;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
  onSelect: (val: string) => void;
  error?: boolean;
}

function CustomSelect({
  value,
  options,
  placeholder,
  icon,
  onSelect,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 px-3.5 bg-white hover:bg-slate-50 border rounded-xl text-slate-900 text-sm flex items-center justify-between transition-all cursor-pointer outline-none",
          error ? "border-red-400 focus:ring-2 focus:ring-red-400" : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          isOpen && "border-blue-500 ring-2 ring-blue-500/20 bg-white"
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className={cn("truncate font-medium", !value && "text-slate-400 font-normal")}>
            {value || placeholder}
          </span>
        </div>

        <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200", isOpen && "rotate-180 text-blue-600")} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 max-h-60 overflow-y-auto space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-xs sm:text-sm rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "hover:bg-slate-50 text-slate-700 font-medium"
                )}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

// Custom Searchable Country Select Component
interface CustomCountrySelectProps {
  value: string;
  countryCode: string | null;
  countries: CountryOption[];
  onSelect: (country: CountryOption) => void;
  isDetecting: boolean;
}

function CustomCountrySelect({
  value,
  countryCode,
  countries,
  onSelect,
  isDetecting,
}: CustomCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, searchQuery]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 px-3.5 bg-white hover:bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl text-slate-900 text-sm flex items-center justify-between transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20",
          isOpen && "border-blue-500 ring-2 ring-blue-500/20 bg-white"
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {countryCode ? (
            <img
              src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
              alt="Country flag"
              className="w-5 h-3.5 object-cover rounded-2xs border border-slate-200/80 shadow-2xs shrink-0"
            />
          ) : (
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className={cn("truncate font-medium", !value && "text-slate-400 font-normal")}>
            {value || "Select your country or region"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 ml-2">
          {isDetecting ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180 text-blue-600")} />
          )}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 max-h-72 flex flex-col overflow-hidden"
        >
          <div className="relative mb-2 px-1 pt-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country..."
              autoFocus
              className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="overflow-y-auto space-y-0.5 max-h-52 pr-1">
            {filteredCountries.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                No country matching "{searchQuery}"
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = value === c.name;
                return (
                  <button
                    key={`${c.code}-${c.name}`}
                    type="button"
                    onClick={() => {
                      onSelect(c);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-xs sm:text-sm rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer",
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt={c.name}
                        className="w-5 h-3.5 object-cover rounded-2xs border border-slate-200/80 shadow-2xs shrink-0"
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isDetectingCountry, setIsDetectingCountry] = useState(false);
  const [countryCode, setCountryCode] = useState<string | null>("kh");
  const [countriesList, setCountriesList] = useState<CountryOption[]>(DEFAULT_COUNTRIES);

  const [registerCompany, { isLoading: isApiLoading }] = useRegisterCompanyMutation();

  // Fetch countries list from REST Countries API
  useEffect(() => {
    let isMounted = true;
    const fetchCountries = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const formatted: CountryOption[] = data
            .map((item: { name: { common: string }; cca2: string }) => ({
              name: item.name?.common || "",
              code: item.cca2 ? item.cca2.toLowerCase() : "",
            }))
            .filter((item: CountryOption) => Boolean(item.name && item.code))
            .sort((a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name));
          if (formatted.length > 0 && isMounted) {
            setCountriesList(formatted);
          }
        }
      } catch {
        // Fallback silently
      }
    };
    fetchCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CompanyRegisterFormValues>({
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

  // Auto-detect country on mount
  const detectCountry = React.useCallback(async () => {
    setIsDetectingCountry(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.country_name) {
          setValue("country", data.country_name, { shouldValidate: true });
          if (data.country_code) {
            setCountryCode(data.country_code.toLowerCase());
          }
          setIsDetectingCountry(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detected = "Cambodia";
      let code = "kh";
      if (timeZone.includes("Phnom_Penh") || timeZone.includes("Bangkok")) {
        detected = "Cambodia";
        code = "kh";
      } else if (timeZone.includes("Ho_Chi_Minh")) {
        detected = "Vietnam";
        code = "vn";
      } else if (timeZone.includes("Singapore")) {
        detected = "Singapore";
        code = "sg";
      } else if (timeZone.includes("Tokyo")) {
        detected = "Japan";
        code = "jp";
      } else if (
        timeZone.includes("New_York") ||
        timeZone.includes("Los_Angeles") ||
        timeZone.includes("Chicago")
      ) {
        detected = "United States";
        code = "us";
      } else if (timeZone.includes("London")) {
        detected = "United Kingdom";
        code = "gb";
      }

      setValue("country", detected, { shouldValidate: true });
      setCountryCode(code);
    } catch {
      // Silent fallback
    } finally {
      setIsDetectingCountry(false);
    }
  }, [setValue]);

  useEffect(() => {
    detectCountry();
  }, [detectCountry]);

  // Watch form fields for step validation
  const fullName = watch("fullName");
  const jobTitle = watch("jobTitle");
  const email = watch("email");
  const password = watch("password");
  const agreeTermsStep1 = watch("agreeTermsStep1");

  const companyName = watch("companyName");
  const companyWebsite = watch("companyWebsite");
  const industry = watch("industry");
  const companySize = watch("companySize");
  const country = watch("country");
  const reason = watch("reason");
  const agreeTermsStep2 = watch("agreeTermsStep2");

  const isStep1Complete =
    Boolean(fullName?.trim()) &&
    Boolean(jobTitle) &&
    Boolean(email?.trim()) &&
    Boolean(password && password.length >= 8) &&
    Boolean(agreeTermsStep1);

  const isStep2Complete =
    Boolean(companyName?.trim()) &&
    Boolean(companyWebsite?.trim()) &&
    Boolean(industry) &&
    Boolean(companySize) &&
    Boolean(country) &&
    Boolean(reason) &&
    Boolean(agreeTermsStep2);

  // Validate Step 1 before proceeding
  const handleNextStep = async () => {
    const isValidStep1 = await trigger(["fullName", "jobTitle", "email", "password", "agreeTermsStep1"]);
    if (isValidStep1) {
      setCurrentStep(2);
    }
  };

  // Submit complete company registration form
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
      {/* LEFT PANEL - Hero & Illustration Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#EFF4FF] border-b lg:border-b-0 lg:border-r border-slate-200/80 p-6 sm:p-10 xl:p-14 flex flex-col justify-between items-center relative overflow-hidden min-h-[480px] lg:min-h-[100dvh] text-center"
      >
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-0" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 w-full flex flex-col h-full justify-between items-center">
          {/* Back Navigation Link */}
          <div className="w-full flex justify-start items-center mb-4">
            <Link
              href="/account-type"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-blue-600" />
              <span>Back to choose account type</span>
            </Link>
          </div>

          {/* Central Lottie Illustration with Backdrop */}
          <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center py-4">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/60 via-indigo-100/50 to-emerald-100/40 rounded-full blur-xl" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <DotLottieReact src="/lottie/company.lottie" loop autoplay />
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-5 relative z-10">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-blue-200/80 px-3 py-1.5 rounded-full shadow-2xs text-sm font-semibold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Organizations</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-indigo-200/80 px-3 py-1.5 rounded-full shadow-2xs text-sm font-semibold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enterprise Bug Bounty</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-2xs text-sm font-semibold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compliance Ready</span>
              </div>
            </div>
          </div>

          {/* Bottom Headline */}
          <div className="mt-auto pt-4 max-w-md mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-blue-600 mb-2"
            >
              Protect your organization
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal"
            >
              Connect with elite security researchers, receive verified vulnerability reports, and secure your digital assets.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Multi-Step Form Container */}
      <div className="bg-white p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center items-center overflow-y-auto">
        <div className="w-full max-w-xl lg:max-w-2xl mx-auto my-auto flex flex-col justify-center">

          {/* STEPPER HEADER */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Connector line behind steps */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
              <div
                className="absolute top-4 left-6 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
                style={{
                  width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
                }}
              />

              {/* Step 1 Badge */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    currentStep === 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100"
                      : currentStep > 1
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : "1"}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold mt-2 transition-colors",
                    currentStep === 1
                      ? "text-blue-600 font-bold"
                      : currentStep > 1
                        ? "text-slate-800"
                        : "text-slate-400"
                  )}
                >
                  Your info
                </span>
              </div>

              {/* Step 2 Badge */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    currentStep === 2
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100"
                      : currentStep > 2
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : "2"}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold mt-2 transition-colors",
                    currentStep === 2
                      ? "text-blue-600 font-bold"
                      : currentStep > 2
                        ? "text-slate-800"
                        : "text-slate-400"
                  )}
                >
                  Company
                </span>
              </div>

              {/* Step 3 Badge */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    currentStep === 3
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  3
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold mt-2 transition-colors",
                    currentStep === 3 ? "text-blue-600 font-bold" : "text-slate-400"
                  )}
                >
                  Verify
                </span>
              </div>
            </div>
          </div>

          {/* FORM CONTENT STEP ANIMATION */}
          <AnimatePresence mode="wait">
            {/* STEP 1: YOUR INFO */}
            {currentStep === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNextStep();
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
                  <Label htmlFor="fullName" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
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
                      className={`w-full h-11 pl-10 pr-4 bg-white border ${errors.fullName ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
                        } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Job Title Custom Select */}
                <div>
                  <Label htmlFor="jobTitle" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
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
                  <Label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
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
                      className={`w-full h-11 pl-10 pr-4 bg-white border ${errors.email ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
                        } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
                    PASSWORD <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      {...register("password")}
                      className={`w-full h-11 pl-10 pr-10 bg-white border ${errors.password ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
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

                {/* Terms & Vulnerability Policy */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register("agreeTermsStep1")}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      I agree to the{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and acknowledge the{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                        Vulnerability Disclosure Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.agreeTermsStep1 && (
                    <p className="text-xs text-red-500 mt-1 pl-6.5">{errors.agreeTermsStep1.message}</p>
                  )}
                </div>

                {/* Submit / Next Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isStep1Complete}
                    className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sign In Footer */}
                <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href="/account-type" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                    Sign In
                  </Link>
                </div>
              </motion.form>
            )}

            {/* STEP 2: ABOUT YOUR COMPANY */}
            {currentStep === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Header */}
                <div className="mb-6 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                    About your company
                  </h1>
                  <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
                    We use this to verify your organization is legitimate and ensure compliance with our security standards.
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <Label htmlFor="companyName" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
                    COMPANY NAME <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Acme Corp"
                      {...register("companyName")}
                      className={`w-full h-11 pl-10 pr-4 bg-white border ${errors.companyName ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
                        } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Company Website & Domain Check */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="companyWebsite" className="block text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wide">
                      COMPANY WEBSITE <span className="text-red-500">*</span>
                    </Label>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      DOMAIN CHECK
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <Input
                      id="companyWebsite"
                      type="url"
                      placeholder="https://readme.org"
                      {...register("companyWebsite")}
                      className={`w-full h-11 pl-10 pr-4 bg-white border ${errors.companyWebsite ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
                        } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
                    />
                  </div>
                  <span className="block text-[11px] text-slate-500 mt-1 font-medium">
                    ✓ Matches your email domain
                  </span>
                  {errors.companyWebsite && (
                    <p className="text-xs text-red-500 mt-1">{errors.companyWebsite.message}</p>
                  )}
                </div>

                {/* Industry & Company Size (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Industry Custom Select */}
                  <div>
                    <Label htmlFor="industry" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
                      INDUSTRY <span className="text-red-500">*</span>
                    </Label>
                    <CustomSelect
                      value={industry}
                      options={INDUSTRIES}
                      placeholder="Select Industry"
                      error={Boolean(errors.industry)}
                      onSelect={(selectedVal) => {
                        setValue("industry", selectedVal, { shouldValidate: true });
                      }}
                    />
                    {errors.industry && (
                      <p className="text-xs text-red-500 mt-1">{errors.industry.message}</p>
                    )}
                  </div>

                  {/* Company Size Custom Select */}
                  <div>
                    <Label htmlFor="companySize" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
                      COMPANY SIZE <span className="text-red-500">*</span>
                    </Label>
                    <CustomSelect
                      value={companySize}
                      options={COMPANY_SIZES}
                      placeholder="Select Size"
                      icon={<Users className="w-4 h-4" />}
                      error={Boolean(errors.companySize)}
                      onSelect={(selectedVal) => {
                        setValue("companySize", selectedVal, { shouldValidate: true });
                      }}
                    />
                    {errors.companySize && (
                      <p className="text-xs text-red-500 mt-1">{errors.companySize.message}</p>
                    )}
                  </div>
                </div>

                {/* Country Selection */}
                <div>
                  <Label htmlFor="country" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
                    COUNTRY <span className="text-red-500">*</span>
                  </Label>
                  <CustomCountrySelect
                    value={country || "Cambodia"}
                    countryCode={countryCode}
                    countries={countriesList}
                    isDetecting={isDetectingCountry}
                    onSelect={(c) => {
                      setValue("country", c.name, { shouldValidate: true });
                      setCountryCode(c.code);
                    }}
                  />
                  {errors.country && (
                    <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
                  )}
                </div>

                {/* Why Are You Joining Custom Select */}
                <div>
                  <Label htmlFor="reason" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 uppercase tracking-wide">
                    WHY ARE YOU JOINING? <span className="text-red-500">*</span>
                  </Label>
                  <CustomSelect
                    value={reason}
                    options={REASONS}
                    placeholder="Select an option"
                    error={Boolean(errors.reason)}
                    onSelect={(selectedVal) => {
                      setValue("reason", selectedVal, { shouldValidate: true });
                    }}
                  />
                  {errors.reason && (
                    <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
                  )}
                </div>

                {/* Terms and Privacy Policy */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="termsStep2"
                      {...register("agreeTermsStep2")}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      I accept the{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeTermsStep2 && (
                    <p className="text-xs text-red-500 mt-1 pl-6.5">{errors.agreeTermsStep2.message}</p>
                  )}
                </div>

                {/* Action Buttons: Back & Submit for review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-full h-11 sm:h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm cursor-pointer transition-all"
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isStep2Complete || isSubmitting || isApiLoading}
                    className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isSubmitting || isApiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit for review</span>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: ACCOUNT PENDING REVIEW */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-center sm:text-left"
              >
                {/* Status Hero Card */}
                <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-100 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-sm">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-inner">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Your account is pending review
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Our team is verifying your company. This usually takes less than 24 hours. We'll email you once approved.
                  </p>
                </div>

                {/* Verification Status Details */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                  <h2 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase text-left">
                    VERIFICATION STATUS
                  </h2>

                  <ul className="divide-y divide-slate-100">
                    {/* Item 1 */}
                    <li className="py-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">Email verified</span>
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                    </li>

                    {/* Item 2 */}
                    <li className="py-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">Domain check passed</span>
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                    </li>

                    {/* Item 3 */}
                    <li className="py-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">Admin review</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>In progress...</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Navigation Link */}
                <div className="pt-2 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to homepage</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}