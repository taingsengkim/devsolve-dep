import { card } from "./styles";

interface SettingsSectionCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export default function SettingsSectionCard({ icon, title, children }: SettingsSectionCardProps) {
  return (
    <div className={`${card} p-6`}>
      <div className="mb-5 flex items-center gap-2.5 pb-4 border-b border-slate-100">
        {icon}
        <h2 className="text-sm font-semibold text-slate-500 tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}