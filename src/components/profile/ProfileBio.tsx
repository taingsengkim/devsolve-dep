import Link from "next/link";
import {
  Cake,
  CalendarDays,
  Globe,
  MapPin,
  Phone,
  Users,
  VenusAndMars,
} from "lucide-react";
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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

/** Label/value pair. One component so every row lines up identically. */
function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-28 shrink-0 pt-px text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
        {children}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {children}
    </h3>
  );
}

const linkClass =
  "inline-flex min-w-0 items-center gap-1.5 font-medium text-blue-600 hover:underline dark:text-blue-400";

export default function ProfileBio({ profile }: ProfileBioProps) {
  const {
    bio,
    location,
    memberSince,
    socialLinks,
    followers,
    following,
    username,
    phone,
    dateOfBirth,
    gender,
  } = profile;

  const hasContact =
    location || phone || socialLinks.website || socialLinks.github || socialLinks.twitter;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {hasContact && (
        <div className="mb-6">
          <SectionLabel>Contact information</SectionLabel>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
            {location && (
              <InfoRow label="Address">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="shrink-0 text-slate-400" />
                  {location}
                </span>
              </InfoRow>
            )}

            {phone && (
              <InfoRow label="Phone">
                <span className="flex items-center gap-1.5">
                  <Phone size={15} className="shrink-0 text-slate-400" />
                  {phone}
                </span>
              </InfoRow>
            )}

            {socialLinks.website && (
              <InfoRow label="Site">
                <a
                  href={toHref(socialLinks.website)}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  <Globe size={15} className="shrink-0 text-blue-400" />
                  <span className="truncate">
                    {displayUrl(socialLinks.website)}
                  </span>
                </a>
              </InfoRow>
            )}

            {socialLinks.github && (
              <InfoRow label="GitHub">
                <a
                  href={toHref(socialLinks.github)}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  <SiGithub size={15} className="shrink-0 text-slate-500" />
                  <span className="truncate">
                    {displayUrl(socialLinks.github)}
                  </span>
                </a>
              </InfoRow>
            )}

            {socialLinks.twitter && (
              <InfoRow label="X (Twitter)">
                <a
                  href={toHref(socialLinks.twitter)}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  <SiX size={15} className="shrink-0 text-slate-500" />
                  <span className="truncate">
                    {displayUrl(socialLinks.twitter)}
                  </span>
                </a>
              </InfoRow>
            )}
          </div>
        </div>
      )}

      <div
        className={
          hasContact
            ? "border-t border-slate-100 pt-5 dark:border-slate-800"
            : undefined
        }
      >
        <SectionLabel>Basic information</SectionLabel>

        <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
          <InfoRow label="Member since">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} className="shrink-0 text-slate-400" />
              {memberSince}
            </span>
          </InfoRow>

          <InfoRow label="Community">
            <span className="flex flex-wrap items-center gap-2">
              <Users size={15} className="shrink-0 text-slate-400" />
              <Link
                href={`/dashboard/profile/${username}/followers`}
                className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
              >
                {followers} followers
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href={`/dashboard/profile/${username}/following`}
                className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
              >
                {following} following
              </Link>
            </span>
          </InfoRow>

          {dateOfBirth && (
            <InfoRow label="Date of birth">
              <span className="flex items-center gap-1.5">
                <Cake size={15} className="shrink-0 text-slate-400" />
                {formatDateOfBirth(dateOfBirth)}
              </span>
            </InfoRow>
          )}

          {gender && (
            <InfoRow label="Sex">
              <span className="flex items-center gap-1.5">
                <VenusAndMars size={15} className="shrink-0 text-slate-400" />
                {GENDER_LABELS[gender]}
              </span>
            </InfoRow>
          )}
        </div>

        {bio && (
          <div className="mt-5 rounded-xl border border-slate-200/60 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              About
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
