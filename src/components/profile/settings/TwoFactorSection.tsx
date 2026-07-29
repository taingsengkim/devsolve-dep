import { ShieldCheck } from "lucide-react";
import Toggle from "./Toggle";
import { buttonOutline } from "./styles";

interface TwoFactorSectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function TwoFactorSection({ enabled, onToggle }: TwoFactorSectionProps) {
  return (
    <div className="rounded-[12px] bg-[#fafafa] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#171717]">Two-factor authentication</p>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Secure your account with an additional layer of security using authenticator apps like Google Authenticator or Authy.
          </p>
        </div>
        <Toggle checked={enabled} onChange={onToggle} label="Toggle two-factor authentication" />
      </div>

      <button type="button" className={`${buttonOutline} mt-3`}>
        <ShieldCheck size={14} />
        Set up 2FA
      </button>
    </div>
  );
}