import Link from "next/link";
import { Cake, CalendarDays, Globe, MapPin, Phone, Users, VenusAndMars } from "lucide-react";
import { Profile } from "@/lib/types/profile/types";
import { SiGithub, SiX } from "react-icons/si";

interface ProfileBioProps {
  profile: Profile;
}

const GENDER_LABELS: Record<NonNullable<Profile["gender"]>, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function formatDateOfBirth(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// The edit form asks for full URLs (e.g. "https://github.com/username" — see
// BioSocialSection's placeholders), so social links are stored that way. Build
// the href straight from the stored value instead of re-prefixing a domain
// onto it, which previously produced broken/duplicated URLs like
// "github.com/https://github.com/handle" whenever a user followed the form's
// own placeholder guidance.
function toHref(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function displayUrl(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export default function ProfileBio({ profile }: ProfileBioProps) {
  const { bio, location, memberSince, socialLinks, followers, following, username, phone, dateOfBirth, gender } = profile;

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

          {phone && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">Phone:</span>
              <span className="font-medium text-slate-600 flex items-center gap-1.5">
                <Phone size={15} className="text-slate-400 shrink-0" />
                {phone}
              </span>
            </div>
          )}

          {socialLinks.website && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">Site:</span>
              <a
                href={toHref(socialLinks.website)}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1.5"
              >
                <Globe size={15} className="text-blue-400 shrink-0" />
                {displayUrl(socialLinks.website)}
              </a>
            </div>
          )}

          {socialLinks.github && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">GitHub:</span>
              <a
                href={toHref(socialLinks.github)}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1.5"
              >
                <SiGithub size={15} className="text-slate-500 shrink-0" />
                {displayUrl(socialLinks.github)}
              </a>
            </div>
          )}

          {socialLinks.twitter && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">X (Twitter):</span>
              <a
                href={toHref(socialLinks.twitter)}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1.5"
              >
                <SiX size={15} className="text-slate-500 shrink-0" />
                {displayUrl(socialLinks.twitter)}
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
              <Link href={`/dashboard/profile/${username}/followers`} className="hover:text-blue-600 hover:underline">
                {followers} followers
              </Link>
              <span className="text-slate-300">•</span>
              <Link href={`/dashboard/profile/${username}/following`} className="hover:text-blue-600 hover:underline">
                {following} following
              </Link>
            </span>
          </div>

          {dateOfBirth && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">Date of Birth:</span>
              <span className="font-medium text-slate-600 flex items-center gap-1.5">
                <Cake size={15} className="text-slate-400 shrink-0" />
                {formatDateOfBirth(dateOfBirth)}
              </span>
            </div>
          )}

          {gender && (
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-medium text-slate-500">Sex:</span>
              <span className="font-medium text-slate-600 flex items-center gap-1.5">
                <VenusAndMars size={15} className="text-slate-400 shrink-0" />
                {GENDER_LABELS[gender]}
              </span>
            </div>
          )}
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