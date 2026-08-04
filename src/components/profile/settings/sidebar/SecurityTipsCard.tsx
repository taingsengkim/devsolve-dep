import { CheckCircle2, ShieldAlert } from "lucide-react";

const TIPS = [
  "Use a strong, unique password",
  "Enable 2FA for extra security",
  "Never share your password",
  "Review your profile regularly",
];

export default function SecurityTipsCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-5">
      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <ShieldAlert size={13} />
        Security tips
      </p>

      <ul className="mt-3 space-y-2">
        {TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}