export type ProfileTabId = "overview" | "hacktivity" | "community" | "hall-of-thanks";

interface ProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
}

const TABS: { id: ProfileTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "hacktivity", label: "Hacktivity" },
  { id: "community", label: "Community" },
  { id: "hall-of-thanks", label: "Hall of Thanks" },
];

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex gap-6 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative whitespace-nowrap pb-3 pt-1 text-sm font-medium transition ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}