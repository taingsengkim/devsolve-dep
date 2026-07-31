import { CalendarDays, Globe, MapPin, Users } from "lucide-react";
import { Profile } from "@/lib/types/profile/types";
import { SiGithub, SiX } from "react-icons/si";

interface ProfileBioProps {
  profile: Profile;
}

export default function ProfileBio({ profile }: ProfileBioProps) {
  const { bio, location, memberSince, socialLinks, followers, following } = profile;

  return (
    <div className="space-y-6 pt-2">
      {/* Contact Information Section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
          {location && (
            <div className="flex items-start gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">Address:</span>
              <span className="font-medium text-slate-600 flex items-center gap-1.5">
                <MapPin size={15} className="text-slate-400 shrink-0" />
                {location}
              </span>
            </div>
          )}

          {socialLinks.website && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">Site:</span>
              <a
                href={`https://${socialLinks.website}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1.5"
              >
                <Globe size={15} className="text-blue-400 shrink-0" />
                {socialLinks.website}
              </a>
            </div>
          )}

          {socialLinks.github && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">GitHub:</span>
              <a
                href={`https://github.com/${socialLinks.github}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1.5"
              >
                <SiGithub size={15} className="text-slate-500 shrink-0" />
                github.com/{socialLinks.github}
              </a>
            </div>
          )}

          {socialLinks.twitter && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">X (Twitter):</span>
              <a
                href={`https://twitter.com/${socialLinks.twitter.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1.5"
              >
                <SiX size={15} className="text-slate-500 shrink-0" />
                {socialLinks.twitter}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm mb-4">
          <div className="flex items-center gap-4">
            <span className="w-28 shrink-0 font-medium text-slate-500">Member Since:</span>
            <span className="font-medium text-slate-600 flex items-center gap-1.5">
              <CalendarDays size={15} className="text-slate-400 shrink-0" />
              {memberSince}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-28 shrink-0 font-medium text-slate-500">Community:</span>
            <span className="font-medium text-slate-600 flex items-center gap-2">
              <Users size={15} className="text-slate-400 shrink-0" />
              <span>{followers} followers</span>
              <span className="text-slate-300">•</span>
              <span>{following} following</span>
            </span>
          </div>
        </div>

        {bio && (
          <div className="mt-3 rounded-2xl bg-slate-50/70 p-4 border border-slate-200/60">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About</p>
            <p className="text-sm leading-relaxed text-slate-600 font-normal">{bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}