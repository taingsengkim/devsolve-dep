
"use client";

import { useState, useRef, useEffect } from "react";
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
  const techRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [radius, setRadius] = useState(250);

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(130); // Mobile
      } else if (window.innerWidth < 1024) {
        setRadius(200); // Tablet
      } else {
        setRadius(260); // Desktop
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isHovered) {
        // 0.0003 controls rotation speed
        setRotation((prev) => (prev + delta * 0.0003) % (2 * Math.PI));
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [isHovered]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Built with Modern Technologies
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
          A carefully chosen, battle-tested stack for security, scalability, and developer experience.
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex min-h-[580px] sm:min-h-[680px] lg:min-h-[750px] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-100/80 p-6 sm:p-12 shadow-sm"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />

        <div
          style={{ width: radius * 2, height: radius * 2 }}
          className="absolute rounded-full border border-slate-200/80 pointer-events-none transition-all duration-300"
        />
        <div
          style={{ width: radius * 1.3, height: radius * 1.3 }}
          className="absolute rounded-full border border-dashed border-slate-300/50 pointer-events-none transition-all duration-300"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-purple-500/15 via-blue-500/15 to-pink-500/15 rounded-full blur-3xl pointer-events-none" />

       
        <div
          ref={centerRef}
          className="relative z-20 flex flex-col items-center justify-center w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white/90 backdrop-blur-xl border-4 border-slate-100 shadow-[0_10px_40px_rgba(59,130,246,0.18)] text-center group transition-transform duration-300 hover:scale-105"
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />

          <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 relative flex items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/devsolve-logo.png"
              alt="DevSolve Logo"
              fill
              className="object-contain p-2"
            />
          </div>

          <span className="text-[10px] sm:text-xs font-black text-slate-800 tracking-wider uppercase mt-1">
            DevSolve Hub
          </span>
          <span className="text-[9px] sm:text-[10px] text-blue-600 font-semibold uppercase tracking-widest mt-0.5">
            Architecture
          </span>
        </div>

        
        {TECHNOLOGIES.map((tech, idx) => {
          const total = TECHNOLOGIES.length;
          const baseAngle = (idx / total) * 2 * Math.PI - Math.PI / 2;
          const currentAngle = baseAngle + rotation;

          const x = Math.cos(currentAngle) * radius;
          const y = Math.sin(currentAngle) * radius;

          return (
            <div
              key={idx}
              ref={(el) => {
                techRefs.current[idx] = el;
              }}
              style={{
                position: "absolute",
                transform: `translate3d(${x}px, ${y}px, 0px)`,
              }}
              className="z-20 transition-transform duration-75 ease-linear"
            >
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 w-28 sm:w-36 lg:w-40 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] text-center group cursor-pointer hover:shadow-xl hover:border-slate-300 hover:scale-105 transition-all duration-200">
                <div
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${tech.bgColor} border ${tech.borderColor} p-2 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner group-hover:scale-105 transition-transform duration-200 mb-2`}
                >
                  <Image
                    src={tech.image}
                    alt={`${tech.name} logo`}
                    fill
                    className="object-contain p-1.5"
                  />
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate w-full">
                  {tech.name}
                </h3>
                <p className="text-slate-400 text-[10px] sm:text-[11px] font-medium truncate w-full hidden sm:block mt-0.5">
                  {tech.description}
                </p>
              </div>
            </div>
          );
        })}

        {TECHNOLOGIES.map((tech, idx) => (
          <AnimatedBeam
            key={`beam-${idx}`}
            containerRef={containerRef}
            fromRef={centerRef}
            toRef={{ current: techRefs.current[idx] }}
            curvature={0}
            gradientStartColor="#3b82f6"
            gradientStopColor={tech.color}
            duration={3 + (idx % 3) * 0.5}
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
    <section id="contact" className="relative bg-slate-50 py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f620,transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe20_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe20_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.3fr] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
          
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#071322] text-white p-6 lg:p-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1d33] via-[#071322] to-[#040914]" />
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none"
              style={{ backgroundImage: "url('/image.png')" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/20 blur-[80px] pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="/com.jpg"
                alt="Cyber Shield"
                className="w-[70%] max-w-[300px] object-contain opacity-30 mix-blend-screen drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]"
              />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-cyan-300 text-[11px] font-semibold tracking-wide backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Cyber Defense Academy
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-white">
                Secure Your Digital<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                  Future Today.
                </span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
                Connect with our research and security engineering team for enterprise-grade solutions.
              </p>
            </div>

            <div className="relative z-10 my-6 flex items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-slow" />
                <div className="w-16 h-16 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Lock className="w-7 h-7 text-cyan-300" />
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2.5 text-slate-300 hover:text-white transition">
                <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:contact@devsolve.university" className="text-xs font-medium">
                  contact@devsolve.university
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center text-teal-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium">
                  Innovation Hub, Campus West
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 bg-white flex flex-col justify-between">
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Send a Message
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our team typically responds within 24 business hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 focus:outline-none cursor-pointer pr-10"
                    >
                      <option value="Cybersecurity Consulting">Cybersecurity Consulting</option>
                      <option value="Academic Research">Academic Research Partnership</option>
                      <option value="Bug Bounty Support">Bug Bounty Program Support</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can our engineers help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
                    />
                    <span className="text-[11px] text-slate-500">
                      I agree to the <a href="#" className="text-cyan-600 hover:underline">Privacy Policy</a>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02] hover:shadow-cyan-500/40 transition-all duration-200 cursor-pointer"
                  >
                    Send Message
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-6 text-center border-t border-slate-100 mt-6">
              <div>
                <span className="block text-base font-extrabold text-slate-900">500+</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Reports</span>
              </div>
              <div>
                <span className="block text-base font-extrabold text-slate-900">98%</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Satisfaction</span>
              </div>
              <div>
                <span className="block text-base font-extrabold text-slate-900">24/7</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Support</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}








