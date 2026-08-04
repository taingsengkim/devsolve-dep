export type DiscussionStatus = "Solved" | "Open";

export interface Author {
  name: string;
  avatar: string;
}

export interface Discussion {
  id: string;
  votes: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status?: DiscussionStatus;
  techStackLabel?: boolean;
  answersCount?: number;
  commentsCount?: number;
  views: number;
  author: Author;
  date: string;
  image?: string;
  isBookmarked?: boolean;
}

export interface Topic {
  name: string;
  count: number;
}

export interface PlatformStats {
  problems: number;
  solutions: number;
  researchers: number;
}

export type TabType = "All" | "Problems" | "Showcase";