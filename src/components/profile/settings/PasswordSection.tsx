"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { inputBase } from "./styles";

export interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordSectionProps {
  value: PasswordFormState;
  onChange: (field: keyof PasswordFormState, value: string) => void;
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#171717]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputBase} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d4d4d] transition hover:text-[#171717]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function PasswordSection({ value, onChange }: PasswordSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
        <Lock size={15} />
        Change password
      </div>

      <PasswordField
        id="currentPassword"
        label="Current password"
        placeholder="Enter your current password"
        value={value.currentPassword}
        onChange={(v) => onChange("currentPassword", v)}
      />

      <div>
        <PasswordField
          id="newPassword"
          label="New password"
          placeholder="Enter a new password (min 8 characters)"
          value={value.newPassword}
          onChange={(v) => onChange("newPassword", v)}
        />
        <p className="mt-1.5 text-sm text-[#4d4d4d]">Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.</p>
      </div>

      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        placeholder="Confirm your new password"
        value={value.confirmPassword}
        onChange={(v) => onChange("confirmPassword", v)}
      />
    </div>
  );
}