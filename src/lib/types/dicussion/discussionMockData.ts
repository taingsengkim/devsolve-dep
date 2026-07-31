import { DiscussionPost, TopicCount } from "./types";

export const MOCK_TOPICS: TopicCount[] = [
  { name: "Authentication", count: 214 },
  { name: "Server-Side", count: 189 },
  { name: "JavaScript", count: 156 },
  { name: "API Security", count: 134 },
  { name: "Cryptography", count: 89 },
  { name: "Program Design", count: 65 },
];

export const MOCK_TRENDING_TAGS = [
  "#ssrf",
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

export const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: "1",
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Problems",
    topic: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN.",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    votes: 142,
    answersCount: 2,
    viewsCount: 2841,
    status: "Solved",
    author: {
      name: "Alex Mercer",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    },
    createdAt: "Jun 12, 2025",
    isBookmarked: false,
    isUpvoted: false,
  },
  {
    id: "2",
    title: "Is prototype pollution still exploitable in lodash ≥ 4.17.21?",
    category: "Problems",
    topic: "JavaScript",
    description:
      "The target app uses lodash merge with user-controlled keys. Lodash 4.17.21 patched CVE-2020-8203 but the app passes unsanitized input through a custom wrapper. Am I missing something?",
    tags: ["#lodash", "#javascript", "#cve", "#prototype-pollution"],
    votes: 212,
    answersCount: 1,
    viewsCount: 5503,
    status: "Open",
    author: {
      name: "Taing Sengkim",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sengkim",
      reputation: 6120,
    },
    createdAt: "May 28, 2025",
    isBookmarked: true,
    isUpvoted: true,
  },
  {
    id: "3",
    title: "Bypassing WAF rate limits with X-Forwarded-For headers in GraphQL",
    category: "Problems",
    topic: "API Security",
    description:
      "Observed an issue where cloud gateway respects client-supplied headers over socket origin during batch queries.",
    tags: ["#graphql", "#rate-limit", "#waf", "#bypass"],
    votes: 98,
    answersCount: 4,
    viewsCount: 1920,
    status: "Solved",
    author: {
      name: "Sengkim Hout",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Hout",
      reputation: 9310,
    },
    createdAt: "May 15, 2025",
    isBookmarked: false,
    isUpvoted: false,
  },
  {
    id: "4",
    title: "Interactive OAuth Security Architecture Flow & POC Playground",
    category: "Showcase",
    topic: "Program Design",
    description:
      "Built a browser sandbox comparing OAuth 2.0 PKCE flow vs Implicit grant token leaks. Check out the interactive React demo!",
    tags: ["#oauth", "#security-architecture", "#showcase"],
    techStack: ["#react", "#firebase", "#keycloak"],
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    votes: 320,
    answersCount: 12,
    viewsCount: 8410,
    author: {
      name: "Alex Mercer",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    },
    createdAt: "Apr 02, 2025",
    isBookmarked: true,
    isUpvoted: true,
  },
  {
    id: "5",
    title: "SSRF via PDF generation — can I escalate to RCE from AWS metadata?",
    category: "Problems",
    topic: "Server-Side",
    description:
      "HTML to PDF renderer executing internal fetch. IMDSv1 is enabled. Documenting IAM role permissions for PoC submission.",
    tags: ["#ssrf", "#aws", "#metadata", "#pdf"],
    votes: 176,
    answersCount: 3,
    viewsCount: 3100,
    status: "Open",
    author: {
      name: "ghostkode",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ghost",
    },
    createdAt: "Mar 20, 2025",
    isBookmarked: false,
    isUpvoted: false,
  },
];