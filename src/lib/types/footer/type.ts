

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface NavSection {
  title: string;
  links: NavLinkItem[];
}

export interface SocialLinkItem {
  id: string;
  platform: "github" | "twitter" | "linkedin" | "youtube" | "email";
  label: string;
  href: string;
}

export interface SponsorItem {
  id: string;
  name: string;
  logoSrc: string;
  href?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface FooterData {
  brandName: string;
  description: string;
  contact: ContactInfo;
  socials: SocialLinkItem[];
  platformNav: NavSection;
  resourcesNav: NavSection;
  legalNav: NavLinkItem[];
  sponsors: SponsorItem[];
}