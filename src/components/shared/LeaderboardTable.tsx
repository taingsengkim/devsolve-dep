'use client';

import { Researcher } from '@/lib/types/leaderboard/types';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard } from '@/components/Leaderboard/Leaderboard';

interface LeaderboardTableProps {
  researchers: Researcher[];
  loading?: boolean;
}

export default function LeaderboardTable({ researchers, loading }: LeaderboardTableProps) {
  const { selectResearcher } = useLeaderboard();

  if (loading) {
    return (
      <div className="p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse flex items-center py-4 border-b">
            <div className="h-6 w-10 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 rounded ml-4"></div>
            <div className="h-6 w-12 bg-gray-200 rounded ml-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (researchers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No researchers found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Researcher
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reputation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accepted
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Critical
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {researchers.map((researcher) => (
            <tr 
              key={researcher.id} 
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => selectResearcher(researcher)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="secondary" className="font-mono">
                  #{researcher.rank}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">{researcher.name}</div>
                  <div className="text-sm text-gray-500">@{researcher.handle}</div>
                  {researcher.country && (
                    <div className="text-xs text-gray-400">{researcher.country}</div>
                  )}
                  {researcher.badges && researcher.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {researcher.badges.map((badge, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-green-600">
                  {researcher.reputationDisplay}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                {researcher.accepted}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={researcher.critical > 0 ? 'destructive' : 'secondary'}>
                  {researcher.critical}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}