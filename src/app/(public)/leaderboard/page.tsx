'use client';

import { useState } from 'react';
import { useLeaderboard, LeaderboardProvider } from '@/components/Leaderboard/Leaderboard';
import SearchBar from '@/components/shared/SearchBar';
import StatsCards from '@/components/ui/StatsCards';
import LeaderboardTable from '@/components/shared/LeaderboardTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


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

     
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-155 mb-2">
          <div className="flex justify-baseline gap-5 items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Global Leaderboard</h2>
            <p className="text-sm text-gray-500">update daily</p>
          </div>
          
        <div className="flex justify-start gap-4 items-center mb-2">
           {/* Reputation - Click to filter */}
          <div>
              <button
                onClick={() => {
                  // Toggle reputation filter
                  setBadgeFilter(filters.badge === 'reputation' ? null : 'reputation');
                }}
                className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  filters.badge === 'reputation'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filters.badge === 'reputation' ? '✓ Reputation' : 'Reputation'}
              </button>
          </div>

            {/* Accepted - Click to filter */}
          <div>
            <button
              onClick={() => {
                // Toggle accepted filter
                setBadgeFilter(filters.badge === 'accepted' ? null : 'accepted');
              }}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filters.badge === 'accepted'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filters.badge === 'accepted' ? '✓ Accepted' : 'Accepted'}
            </button>
          </div>

            {/* Critical - Click to filter */}
          <div>
            <button
              onClick={() => {
                // Toggle critical filter
                setBadgeFilter(filters.badge === 'critical' ? null : 'critical');
              }}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filters.badge === 'critical'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filters.badge === 'critical' ? '✓ Critical' : 'Critical'}
            </button>
          </div>

        </div>
        </div>
        <div className="md:col-span-2">
          <SearchBar
            value={localSearch}
            onChange={handleSearch}
            placeholder="Search researchers ..."
              />
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