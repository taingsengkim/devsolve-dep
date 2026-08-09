import {
  Profile,
  ProfileBadge,
  ProfileStats,
  SeverityStats,
  HacktivityEntry,
  ThanksEntry,
  EditProfileFormData,
  AccountStatus,
  FollowRecord,
  FollowingCounts,
} from "./types";

export const mockProfile: Profile = {
  id: "usr_narongseu",
  username: "narongseu",
  displayName: "Narong Seu",
  avatarInitials: "NR",
  bio: "Full-stack security researcher specializing in API abuse, server-side vulnerabilities, and OAuth misconfigurations. I enjoy finding critical bugs in authentication flows and payment systems. Open to private program invitations.",
  location: "Phnom Penh, Cambodia",
  memberSince: "March 2023",
  socialLinks: {
    website: "ghostkode.dev",
    github: "ghostkode",
    twitter: "@ghostkode_sec",
  },
  followers: 284,
  following: 61,
  isOwnProfile: true,
};

export const mockStats: ProfileStats = {
  reputation: 9310,
  globalRank: 7,
  reportsSubmitted: 148,
  accepted: 121,
  acceptedRate: 81.8,
  totalEarned: 42800,
};

export const mockSeverity: SeverityStats = {
  critical: 14,
  high: 38,
  medium: 49,
  low: 20,
  rejected: 18,
  duplicate: 9,
  retests: 22,
};

export const mockBadges: ProfileBadge[] = [
  { id: "b1", label: "Top 10 Global", icon: "trophy", locked: false },
  { id: "b2", label: "Century", icon: "shield", locked: false },
  { id: "b3", label: "First Critical", icon: "zap", locked: false },
  { id: "b4", label: "Speed Demon", icon: "activity", locked: false },
  { id: "b5", label: "Community Star", icon: "star", locked: false },
  { id: "b6", label: "Retest Ace", icon: "target", locked: false },
  { id: "b7", label: "Hall of Fame", icon: "crown", locked: true },
  { id: "b8", label: "500 Club", icon: "shield", locked: true },
  { id: "b9", label: "Critical Hunter", icon: "zap", locked: true },
];

export const mockHacktivity: HacktivityEntry[] = [
  { id: "h1", type: "resolved", actorHandle: "@ghostkode", date: "2025-07-01", severity: "critical", program: "CloudVault", bounty: 8000 },
  { id: "h2", type: "badge", actorHandle: "@ghostkode", date: "2025-06-29", badgeName: "Speed Demon" },
  { id: "h3", type: "resolved", actorHandle: "@ghostkode", date: "2025-06-22", severity: "high", program: "FinTrack API", bounty: 3500 },
  { id: "h4", type: "rank", actorHandle: "@ghostkode", date: "2025-06-18", rankLabel: "#7 Global" },
  { id: "h5", type: "retest", actorHandle: "@ghostkode", date: "2025-06-12", program: "DataBridge" },
  { id: "h6", type: "resolved", actorHandle: "@ghostkode", date: "2025-05-28", severity: "critical", program: "AuthFlow", bounty: 12000 },
  { id: "h7", type: "badge", actorHandle: "@ghostkode", date: "2025-05-20", badgeName: "Century" },
  { id: "h8", type: "resolved", actorHandle: "@ghostkode", date: "2025-05-14", severity: "high", program: "ShieldNet", bounty: 4200 },
];

export const mockThanks: ThanksEntry[] = [
  {
    id: "t1",
    orgName: "Anna Cook",
    message:
      "We truly appreciate your time reporting a critical vulnerability in our system. Your responsible disclosure has helped us protect thousands of users.",
    date: "2026-06-08",
  },
  {
    id: "t2",
    orgName: "Anna Cook",
    message:
      "We truly appreciate your time reporting a critical vulnerability in our system. Your responsible disclosure has helped us protect thousands of users.",
    date: "2026-06-08",
  },
  {
    id: "t3",
    orgName: "Anna Cook",
    message:
      "We truly appreciate your time reporting a critical vulnerability in our system. Your responsible disclosure has helped us protect thousands of users.",
    date: "2026-06-08",
  },
];

export const mockEditProfileFormData: EditProfileFormData = {
  avatarInitials: "NR",
  fullName: "Narong Seu",
  username: "narongseu",
  email: "narong.seu@example.com",
  accountType: "User",
  bio: mockProfile.bio,
  location: "Phnom Penh, Cambodia",
  socialLinks: {
    github: "ghostkode",
    twitter: "@ghostkode_sec",
    linkedin: "",
    website: "ghostkode.dev",
  },
  twoFactorEnabled: false,
  notifications: {
    reportStatusChanges: { inApp: true, email: true },
    adminApprovals: { inApp: true, email: false },
    newPrograms: { inApp: true, email: false },
    retestInvites: { inApp: true, email: true },
    communityActivity: { inApp: false, email: false },
    followActivity: { inApp: false, email: false },
  },
};

export const mockAccountStatus: AccountStatus = {
  memberSince: "Mar 2023",
  totalSubmissions: mockStats.reportsSubmitted,
  acceptedReports: mockStats.accepted,
  reputationPoints: mockStats.reputation,
  acceptanceRate: mockStats.acceptedRate,
};
export const mockEditProfileForm: EditProfileFormData = {
  avatarInitials: "AK",
  avatarUrl: undefined,
  fullName: "Alex Kim",
  username: "alexkim",
  email: "alex.kim@example.com",
  accountType: "Hacker",
  bio: "Security researcher focused on web app vulnerabilities and API security. Love breaking things to make them safer.",
  location: "San Francisco, CA",
  phone: "",
  dateOfBirth: "",
  gender: undefined,
  socialLinks: {
    github: "https://github.com/alexkim",
    twitter: "https://twitter.com/alexkim",
    linkedin: "https://linkedin.com/in/alexkim",
    website: "https://alexkim.dev",
  },
  twoFactorEnabled: true,
  notifications: {
    reportStatusChanges: { inApp: true, email: true },
    adminApprovals: { inApp: true, email: false },
    newPrograms: { inApp: false, email: false },
    retestInvites: { inApp: true, email: true },
    communityActivity: { inApp: false, email: false },
    followActivity: { inApp: true, email: false },
  },
};