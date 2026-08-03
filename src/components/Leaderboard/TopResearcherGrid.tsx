
import { Researcher } from "@/lib/types/leaderboard/types";
import TopResearcherCard from "./TopResearcherCard";

interface TopResearcherGridProps {
  researchers: Researcher[];
}

export default function TopResearcherGrid({ researchers }: TopResearcherGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {researchers.map((researcher) => (
        <TopResearcherCard key={researcher.id} researcher={researcher} />
      ))}
    </div>
  );
}
