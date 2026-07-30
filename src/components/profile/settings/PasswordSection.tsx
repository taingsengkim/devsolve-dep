"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputBase} pr-9 text-sm`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function PasswordSection({ value, onChange }: PasswordSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PasswordField
        id="currentPassword"
        label="Old Password"
        placeholder="Enter your password"
        value={value.currentPassword}
        onChange={(v) => onChange("currentPassword", v)}
      />

      <PasswordField
        id="newPassword"
        label="New Password"
        placeholder="Enter new password"
        value={value.newPassword}
        onChange={(v) => onChange("newPassword", v)}
      />

      <PasswordField
        id="confirmPassword"
        label="New Password Again"
        placeholder="Confirm new password"
        value={value.confirmPassword}
        onChange={(v) => onChange("confirmPassword", v)}
      />
    </div>
  );
}