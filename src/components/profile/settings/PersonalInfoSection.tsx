import { Lock, User as UserIcon } from "lucide-react";
import { EditProfileFormData } from "@/lib/types/profile/types";
import { inputBase, hairlineShadow } from "./styles";

interface PersonalInfoSectionProps {
  data: Pick<EditProfileFormData, "fullName" | "username" | "email" | "accountType">;
  onChange: (field: "fullName" | "username" | "email", value: string) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-[#171717]">
          Full name <span className="text-[#ff5b4f]">*</span>
        </label>
        <input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Your full name"
          className={inputBase}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="username" className="text-sm font-medium text-[#171717]">
          Username <span className="text-[#ff5b4f]">*</span>
        </label>
        <input
          id="username"
          value={data.username}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="your-username"
          className={inputBase}
        />
        <p className="text-sm text-[#4d4d4d]">This is your unique public username. You can change it once every 30 days.</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[#171717]">
          Email <span className="text-[#ff5b4f]">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="you@example.com"
          className={inputBase}
        />
        <p className="text-sm text-[#4d4d4d]">We&apos;ll send notifications to this email address.</p>
      </div>

      <div className="space-y-1.5">
        <span className="text-sm font-medium text-[#171717]">Account type</span>
        <div className={`flex items-center justify-between rounded-[6px] bg-[#fafafa] px-3 py-2.5 text-sm text-[#4d4d4d] ${hairlineShadow}`}>
          <span className="inline-flex items-center gap-2">
            <UserIcon size={15} />
            {data.accountType}
          </span>
          <Lock size={14} />
        </div>
      </div>
    </div>
  );
}