
// import Hero from "@/components/about/Hero";
// import About from "@/components/about/About";
// import Stats from "../../../components/about/State"
// import Purpose from "@/components/about/Purpose";
// import Features from "@/components/about/Features";
// import Team from "@/components/about/Team";
// import Contact from "@/components/about/Contact";

// export default function AboutPage() {
//   return (
//     <main className="bg-white">
//       <Hero />
//       <About />
//       <Stats />
//       <Purpose />
//       <Features />
//       <Team />
//       <Contact />
//     </main>
//   );
// }

// app/about/page.tsx
import { SVGProps } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Users, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <HeroSection />
      <AboutSection />
      <PurposeSection />
      <OfferSection />
      <TechStackSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}

// ============================================================
// ICONS
// ============================================================

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
      />
    </svg>
  );
}

function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function GiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      />
    </svg>
  );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11V7a3 3 0 00-6 0v4"
      />
    </svg>
  );
}

function ReactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5c-4.5 0-8.2 1.8-10.2 4.7-.3.4-.3.9 0 1.3 2 2.9 5.7 4.7 10.2 4.7s8.2-1.8 10.2-4.7c.3-.4.3-.9 0-1.3C20.2 4.3 16.5 2.5 12 2.5zm0 4c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 10.3c-4.5 0-8.2 1.8-10.2 4.7-.3.4-.3.9 0 1.3 2 2.9 5.7 4.7 10.2 4.7s8.2-1.8 10.2-4.7c.3-.4.3-.9 0-1.3-2-2.9-5.7-4.7-10.2-4.7zM3.5 9.1c.7.5 1.6.9 2.6 1.2-.6.8-1 1.7-1 2.7s.4 1.9 1 2.7c-1 .3-1.9.7-2.6 1.2-.5-.8-.8-1.7-.8-2.7s.3-1.9.8-2.7zm17 0c.5.8.8 1.7.8 2.7s-.3 1.9-.8 2.7c-.7-.5-1.6-.9-2.6-1.2.6-.8 1-1.7 1-2.7s-.4-1.9-1-2.7c1-.3 1.9-.7 2.6-1.2z" />
    </svg>
  );
}

function SpringIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );
}

function PostgresIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );
}

function DockerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );
}

function KeycloakIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );
}

function TailwindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
  );
}

function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
      />
    </svg>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-100 blur-3xl opacity-40" />
        <div className="absolute right-0 top-20 h-[450px] w-[450px] rounded-full bg-cyan-100 blur-3xl opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              About DevSolve
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
              Building a Safer
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Digital World
              </span>
              <br />
              Together
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
              DevSolve connects ethical hackers and organizations to build a
              more secure digital ecosystem. Through bug bounty programs,
              technical challenges, and community collaboration, we make
              security accessible, rewarding, and transparent for everyone.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#"
                className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="#"
                className="rounded-xl border border-gray-300 px-6 py-4 font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
              >
                Read Our Story
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-5">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <ShieldCheck className="mb-3 h-7 w-7 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900">150+</h3>
                <p className="mt-2 text-sm text-gray-500">Active Programs</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <Users className="mb-3 h-7 w-7 text-cyan-500" />
                <h3 className="text-3xl font-bold text-gray-900">2,500+</h3>
                <p className="mt-2 text-sm text-gray-500">Community Members</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <Trophy className="mb-3 h-7 w-7 text-emerald-500" />
                <h3 className="text-3xl font-bold text-gray-900">5,000+</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Vulnerabilities Fixed
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-40" />

            <div className="relative overflow-hidden rounded-[34px] border border-white bg-white shadow-2xl">
              <div className="h-[500px] w-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <ShieldIcon className="w-32 h-32 text-blue-500" />
              </div>
            </div>

            <div className="absolute -bottom-6 left-10 rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">5,000+</h4>
                  <p className="text-sm text-gray-500">Bugs Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT SECTION
// ============================================================
function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              About DevSolve
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Building a Safer
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Digital World Together
              </span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-gray-600">
              Building a Safer Digital World Together is a project aimed at
              creating a safer digital world by empowering individuals and
              communities to protect themselves online. The project focuses on
              enhancing digital literacy, promoting responsible online behavior,
              and providing support to those who are vulnerable or at risk.
            </p>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Key Initiatives
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Digital Literacy Programs:</strong> The project
                    offers a range of digital literacy programs designed to
                    equip individuals with the skills and knowledge needed to
                    navigate the digital world safely and responsibly.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Online Safety Training:</strong> Participants will
                    have access to online safety training modules that cover
                    topics such as cyberbullying, online privacy, and safe
                    internet practices.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Support Services:</strong> The project provides
                    support services to individuals who are experiencing
                    cyberbullying, online harassment, or other digital safety
                    concerns.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-96 w-96 rounded-full bg-cyan-100 blur-3xl opacity-50" />

            <div className="relative h-[430px] w-[430px] overflow-hidden rounded-full border-8 border-white shadow-2xl bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center">
              <GlobeIcon className="w-32 h-32 text-blue-500" />
            </div>

            <div className="absolute -top-5 right-0 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center">
              <LockIcon className="w-16 h-16 text-blue-500" />
            </div>

            <div className="absolute bottom-5 left-0 h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-xl bg-cyan-100 flex items-center justify-center">
              <ShieldIcon className="w-20 h-20 text-cyan-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PURPOSE SECTION
// ============================================================
function PurposeSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          What Drives DevSolve
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
          Empowering Security & Innovation
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4">
          Empowering Security is a key component of the project, focusing on
          enhancing cybersecurity awareness and skills among individuals and
          communities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              What Drives DevSolve
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Empowering Security & Continuous Learning
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            The project is driven by a desire to create a more secure and
            responsible digital environment. By empowering individuals and
            communities, the project seeks to reduce the risk of cybercrime and
            other digital threats.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Enhancing cybersecurity awareness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Empowering individuals to protect themselves</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Reducing cybercrime and digital threats</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Everything in One Place
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            A Connected & Inclusive Digital World
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Everything Is One Place is a project that aims to create a more
            connected and inclusive digital world. The project seeks to break
            down barriers and promote digital inclusion for all.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Breaking down digital barriers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Promoting digital inclusion for all</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Creating a more connected world</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// OFFER SECTION
// ============================================================
function OfferSection() {
  const offerings = [
    {
      icon: ShieldIcon,
      title: "Bug Bounty Programs",
      description:
        "Organizations publish scoped programs with Markdown descriptions. Hackers find, document, and report vulnerabilities through a structured, secure workflow.",
    },
    {
      icon: CodeIcon,
      title: "Technical Challenges",
      description:
        "A rich library of coding and security challenges with defined evaluation criteria, secure file submission, and confidential judging for complete fairness.",
    },
    {
      icon: ChatIcon,
      title: "Discussion Forum",
      description:
        "An integrated community forum to exchange ideas, ask technical questions, share write-ups, and collaborate beyond individual challenge submissions.",
    },
    {
      icon: TrophyIcon,
      title: "Global Leaderboards",
      description:
        "Real-time leaderboards ranking hackers by points, reputation, and outcomes. Outstanding contributors earn global recognition and premium badge tiers.",
    },
    {
      icon: GiftIcon,
      title: "Reward System",
      description:
        "Structured reward policies with milestone bonuses, badge tiers, and monetary payouts tied directly to accepted vulnerability reports.",
    },
    {
      icon: LockIcon,
      title: "Secure Authentication",
      description:
        "Enterprise-grade authentication, anti-cheating mechanisms, plagiarism prevention, and duplicate submission protection keep the platform trustworthy.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Everything in One Place
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
            Built with Modern Technologies
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4">
            DevSolve integrates the complete challenge lifecycle — from
            program creation to reward payout — in a single, cohesive,
            secure platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TECHNOLOGY STACK SECTION
// ============================================================
function TechStackSection() {
  const technologies = [
    {
      icon: ReactIcon,
      name: "React",
      description: "Frontend UI",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      icon: SpringIcon,
      name: "Spring Boot",
      description: "Backend API",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: PostgresIcon,
      name: "PostgreSQL",
      description: "Database",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: DockerIcon,
      name: "Docker",
      description: "Containers",
      bgColor: "bg-sky-50",
      textColor: "text-sky-600",
    },
    {
      icon: KeycloakIcon,
      name: "Keycloak",
      description: "Auth & SSO",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: TailwindIcon,
      name: "Tailwind CSS",
      description: "Styling",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          Technology Stack
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
          Built with Modern Technologies
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4">
          A carefully chosen, battle-tested stack for security, scalability,
          and developer experience.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-200 text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${tech.bgColor} ${tech.textColor} flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{tech.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{tech.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// TEAM SECTION
// ============================================================
interface TeamMember {
  name: string;
  subRole?: string;
  badge?: string;
  badgeColor?: "pink" | "purple" | "blue";
  quote: string;
  image: string;
}

const SUPERVISORS: TeamMember[] = [
  {
    name: "Sreng Chipor",
    badge: "MENTOR",
    badgeColor: "pink",
    quote: '"Guiding the next generation of cybersecurity experts."',
    image: "/teacherChipor.JPG",
  },
  {
    name: "Rin Bunvarn",
    badge: "MENTOR",
    badgeColor: "pink",
    quote: '"Building resilient systems through rigorous academic foundation."',
    image: "/TeacherBunVarn.jpeg",
  },
];

const STUDENT_DEVELOPERS: TeamMember[] = [
  {
    name: "Taing Sengkim",
    badge: "LEADER",
    badgeColor: "purple",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Visionary leadership drives technical success."',
    image: "/sengkim.jpg",
  },
  {
    name: "Lor VengRoth",
    badge: "SUB LEADER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Architecting the backbone of security."',
    image: "/vengroth.png",
  },
  {
    name: "Ky Reaksa",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Intuitive interfaces for complex security data."',
    image: "/raxsa.png",
  },
  {
    name: "Dim Pathea",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Design with security in mind from day one."',
    image: "/pathea.jpg",
  },
  {
    name: "Chamreun Molikatevy",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Crafting pixel-perfect secure experiences."',
    image: "/tevy.jpg",
  },
  {
    name: "Tollah Hamadabidin",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Robust code is the best defense."',
    image: "/bidin.JPG",
  },
  {
    name: "Bun Raksa",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Securing the future, one line of code at a time."',
    image: "/Raksa.JPEG",
  },
  {
    name: "San Tol",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Visualizing threats for better protection."',
    image: "/tol.jpg",
  },
  {
    name: "Seu Narong",
    badge: "MEMBER",
    badgeColor: "blue",
    subRole: "FULL STACK DEVELOPER",
    quote: '"Innovation through collaborative logic."',
    image: "/narong.jpg",
  },
];

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
    <section className="bg-gray-50/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Our Team
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
            The People Behind DevSolve
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4">
            Meet the dedicated team of mentors and developers working together
            to build a safer digital world.
          </p>
        </div>

        <SectionHeader title="Supervisors & Mentors" />
        <div className="flex flex-wrap justify-center gap-10 my-4">
          {SUPERVISORS.map((supervisor) => (
            <MemberCard key={supervisor.name} member={supervisor} />
          ))}
        </div>

        <SectionHeader title="Student Developers" />
        <div className="flex flex-col items-center gap-10 my-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {STUDENT_DEVELOPERS.slice(0, 5).map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {STUDENT_DEVELOPERS.slice(5).map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT SECTION
// ============================================================
function ContactSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Contact Us
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
            Get in Touch
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4">
            Have questions, want to partner, or want to learn more about DevSolve?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                  <a href="mailto:contact@devsolve.io" className="text-gray-600 hover:text-blue-600 transition">
                    contact@devsolve.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.4s2.04.133 3 .4c2.29-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.58 4.765-1.588 8.2-6.086 8.2-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">GitHub</h3>
                  <a href="https://github.com/devsolve-io" className="text-gray-600 hover:text-blue-600 transition">
                    github.com/devsolve-io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Twitter / X</h3>
                  <a href="https://twitter.com/devsolve" className="text-gray-600 hover:text-blue-600 transition">
                    @devsolve
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">LinkedIn</h3>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                    DevSolve Platform
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-lg font-bold">🎓</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">UNIVERSITY PROJECT</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    DevSolve is a university final-year project exploring cybersecurity
                    platform design, ethical hacking workflows, and secure software
                    engineering. We welcome academic feedback and collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Subject
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-900 appearance-none bg-white">
                  <option>How can we help?</option>
                  <option>Partnership Inquiry</option>
                  <option>Academic Collaboration</option>
                  <option>Bug Report</option>
                  <option>General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}