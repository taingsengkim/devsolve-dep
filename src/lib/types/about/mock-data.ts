import { TeamMember, Technology, Offering } from "./type";

export const MISSION_FEATURES: string[] = [
  "Structured, secure vulnerability reporting",
  "Transparent evaluation & merit-based rewards",
  "Anti-cheating and plagiarism prevention",
  "Innovation through real-world challenges",
];

export const VISION_FEATURES: string[] = [
  "Globally trusted platform for all stakeholders",
  "Active, security-first collaborative community",
  "Scalable infrastructure for enterprise bounties",
  "Cybersecurity education through practice",
];

export const SUPERVISORS: TeamMember[] = [
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

export const STUDENT_DEVELOPERS: TeamMember[] = [
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
    badgeColor: "purple",
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

export const TECHNOLOGIES: Technology[] = [
  {
    image: "/react1.png",
    name: "React",
    description: "Frontend UI",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-100 hover:border-sky-300",
  },
  {
    image: "/spring1.png",
    name: "Spring Boot",
    description: "Backend API",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100 hover:border-emerald-300",
  },
  {
    image: "/postgrest1.png",
    name: "PostgreSQL",
    description: "Database",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100 hover:border-blue-300",
  },
  {
    image: "/doker1.png",
    name: "Docker",
    description: "Containers",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-100 hover:border-cyan-300",
  },
  {
    image: "/keycloak1.png",
    name: "Keycloak",
    description: "Auth & SSO",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100 hover:border-purple-300",
  },
  {
    image: "/tailwind1.png",
    name: "Tailwind CSS",
    description: "Styling",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-100 hover:border-teal-300",
  },
];

export const OFFERINGS: Offering[] = [
  {
    iconName: "Bug",
    title: "Bug Bounty Programs",
    description:
      "Organizations publish scoped programs with Markdown descriptions. Hackers find, document, and report vulnerabilities through a structured, secure workflow.",
    accentBg: "bg-red-50",
    accentText: "text-red-500",
    borderColor: "border-red-100 hover:border-red-200",
  },
  {
    iconName: "Code",
    title: "Technical Challenges",
    description:
      "A rich library of coding and security challenges with defined evaluation criteria, secure file submission, and confidential judging for complete fairness.",
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
    borderColor: "border-blue-100 hover:border-blue-200",
  },
  {
    iconName: "MessageSquare",
    title: "Discussion Forum",
    description:
      "An integrated community forum to exchange ideas, ask technical questions, share write-ups, and collaborate beyond individual challenge submissions.",
    accentBg: "bg-purple-50",
    accentText: "text-purple-600",
    borderColor: "border-purple-100 hover:border-purple-200",
  },
  {
    iconName: "Trophy",
    title: "Global Leaderboards",
    description:
      "Real-time leaderboards ranking hackers by points, reputation, and outcomes. Outstanding contributors earn global recognition and premium badge tiers.",
    accentBg: "bg-amber-50",
    accentText: "text-amber-500",
    borderColor: "border-amber-100 hover:border-amber-200",
  },
  {
    iconName: "Ribbon",
    title: "Reward System",
    description:
      "Structured reward policies with milestone bonuses, badge tiers, and monetary payouts tied directly to accepted vulnerability reports and challenge solutions.",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-500",
    borderColor: "border-emerald-100 hover:border-emerald-200",
  },
  {
    iconName: "Lock",
    title: "Secure Authentication",
    description:
      "Enterprise-grade auth, anti-cheating mechanisms, plagiarism prevention, and duplicate submission protection keep the platform trustworthy and fair.",
    accentBg: "bg-sky-50",
    accentText: "text-sky-500",
    borderColor: "border-sky-100 hover:border-sky-200",
  },
];