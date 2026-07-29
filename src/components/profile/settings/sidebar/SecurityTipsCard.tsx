import { CheckCircle2, ShieldAlert } from "lucide-react";
import { card, sectionLabel } from "../styles";

const TIPS = [
  "Use a strong, unique password",
  "Enable 2FA for extra security",
  "Never share your password",
  "Review your profile regularly",
];

export default function SecurityTipsCard() {
  return (
    <div className={`${card} p-5`}>
      <p className={`inline-flex items-center gap-1.5 ${sectionLabel}`}>
        <ShieldAlert size={13} />
        Security tips
      </p>

      <ul className="mt-3 space-y-2">
        {TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-sm text-[#4d4d4d]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#10B981]" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}