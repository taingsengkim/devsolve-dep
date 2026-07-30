export type AboutTeamRole =
  | "Mentor"
  | "Leader"
  | "Sub Leader"
  | "Member"
  | "Advisor";

export type AboutTeamGroup =
  | "Mentorship"
  | "Leadership"
  | "Engineering"
  | "Design";

export type AboutTeamMember = {
  name: string;
  role: AboutTeamRole;
  group: AboutTeamGroup;
  specialty: string;
  quote: string;
  initials: string;
  imageSrc: string;
  accent: "blue" | "emerald" | "slate";
};

export const ABOUT_TEAM_MEMBERS: AboutTeamMember[] = [
  {
    name: "Sreng Chipor",
    role: "Mentor",
    group: "Mentorship",
    specialty: "Mentor",
    quote: "Guiding the next generation of security builders.",
    initials: "SC",
    imageSrc: "/image1.jpg",
    accent: "blue",
  },
  {
    name: "Rin Bunvarn",
    role: "Advisor",
    group: "Mentorship",
    specialty: "Mentor",
    quote: "Building resilient systems through disciplined learning.",
    initials: "RB",
    imageSrc: "/image2.jpg",
    accent: "emerald",
  },
  {
    name: "Taing Sengkim",
    role: "Leader",
    group: "Leadership",
    specialty: "Full Stack Developer",
    quote: "Security becomes stronger when teams move together.",
    initials: "TS",
    imageSrc: "/Taing_Sengkim.jpg",
    accent: "blue",
  },
  {
    name: "Lor Vengroth",
    role: "Sub Leader",
    group: "Leadership",
    specialty: "Full Stack Developer",
    quote: "Architecture and execution should feel equally deliberate.",
    initials: "LV",
    imageSrc: "/LOR_VENGROTH.png",
    accent: "slate",
  },
  {
    name: "Ky Reaksa",
    role: "Member",
    group: "Engineering",
    specialty: "Full Stack Developer",
    quote: "Every secure experience starts with thoughtful detail.",
    initials: "KR",
    imageSrc: "/ky reaksa.png",
    accent: "emerald",
  },
  {
    name: "Dim Pathea",
    role: "Member",
    group: "Design",
    specialty: "Full Stack Developer",
    quote: "Design with clarity first and trust follows naturally.",
    initials: "DP",
    imageSrc: "/image3.jpg",
    accent: "blue",
  },
  {
    name: "Chamreun Molikatevy",
    role: "Member",
    group: "Engineering",
    specialty: "Full Stack Developer",
    quote: "Calm interfaces help complex security work feel simple.",
    initials: "CK",
    imageSrc: "/molika tevy.jpg",
    accent: "emerald",
  },
  {
    name: "Tolah Hamadabidin",
    role: "Member",
    group: "Engineering",
    specialty: "Full Stack Developer",
    quote: "Reliable products are built through steady iteration.",
    initials: "TH",
    imageSrc: "/TOLLAH-HAMADABIDIN.JPG",
    accent: "slate",
  },
  {
    name: "Bun Raksa",
    role: "Member",
    group: "Engineering",
    specialty: "Full Stack Developer",
    quote: "Secure systems are the result of patient engineering.",
    initials: "BR",
    imageSrc: "/bun reaksa.JPEG",
    accent: "blue",
  },
  {
    name: "San Tol",
    role: "Member",
    group: "Engineering",
    specialty: "Full Stack Developer",
    quote: "Visibility, testing, and discipline make defense real.",
    initials: "ST",
    imageSrc: "/san tol.jpg",
    accent: "emerald",
  },
  {
    name: "Seu Narong",
    role: "Member",
    group: "Engineering",
    specialty: "Full Stack Developer",
    quote: "Innovation works best when reliability leads the way.",
    initials: "SN",
    imageSrc: "/seu narong.jpg",
    accent: "slate",
  },
];

export const ABOUT_VALUES = [
  {
    title: "Security First",
    description:
      "We prioritize security in everything we do, ensuring a safer digital future.",
  },
  {
    title: "Community Driven",
    description:
      "We believe in the power of collaboration and shared knowledge.",
  },
  {
    title: "Grow Together",
    description:
      "We support developers and organizations to grow and achieve more.",
  },
  {
    title: "Trust & Integrity",
    description:
      "We are committed to transparency, fairness, and building lasting trust.",
  },
];

export const ABOUT_STATS = [
  {
    label: "Organizations Secured",
    value: "250+",
    description: "Trusted by companies worldwide",
  },
  {
    label: "Vulnerabilities Reported",
    value: "12K+",
    description: "Helping make systems safer",
  },
  {
    label: "Developers",
    value: "25K+",
    description: "Growing together in one community",
  },
  {
    label: "Recognitions Earned",
    value: "8K+",
    description: "Celebrating achievements",
  },
];
