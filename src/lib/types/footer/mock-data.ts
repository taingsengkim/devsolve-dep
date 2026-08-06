import type { FooterData } from "./type";

export const mockFooterData: FooterData = {
  brandName: "DevSolve",
  description:
    "DevSolve is a bug bounty platform that connects organizations with ethical hackers to identify and resolve security vulnerabilities through responsible disclosure, collaboration, and rewards.",
  contact: {
    address: "#40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh",
    phone: "+855 15 33 88 26",
    email: "info.istad@gmail.com",
  },
  socials: [
    { id: "s-1", platform: "github", label: "GitHub", href: "https://github.com" },
    { id: "s-2", platform: "twitter", label: "Twitter", href: "https://x.com" },
    { id: "s-3", platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
    { id: "s-4", platform: "youtube", label: "YouTube", href: "https://youtube.com" },
    { id: "s-5", platform: "email", label: "Email", href: "info.istad@gmail.com" },
  ],
  platformNav: {
    title: "Platform",
    links: [
      { id: "p-1", label: "Home", href: "/" },
      { id: "p-2", label: "Programs", href: "/programs" },
      { id: "p-3", label: "Community", href: "/discussions" },
      { id: "p-4", label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  resourcesNav: {
    title: "Resources",
    links: [
      { id: "r-1", label: "Support Center", href: "/support" },
      { id: "r-2", label: "Documentation", href: "/docs" },
      { id: "r-3", label: "About", href: "/about" },
      { id: "r-4", label: "Contact", href: "/contact" },
      { id: "r-5", label: "Privacy Policy", href: "/privacy" },
      { id: "r-6", label: "Terms of Service", href: "/terms" },
    ],
  },
  legalNav: [
    { id: "l-1", label: "Privacy Policy", href: "/privacy" },
    { id: "l-2", label: "Terms of Service", href: "/terms" },
    { id: "l-3", label: "Cookies", href: "/cookies" },
  ],
  sponsors: [
    { id: "sp-1", name: "ISTAD", logoSrc: "/istad.png", href: "https://istad.co" },
    { id: "sp-2", name: "MPTC", logoSrc: "/Logo_MPTC.png", href: "https://mptc.gov.kh" },
    { id: "sp-3", name: "CBRD", logoSrc: "/CBRD-Logo-Final.png", href: "#" },
  ],
};
