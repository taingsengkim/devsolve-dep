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

const SOCIAL_FIELDS: { key: keyof SocialLinksForm; placeholder: string; label: string }[] = [
  { key: "github", placeholder: "https://github.com/username", label: "GitHub" },
  { key: "twitter", placeholder: "https://twitter.com/username", label: "X (Twitter)" },
  { key: "linkedin", placeholder: "https://linkedin.com/in/username", label: "LinkedIn" },
  { key: "website", placeholder: "https://yoursite.dev", label: "Website" },
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
        <label htmlFor="bio" className="text-sm font-semibold text-slate-700">
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
        <div className="flex items-center justify-between text-xs font-medium text-slate-400">
          <span>Max {MAX_BIO} characters.</span>
          <span>
            {bio.length}/{MAX_BIO}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="location" className="text-sm font-semibold text-slate-700">
          Location
        </label>
        <input id="location" value={location} onChange={(e) => onLocationChange(e.target.value)} placeholder="City, Country" className={inputBase} />
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-semibold text-slate-700">Social links</span>
          <p className="text-xs font-medium text-slate-500">Connect your social accounts to build your community presence.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs font-medium text-slate-500">{field.label}</label>
              <input
                value={socialLinks[field.key]}
                onChange={(e) => onSocialLinkChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputBase}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}