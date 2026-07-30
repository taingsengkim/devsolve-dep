interface SettingsSectionCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export default function SettingsSectionCard({ icon, title, children }: SettingsSectionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-6">
      <div className="mb-5 flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        {icon}
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}