'use client';

import { useState } from 'react';
import { useLeaderboard, LeaderboardProvider } from '@/components/Leaderboard/Leaderboard';
import SearchBar from '@/components/shared/SearchBar';
import StatsCards from '@/components/ui/StatsCards';
import LeaderboardTable from '@/components/shared/LeaderboardTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function LeaderboardContent() {
  const {
    researchers,
    stats,
    loading,
    error,
    filters,
    page,
    total,
    limit,
    badges,
    countries,
    setSearchQuery,
    setBadgeFilter,
    setCountryFilter,
    setPage,
    clearFilters,
  } = useLeaderboard();

  const [localSearch, setLocalSearch] = useState(filters.search || '');
  
  const totalPages = Math.ceil(total / limit);

  const handleSearch = (query: string) => {
    setLocalSearch(query);
    setSearchQuery(query);
  };

  if (loading && researchers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && researchers.length === 0) {
    return (
      <div className="text-red-500 text-center py-8">
        <p className="text-lg font-semibold">Error loading leaderboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Updated daily • {total} researchers
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-gray-900">2841</p>
            <p className="text-sm text-gray-500">active Researchers</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-gray-900">2841</p>
            <p className="text-sm text-gray-500">active Researchers</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-gray-900">2841</p>
            <p className="text-sm text-gray-500">active Researchers</p>
          </div>
        </div>
      </div>

     

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="md:col-span-2">
          <SearchBar
            value={localSearch}
            onChange={handleSearch}
            placeholder="Search researchers by name, handle, or country..."
          />
        </div>
        <div>
          <Select
            value={filters.badge || ''}
            onValueChange={(value: string) => setBadgeFilter(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by badge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Badges</SelectItem>
              {badges.map((badge) => (
                <SelectItem key={badge} value={badge}>
                  {badge}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.country || ''}
            onValueChange={(value: string) => setCountryFilter(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-start mt-6">
        <StatsCards  stats={stats} />
      </div>
      
      <Card className="mt-6 overflow-hidden">
        <LeaderboardTable researchers={researchers} loading={loading} />
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <LeaderboardProvider>
      <LeaderboardContent />
    </LeaderboardProvider>
  );
}