'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { leaderboardApi } from '@/lib/redux/services/leaderboardApi';
import {
  Researcher,
  LeaderboardStats,
  LeaderboardFilters,
} from '@/lib/types/leaderboard/types';

interface LeaderboardContextType {
  researchers: Researcher[];
  stats: LeaderboardStats | null;
  selectedResearcher: Researcher | null;
  loading: boolean;
  error: string | null;
  filters: LeaderboardFilters;
  page: number;
  total: number;
  limit: number;
  badges: string[];
  countries: string[];
  setSearchQuery: (query: string) => void;
  setBadgeFilter: (badge: string | null) => void;
  setCountryFilter: (country: string | null) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
  selectResearcher: (researcher: Researcher | null) => void;
  refresh: () => Promise<void>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    search: '',
    badge: null,
    country: null,
    minReputation: null,
    maxReputation: null,
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [badges, setBadges] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  const fetchLeaderboard = useCallback(async (
    newPage?: number,
    newFilters?: Partial<LeaderboardFilters>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentPage = newPage ?? page;
      const currentFilters = { ...filters, ...newFilters };
      
      const response = await leaderboardApi.getLeaderboard(
        currentFilters,
        currentPage,
        limit
      );
      
      setResearchers(response.researchers);
      setTotal(response.total);
      setPage(response.page);
      
      if (response.stats) {
        setStats(response.stats);
      }
      
      if (newFilters) {
        setFilters(currentFilters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [page, filters, limit]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await leaderboardApi.getLeaderboardStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  const searchResearchers = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await leaderboardApi.searchResearchers(query);
      setResearchers(results);
      setTotal(results.length);
      setPage(1);
      setFilters({ ...filters, search: query });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getResearcherById = useCallback(async (id: string): Promise<Researcher | null> => {
    try {
      const researcher = await leaderboardApi.getResearcherById(id);
      if (researcher) {
        setSelectedResearcher(researcher);
      }
      return researcher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch researcher');
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchLeaderboard(page);
    await fetchStats();
  }, [fetchLeaderboard, fetchStats, page]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters({ ...filters, search: query });
    setPage(1);
    fetchLeaderboard(1, { ...filters, search: query });
  }, [filters, fetchLeaderboard]);

  const setBadgeFilter = useCallback((badge: string | null) => {
    setFilters({ ...filters, badge });
    setPage(1);
    fetchLeaderboard(1, { ...filters, badge });
  }, [filters, fetchLeaderboard]);

  const setCountryFilter = useCallback((country: string | null) => {
    setFilters({ ...filters, country });
    setPage(1);
    fetchLeaderboard(1, { ...filters, country });
  }, [filters, fetchLeaderboard]);

  const clearFilters = useCallback(() => {
    const newFilters = {
      search: '',
      badge: null,
      country: null,
      minReputation: null,
      maxReputation: null,
    };
    setFilters(newFilters);
    setPage(1);
    fetchLeaderboard(1, newFilters);
  }, [fetchLeaderboard]);

  const selectResearcher = useCallback((researcher: Researcher | null) => {
    setSelectedResearcher(researcher);
  }, []);

  const setPageHandler = useCallback((newPage: number) => {
    setPage(newPage);
    fetchLeaderboard(newPage);
  }, [fetchLeaderboard]);

  // Load options (badges and countries)
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [badgesData, countriesData] = await Promise.all([
          leaderboardApi.getBadges(),
          leaderboardApi.getCountries(),
        ]);
        setBadges(badgesData);
        setCountries(countriesData);
      } catch (err) {
        console.error('Failed to load options:', err);
      }
    };
    loadOptions();
  }, []); 

  useEffect(() => {
    // Initial load
    const initialLoad = async () => {
      await Promise.all([
        fetchLeaderboard(),
        fetchStats(),
      ]);
    };
    initialLoad();
  }, [fetchLeaderboard, fetchStats]);


  const value: LeaderboardContextType = {
    researchers,
    stats,
    selectedResearcher,
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
    setPage: setPageHandler,
    clearFilters,
    selectResearcher,
    refresh,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
}