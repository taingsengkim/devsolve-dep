import { ShieldCheck } from "lucide-react";
import Toggle from "./Toggle";
import { Button } from "@/components/ui/button";

interface TwoFactorSectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function TwoFactorSection({ enabled, onToggle }: TwoFactorSectionProps) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200/60 dark:border-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Two-factor authentication</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Secure your account with an additional layer of security using authenticator apps like Google Authenticator or Authy.
          </p>
        </div>
        <Toggle checked={enabled} onChange={onToggle} label="Toggle two-factor authentication" />
      </div>

      <Button variant="outline" size="sm" type="button" className="mt-3 gap-2 rounded-xl border-slate-300 bg-white font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer">
        <ShieldCheck size={14} />
        Set up 2FA
      </Button>
    </div>
  );
}