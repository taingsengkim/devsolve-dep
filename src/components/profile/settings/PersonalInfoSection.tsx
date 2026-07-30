import { EditProfileFormData } from "@/lib/types/profile/types";
import { inputBase } from "./styles";

interface PersonalInfoSectionProps {
  data: Pick<EditProfileFormData, "fullName" | "username" | "email">;
  onChange: (field: "fullName" | "username" | "email", value: string) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      <div className="space-y-1.5 sm:col-span-1">
        <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          className={inputBase}
        />
      </div>

      <div className="space-y-1.5 sm:col-span-1">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="you@example.com"
          className={inputBase}
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          value={data.username}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="your-username"
          className={inputBase}
        />
      </div>
    </div>
  );
}