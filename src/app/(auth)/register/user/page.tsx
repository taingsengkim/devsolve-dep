"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
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
  UserPlus,
  TrendingUp,
  Zap,
  Users,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Search,
  Check,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { useRegisterUserMutation } from "@/lib/redux/services/authApi";

interface CountryOption {
  name: string;
  code: string;
}

const DEFAULT_COUNTRIES: CountryOption[] = [
  { name: "Afghanistan", code: "af" },
  { name: "Albania", code: "al" },
  { name: "Algeria", code: "dz" },
  { name: "Argentina", code: "ar" },
  { name: "Australia", code: "au" },
  { name: "Austria", code: "at" },
  { name: "Bangladesh", code: "bd" },
  { name: "Belgium", code: "be" },
  { name: "Brazil", code: "br" },
  { name: "Cambodia", code: "kh" },
  { name: "Canada", code: "ca" },
  { name: "Chile", code: "cl" },
  { name: "China", code: "cn" },
  { name: "Colombia", code: "co" },
  { name: "Denmark", code: "dk" },
  { name: "Egypt", code: "eg" },
  { name: "Finland", code: "fi" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "Ghana", code: "gh" },
  { name: "Greece", code: "gr" },
  { name: "Hong Kong", code: "hk" },
  { name: "India", code: "in" },
  { name: "Indonesia", code: "id" },
  { name: "Ireland", code: "ie" },
  { name: "Israel", code: "il" },
  { name: "Italy", code: "it" },
  { name: "Japan", code: "jp" },
  { name: "Kenya", code: "ke" },
  { name: "Korea, Republic of", code: "kr" },
  { name: "Laos", code: "la" },
  { name: "Malaysia", code: "my" },
  { name: "Mexico", code: "mx" },
  { name: "Myanmar", code: "mm" },
  { name: "Nepal", code: "np" },
  { name: "Netherlands", code: "nl" },
  { name: "New Zealand", code: "nz" },
  { name: "Nigeria", code: "ng" },
  { name: "Norway", code: "no" },
  { name: "Pakistan", code: "pk" },
  { name: "Philippines", code: "ph" },
  { name: "Poland", code: "pl" },
  { name: "Portugal", code: "pt" },
  { name: "Qatar", code: "qa" },
  { name: "Romania", code: "ro" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "Singapore", code: "sg" },
  { name: "South Africa", code: "za" },
  { name: "Spain", code: "es" },
  { name: "Sweden", code: "se" },
  { name: "Switzerland", code: "ch" },
  { name: "Taiwan", code: "tw" },
  { name: "Thailand", code: "th" },
  { name: "Turkey", code: "tr" },
  { name: "Ukraine", code: "ua" },
  { name: "United Arab Emirates", code: "ae" },
  { name: "United Kingdom", code: "gb" },
  { name: "United States", code: "us" },
  { name: "Vietnam", code: "vn" },
];

// Form Validation Schema using Zod
const userRegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    country: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserRegisterFormValues = z.infer<typeof userRegisterSchema>;

// Custom Searchable Country Select Dropdown Component
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

  // Close on outside click
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
      {/* Trigger Button */}
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
              alt={value ? `${value} flag` : "Country flag"}
              title={value || "Country flag"}
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

      {/* Dropdown Popover */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 max-h-72 flex flex-col overflow-hidden"
        >
          {/* Search Box */}
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

          {/* Options List */}
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

export default function UserRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isDetectingCountry, setIsDetectingCountry] = useState(false);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countriesList, setCountriesList] = useState<CountryOption[]>(DEFAULT_COUNTRIES);

  const [registerUser, { isLoading: isApiLoading }] = useRegisterUserMutation();

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
        // Silently fallback to DEFAULT_COUNTRIES without logging error trace
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserRegisterFormValues>({
    resolver: zodResolver(userRegisterSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      agreeTerms: false,
    },
  });

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
      // Fallback silently if IP API is blocked or offline
    }

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detected = "";
      let code = "";
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
      } else {
        const userLanguage = typeof navigator !== "undefined" ? navigator.language : "en-US";
        const cCode = userLanguage.split("-")[1];
        if (cCode) {
          code = cCode.toLowerCase();
          if (typeof Intl.DisplayNames !== "undefined") {
            const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
            detected = regionNames.of(cCode) || "";
          }
        }
      }

      if (detected) {
        setValue("country", detected, { shouldValidate: true });
      }
      if (code) {
        setCountryCode(code);
      }
    } catch {
      // Silent fallback
    } finally {
      setIsDetectingCountry(false);
    }
  }, [setValue]);

  useEffect(() => {
    detectCountry();
  }, [detectCountry]);

  const username = watch("username");
  const fullName = watch("fullName");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const agreeTerms = watch("agreeTerms");
  const countryValue = watch("country");

  const isFormComplete =
    Boolean(username?.trim()) &&
    Boolean(fullName?.trim()) &&
    Boolean(email?.trim()) &&
    Boolean(password) &&
    Boolean(confirmPassword) &&
    Boolean(agreeTerms) &&
    isValid;

  const onSubmit = async (data: UserRegisterFormValues) => {
    try {
      const res = await registerUser({
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        country: data.country,
        role: "user",
      }).unwrap();

      if (res.success) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setSocialLoading(provider);
    try {
      await authClient.signIn.oauth2({
        providerId: provider === "github" ? "github" : "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(`Error logging in with ${provider}:`, err);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased overflow-x-hidden">
      {/* LEFT PANEL - Illustration & Hero Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#EFF4FF] border-b lg:border-b-0 lg:border-r border-slate-200/80 p-6 sm:p-10 xl:p-14 flex flex-col justify-between items-center relative overflow-hidden min-h-[480px] lg:min-h-[100dvh] text-center"
      >
        {/* Top Floating Ambient Spheres/Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-0" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 w-full flex flex-col h-full justify-between items-center">
          {/* Top Bar with Back Link */}
          <div className="w-full flex justify-start items-center mb-4">
            <Link
              href="/account-type"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-blue-600" />
              <span>Back to choose account type</span>
            </Link>
          </div>

          {/* Center Illustration with Backdrop Graphics */}
          <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center py-4">
            {/* Soft Circular Graphic Backdrop */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/60 via-indigo-100/50 to-emerald-100/40 rounded-full blur-xl" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <DotLottieReact
                  src="/lottie/researcher.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>

            {/* Feature Badges under illustration */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-5 relative z-10">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-blue-200/80 px-3 py-1.5 rounded-full shadow-2xs text-sm font-semibold text-slate-800">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Discover Programs</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-2xs text-sm font-semibold text-slate-800">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Build Reputation</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-indigo-200/80 px-3 py-1.5 rounded-full shadow-2xs text-sm font-semibold text-slate-800">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Strong Community</span>
              </div>
            </div>
          </div>

          {/* Bottom Headline & Description */}
          <div className="mt-auto pt-4 max-w-md mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-blue-600 mb-2"
            >
              Join thousands of user
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal"
            >
              Start discovering vulnerabilities, earning bounties, and building your security career today.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Wider Centered User Registration Form using Shadcn components */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center items-center overflow-y-auto"
      >
        <div className="w-full max-w-xl lg:max-w-2xl mx-auto my-auto flex flex-col justify-center">

          {/* Main Title Header */}
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Create your User account
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
              Fill in your details to get started as a security researcher
            </p>
          </div>

          {/* Social Sign In Buttons at top */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
              disabled={socialLoading !== null}
              className="w-full h-11 sm:h-12 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Google</span>
            </Button>

            {/* GitHub */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("github")}
              disabled={socialLoading !== null}
              className="w-full h-11 sm:h-12 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {socialLoading === "github" ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <svg className="w-4 h-4 text-slate-900 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="bg-white px-3.5 text-xs font-medium text-slate-400 relative z-10">
              or Sign up with Email
            </span>
          </div>

          {/* Success State Overlay / Message */}
          {registrationSuccess ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-emerald-200 rounded-2xl p-8 text-center shadow-lg shadow-emerald-500/5 my-4"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Account Created!</h3>
              <p className="text-slate-600 text-sm">
                Welcome aboard! Redirecting you to your security dashboard...
              </p>
            </motion.div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1: Username & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <Label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="e.g. tada122"
                      {...register("username")}
                      className={`w-full h-11 pl-10 pr-4 bg-white border ${
                        errors.username ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-blue-500"
                      } rounded-xl text-slate-900 text-sm placeholder:text-slate-400 transition-all`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Data Battambang"
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
              </div>

              {/* Row 2: Email */}
              <div>
                <Label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
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

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <Label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                  <Label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
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
              </div>

              {/* Row 4: Country / Region (Auto-detected & Selectable via Custom Country Select UI) */}
              <div>
                <Label htmlFor="country" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Country / Region
                </Label>
                <CustomCountrySelect
                  value={countryValue || ""}
                  countryCode={countryCode}
                  countries={countriesList}
                  isDetecting={isDetectingCountry}
                  onSelect={(country) => {
                    setValue("country", country.name, { shouldValidate: true });
                    setCountryCode(country.code);
                  }}
                />
              </div>

              {/* Row 5: Checkbox Terms */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 leading-snug">
                    I agree to DevSolve's{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500 mt-1 pl-6.5">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!isFormComplete || isSubmitting || isApiLoading}
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting || isApiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Bottom Login Link */}
          <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/account-type" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
