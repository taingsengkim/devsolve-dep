'use client';

import { Card, CardContent } from './card';
import { LeaderboardStats } from '@/lib/types/leaderboard/types';

interface StatsCardsProps {
  stats: LeaderboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Active Researchers',
      value: stats.totalResearchers.toLocaleString(),
      icon: '👥',
    },
    {
      title: 'Valid Reports',
      value: stats.totalReports.toLocaleString(),
      icon: '📊',
    },
    {
      title: 'Programs Live',
      value: stats.totalPrograms.toLocaleString(),
      icon: '🎯',
    },
    {
      title: 'Top Researcher',
      value: stats.topResearcher,
      icon: '🏆',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.title} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
              <div className="text-3xl">{item.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}