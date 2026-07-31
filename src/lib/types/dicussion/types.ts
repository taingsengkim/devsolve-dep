export type DiscussionCategory = "All" | "Problems" | "Showcase";

export type TopicFilter =
  | "Authentication"
  | "Server-Side"
  | "JavaScript"
  | "API Security"
  | "Cryptography"
  | "Program Design";

export interface DiscussionPost {
  id: string;
  title: string;
  category: "Problems" | "Showcase";
  topic: TopicFilter;
  description: string;
  tags: string[];
  techStack?: string[];
  votes: number;
  answersCount: number;
  viewsCount: number;
  status?: "Solved" | "Open";
  thumbnailUrl?: string;
  author: {
    name: string;
    avatarUrl: string;
    reputation?: number;
  };
  createdAt: string;
  isBookmarked?: boolean;
  isUpvoted?: boolean;
}

export interface TopicCount {
  name: TopicFilter;
  count: number;
}

export interface CommentItem {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
}

export interface SolutionItem {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    reputation: number;
  };
  type: "rich" | "basic";
  isAccepted?: boolean;
  votes: number;
  createdAt: string;
  explanation: string;
  
  // Rich solution fields
  stepByStep?: string[];
  codeFix?: string;
  hasDiagram?: boolean;
  hasVideo?: boolean;
  
  // Comments thread
  comments: CommentItem[];
}

export interface ProblemDetail {
  id: string;
  title: string;
  status: "Open" | "Solved";
  sdlcPhase: string;
  category: string;
  tags: string[];
  votes: number;
  description: string;
  codeSnippet?: string;
  postedBy: {
    name: string;
    avatarUrl: string;
    reputation: number;
  };
  postedDate: string;
  viewsCount: number;
  solutions: SolutionItem[];
}