import Image from "next/image";
import { Globe, User as UserIcon } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { EditProfileFormData } from "@/lib/types/profile/types";
import { card, sectionLabel, badgePill } from "../styles";

interface ProfilePreviewCardProps {
  data: EditProfileFormData;
}

export default function ProfilePreviewCard({ data }: ProfilePreviewCardProps) {
  return (
    <div className={`${card} p-5`}>
      <p className={`inline-flex items-center gap-1.5 ${sectionLabel}`}>
        <UserIcon size={14} />
        Profile preview
      </p>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden relative bg-slate-100 shrink-0">
          <Image
            src="/justin.png"
            alt={data.fullName}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-slate-800 truncate">{data.fullName}</p>
          <p className="text-xs font-medium text-slate-500 truncate">@{data.username}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">{data.bio}</p>

      <div className="mt-3 flex items-center gap-3 text-slate-500">
        {data.socialLinks.github && <FaGithub size={16} className="hover:text-slate-800 transition" />}
        {data.socialLinks.twitter && <FaTwitter size={16} className="hover:text-slate-800 transition" />}
        {data.socialLinks.linkedin && <FaLinkedin size={16} className="hover:text-slate-800 transition" />}
        {data.socialLinks.website && <Globe size={16} className="hover:text-blue-600 transition" />}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">Your profile is visible to the community.</p>
    </div>
  );
}