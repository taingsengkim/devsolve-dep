
"use client";

import { useState, useRef, useEffect} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FaGithub, FaLinkedin, FaTelegram, FaGlobe } from "react-icons/fa6";
import { FaFacebook, FaTwitter } from "react-icons/fa";
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
  Phone,
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
import { TeamMember, Technology } from "@/lib/types/about/type";

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
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-12 bg-[#09131D] text-white overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#00D2B4]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#00D2B4] animate-pulse" />
              <span className="text-slate-400 font-light uppercase tracking-wider">Established</span>
              <span className="font-bold text-white tracking-widest">2026</span>
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

          <div className="hidden lg:block lg:col-span-1 justify-self-center">
            <div className="w-[1px] h-36 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 space-y-6 sm:space-y-8"
          >
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              DevSolve connects organizations with top security researchers and developers to solve real-world technical challenges, fix vulnerabilities, and build resilient software.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  150+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
                  Active Programs
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  2.5K+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
                  Top Developers
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  5.0K+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-1">
                  Solutions Fixed
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden group shadow-2xl border border-slate-800/80"
        >
          <Image
            src="/about-hero-team.jpg"
            alt="DevSolve Engineering & Security Team"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#09131D] via-[#09131D]/40 to-transparent z-10" />

          <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
                <div className="p-2 rounded-lg bg-[#00D2B4]/10 text-[#00D2B4]">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Bug Bounty</h4>
                  <p className="text-[10px] text-slate-400">Continuous Audits</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Verified Pros</h4>
                  <p className="text-[10px] text-slate-400">Vetted Engineers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Encrypted</h4>
                  <p className="text-[10px] text-slate-400">Zero Trust Flow</p>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00D2B4] hover:bg-[#00c0a5] text-slate-950 font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#00D2B4]/25 hover:shadow-xl hover:scale-105"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
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


interface TechStackSectionProps {
  technologies?: Technology[];
}

const SUB_BADGE_PRESETS = [
  ["UI", "Reactive"],
  ["Security", "API"],
  ["ACID", "Relational"],
  ["Containers", "DevOps"],
  ["Auth", "SSO"],
  ["Utility", "CSS"],
];

export function TechStackSection({
  technologies = TECHNOLOGIES,
}: TechStackSectionProps) {
  const [activeNode, setActiveNode] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [ballPosition, setBallPosition] = useState({ x: 80, y: 100 });
  const [containerWidth, setContainerWidth] = useState(1000);
  const [isBallAtNode, setIsBallAtNode] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const TECH_FLOW = useMemo(
    () =>
      (technologies || []).map((tech, index) => ({
        id: `tech-${index + 1}`,
        name: tech.name,
        description: tech.description,
        image: tech.image,
        bgColor: tech.bgColor,
        borderColor: tech.borderColor,
        subBadges: SUB_BADGE_PRESETS[index % SUB_BADGE_PRESETS.length],
      })),
    [technologies]
  );

  const flowLength = TECH_FLOW.length;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const positions = useMemo(() => {
    const total = Math.max(flowLength, 1);
    const nextPositions = [] as Array<{ x: number; y: number }>;
    const width = containerWidth;
    const padding = 80;
    const usableWidth = width - padding * 2;

    for (let i = 0; i < total; i++) {
      const x = padding + (i / Math.max(total - 1, 1)) * usableWidth;
      const y = 100 + Math.sin((i / Math.max(total - 1, 1)) * Math.PI) * 30;
      nextPositions.push({ x, y });
    }
    return nextPositions;
  }, [flowLength, containerWidth]);

  useEffect(() => {
    if (hoveredNode !== null || flowLength === 0) return;

    const interval = setInterval(() => {
      setIsBallAtNode(false);
      setActiveNode((prev) => (prev + 1) % flowLength);
    }, 3000);

    return () => clearInterval(interval);
  }, [flowLength, hoveredNode]);

  useEffect(() => {
    if (flowLength === 0 || !positions[activeNode]) return;

    setBallPosition(positions[activeNode]);

    const timer = setTimeout(() => {
      setIsBallAtNode(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeNode, flowLength, positions]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Tech Stack
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          Built with Modern Technologies
        </h2>
        <p className="text-[#64748B] text-sm md:text-base max-w-xl mx-auto mt-3 leading-relaxed">
          An end-to-end pipeline designed for security, scalability, and top-tier performance.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-visible rounded-[40px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-xl p-6 sm:p-10 md:p-14"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
          <div className="absolute w-[450px] h-[450px] bg-blue-400/10 blur-[120px] rounded-full -top-40 -left-32 animate-bgGlow" />
          <div className="absolute w-[350px] h-[350px] bg-emerald-300/10 blur-[120px] rounded-full bottom-0 right-0 animate-bgGlow" />
        </div>

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 px-5 rounded-full bg-[#2B68F6] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/20">
              Architecture Pipeline
              <span className="animate-pulse">➔</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400 tracking-wider">
            <span>CLIENT</span>
            <span>›››</span>
            <span>SERVICES</span>
            <span>›››</span>
            <span>PERSISTENCE</span>
          </div>
        </div>

        <div className="relative py-16 my-4 flex items-center justify-between gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 min-w-[700px]"
            preserveAspectRatio="none"
            viewBox="0 0 1000 200"
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <path
              id="techPath"
              d="M 80,100 C 220,20 340,180 500,100 C 660,20 780,180 920,100"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="7 7"
            />

            <path
              d="M 80,100 C 220,20 340,180 500,100 C 660,20 780,180 920,100"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="4"
              opacity="0.3"
              filter="url(#glow)"
              strokeDasharray="30 170"
              style={{ animation: "dash 4s linear infinite" }}
            />

            <path
              d="M 80,100 C 220,20 340,180 500,100 C 660,20 780,180 920,100"
              fill="none"
              stroke="#2B68F6"
              strokeWidth="3"
              strokeDasharray="20 180"
              style={{ animation: "dash 4s linear infinite" }}
            />

            <circle
              cx={ballPosition.x}
              cy={ballPosition.y}
              r={isBallAtNode ? "12" : "6"}
              fill="#2B68F6"
              className="transition-all duration-700 ease-in-out"
            />

            <circle
              cx={ballPosition.x}
              cy={ballPosition.y}
              r={isBallAtNode ? "24" : "0"}
              fill="#2B68F6"
              opacity={isBallAtNode ? "0.2" : "0"}
              className="transition-all duration-700 ease-in-out"
            />

            <circle r="3" fill="#10B981">
              <animateMotion begin="0s" dur="6s" repeatCount="indefinite">
                <mpath href="#techPath" />
              </animateMotion>
            </circle>
            <circle r="2.5" fill="#F59E0B">
              <animateMotion begin="2s" dur="6s" repeatCount="indefinite">
                <mpath href="#techPath" />
              </animateMotion>
            </circle>
            <circle r="2" fill="#60A5FA">
              <animateMotion begin="4s" dur="6s" repeatCount="indefinite">
                <mpath href="#techPath" />
              </animateMotion>
            </circle>
          </svg>

          {/* Technology Nodes */}
          {TECH_FLOW.map((node, index) => {
            const isActive = activeNode === index;
            const isHovered = hoveredNode === node.id;
            const shouldHighlight = isActive || isHovered;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="relative z-10 flex flex-col items-center justify-center shrink-0 min-w-[130px] md:min-w-[160px] py-4"
                style={{
                  animation: "float 4s ease-in-out infinite",
                  animationDelay: `${index * 0.4}s`,
                }}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
                    <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-pulse pointer-events-none" />
                  </>
                )}

                {node.subBadges && (
                  <div className="absolute -top-3 left-0 right-0 pointer-events-none flex justify-between z-20 px-1">
                    {node.subBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className={`px-2 py-0.5 bg-white border rounded-full text-[10px] font-bold shadow-xs transition-all duration-500 ${
                          shouldHighlight
                            ? "border-[#2B68F6] text-[#2B68F6] scale-110 shadow-md"
                            : "border-slate-200 text-slate-500 opacity-80"
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative flex items-center justify-center my-2">
                  <div
                    className={`absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 blur-xs transition-all duration-500 ${
                      isActive
                        ? "opacity-100 animate-spinSlow scale-110"
                        : isHovered
                        ? "opacity-75 scale-105"
                        : "opacity-0 scale-90"
                    }`}
                  />

                  <div
                    className={`relative flex flex-col items-center justify-center rounded-full bg-white border-2 transition-all duration-500 cursor-pointer shadow-md ${
                      shouldHighlight
                        ? "w-28 h-28 md:w-32 md:h-32 border-[#2B68F6] scale-125 -translate-y-2 shadow-2xl shadow-blue-500/30 z-30"
                        : "w-24 h-24 md:w-26 md:h-26 border-slate-200 scale-100 z-10"
                    }`}
                  >
                    <div
                      className={`relative transition-all duration-500 mb-1 z-10 ${
                        shouldHighlight
                          ? "w-9 h-9 md:w-11 md:h-11 rotate-6 scale-110"
                          : "w-8 h-8 md:w-9 md:h-9"
                      }`}
                    >
                      <Image
                        src={node.image}
                        alt={`${node.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <h3
                      className={`font-bold text-center px-1 leading-tight z-10 transition-colors duration-300 ${
                        shouldHighlight
                          ? "text-xs md:text-sm text-[#0F172A]"
                          : "text-[11px] md:text-xs text-[#1E2B45]"
                      }`}
                    >
                      {node.name}
                    </h3>

                    <span className="text-[9px] text-[#64748B] text-center leading-tight font-medium px-2 mt-0.5 block z-10">
                      {node.description}
                    </span>

                    {isActive && (
                      <div className="absolute -bottom-5 flex items-center gap-1 text-[8px] font-extrabold text-[#2B68F6] uppercase tracking-widest z-20 bg-white/90 px-2 py-0.5 rounded-full border border-blue-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B68F6] animate-pulse" />
                        Active
                      </div>
                    )}
                  </div>
                </div>

                {index < TECH_FLOW.length - 1 && (
                  <div
                    className={`absolute right-[-14px] md:right-[-20px] top-1/2 -translate-y-1/2 z-0 hidden sm:block font-bold text-sm transition-all duration-500 ${
                      isActive
                        ? "text-[#2B68F6] translate-x-1 scale-125"
                        : "text-slate-300"
                    }`}
                  >
                    ➜
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-between mt-8">
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400 tracking-wider">
            <span>DATA INTEGRITY</span>
            <span>‹‹‹</span>
            <span>SECURITY FIRST</span>
            <span>‹‹‹</span>
            <span>STABLE INFRASTRUCTURE</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="h-10 px-5 rounded-full bg-[#10B981] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-500/20">
              <span className="animate-pulse">◀</span>
              Continuous Security Feedback
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -400;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spinSlow {
          animation: spinSlow 8s linear infinite;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
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




interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group w-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-xs border border-gray-200 transition-all duration-300 group-hover:shadow-xl">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-4 left-4">
          <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wider border border-white/10">
            {member.subRole?.toUpperCase() || "FULL STACK"}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaGithub size={15} />
            </a>
          )}

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaLinkedin size={15} />
            </a>
          )}

          {member.telegram && (
            <a
              href={member.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaTelegram size={15} />
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {member.name}
          </h3>

          <span className="text-[10px] px-3 py-1 rounded-full border border-blue-200 text-blue-600 font-semibold bg-blue-50">
            {member.badge || "MEMBER"}
          </span>
        </div>

        {member.quote && (
          <p className="mt-2 text-sm italic text-gray-500 leading-relaxed">
            "{member.quote.replace(/['"]+/g, "")}"
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
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form Submitted:", formData);
      alert(
        "Thank you for reaching out! Our team will respond within 24 business hours."
      );
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-[#FFFFFF] text-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Get In Touch
          </h2>
          <p className="mt-3 text-base text-[#64748B] max-w-2xl mx-auto">
            Have questions about DevSolve or cybersecurity services? Send us a
            message and our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl border border-[#CBD5E1] p-8 sm:p-10 shadow-xl">
            <h3 className="text-[22px] font-bold text-[#1E2B45] mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1E2B45]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kumara Sangy"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-3 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1E2B45]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Kumara.Sangy@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-3 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1E2B45]">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the subject of your message..."
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-3 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1E2B45]">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write more about your project..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-3 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B68F6] px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600 hover:-translate-y-1 shadow-lg shadow-blue-500/20 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2B68F6]/10 text-[#2B68F6]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#1E2B45] mb-1">
                  Address
                </h4>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Innovation Hub, Campus West <br />
                  Phnom Penh, Cambodia
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#1E2B45] mb-1">
                  Email Us
                </h4>
                <p className="text-sm text-[#64748B]">
                  contact@devsolve.com
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2B68F6]/10 text-[#2B68F6]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#1E2B45] mb-1">
                  Support HQ
                </h4>
                <p className="text-sm text-[#64748B] leading-relaxed ">
                  #40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh
                </p>
                <br></br>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-6 shadow-sm">
              <h4 className="text-[18px] font-bold text-[#1E2B45] mb-4">
                Connect With Us
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#FFFFFF] text-[#2B68F6] transition-all hover:bg-[#2B68F6] hover:text-white hover:border-[#2B68F6] shadow-sm"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#FFFFFF] text-[#2B68F6] transition-all hover:bg-[#2B68F6] hover:text-white hover:border-[#2B68F6] shadow-sm"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our X account"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#FFFFFF] text-[#2B68F6] transition-all hover:bg-[#2B68F6] hover:text-white hover:border-[#2B68F6] shadow-sm"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

function useMemo<T>(factory: () => T, deps: readonly unknown[]): T {
  const ref = useRef<{ deps: readonly unknown[]; value: T } | null>(null);

  const hasChanged =
    !ref.current ||
    deps.length !== ref.current.deps.length ||
    deps.some((dep, index) => dep !== ref.current!.deps[index]);

  if (hasChanged) {
    ref.current = { deps, value: factory() };
  }

  return ref.current!.value;
}
