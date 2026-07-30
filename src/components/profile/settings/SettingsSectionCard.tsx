import { card, sectionLabel } from "./styles";

interface SettingsSectionCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export default function SettingsSectionCard({ icon, title, children }: SettingsSectionCardProps) {
  return (
    <div className={`${card} p-6`}>
      <div className="mb-5 flex items-center gap-2 pb-4 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
        {icon}
        <h2 className="text-[1.75rem] font-semibold leading-none text-[#171717]" style={{ fontSize: "1.125rem" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}