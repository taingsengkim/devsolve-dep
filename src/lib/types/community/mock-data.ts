import { Discussion, Topic, PlatformStats } from "./types";

export const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    votes: 142,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN assets, etc. Is this a real exploitable vector or low risk in",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    status: "Solved",
    answersCount: 2,
    views: 2841,
    author: { name: "Alex Mercer", avatar: "/AlexMercer.avif" },
    date: "Jun 12, 2025",
    isBookmarked: false,
  },
  {
    id: "2",
    votes: 98,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN assets, etc. Is this a real exploitable vector or low risk in practice?",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    status: "Open",
    answersCount: 2,
    views: 2841,
    author: { name: "John Smat", avatar: "/profile3.jpg" },
    date: "Jun 12, 2025",
    isBookmarked: false,
  },
  {
    id: "3",
    votes: 67,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN assets, etc. Is this a real exploitable vector or low risk in",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    status: "Solved",
    answersCount: 2,
    views: 2841,
    author: { name: "Kun Suki", avatar: "/profile1.jpg" },
    date: "Jun 12, 2025",
    isBookmarked: false,
  },
  {
    id: "4",
    votes: 234,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the...",
    tags: ["#react", "#firebase", "#keycloak"],
    techStackLabel: true,
    commentsCount: 2,
    views: 2841,
    author: { name: "Mary Saly", avatar: "/profile2.jpg" },
    date: "Jun 12, 2025",
    image: "/computer.jpg",
    isBookmarked: false,
  },
  {
    id: "5",
    votes: 312,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the...",
    tags: ["#react", "#firebase", "#keycloak"],
    techStackLabel: true,
    commentsCount: 2,
    views: 2841,
    author: { name: "Ahly Noko", avatar: "/AlexMercer.avif" },
    date: "Jun 12, 2025",
    image: "/computers.jpg",
    isBookmarked: false,
  },
];

export const MOCK_TOPICS: Topic[] = [
  { name: "All Topics", count: 847 },
  { name: "Authentication", count: 314 },
  { name: "Server-Side", count: 189 },
  { name: "JavaScript", count: 156 },
  { name: "API Security", count: 134 },
  { name: "Cryptography", count: 89 },
  { name: "Program Design", count: 65 },
];

export const MOCK_TAGS: string[] = [
  "#xsrf",
  "#jwt",
  "#graphql",
  "#xss",
  "#rce",
  "#oauth",
  "#cors",
  "#idor",
  "#sql-injection",
  "#csrf",
];

export const MOCK_PLATFORM_STATS: PlatformStats = {
  problems: 857,
  solutions: 3241,
  researchers: 12408,
};