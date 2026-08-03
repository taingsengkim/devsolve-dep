import { EditProfileFormData } from "@/lib/types/profile/types";
import { Input } from "@/components/ui/input";

type PersonalInfoField = "fullName" | "username" | "email" | "phone" | "dateOfBirth" | "gender";

interface PersonalInfoSectionProps {
  data: Pick<EditProfileFormData, "fullName" | "username" | "email" | "phone" | "dateOfBirth" | "gender">;
  onChange: (field: PersonalInfoField, value: string) => void;
}

const GENDER_OPTIONS: { value: NonNullable<EditProfileFormData["gender"]>; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      <div className="space-y-1.5 sm:col-span-1">
        <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          className="h-10.5 rounded-xl border-slate-300 bg-white text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600/30"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-1">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="you@example.com"
          className="h-10.5 rounded-xl border-slate-300 bg-white text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600/30"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Username <span className="text-red-500">*</span>
        </label>
        <Input
          id="username"
          value={data.username}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="your-username"
          className="h-10.5 rounded-xl border-slate-300 bg-white text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600/30"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-1">
        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          value={data.phone ?? ""}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+1 555 123 4567"
          className="h-10.5 rounded-xl border-slate-300 bg-white text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600/30"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-1">
        <label htmlFor="dateOfBirth" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Date of Birth
        </label>
        <Input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth ?? ""}
          onChange={(e) => onChange("dateOfBirth", e.target.value)}
          className="h-10.5 rounded-xl border-slate-300 bg-white text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600/30"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sex</label>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange("gender", option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                data.gender === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}