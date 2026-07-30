import { CalendarDays, Globe, MapPin } from "lucide-react";
import { Profile } from "@/lib/types/profile/types";
import { SiGithub, SiX } from "react-icons/si";

interface ProfileBioProps {
  profile: Profile;
}

export default function ProfileBio({ profile }: ProfileBioProps) {
  const { bio, location, memberSince, socialLinks } = profile;

  return (
    <div className="rounded-xl p-5">
      <p className="text-sm leading-relaxed text-slate-600">{bio}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
        {location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} />
            {location}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          Member since {memberSince}
        </span>
        {socialLinks.website && (
          <a href={`https://${socialLinks.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-600">
            <Globe size={14} />
            {socialLinks.website}
          </a>
        )}
        {socialLinks.github && (
          <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-600">
            <SiGithub size={14} />
            {socialLinks.github}
          </a>
        )}
        {socialLinks.twitter && (
          <a
            href={`https://twitter.com/${socialLinks.twitter.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-blue-600"
          >
            <SiX size={14} />
            {socialLinks.twitter}
          </a>
        )}
      </div>
    </div>
  );
}