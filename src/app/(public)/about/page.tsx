import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Trophy,
  Award,
  Code,
  MessageSquare,
  Lock,
  Sparkles,
  Target,
  Globe,
  CheckCircle2,
  Bug,
  Ribbon,
  Mail,
  GraduationCap,
  Send,
} from "lucide-react";

import {
  MISSION_FEATURES,
  VISION_FEATURES,
  SUPERVISORS,
  STUDENT_DEVELOPERS,
  TECHNOLOGIES,
  OFFERINGS,
} from "@/lib/types/about/mock-data";
import { TeamMember } from "@/lib/types/about/type";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-gray-900 font-sans antialiased">
      <HeroSection />
      <EmpoweringSecuritySection />
      <PurposeSection />
      <OfferSection />
      <TechStackSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 to-transparent py-16 md:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Building a Safer
              <br />
              <span className="text-blue-600">Digital World</span>
              <br />
              <span className="text-emerald-500">Together</span>
            </h1>

            <p className="mt-6 text-gray-500 text-base leading-relaxed max-w-lg">
              DevSolve connects ethical hackers and organizations to build a
              more secure digital ecosystem. Through bug bounty programs,
              technical challenges, and community collaboration, we make
              security research rewarding and transparent for all.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                href="#"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-full transition shadow-lg shadow-blue-600/25 group"
              >
                Get started
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#team"
                className="inline-flex items-center justify-center border border-gray-300 bg-white hover:border-gray-400 text-gray-700 font-medium text-sm px-6 py-3.5 rounded-full transition shadow-sm"
              >
                Read Our Team
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight">
                  150+
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Security Programs
                </p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight">
                  2,500+
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Community Members
                </p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight">
                  5,000+
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Vulnerabilities Fixed
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 flex items-center justify-center">
              <Image
                src="/hero.jpg"
                alt="DevSolve Team Collaborating"
                fill
                className="object-cover object-top"
              />
            </div>

            <div className="absolute -bottom-5 left-6 bg-white/95 backdrop-blur rounded-2xl p-3.5 px-5 shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-extrabold text-gray-900 leading-none">
                  5,000+
                </div>
                <div className="text-[11px] font-medium text-gray-500 mt-0.5">
                  Bugs Resolved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmpoweringSecuritySection() {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="inline-block rounded-full border border-blue-200 bg-blue-50/60 px-4 py-1.5 text-xs font-semibold text-blue-600 mb-6">
              About DevSolve
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-blue-600 leading-tight">
              Empowering Security
            </h2>

            <div className="mt-6 space-y-4 text-gray-500 text-sm sm:text-base leading-relaxed">
              <p>
                DevSolve is a platform designed to connect organizations with
                hackers and problem solvers through bug bounty programs and
                technical challenges. The system enables companies to publish
                programs while allowing hackers to find, report, and resolve
                vulnerabilities in a secure environment.
              </p>
              <p>
                In addition, our integrated discussion forum encourages users to
                exchange ideas, ask questions, and share technical knowledge —
                fostering an active and collaborative community focused on
                continuous learning.
              </p>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-blue-600">
                  150+
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Security Programs
                </p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-blue-600">
                  2,500+
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Community Members
                </p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-blue-600">
                  5,000+
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Vulnerabilities Fixed
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                href="#"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-full transition shadow-md shadow-blue-600/20 group"
              >
                See Mission & Vision
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center border border-gray-300 bg-white hover:border-gray-400 text-gray-700 font-medium text-sm px-6 py-3.5 rounded-full transition shadow-sm"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center py-6">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                <Image
                  src="/hero2.jpg"
                  alt="Team discussion"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute bottom-4 left-0 w-2/3 h-2/3 rounded-[3rem] sm:rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                <Image
                  src="/hero.jpg"
                  alt="Collaboration"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white/95 backdrop-blur rounded-2xl p-3 px-4 shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-900 leading-none">
                    Top Rated
                  </div>
                  <div className="text-[10px] font-medium text-gray-400 mt-1">
                    Security Platform
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PurposeSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide border border-blue-100 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Purpose
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          What Drives DevSolve
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
              Our Mission
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-snug mb-4">
              Responsible Disclosure & Continuous Learning
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              To empower ethical hackers to identify and report vulnerabilities
              responsibly, reward meaningful contributions, and cultivate a culture of
              continuous learning through real-world security challenges that make the
              digital ecosystem safer for everyone.
            </p>
          </div>

          <ul className="space-y-3">
            {MISSION_FEATURES.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">
              Our Vision
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-snug mb-4">
              A Trusted Global Cybersecurity Community
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              To become the world's most trusted bridge between organizations and
              ethical hackers — an ecosystem where cybersecurity awareness grows,
              talent is recognized globally, and the internet becomes more resilient
              through collective effort.
            </p>
          </div>

          <ul className="space-y-3">
            {VISION_FEATURES.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
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
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold tracking-wide border border-emerald-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            WHAT WE OFFER
          </span>
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
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-widest border border-cyan-100 mb-3">
          <Sparkles className="w-3 h-3" />
          TECHNOLOGY STACK
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          Built with Modern Technologies
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
          A carefully chosen, battle-tested stack for security, scalability, and
          developer experience.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {TECHNOLOGIES.map((tech, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 border ${tech.borderColor} shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center group cursor-default`}
          >
            <div
              className={`w-20 h-20 rounded-xl ${tech.bgColor} p-2 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 overflow-hidden relative`}
            >
              <Image
                src={tech.image}
                alt={`${tech.name} logo`}
                fill
                className="object-contain p-2"
              />
            </div>
            <h3 className="text-sm font-bold text-gray-900">{tech.name}</h3>
            <p className="text-gray-400 text-[11px] font-medium mt-0.5">
              {tech.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="relative flex py-6 items-center w-full max-w-5xl my-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center text-center w-[180px]">
      <div className="relative mb-3 flex flex-col items-center">
        <div className="w-36 h-36 relative rounded-2xl overflow-hidden border-2 border-cyan-400 bg-sky-100 shadow-md">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 144px"
          />
        </div>

        {member.badge && (
          <div className="absolute -bottom-2 z-10 px-3 py-0.5 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
            <span
              className={`text-[9px] font-bold tracking-wider ${
                member.badgeColor === "pink"
                  ? "text-pink-500"
                  : member.badgeColor === "purple"
                  ? "text-indigo-600"
                  : "text-slate-600"
              }`}
            >
              {member.badge}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-base font-bold text-gray-800 mt-1">{member.name}</h3>

      {member.subRole && (
        <span className="mt-1 mb-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[9px] font-bold text-blue-500 tracking-wide">
          {member.subRole}
        </span>
      )}

      <p className="text-xs text-gray-500 font-medium leading-snug">
        {member.quote}
      </p>
    </div>
  );
}

function TeamSection() {
  return (
    <section id="team" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide border border-indigo-100 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          MEET THE TEAM
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          The People Behind DevSolve
        </h2>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
          A passionate team of mentors and developers dedicated to building a
          more secure digital ecosystem through innovation and collaboration.
        </p>
      </div>

      <div className="mb-24 flex flex-col items-center w-full">
        <SectionHeader title="SUPERVISORS" />
        <div className="flex flex-wrap justify-center items-center gap-8 mt-6 w-full">
          {SUPERVISORS.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <SectionHeader title="STUDENT DEVELOPERS" />
        <div className="flex flex-wrap justify-center items-center gap-8 mt-6 w-full">
          {STUDENT_DEVELOPERS.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="bg-slate-50/50 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            Contact Us
          </h2>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 text-gray-900">
            Get In Touch
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto mt-4">
            Have questions, want to partner, or want to learn more about DevSolve?
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                    <a href="mailto:contact@devsolve.io" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition">
                      contact@devsolve.io
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-3xl p-8 border border-blue-100 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">University Project</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                DevSolve is a university final-year project exploring cybersecurity
                platform design, ethical hacking workflows, and secure software
                engineering. We welcome academic feedback and collaboration.
              </p>
            </div>
          </div>

          {/* Complete Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Send a Message</h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition shadow-md shadow-blue-600/20 gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}