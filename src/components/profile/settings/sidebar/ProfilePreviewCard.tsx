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
        <UserIcon size={13} />
        Profile preview
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
          {data.avatarInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#171717]">{data.fullName}</p>
          <p className="text-sm text-[#4d4d4d]">@{data.username}</p>
        </div>
      </div>

      <span className={`${badgePill} mt-2 bg-[#2563EB]/10 text-[#2563EB]`}>
        <UserIcon size={11} />
        {data.accountType}
      </span>

      <p className="mt-3 text-sm leading-relaxed text-[#4d4d4d]">{data.bio}</p>

      <div className="mt-3 flex items-center gap-3 text-[#4d4d4d]">
        {data.socialLinks.github && <FaGithub size={15} />}
        {data.socialLinks.twitter && <FaTwitter size={15} />}
        {data.socialLinks.linkedin && <FaLinkedin size={15} />}
        {data.socialLinks.website && <Globe size={15} />}
      </div>

      <p className="mt-3 text-sm text-[#4d4d4d]">Your profile is visible to the community.</p>
    </div>
  );
}