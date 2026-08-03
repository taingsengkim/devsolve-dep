


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
          <Image
            src="/about-hero-team.jpg"
            alt="We Are Creative Digital Agency Team"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setIsVideoOpen(true)}
              aria-label="Play presentation video"
              className="relative group/btn cursor-pointer focus:outline-none"
            >
              <span className="absolute -inset-4 rounded-full bg-[#00D2B4]/30 animate-ping duration-1000" />
              
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#00D2B4] hover:bg-[#00c0a5] text-slate-950 flex items-center justify-center shadow-xl shadow-[#00D2B4]/40 transition-all duration-300 group-hover/btn:scale-110">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 fill-slate-950 translate-x-0.5" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

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

      <div
        ref={containerRef}
        className="relative flex h-[460px] sm:h-[500px] w-full items-center justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 p-4 sm:p-8 lg:p-12 shadow-sm mb-12"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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
  return (
    <section id="team" className="max-w-6xl mx-auto px-6 py-2">

      <div className="text-center mb-10">
        <span className="text-blue-600 uppercase tracking-[0.3em] text-sm font-semibold">
          OUR TEAM
        </span>

        <h2 className="mt-3 text-4xl font-bold text-gray-900">
          Meet the People Behind DevSolve
        </h2>

        <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
          Our mentors and developers work together to build secure,
          innovative, and scalable software solutions.
        </p>
      </div>

      {/* Mentors */}
      <div className="mb-14">
        <h3 className="text-2xl font-semibold text-center mb-6  color-pink-300" >
          Mentors
        </h3>

        <div className="flex justify-center gap-8">
          {SUPERVISORS.map((mentor) => (
            <div key={mentor.name} className="w-64">
              <MemberCard member={mentor}  />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-center mb-6">
          Developers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 justify-items-center">
          {STUDENT_DEVELOPERS.map((member) => (
            <div key={member.name} className="w-64">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}






function MemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group w-full"
    >
      <div
        className="
          relative 
          aspect-[3/4] 
          overflow-hidden 
          rounded-2xl 
          bg-gray-100
          shadow-sm
          border border-gray-200
          transition-all
          duration-300
          group-hover:shadow-xl
        "
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="
            object-cover 
            object-top
            transition-transform 
            duration-500
            group-hover:scale-105
          "
          sizes="(max-width:768px) 100vw, 25vw"
        />


        <div
          className="
            absolute 
            inset-x-0 
            bottom-0 
            h-32
            bg-gradient-to-t 
            from-black/70 
            via-black/30 
            to-transparent
          "
        />


        {/* Role Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className="
              px-4
              py-2
              rounded-full
              bg-black/60
              backdrop-blur-md
              text-white
              text-[11px]
              font-bold
              tracking-wider
              border
              border-white/10
            "
          >
            {member.subRole?.toUpperCase() || "FULL STACK"}
          </span>
        </div>


        <div
          className="
            absolute 
            bottom-4 
            right-4 
            flex 
            gap-2
          "
        >
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              className="
                w-9 h-9
                rounded-full
                bg-black/80
                text-white
                flex
                items-center
                justify-center
                hover:scale-110
                transition
              "
            >
              <FaGithub size={15}/>
            </a>
          )}


          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              className="
                w-9 h-9
                rounded-full
                bg-black/80
                text-white
                flex
                items-center
                justify-center
                hover:scale-110
                transition
              "
            >
              <FaLinkedin size={15}/>
            </a>
          )}


          {member.telegram && (
            <a
              href={member.telegram}
              target="_blank"
              className="
                w-9 h-9
                rounded-full
                bg-black/80
                text-white
                flex
                items-center
                justify-center
                hover:scale-110
                transition
              "
            >
              <FaTelegram size={15}/>
            </a>
          )}
        </div>
      </div>



      <div className="mt-4 px-1">

        <div className="flex items-center justify-between">

          <h3
            className="
              text-lg
              font-bold
              text-gray-900
            "
          >
            {member.name}
          </h3>


          <span
            className="
              text-[10px]
              px-3
              py-1
              rounded-full
              border
              border-blue-200
              text-blue-600
              font-semibold
              bg-blue-50
            "
          >
            {member.badge || "MEMBER"}
          </span>

        </div>



        {member.quote && (
          <p
            className="
              mt-2
              text-sm
              italic
              text-gray-400
              leading-relaxed
            "
          >
            {member.quote.replace(/['"]+/g, "")}
          </p>
        )}

      </div>

    </motion.div>
  );
}




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
    <section id="contact" className="relative bg-slate-950 overflow-hidden py-16 lg:py-24">
      {/* 1. Cyber Image Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-screen pointer-events-none"
        style={{
          // Replace '/cyber-bg.png' with the path to your image in the public folder
          backgroundImage: `url('/cyber-bg.png')`, 
        }}
      />

      {/* 2. Gradient Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-blue-950/90 pointer-events-none" />

      {/* 3. Ambient Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-slate-950/80 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Left Column: Dark Cyber Hero Banner */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-b from-blue-950/30 via-slate-950/70 to-slate-950 border-r border-slate-800/80">
            {/* Top Header & Intro */}
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold tracking-wide backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Cyber Defense Academy
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Let&apos;s Secure the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  Future Together.
                </span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed max-w-md font-normal">
                Connect with our research and security engineering team to explore enterprise-grade solutions and academic partnerships.
              </p>
            </div>

            {/* Glowing Lock Badge Graphic */}
            <div className="relative z-10 my-8 flex items-center justify-center py-4">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-spin-slow" />
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600/40 to-cyan-400/20 backdrop-blur-md border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Lock className="w-10 h-10 text-cyan-300" />
                </div>
              </div>
            </div>

            {/* Bottom Contact Details */}
            <div className="relative z-10 space-y-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-slate-300 hover:text-white transition">
                <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:contact@devsolve.university" className="text-xs sm:text-sm font-medium">
                  contact@devsolve.university
                </a>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center text-teal-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  Innovation Hub, Campus West
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Cybersecurity • Aura Professional
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-slate-900/40 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-100">
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

            {/* Bottom Security Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 text-center text-slate-400">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-medium tracking-wide">ISO 27001</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-medium tracking-wide">Academic Lab</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Award className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-medium tracking-wide">EU Certified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


