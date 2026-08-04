
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
  Star,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Award,
  TrendingUp,
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



// function AboutHeroSection() {
//   return (
//     <div className="relative w-full bg-slate-50 dark:bg-[#080E17] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
//       <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#00D2B4]/15 dark:bg-[#00D2B4]/10 rounded-full blur-[150px] pointer-events-none" />
//       <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

//       <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             className="lg:col-span-6 space-y-6 lg:space-y-8 z-10"
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2B4]/10 border border-[#00D2B4]/30 text-[#00a890] dark:text-[#00D2B4] text-xs sm:text-sm font-medium tracking-wide">
//               <span>The next-gen security platform</span>
//               <span className="text-[#00D2B4]/60">•</span>
//               <span className="font-semibold text-slate-900 dark:text-white">Est. 2026</span>
//             </div>

//             <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
//               We Are <br />
//               <span className="text-[#00a890] dark:text-[#00D2B4] relative inline-block">
//                 Next-Gen
//                 <svg
//                   className="absolute -bottom-2 left-0 w-full text-[#00a890]/30 dark:text-[#00D2B4]/40"
//                   height="10"
//                   viewBox="0 0 200 10"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M2 8C50 2 150 2 198 8"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </span>{" "}
//               Security <br /> Platform
//             </h1>

//             <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
//               DevSolve connects organizations with top security researchers and developers to solve real-world technical challenges, fix vulnerabilities, and build resilient software.
//             </p>

//             <div className="flex flex-wrap items-center gap-4 pt-2">
//               <Link
//                 href="/programs"
//                 className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-[#00D2B4] dark:hover:bg-[#00c0a5] text-white dark:text-slate-950 font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-slate-900/10 dark:shadow-[#00D2B4]/25 hover:shadow-xl hover:scale-105"
//               >
//                 <span>Explore Programs</span>
//                 <ArrowRight className="w-4 h-4 text-[#00D2B4] dark:text-slate-950" />
//               </Link>

//               <button
//                 type="button"
//                 className="inline-flex items-center gap-3 px-5 py-4 rounded-full text-slate-700 dark:text-white hover:text-[#00a890] dark:hover:text-[#00D2B4] font-semibold text-sm sm:text-base transition-colors duration-200 group"
//               >
//                 <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-center text-[#00a890] dark:text-[#00D2B4] group-hover:scale-110 group-hover:border-[#00D2B4]/50 transition-all">
//                   <Play className="w-4 h-4 fill-current ml-0.5" />
//                 </div>
//                 <span>Watch Demo</span>
//               </button>
//             </div>

//             <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 max-w-md">
//               <div className="flex -space-x-2.5 overflow-hidden">
//                 <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
//                   <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
//                 </div>
//                 <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
//                   <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
//                 </div>
//                 <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
//                   <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
//                 </div>
//                 <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
//                   <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
//                   ))}
//                 </div>
//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   Join <span className="text-slate-900 dark:text-white font-semibold">2,500+</span> vetted security researchers
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//             className="lg:col-span-6 relative flex items-center justify-center lg:justify-end"
//           >
//             <div className="absolute w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 dark:from-cyan-500/20 dark:to-blue-600/20 blur-3xl pointer-events-none" />

//             <div className="absolute -top-4 right-12 w-6 h-6 rounded-full bg-amber-400/80 blur-[1px] animate-bounce" style={{ animationDuration: '3s' }} />
//             <div className="absolute bottom-12 left-2 w-8 h-8 rounded-full bg-[#00D2B4]/40 blur-[2px]" />
//             <div className="absolute top-1/2 -left-6 w-5 h-5 rotate-45 bg-blue-400/50" />

//             <div className="relative w-full max-w-[750px] h-[500px] sm:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60">
//               <Image
//                 src="/teams/team.jpg"
//                 alt="DevSolve Engineering & Security Team"
//                 fill
//                 priority
//                 className="object-cover object-top"
//                 sizes="(max-width: 1280px) 100vw, 600px"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#080E17]/80 via-transparent to-transparent" />
//             </div>

//             {/* <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.4, duration: 0.5 }}
//               className="absolute -top-2 right-2 sm:right-6 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20 max-w-[220px]"
//             >
//               <div className="p-2 rounded-xl bg-[#00D2B4]/15 text-[#00a890] dark:text-[#00D2B4]">
//                 <ShieldCheck className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-slate-900 dark:text-white">Zero-Trust Flow</p>
//                 <p className="text-[10px] text-slate-500 dark:text-slate-400">Enterprise grade security</p>
//               </div>
//             </motion.div> */}

//             {/* <motion.div
//               initial={{ x: 30, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.5 }}
//               className="absolute top-1/3 -right-2 sm:-right-6 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 p-4 rounded-2xl shadow-xl z-20 hidden sm:block w-44"
//             >
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bounties Paid</span>
//                 <TrendingUp className="w-3.5 h-3.5 text-[#00a890] dark:text-[#00D2B4]" />
//               </div>
//               <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">$875,000+</p>
//               <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">↑ 28% active this month</p>
//             </motion.div> */}

//             {/* <motion.div
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.6, duration: 0.5 }}
//               className="absolute -bottom-4 left-2 sm:-left-6 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 p-4 rounded-2xl shadow-2xl z-20 max-w-[280px] sm:max-w-[320px]"
//             >
//               <div className="flex items-start gap-3">
//                 <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
//                   <Image
//                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
//                     alt="Security Lead"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
//                     &quot;DevSolve helped us find critical vulnerabilities before launch.&quot;
//                   </p>
//                   <div className="flex items-center justify-between pt-1">
//                     <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">— Jenna B., Lead SecOps</p>
//                     <div className="flex text-amber-500 dark:text-amber-400">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-2.5 h-2.5 fill-amber-500 dark:fill-amber-400" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div> */}
//           </motion.div>

//         </div>
//       </section>

     
//     </div>
//   );
// }


function AboutHeroSection() {
  const gridNodes = [
    { left: "10%", top: "15%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 0, duration: 6 },
    { left: "25%", top: "8%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 1, duration: 8 },
    { left: "42%", top: "18%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.5, duration: 7 },
    { left: "60%", top: "12%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.5, duration: 9 },
    { left: "78%", top: "22%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 2, duration: 6.5 },
    { left: "90%", top: "10%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.2, duration: 7.5 },
    
    { left: "5%", top: "45%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.2, duration: 8 },
    { left: "20%", top: "38%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.4, duration: 6.5 },
    { left: "35%", top: "52%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 1.8, duration: 7 },
    { left: "50%", top: "40%", size: "w-3.5 h-3.5 sm:w-4 sm:h-4", delay: 0.8, duration: 8.5 },
    { left: "68%", top: "48%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 2.2, duration: 6 },
    { left: "85%", top: "42%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.1, duration: 7.2 },
    
    { left: "12%", top: "75%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.3, duration: 7 },
    { left: "28%", top: "82%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.6, duration: 8.2 },
    { left: "45%", top: "70%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 0.9, duration: 6.8 },
    { left: "62%", top: "78%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 2.1, duration: 7.8 },
    { left: "80%", top: "72%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.4, duration: 6.3 },
    { left: "92%", top: "85%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 0.7, duration: 8.8 },
  ];

  return (
    <div className="relative w-full bg-slate-50 dark:bg-[#080E17] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 dark:opacity-40">
        
        <svg
          className="absolute inset-0 w-full h-full text-cyan-500/20 dark:text-cyan-400/15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
            </pattern>
          </defs>
          
          <path d="M-100,100 Q 500,-50 1300,100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,250 Q 500,50 1300,250" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,400 Q 500,180 1300,400" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,550 Q 500,320 1300,550" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,700 Q 500,460 1300,700" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

          <path d="M100,-50 L 200,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M300,-50 L 380,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M500,-50 L 540,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M700,-50 L 710,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M900,-50 L 880,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M1100,-50 L 1050,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {gridNodes.map((node, index) => (
          <motion.div
            key={index}
            style={{ left: node.left, top: node.top }}
            animate={{
              y: [0, -12, 0, 12, 0],
              x: [0, 8, 0, -8, 0],
              scale: [1, 1.25, 1, 0.9, 1],
              opacity: [0.6, 1, 0.6, 0.8, 0.6],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay,
            }}
            className={`absolute ${node.size} rounded-full bg-gradient-to-br from-cyan-300 via-[#00D2B4] to-teal-600 shadow-[0_0_12px_rgba(0,210,180,0.8)] border border-white/60 dark:border-cyan-200/50 z-0`}
          />
        ))}
      </div>

      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#00D2B4]/15 dark:bg-[#00D2B4]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 lg:space-y-8 z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2B4]/10 border border-[#00D2B4]/30 text-[#00a890] dark:text-[#00D2B4] text-xs sm:text-sm font-medium tracking-wide">
              <span>The next-gen security platform</span>
              <span className="text-[#00D2B4]/60">•</span>
              <span className="font-semibold text-slate-900 dark:text-white">Est. 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              We Are <br />
              <span className="text-[#00a890] dark:text-[#00D2B4] relative inline-block">
                Next-Gen
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#00a890]/30 dark:text-[#00D2B4]/40"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Security <br /> Platform
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              DevSolve connects organizations with top security researchers and developers to solve real-world technical challenges, fix vulnerabilities, and build resilient software.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-blue-600 hover:bg-slate-800 dark:bg-[#00D2B4] dark:hover:bg-[#00c0a5] text-white dark:text-slate-950 font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-slate-900/10 dark:shadow-[#00D2B4]/25 hover:shadow-xl hover:scale-105"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4 text-[#00D2B4] dark:text-slate-950" />
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-3 px-5 py-4 rounded-full text-slate-700 dark:text-white hover:text-[#00a890] dark:hover:text-[#00D2B4] font-semibold text-sm sm:text-base transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-center text-[#00a890] dark:text-[#00D2B4] group-hover:scale-110 group-hover:border-[#00D2B4]/50 transition-all">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 max-w-md">
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join <span className="text-slate-900 dark:text-white font-semibold">2,500+</span> vetted security researchers
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[750px] h-[500px] sm:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 z-10">
              <Image
                src="/teams/team.jpg"
                alt="DevSolve Engineering & Security Team"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1280px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#080E17]/80 via-transparent to-transparent" />
            </div>
          </motion.div>

        </div>
      </section>
    </div>
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
  ["ACID", " Relational"],
  ["Containers ", "DevOps"],
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
  const [rippleKey, setRippleKey] = useState(0);
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
    const padding = 120;
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
      setRippleKey((prev) => prev + 1);
    }, 2500);

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
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Tech Stack
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Built with Modern Technologies
        </h2>
        <p className="text-[#64748B] text-sm md:text-base max-w-xl mx-auto mt-2 leading-relaxed">
          An end-to-end pipeline designed for security, scalability, and top-tier performance.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-visible rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-xl p-6 md:p-10"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
          <div className="absolute w-[450px] h-[450px] bg-blue-400/10 blur-[120px] rounded-full -top-40 -left-32" />
          <div className="absolute w-[350px] h-[350px] bg-emerald-300/10 blur-[120px] rounded-full bottom-0 right-0" />
        </div>

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 px-4 rounded-full bg-[#2B68F6] text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/20">
              Architecture Pipeline
              <span className="animate-pulse">➔</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[10px] font-semibold text-slate-400 tracking-wider">
            <span>CLIENT</span>
            <span className="text-slate-300">›››</span>
            <span>SERVICES</span>
            <span className="text-slate-300">›››</span>
            <span>PERSISTENCE</span>
          </div>
        </div>

        <div className="relative py-14 px-10 my-2 flex items-center justify-between gap-4 md:gap-6 overflow-x-auto no-scrollbar">
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
              r="6"
              fill="#2563EB"
              className="transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
            />

            {/* Ball outer glow */}
            <circle
              cx={ballPosition.x}
              cy={ballPosition.y}
              r="12"
              fill="#2563EB"
              opacity="0.15"
              className="transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
            />

            {/* Ripple effect */}
            {isBallAtNode && (
              <circle
                key={rippleKey}
                cx={ballPosition.x}
                cy={ballPosition.y}
                r="6"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  from="6"
                  to="24"
                  dur="0.8s"
                  repeatCount="1"
                />
                <animate
                  attributeName="opacity"
                  from="0.4"
                  to="0"
                  dur="0.8s"
                  repeatCount="1"
                />
              </circle>
            )}

            <circle r="2.5" fill="#10B981">
              <animateMotion begin="0s" dur="6s" repeatCount="indefinite">
                <mpath href="#techPath" />
              </animateMotion>
            </circle>
            <circle r="2" fill="#F59E0B">
              <animateMotion begin="2s" dur="6s" repeatCount="indefinite">
                <mpath href="#techPath" />
              </animateMotion>
            </circle>
            <circle r="1.5" fill="#60A5FA">
              <animateMotion begin="4s" dur="6s" repeatCount="indefinite">
                <mpath href="#techPath" />
              </animateMotion>
            </circle>
          </svg>

          {TECH_FLOW.map((node, index) => {
            const isActive = activeNode === index;
            const isHovered = hoveredNode === node.id;
            const shouldHighlight = isActive || isHovered;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="relative z-10 flex flex-col items-center justify-center shrink-0 min-w-[100px] md:min-w-[120px] pt-3 pb-3"
                style={{
                  animation: "float 4s ease-in-out infinite",
                  animationDelay: `${index * 0.5}s`,
                }}
              >
                {/* Sub-badges */}
                {node.subBadges && (
                  <div className="absolute -top-4 left-0 right-0 pointer-events-none flex justify-between z-20 px-2">
                    {node.subBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className={`px-2 py-0.5 bg-white border rounded-full text-[9px] font-bold shadow-sm transition-all duration-300 ${
                          shouldHighlight
                            ? "border-[#2B68F6] text-[#2B68F6] scale-105 shadow-md shadow-blue-500/20"
                            : "border-slate-200 text-slate-500 opacity-80"
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative flex items-center justify-center mt-4">
                  <div
                    className={`absolute inset-0 scale-110 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 blur-md transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      isActive
                        ? "opacity-60 animate-spinSlow"
                        : isHovered
                        ? "opacity-40"
                        : "opacity-0"
                    }`}
                  />

                  <div
                    className={`relative flex flex-col items-center justify-center rounded-full bg-white border-2 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] cursor-pointer shadow-md ${
                      shouldHighlight
                        ? "w-[104px] h-[104px] md:w-[112px] h-[112px] border-[#2B68F6] scale-[1.03] shadow-xl shadow-blue-500/25 z-30"
                        : "w-24 h-24 md:w-28 h-28 border-slate-200 scale-100 z-10"
                    }`}
                  >
                    <div
                      className={`relative transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] mb-0.5 z-10 ${
                        shouldHighlight
                          ? "w-8 h-8 md:w-9 h-9 rotate-3 scale-105"
                          : "w-7 h-7 md:w-8 h-8"
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
                      className={`font-bold text-center px-1 leading-tight z-10 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                        shouldHighlight
                          ? "text-[10px] md:text-xs text-[#0F172A]"
                          : "text-[9px] md:text-[10px] text-[#1E2B45]"
                      }`}
                    >
                      {node.name}
                    </h3>

                    <span className="text-[7px] md:text-[8px] text-[#64748B] text-center leading-tight font-medium px-2 mt-0.5 block z-10">
                      {node.description}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[7px] md:text-[8px] font-extrabold text-[#2B68F6] uppercase tracking-widest z-20 bg-white/95 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-md shadow-blue-500/10 whitespace-nowrap animate-fadeIn">
                      <span className="w-1 h-1 rounded-full bg-[#2B68F6] animate-pulse" />
                      Active
                    </div>
                  )}
                </div>

                {index < TECH_FLOW.length - 1 && (
                  <div
                    className={`absolute right-[-16px] md:right-[-20px] top-1/2 -translate-y-1/2 z-0 hidden md:block font-bold text-base transition-all duration-300 ${
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

        <div className="relative z-10 flex items-center justify-between mt-6">
          <div className="hidden md:flex items-center gap-3 text-[10px] font-semibold text-slate-400 tracking-wider">
            <span>DATA INTEGRITY</span>
            <span className="text-slate-300">‹‹‹</span>
            <span>SECURITY FIRST</span>
            <span className="text-slate-300">‹‹‹</span>
            <span>STABLE INFRASTRUCTURE</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="h-8 px-4 rounded-full bg-[#10B981] text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-500/20">
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
            transform: translateY(-2px);
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-spinSlow {
          animation: spinSlow 8s linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
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

        <div className="absolute bottom-4 left-2">
          <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wider border border-white/10">
            {member.subRole?.toUpperCase() || "FULL STACK"}
          </span>
        </div>

        <div className="absolute bottom-2 right-4 flex gap-1">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaGithub size={13} />
            </a>
          )}

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaLinkedin size={13} />
            </a>
          )}

          {member.telegram && (
            <a
              href={member.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaTelegram size={13} />
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
                  #40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh
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

            <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-xs flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2B68F6]/10 text-[#2B68F6]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#1E2B45] mb-1">
                  Support HQ
                </h4>
                <div className="text-sm text-[#64748B] space-y-1 flex flex-col">
                  <a
                    href="tel:096453972"
                    className="hover:text-[#2B68F6] transition-colors"
                  >
                    (+855) 95-990-910
                  </a>
                  <a
                    href="tel:0163392322"
                    className="hover:text-[#2B68F6] transition-colors"
                  >
                    (+855) 93-990-910
                  </a>
                </div>
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
                  href="https://www.linkedin./"
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
