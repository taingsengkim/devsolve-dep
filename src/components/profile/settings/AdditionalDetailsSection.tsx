import { EditProfileFormData } from "@/lib/types/profile/types";
import { Input } from "@/components/ui/input";

interface AdditionalDetailsSectionProps {
  phone?: string;
  dateOfBirth?: string;
  gender?: EditProfileFormData["gender"];
  onChange: (field: "phone" | "dateOfBirth" | "gender", value: string) => void;
}

const GENDER_OPTIONS: { value: NonNullable<EditProfileFormData["gender"]>; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export default function AdditionalDetailsSection({ phone, dateOfBirth, gender, onChange }: AdditionalDetailsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</label>
        <Input
          type="tel"
          value={phone ?? ""}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+1 555 123 4567"
          className="h-10.5 rounded-xl border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-2xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date of Birth</label>
        <Input
          type="date"
          value={dateOfBirth ?? ""}
          onChange={(e) => onChange("dateOfBirth", e.target.value)}
          className="h-10.5 rounded-xl border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-2xs"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gender</label>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange("gender", option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                gender === option.value
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