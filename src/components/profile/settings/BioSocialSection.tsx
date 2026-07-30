import { SocialLinksForm } from "@/lib/types/profile/types";
import { inputBase } from "./styles";

const MAX_BIO = 500;

interface BioSocialSectionProps {
  bio: string;
  location: string;
  socialLinks: SocialLinksForm;
  onBioChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSocialLinkChange: (key: keyof SocialLinksForm, value: string) => void;
}

const SOCIAL_FIELDS: { key: keyof SocialLinksForm; placeholder: string }[] = [
  { key: "github", placeholder: "https://github.com/username" },
  { key: "twitter", placeholder: "https://twitter.com/username" },
  { key: "linkedin", placeholder: "https://linkedin.com/in/username" },
  { key: "website", placeholder: "https://yoursite.dev" },
];

export default function BioSocialSection({
  bio,
  location,
  socialLinks,
  onBioChange,
  onLocationChange,
  onSocialLinkChange,
}: BioSocialSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="bio" className="text-sm font-medium text-[#171717]">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          maxLength={MAX_BIO}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Tell the community about yourself, your skills, and your interests..."
          rows={4}
          className={`${inputBase} resize-none`}
        />
        <div className="flex items-center justify-between text-sm text-[#4d4d4d]">
          <span>Max {MAX_BIO} characters.</span>
          <span>
            {bio.length}/{MAX_BIO}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="location" className="text-sm font-medium text-[#171717]">
          Location
        </label>
        <input id="location" value={location} onChange={(e) => onLocationChange(e.target.value)} placeholder="City, Country" className={inputBase} />
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-[#171717]">Social links</span>
          <p className="text-sm text-[#4d4d4d]">Connect your social accounts to build your community presence.</p>
        </div>
        <div className="space-y-2.5">
          {SOCIAL_FIELDS.map((field) => (
            <input
              key={field.key}
              value={socialLinks[field.key]}
              onChange={(e) => onSocialLinkChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={inputBase}
            />
          ))}
        </div>
      </div>
    </div>
  );
}