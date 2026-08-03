import { Globe, User as UserIcon } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { EditProfileFormData } from "@/lib/types/profile/types";

interface ProfilePreviewCardProps {
  data: EditProfileFormData;
}

export default function ProfilePreviewCard({ data }: ProfilePreviewCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-5">
      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <UserIcon size={14} />
        Profile preview
      </p>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden relative bg-slate-100 shrink-0">
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URL, not in next/image's remote host allowlist
            <img src={data.avatarUrl} alt={data.fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-600 text-sm font-bold text-white">
              {data.avatarInitials}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{data.fullName}</p>
          <p className="text-xs font-medium text-slate-500 truncate">@{data.username}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">{data.bio}</p>

      <div className="mt-3 flex items-center gap-3 text-slate-500">
        {data.socialLinks.github && <FaGithub size={16} className="hover:text-slate-800 dark:hover:text-slate-200 transition" />}
        {data.socialLinks.twitter && <FaTwitter size={16} className="hover:text-slate-800 dark:hover:text-slate-200 transition" />}
        {data.socialLinks.linkedin && <FaLinkedin size={16} className="hover:text-slate-800 dark:hover:text-slate-200 transition" />}
        {data.socialLinks.website && <Globe size={16} className="hover:text-blue-600 transition" />}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">Your profile is visible to the community.</p>
    </div>
  );
}
