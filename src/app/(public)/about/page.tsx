
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FaGithub, FaLinkedin, FaTelegram, FaGlobe } from "react-icons/fa6";
import Link from "next/link";

import {
  ArrowRight,
  Trophy,
  Code,
  MessageSquare,
  Lock,
  Bug,
  Ribbon,
  Mail,
  GraduationCap,
  Send,
  Play,
  X,
  


  MapPin,
  ChevronDown,
  ShieldCheck,
  Award,
} from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

import {
  SUPERVISORS,
  STUDENT_DEVELOPERS,
  TECHNOLOGIES,
  OFFERINGS,
} from "@/lib/types/about/mock-data";
import { TeamMember } from "@/lib/types/about/type";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-gray-900 font-sans antialiased">
      <AboutHeroSection />
      <TechStackSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}

function AboutHeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full py-10 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-[#09131D] text-white overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
        {/* Top Header Layout (Split 2-Column with Divider) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 sm:pt-4">
          
          {/* Left Column: Established badge & Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-light tracking-wider text-slate-400 uppercase">
                Establish
              </span>
              <span className="text-sm sm:text-base font-bold text-white tracking-widest uppercase">
                2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              We Are{" "}
              <span className="text-[#00D2B4] font-normal italic font-serif">
                Next-Gen
              </span>{" "}
              <br className="hidden sm:inline" />
              Security Platform
            </h1>
          </motion.div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 justify-self-center">
            <div className="w-[1px] h-32 bg-slate-800/80" />
          </div>

          {/* Right Column: Description paragraph & Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 space-y-6 sm:space-y-8"
          >
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              DevSolve connects organizations with top security researchers and developers to solve real-world technical challenges, fix vulnerabilities, and build resilient software.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-800/70">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  150 +
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
                  Active Programs
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  2.5K +
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
                  Top Developers
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  5.0K +
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
                  Solutions 
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Hero Image Banner with Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative w-full h-[320px] sm:h-[480px] lg:h-[580px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden group shadow-2xl border border-slate-800/60"
        >
          {/* Main Hero Image from Unsplash/Internet */}
          <Image
            src="/about-hero-team.jpg"
            alt="We Are Creative Digital Agency Team"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Interactive Play Button Center Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setIsVideoOpen(true)}
              aria-label="Play presentation video"
              className="relative group/btn cursor-pointer focus:outline-none"
            >
              {/* Outer Pulse Animation Ring */}
              <span className="absolute -inset-4 rounded-full bg-[#00D2B4]/30 animate-ping duration-1000" />
              
              {/* Teal Play Button Circle matching mockup */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#00D2B4] hover:bg-[#00c0a5] text-slate-950 flex items-center justify-center shadow-xl shadow-[#00D2B4]/40 transition-all duration-300 group-hover/btn:scale-110">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 fill-slate-950 translate-x-0.5" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="DevSolve Creative Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const ICON_MAP = {
  Bug,
  Code,
  MessageSquare,
  Trophy,
  Ribbon,
  Lock,
};

function OfferSection() {
  return (
    <section className="bg-slate-50/50 py-16 md:py-24 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Everything in One Place
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
            DevSolve integrates the complete challenge lifecycle — from program creation to reward payout — in a single, cohesive, secure platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERINGS.map((item, index) => {
            const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Bug;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-7 border ${item.borderColor} shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.accentBg} ${item.accentText} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const reactRef = useRef<HTMLDivElement>(null);
  const springRef = useRef<HTMLDivElement>(null);
  const postgresRef = useRef<HTMLDivElement>(null);
  const dockerRef = useRef<HTMLDivElement>(null);
  const keycloakRef = useRef<HTMLDivElement>(null);
  const tailwindRef = useRef<HTMLDivElement>(null);

  const leftTechs = [
    { tech: TECHNOLOGIES[0], ref: reactRef, curvature: -30, color: "#38bdf8" },
    { tech: TECHNOLOGIES[5], ref: tailwindRef, curvature: 0, color: "#2dd4bf" },
    { tech: TECHNOLOGIES[4], ref: keycloakRef, curvature: 30, color: "#a855f7" },
  ];

  const rightTechs = [
    { tech: TECHNOLOGIES[1], ref: springRef, curvature: -30, color: "#10b981" },
    { tech: TECHNOLOGIES[2], ref: postgresRef, curvature: 0, color: "#3b82f6" },
    { tech: TECHNOLOGIES[3], ref: dockerRef, curvature: 30, color: "#06b6d4" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-12">

        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          Built with Modern Technologies
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
          A carefully chosen, battle-tested stack for security, scalability, and
          developer experience.
        </p>
      </div>

      {/* Animated Beams Visual Hub */}
      <div
        ref={containerRef}
        className="relative flex h-[460px] sm:h-[500px] w-full items-center justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 p-4 sm:p-8 lg:p-12 shadow-sm mb-12"
      >
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 pointer-events-none" />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column - Frontend & Security */}
        <div className="flex flex-col justify-between h-full z-10 gap-3">
          {leftTechs.map((item, idx) => (
            <div
              key={idx}
              ref={item.ref}
              className={`bg-white rounded-2xl p-2.5 sm:p-4 border ${item.tech.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 sm:gap-3.5 w-36 sm:w-52 lg:w-60 bg-white/90 backdrop-blur-sm group cursor-default`}
            >
              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${item.tech.bgColor} p-1.5 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform`}
              >
                <Image
                  src={item.tech.image}
                  alt={`${item.tech.name} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {item.tech.name}
                </h3>
                <p className="text-gray-400 text-[10px] sm:text-[11px] font-medium truncate hidden sm:block">
                  {item.tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Center Hub - DevSolve Ecosystem */}
        <div className="flex items-center justify-center z-10 my-auto">
          <div
            ref={centerRef}
            className="relative flex flex-col items-center justify-center w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white border border-slate-200/80 shadow-lg shadow-blue-500/10 text-center group cursor-default p-3"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative flex items-center justify-center overflow-hidden rounded-full">
              <Image
                src="/devsolve-logo.png"
                alt="DevSolve Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-blue-100 tracking-wider uppercase mt-1 sm:mt-1.5 shadow-xs">
              DevSolve Hub
            </span>
          </div>
        </div>

        {/* Right Column - Backend & Infrastructure */}
        <div className="flex flex-col justify-between h-full z-10 gap-3">
          {rightTechs.map((item, idx) => (
            <div
              key={idx}
              ref={item.ref}
              className={`bg-white rounded-2xl p-2.5 sm:p-4 border ${item.tech.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 sm:gap-3.5 w-36 sm:w-52 lg:w-60 bg-white/90 backdrop-blur-sm group cursor-default`}
            >
              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${item.tech.bgColor} p-1.5 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform`}
              >
                <Image
                  src={item.tech.image}
                  alt={`${item.tech.name} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {item.tech.name}
                </h3>
                <p className="text-gray-400 text-[10px] sm:text-[11px] font-medium truncate hidden sm:block">
                  {item.tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Beams (Left to Center) */}
        {leftTechs.map((item, idx) => (
          <AnimatedBeam
            key={`left-${idx}`}
            containerRef={containerRef}
            fromRef={item.ref}
            toRef={centerRef}
            curvature={item.curvature}
            gradientStartColor={item.color}
            gradientStopColor="#3b82f6"
            duration={3 + idx * 0.5}
            pathWidth={2.5}
          />
        ))}

        {/* Animated Beams (Center to Right) */}
        {rightTechs.map((item, idx) => (
          <AnimatedBeam
            key={`right-${idx}`}
            containerRef={containerRef}
            fromRef={centerRef}
            toRef={item.ref}
            curvature={item.curvature}
            gradientStartColor="#3b82f6"
            gradientStopColor={item.color}
            duration={3.5 + idx * 0.4}
            pathWidth={2.5}
          />
        ))}
      </div>

    </section>
  );
}

function TeamSection() {
  const [activeTab, setActiveTab] = useState<"all" | "mentors" | "developers">("all");

  const allMembers = [
    ...SUPERVISORS.map((m) => ({ ...m, category: "mentors" })),
    ...STUDENT_DEVELOPERS.map((m) => ({ ...m, category: "developers" })),
  ];

  const filteredMembers = allMembers.filter((m) => {
    if (activeTab === "mentors") return m.category === "mentors";
    if (activeTab === "developers") return m.category === "developers";
    return true;
  });

  return (
    <section id="team" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Header section matching mockup */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
  
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Our Team of Experts
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mt-3 leading-relaxed">
            Meet the passionate mentors and developers behind DevSolve, driving software development and digital innovation forward.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex items-center p-1 bg-slate-200/60 rounded-full text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-xs font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Experts ({allMembers.length})
          </button>
          <button
            onClick={() => setActiveTab("mentors")}
            className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === "mentors"
                ? "bg-white text-gray-900 shadow-xs font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Mentors ({SUPERVISORS.length})
          </button>
          <button
            onClick={() => setActiveTab("developers")}
            className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === "developers"
                ? "bg-white text-gray-900 shadow-xs font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Developers ({STUDENT_DEVELOPERS.length})
          </button>
        </div>
      </div>

      {/* Responsive Grid matching mockup */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10"
      >
        {/* Join The Team Card (First card as shown in mockup) */}
        {(activeTab === "all" || activeTab === "developers") && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-between bg-slate-100/80 rounded-3xl p-7 border border-slate-200/50 shadow-2xs aspect-[3/4] hover:bg-slate-100 transition-colors"
          >
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">
                JOIN THE TEAM
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-gray-900 leading-tight mt-4">
                Want to shape the future of technology?
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-4 leading-relaxed">
                Join us and create bold, innovative digital solutions that inspire change.
              </p>
            </div>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white text-xs font-medium px-6 py-3 rounded-full transition shadow-xs w-fit group cursor-pointer"
            >
              Apply Now
              <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        {/* Member Cards */}
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col group cursor-pointer"
    >
      {/* Image Container with aspect ratio matching mockup */}
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#f3f4f6] border border-gray-100 shadow-2xs group-hover:shadow-md transition-all duration-300">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Social Icons Overlay (Bottom Right of Image as in mockup) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
              title="GitHub"
            >
              <FaGithub className="w-3.5 h-3.5" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
              title="LinkedIn"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {member.telegram && (
            <a
              href={member.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
              title="Telegram"
            >
              <FaTelegram className="w-3.5 h-3.5" />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
              title="Email"
            >
              <FaGlobe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Info Row Below Image */}
      <div className="mt-3.5 flex items-center justify-between px-1 gap-2">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
          {member.name}
        </h3>

        {member.badge && (
          <span className="border border-gray-300/80 bg-white/80 rounded-full px-3 py-0.5 text-xs font-normal text-gray-600 shadow-2xs shrink-0">
            {member.badge}
          </span>
        )}
      </div>

      {/* Subrole / Quote */}
      <p className="text-xs text-gray-500 mt-1 line-clamp-1 px-1 font-normal italic opacity-80 group-hover:opacity-100 transition-opacity">
        {member.quote}
      </p>
    </motion.div>
  );
}

// function ContactSection() {
//   return (
//     <section className="bg-slate-50/50 py-16 md:py-24 border-t border-gray-100">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-12">
//           <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
//             Contact Us
//           </h2>
//           <h1 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900">
//             Get In Touch
//           </h1>
//           <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto mt-4">
//             Have questions, want to partner, or want to learn more about DevSolve?
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
//           <div className="lg:col-span-5 space-y-8">
//             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
//               <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>

//               <div className="space-y-4">
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
//                     <Mail className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
//                     <a href="mailto:contact@devsolve.io" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition">
//                       contact@devsolve.io
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-3xl p-8 border border-blue-100 shadow-xs">
//               <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4">
//                 <GraduationCap className="w-6 h-6" />
//               </div>
//               <h3 className="text-base font-bold text-gray-900 mb-2">University Project</h3>
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 DevSolve is a university final-year project exploring cybersecurity
//                 platform design, ethical hacking workflows, and secure software
//                 engineering. We welcome academic feedback and collaboration.
//               </p>
//             </div>
//           </div>

//           {/* Complete Contact Form */}
//           <div className="lg:col-span-7">
//             <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-6">Send a Message</h3>
//               <form className="space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="John Doe"
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       placeholder="john@example.com"
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="How can we help?"
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     rows={4}
//                     placeholder="Write your message here..."
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
//                   ></textarea>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition shadow-md shadow-blue-600/20 gap-2 cursor-pointer"
//                 >
//                   <Send className="w-4 h-4" />
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }









// "use client";

// import { useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion, AnimatePresence } from "motion/react";
// import { FaGithub, FaLinkedin, FaTelegram, FaGlobe } from "react-icons/fa6";
// import {
//   ArrowRight,
//   Trophy,
//   Code,
//   MessageSquare,
//   Lock,
//   Bug,
//   Ribbon,
//   Mail,
//   MapPin,
//   GraduationCap,
//   Send,
//   Play,
//   X,
//   ShieldCheck,
//   Award,
//   ChevronDown,
// } from "lucide-react";
// import { AnimatedBeam } from "@/components/ui/animated-beam";

// import {
//   SUPERVISORS,
//   STUDENT_DEVELOPERS,
//   TECHNOLOGIES,
//   OFFERINGS,
// } from "@/lib/types/about/mock-data";
// import { TeamMember } from "@/lib/types/about/type";

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-slate-50/50 text-gray-900 font-sans antialiased">
//       <AboutHeroSection />
//       <OfferSection />
//       <TechStackSection />
//       <TeamSection />
//       <ContactSection />
//     </div>
//   );
// }

// function AboutHeroSection() {
//   const [isVideoOpen, setIsVideoOpen] = useState(false);

//   return (
//     <section className="relative w-full py-10 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-[#09131D] text-white overflow-hidden">
//       {/* Background Glow Overlay */}
//       <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
//       <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
//         {/* Top Header Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 sm:pt-4">
//           {/* Left Column: Established badge & Main Title */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="lg:col-span-7 space-y-4"
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-xs sm:text-sm font-light tracking-wider text-slate-400 uppercase">
//                 Established
//               </span>
//               <span className="text-sm sm:text-base font-bold text-white tracking-widest uppercase">
//                 2026
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
//               We Are{" "}
//               <span className="text-[#00D2B4] font-normal italic font-serif">
//                 Next-Gen
//               </span>{" "}
//               <br className="hidden sm:inline" />
//               Security Platform
//             </h1>
//           </motion.div>

//           {/* Vertical Divider */}
//           <div className="hidden lg:block lg:col-span-1 justify-self-center">
//             <div className="w-[1px] h-32 bg-slate-800/80" />
//           </div>

//           {/* Right Column */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.15 }}
//             className="lg:col-span-4 space-y-6 sm:space-y-8"
//           >
//             <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
//               DevSolve connects organizations with top security researchers and developers to solve real-world technical challenges, fix vulnerabilities, and build resilient software.
//             </p>

//             {/* Stats Row */}
//             <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-800/70">
//               <div>
//                 <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
//                   150 +
//                 </div>
//                 <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
//                   Active Programs
//                 </div>
//               </div>

//               <div>
//                 <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
//                   2.5K +
//                 </div>
//                 <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
//                   Top Developers
//                 </div>
//               </div>

//               <div>
//                 <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
//                   5.0K +
//                 </div>
//                 <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
//                   Solutions
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Hero Image Banner */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.25 }}
//           className="relative w-full h-[320px] sm:h-[480px] lg:h-[580px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden group shadow-2xl border border-slate-800/60"
//         >
//           <Image
//             src="/about-hero-team.jpg"
//             alt="We Are Creative Digital Agency Team"
//             fill
//             priority
//             className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
//             sizes="(max-width: 1280px) 100vw, 1280px"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

//           {/* Play Button */}
//           <div className="absolute inset-0 flex items-center justify-center z-10">
//             <button
//               onClick={() => setIsVideoOpen(true)}
//               aria-label="Play presentation video"
//               className="relative group/btn cursor-pointer focus:outline-none"
//             >
//               <span className="absolute -inset-4 rounded-full bg-[#00D2B4]/30 animate-ping duration-1000" />
//               <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#00D2B4] hover:bg-[#00c0a5] text-slate-950 flex items-center justify-center shadow-xl shadow-[#00D2B4]/40 transition-all duration-300 group-hover/btn:scale-110">
//                 <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 fill-slate-950 translate-x-0.5" />
//               </div>
//             </button>
//           </div>
//         </motion.div>
//       </div>

//       {/* Video Modal */}
//       <AnimatePresence>
//         {isVideoOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
//             onClick={() => setIsVideoOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() => setIsVideoOpen(false)}
//                 className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               <div className="relative aspect-video w-full">
//                 <iframe
//                   className="w-full h-full"
//                   src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
//                   title="DevSolve Creative Video"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }

// const ICON_MAP = {
//   Bug,
//   Code,
//   MessageSquare,
//   Trophy,
//   Ribbon,
//   Lock,
// };

// function OfferSection() {
//   return (
//     <section className="bg-slate-50/50 py-16 md:py-24 border-y border-gray-100">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
//             Everything in One Place
//           </h2>
//           <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
//             DevSolve integrates the complete challenge lifecycle — from program creation to reward payout — in a single, cohesive, secure platform.
//           </p>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {OFFERINGS.map((item, index) => {
//             const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Bug;
//             return (
//               <div
//                 key={index}
//                 className={`bg-white rounded-3xl p-7 border ${item.borderColor} shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between`}
//               >
//                 <div>
//                   <div
//                     className={`w-11 h-11 rounded-2xl ${item.accentBg} ${item.accentText} flex items-center justify-center mb-6`}
//                   >
//                     <Icon className="w-5 h-5" />
//                   </div>
//                   <h3 className="text-base font-bold text-gray-900 mb-2">
//                     {item.title}
//                   </h3>
//                   <p className="text-gray-500 text-xs leading-relaxed">
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// function TechStackSection() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const centerRef = useRef<HTMLDivElement>(null);
//   const reactRef = useRef<HTMLDivElement>(null);
//   const springRef = useRef<HTMLDivElement>(null);
//   const postgresRef = useRef<HTMLDivElement>(null);
//   const dockerRef = useRef<HTMLDivElement>(null);
//   const keycloakRef = useRef<HTMLDivElement>(null);
//   const tailwindRef = useRef<HTMLDivElement>(null);

//   const leftTechs = [
//     { tech: TECHNOLOGIES[0], ref: reactRef, curvature: -30, color: "#38bdf8" },
//     { tech: TECHNOLOGIES[5], ref: tailwindRef, curvature: 0, color: "#2dd4bf" },
//     { tech: TECHNOLOGIES[4], ref: keycloakRef, curvature: 30, color: "#a855f7" },
//   ];

//   const rightTechs = [
//     { tech: TECHNOLOGIES[1], ref: springRef, curvature: -30, color: "#10b981" },
//     { tech: TECHNOLOGIES[2], ref: postgresRef, curvature: 0, color: "#3b82f6" },
//     { tech: TECHNOLOGIES[3], ref: dockerRef, curvature: 30, color: "#06b6d4" },
//   ];

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
//           Built with Modern Technologies
//         </h2>
//         <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
//           A carefully chosen, battle-tested stack for security, scalability, and
//           developer experience.
//         </p>
//       </div>

//       {/* Animated Beams */}
//       <div
//         ref={containerRef}
//         className="relative flex h-[460px] sm:h-[500px] w-full items-center justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 p-4 sm:p-8 lg:p-12 shadow-sm mb-12"
//       >
//         {/* Grid Background */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 pointer-events-none" />

//         {/* Ambient Glow */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

//         {/* Left Column */}
//         <div className="flex flex-col justify-between h-full z-10 gap-3">
//           {leftTechs.map((item, idx) => (
//             <div
//               key={idx}
//               ref={item.ref}
//               className={`bg-white rounded-2xl p-2.5 sm:p-4 border ${item.tech.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 sm:gap-3.5 w-36 sm:w-52 lg:w-60 bg-white/90 backdrop-blur-sm group cursor-default`}
//             >
//               <div
//                 className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${item.tech.bgColor} p-1.5 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform`}
//               >
//                 <Image
//                   src={item.tech.image}
//                   alt={`${item.tech.name} logo`}
//                   fill
//                   className="object-contain p-1"
//                 />
//               </div>
//               <div className="overflow-hidden">
//                 <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
//                   {item.tech.name}
//                 </h3>
//                 <p className="text-gray-400 text-[10px] sm:text-[11px] font-medium truncate hidden sm:block">
//                   {item.tech.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Center Hub */}
//         <div className="flex items-center justify-center z-10 my-auto">
//           <div
//             ref={centerRef}
//             className="relative flex flex-col items-center justify-center w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white border border-slate-200/80 shadow-lg shadow-blue-500/10 text-center group cursor-default p-3"
//           >
//             <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative flex items-center justify-center overflow-hidden rounded-full">
//               <Image
//                 src="/devsolve-logo.png"
//                 alt="DevSolve Logo"
//                 fill
//                 className="object-contain p-1"
//               />
//             </div>
//             <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-blue-100 tracking-wider uppercase mt-1 sm:mt-1.5 shadow-xs">
//               DevSolve Hub
//             </span>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="flex flex-col justify-between h-full z-10 gap-3">
//           {rightTechs.map((item, idx) => (
//             <div
//               key={idx}
//               ref={item.ref}
//               className={`bg-white rounded-2xl p-2.5 sm:p-4 border ${item.tech.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 sm:gap-3.5 w-36 sm:w-52 lg:w-60 bg-white/90 backdrop-blur-sm group cursor-default`}
//             >
//               <div
//                 className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${item.tech.bgColor} p-1.5 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform`}
//               >
//                 <Image
//                   src={item.tech.image}
//                   alt={`${item.tech.name} logo`}
//                   fill
//                   className="object-contain p-1"
//                 />
//               </div>
//               <div className="overflow-hidden">
//                 <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
//                   {item.tech.name}
//                 </h3>
//                 <p className="text-gray-400 text-[10px] sm:text-[11px] font-medium truncate hidden sm:block">
//                   {item.tech.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Animated Beams */}
//         {leftTechs.map((item, idx) => (
//           <AnimatedBeam
//             key={`left-${idx}`}
//             containerRef={containerRef}
//             fromRef={item.ref}
//             toRef={centerRef}
//             curvature={item.curvature}
//             gradientStartColor={item.color}
//             gradientStopColor="#3b82f6"
//             duration={3 + idx * 0.5}
//             pathWidth={2.5}
//           />
//         ))}

//         {rightTechs.map((item, idx) => (
//           <AnimatedBeam
//             key={`right-${idx}`}
//             containerRef={containerRef}
//             fromRef={centerRef}
//             toRef={item.ref}
//             curvature={item.curvature}
//             gradientStartColor="#3b82f6"
//             gradientStopColor={item.color}
//             duration={3.5 + idx * 0.4}
//             pathWidth={2.5}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// function TeamSection() {
//   const [activeTab, setActiveTab] = useState<"all" | "mentors" | "developers">("all");

//   const allMembers = [
//     ...SUPERVISORS.map((m) => ({ ...m, category: "mentors" })),
//     ...STUDENT_DEVELOPERS.map((m) => ({ ...m, category: "developers" })),
//   ];

//   const filteredMembers = allMembers.filter((m) => {
//     if (activeTab === "mentors") return m.category === "mentors";
//     if (activeTab === "developers") return m.category === "developers";
//     return true;
//   });

//   return (
//     <section id="team" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
//       <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
//         <div>
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
//             Our Team of Experts
//           </h2>
//           <p className="text-gray-500 text-sm max-w-xl mt-3 leading-relaxed">
//             Meet the passionate mentors and developers behind DevSolve, driving software development and digital innovation forward.
//           </p>
//         </div>

//         {/* Filter Tabs */}
//         <div className="inline-flex items-center p-1 bg-slate-200/60 rounded-full text-xs font-medium self-start md:self-auto">
//           <button
//             onClick={() => setActiveTab("all")}
//             className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
//               activeTab === "all"
//                 ? "bg-white text-gray-900 shadow-xs font-semibold"
//                 : "text-gray-500 hover:text-gray-900"
//             }`}
//           >
//             All Experts ({allMembers.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("mentors")}
//             className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
//               activeTab === "mentors"
//                 ? "bg-white text-gray-900 shadow-xs font-semibold"
//                 : "text-gray-500 hover:text-gray-900"
//             }`}
//           >
//             Mentors ({SUPERVISORS.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("developers")}
//             className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
//               activeTab === "developers"
//                 ? "bg-white text-gray-900 shadow-xs font-semibold"
//                 : "text-gray-500 hover:text-gray-900"
//             }`}
//           >
//             Developers ({STUDENT_DEVELOPERS.length})
//           </button>
//         </div>
//       </div>

//       <motion.div
//         layout
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10"
//       >
//         {/* Join The Team Card */}
//         {(activeTab === "all" || activeTab === "developers") && (
//           <motion.div
//             layout
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className="flex flex-col justify-between bg-slate-100/80 rounded-3xl p-7 border border-slate-200/50 shadow-2xs aspect-[3/4] hover:bg-slate-100 transition-colors"
//           >
//             <div>
//               <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">
//                 JOIN THE TEAM
//               </span>
//               <h3 className="text-2xl sm:text-3xl font-light text-gray-900 leading-tight mt-4">
//                 Want to shape the future of technology?
//               </h3>
//               <p className="text-xs sm:text-sm text-gray-500 mt-4 leading-relaxed">
//                 Join us and create bold, innovative digital solutions that inspire change.
//               </p>
//             </div>

//             <Link
//               href="#contact"
//               className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white text-xs font-medium px-6 py-3 rounded-full transition shadow-xs w-fit group cursor-pointer"
//             >
//               Apply Now
//               <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
//             </Link>
//           </motion.div>
//         )}

//         {/* Member Cards */}
//         <AnimatePresence mode="popLayout">
//           {filteredMembers.map((member) => (
//             <MemberCard key={member.name} member={member} />
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     </section>
//   );
// }

// function MemberCard({ member }: { member: TeamMember }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ duration: 0.3 }}
//       className="flex flex-col group cursor-pointer"
//     >
//       <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#f3f4f6] border border-gray-100 shadow-2xs group-hover:shadow-md transition-all duration-300">
//         <Image
//           src={member.image}
//           alt={member.name}
//           fill
//           className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//         />

//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

//         {/* Social Icons */}
//         <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
//           {member.github && (
//             <a
//               href={member.github}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
//               title="GitHub"
//             >
//               <FaGithub className="w-3.5 h-3.5" />
//             </a>
//           )}
//           {member.linkedin && (
//             <a
//               href={member.linkedin}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
//               title="LinkedIn"
//             >
//               <FaLinkedin className="w-3.5 h-3.5" />
//             </a>
//           )}
//           {member.telegram && (
//             <a
//               href={member.telegram}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
//               title="Telegram"
//             >
//               <FaTelegram className="w-3.5 h-3.5" />
//             </a>
//           )}
//           {member.email && (
//             <a
//               href={`mailto:${member.email}`}
//               className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 shadow-xs hover:scale-110"
//               title="Email"
//             >
//               <FaGlobe className="w-3.5 h-3.5" />
//             </a>
//           )}
//         </div>
//       </div>

//       <div className="mt-3.5 flex items-center justify-between px-1 gap-2">
//         <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
//           {member.name}
//         </h3>

//         {member.badge && (
//           <span className="border border-gray-300/80 bg-white/80 rounded-full px-3 py-0.5 text-xs font-normal text-gray-600 shadow-2xs shrink-0">
//             {member.badge}
//           </span>
//         )}
//       </div>

//       <p className="text-xs text-gray-500 mt-1 line-clamp-1 px-1 font-normal italic opacity-80 group-hover:opacity-100 transition-opacity">
//         {member.quote}
//       </p>
//     </motion.div>
//   );
// }

// // function ContactSection() {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     subject: "",
// //     message: "",
// //   });

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     console.log("Form Submitted:", formData);
// //     setFormData({ name: "", email: "", subject: "", message: "" });
// //     alert("Thank you for your message! We'll get back to you soon.");
// //   };

// //   return (
// //     <section id="contact" className="bg-slate-50/50 py-16 md:py-24 border-t border-gray-100">
// //       <div className="max-w-7xl mx-auto px-6">
// //         <div className="text-center mb-12">
// //           <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
// //             Contact Us
// //           </h2>
// //           <h1 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900 tracking-tight">
// //             Get In Touch
// //           </h1>
// //           <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
// //             Have questions, want to partner, or want to learn more about DevSolve? We&apos;d love to hear from you.
// //           </p>
// //         </div>

// //         <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
// //           {/* Info Sidebar */}
// //           <div className="lg:col-span-5 space-y-8">
// //             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
// //               <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>

// //               <div className="space-y-6">
// //                 <div className="flex items-start gap-4">
// //                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
// //                     <Mail className="w-5 h-5" />
// //                   </div>
// //                   <div>
// //                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
// //                     <a
// //                       href="mailto:contact@devsolve.io"
// //                       className="text-sm font-medium text-gray-900 hover:text-blue-600 transition"
// //                     >
// //                       contact@devsolve.io
// //                     </a>
// //                   </div>
// //                 </div>

// //                 <div className="flex items-start gap-4">
// //                   <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
// //                     <MapPin className="w-5 h-5" />
// //                   </div>
// //                   <div>
// //                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</p>
// //                     <p className="text-sm font-medium text-gray-900">
// //                       Phnom Penh, Cambodia
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-3xl p-8 border border-blue-100 shadow-xs">
// //               <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4">
// //                 <GraduationCap className="w-6 h-6" />
// //               </div>
// //               <h3 className="text-base font-bold text-gray-900 mb-2">University Project</h3>
// //               <p className="text-sm text-gray-600 leading-relaxed">
// //                 DevSolve is a university final-year project exploring cybersecurity
// //                 platform design, ethical hacking workflows, and secure software
// //                 engineering. We welcome academic feedback and collaboration.
// //               </p>
// //             </div>
// //           </div>

// //           {/* Contact Form */}
// //           <div className="lg:col-span-7">
// //             <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
// //               <h3 className="text-lg font-bold text-gray-900 mb-6">Send a Message</h3>
// //               <form onSubmit={handleSubmit} className="space-y-5">
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
// //                       Full Name
// //                     </label>
// //                     <input
// //                       type="text"
// //                       required
// //                       placeholder="John Doe"
// //                       value={formData.name}
// //                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                       className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
// //                       Email Address
// //                     </label>
// //                     <input
// //                       type="email"
// //                       required
// //                       placeholder="john@example.com"
// //                       value={formData.email}
// //                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                       className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
// //                     Subject
// //                   </label>
// //                   <input
// //                     type="text"
// //                     required
// //                     placeholder="How can we help?"
// //                     value={formData.subject}
// //                     onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
// //                     className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
// //                     Message
// //                   </label>
// //                   <textarea
// //                     rows={4}
// //                     required
// //                     placeholder="Write your message here..."
// //                     value={formData.message}
// //                     onChange={(e) => setFormData({ ...formData, message: e.target.value })}
// //                     className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
// //                   ></textarea>
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer gap-2"
// //                 >
// //                   <span>Send Message</span>
// //                   <Send className="w-4 h-4" />
// //                 </button>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


// function ContactSection() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     inquiryType: "Cybersecurity Consulting",
//     message: "",
//     agreeToTerms: false,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form Submitted:", formData);
//     alert("Thank you for reaching out! Our team will respond within 24 business hours.");
//     setFormData({
//       name: "",
//       email: "",
//       inquiryType: "Cybersecurity Consulting",
//       message: "",
//       agreeToTerms: false,
//     });
//   };

//   return (
//     <section id="contact" className="relative bg-slate-900 overflow-hidden py-16 lg:py-24">
//       {/* Background Cyber Tech Grid Overlay */}
//       <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
//       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 pointer-events-none" />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-slate-950/60 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
          
//           {/* Left Column: Cyber Security Hero Banner */}
//           <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border-r border-slate-800/60">
//             {/* Soft Ambient Glows */}
//             <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
//             <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

//             {/* Top Content */}
//             <div className="relative z-10 space-y-6">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
//                 <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
//                 Cyber Defense Academy
//               </div>

//               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
//                 Let&apos;s Secure the <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
//                   Future Together.
//                 </span>
//               </h2>

//               <p className="text-slate-300 text-sm leading-relaxed max-w-md font-normal">
//                 Connect with our research and security engineering team to explore enterprise-grade solutions and academic partnerships.
//               </p>
//             </div>

//             {/* Middle Graphic / Watermark */}
//             <div className="relative z-10 my-10 flex items-center justify-center py-6">
//               <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
//                 <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow" />
//                 <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-teal-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
//                   <Lock className="w-12 h-12 text-blue-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Contact Details */}
//             <div className="relative z-10 space-y-4 pt-6 border-t border-slate-800/80">
//               <div className="flex items-center gap-3 text-slate-300 hover:text-white transition">
//                 <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 shrink-0">
//                   <Mail className="w-4 h-4" />
//                 </div>
//                 <a href="mailto:contact@devsolve.university" className="text-xs sm:text-sm font-medium">
//                   contact@devsolve.university
//                 </a>
//               </div>

//               <div className="flex items-center gap-3 text-slate-300">
//                 <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-teal-400 shrink-0">
//                   <MapPin className="w-4 h-4" />
//                 </div>
//                 <span className="text-xs sm:text-sm font-medium">
//                   Innovation Hub, Campus West
//                 </span>
//               </div>

//               <div className="pt-4">
//                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
//                   Cybersecurity • Aura Professional
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Floating White Form Card */}
//           <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-slate-100/30 flex flex-col justify-between">
//             <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100/80">
//               <div className="mb-6">
//                 <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
//                   Send a Message
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                   Our team typically responds within 24 business hours.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                       Work Email
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       placeholder="john@university.edu"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                     Inquiry Type
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={formData.inquiryType}
//                       onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
//                       className="w-full appearance-none px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition cursor-pointer pr-10"
//                     >
//                       <option value="Cybersecurity Consulting">Cybersecurity Consulting</option>
//                       <option value="Academic Research">Academic Research Partnership</option>
//                       <option value="Bug Bounty Support">Bug Bounty Program Support</option>
//                       <option value="General Inquiry">General Inquiry</option>
//                     </select>
//                     <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                     Your Message
//                   </label>
//                   <textarea
//                     rows={4}
//                     required
//                     placeholder="How can our engineers help you?"
//                     value={formData.message}
//                     onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                     className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition resize-none"
//                   ></textarea>
//                 </div>

//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
//                   <label className="flex items-start sm:items-center gap-2 cursor-pointer group">
//                     <input
//                       type="checkbox"
//                       required
//                       checked={formData.agreeToTerms}
//                       onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
//                       className="mt-0.5 sm:mt-0 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 transition"
//                     />
//                     <span className="text-xs text-gray-500 group-hover:text-gray-700 transition">
//                       I agree to the{" "}
//                       <Link href="#" className="text-blue-600 hover:underline font-medium">
//                         Privacy Policy
//                       </Link>{" "}
//                       regarding my data processing.
//                     </span>
//                   </label>

//                   <button
//                     type="submit"
//                     className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/25 cursor-pointer gap-2 shrink-0"
//                   >
//                     <span>Send Message</span>
//                     <Send className="w-4 h-4" />
//                   </button>
//                 </div>
//               </form>
//             </div>

//             {/* Bottom Security Badges */}
//             <div className="grid grid-cols-3 gap-4 pt-8 text-center text-slate-500">
//               <div className="flex flex-col items-center gap-1.5">
//                 <ShieldCheck className="w-5 h-5 text-gray-400" />
//                 <span className="text-[11px] font-medium tracking-wide">ISO 27001</span>
//               </div>
//               <div className="flex flex-col items-center gap-1.5">
//                 <GraduationCap className="w-5 h-5 text-gray-400" />
//                 <span className="text-[11px] font-medium tracking-wide">Academic Lab</span>
//               </div>
//               <div className="flex flex-col items-center gap-1.5">
//                 <Award className="w-5 h-5 text-gray-400" />
//                 <span className="text-[11px] font-medium tracking-wide">EU Certified</span>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }


function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "Cybersecurity Consulting",
    message: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you for reaching out! Our team will respond within 24 business hours.");
    setFormData({
      name: "",
      email: "",
      inquiryType: "Cybersecurity Consulting",
      message: "",
      agreeToTerms: false,
    });
  };

  return (
    <section id="contact" className="relative bg-slate-900 overflow-hidden py-16 lg:py-24">
      {/* Background Cyber Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-slate-950/60 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Left Column: Cyber Security Hero Banner */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border-r border-slate-800/60">
            {/* Soft Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Content */}
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Cyber Defense Academy
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Let&apos;s Secure the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
                  Future Together.
                </span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed max-w-md font-normal">
                Connect with our research and security engineering team to explore enterprise-grade solutions and academic partnerships.
              </p>
            </div>

            {/* Middle Graphic / Watermark */}
            <div className="relative z-10 my-10 flex items-center justify-center py-6">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow" />
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-teal-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <Lock className="w-12 h-12 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Bottom Contact Details */}
            <div className="relative z-10 space-y-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-slate-300 hover:text-white transition">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:contact@devsolve.university" className="text-xs sm:text-sm font-medium">
                  contact@devsolve.university
                </a>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-teal-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  Innovation Hub, Campus West
                </span>
              </div>

              <div className="pt-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Cybersecurity • Aura Professional
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating White Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-slate-100/30 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100/80">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Our team typically responds within 24 business hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full appearance-none px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition cursor-pointer pr-10"
                    >
                      <option value="Cybersecurity Consulting">Cybersecurity Consulting</option>
                      <option value="Academic Research">Academic Research Partnership</option>
                      <option value="Bug Bounty Support">Bug Bounty Program Support</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our engineers help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <label className="flex items-start sm:items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="mt-0.5 sm:mt-0 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 transition"
                    />
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition">
                      I agree to the{" "}
                      <Link href="#" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>{" "}
                      regarding my data processing.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/25 cursor-pointer gap-2 shrink-0"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 text-center text-slate-500">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-[11px] font-medium tracking-wide">ISO 27001</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <span className="text-[11px] font-medium tracking-wide">Academic Lab</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Award className="w-5 h-5 text-gray-400" />
                <span className="text-[11px] font-medium tracking-wide">EU Certified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

