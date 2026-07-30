import { Bell, Mail } from "lucide-react";
import { NotificationChannelPrefs, NotificationKey, NotificationPreferences } from "@/lib/types/profile/types";
import Toggle from "./Toggle";

interface NotificationPreferencesSectionProps {
  preferences: NotificationPreferences;
  onChange: (key: NotificationKey, channel: keyof NotificationChannelPrefs, value: boolean) => void;
}

const ROWS: { key: NotificationKey; label: string }[] = [
  { key: "reportStatusChanges", label: "Report status changes" },
  { key: "adminApprovals", label: "Admin approvals" },
  { key: "newPrograms", label: "New programs (from followed organizations)" },
  { key: "retestInvites", label: "Retest invites" },
  { key: "communityActivity", label: "Community activity (new solutions, comments)" },
  { key: "followActivity", label: "Follow activity (followed users' achievements)" },
];

function Column({
  icon,
  title,
  channel,
  preferences,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  channel: keyof NotificationChannelPrefs;
  preferences: NotificationPreferences;
  onChange: NotificationPreferencesSectionProps["onChange"];
}) {
  return (
    <div className="flex-1 space-y-4">
      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        {icon}
        {title}
      </p>
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{row.label}</span>
          <Toggle
            checked={preferences[row.key][channel]}
            onChange={(value) => onChange(row.key, channel, value)}
            label={`${row.label} — ${title}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function NotificationPreferencesSection({ preferences, onChange }: NotificationPreferencesSectionProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notification preferences</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose which notifications you receive.</p>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Column icon={<Bell size={13} />} title="In-app" channel="inApp" preferences={preferences} onChange={onChange} />
        <Column icon={<Mail size={13} />} title="Email" channel="email" preferences={preferences} onChange={onChange} />
      </div>
    </div>
  );
}