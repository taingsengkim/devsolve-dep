import { baseApi } from './baseApi';
import {
  Researcher,
  LeaderboardStats,
  LeaderboardFilters,
  LeaderboardResponse,
} from '@/lib/types/leaderboard/types';
import {
  mockResearchers,
  mockLeaderboardStats,
  mockBadges,
  mockCountries,
} from '@/lib/types/leaderboard/mock-data';

class LeaderboardApiService {
  private useMockData = process.env.NODE_ENV === 'development';
  private mockResearchers = [...mockResearchers];

  async getLeaderboard(
    filters?: LeaderboardFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<LeaderboardResponse> {
    if (this.useMockData) {
      await this.simulateDelay(500);
      
      let filtered = [...this.mockResearchers];

      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.name.toLowerCase().includes(searchLower) ||
              r.handle.toLowerCase().includes(searchLower) ||
              r.country?.toLowerCase().includes(searchLower)
          );
        }

        if (filters.badge) {
          filtered = filtered.filter((r) => r.badges.includes(filters.badge!));
        }

        if (filters.country) {
          filtered = filtered.filter((r) => r.country === filters.country);
        }

        if (filters.minReputation !== null) {
          filtered = filtered.filter((r) => r.reputation >= filters.minReputation!);
        }

        if (filters.maxReputation !== null) {
          filtered = filtered.filter((r) => r.reputation <= filters.maxReputation!);
        }
      }

      filtered.sort((a, b) => a.rank - b.rank);

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);

      return {
        researchers: paginated,
        stats: mockLeaderboardStats,
        total: filtered.length,
        page,
        limit,
      };
    }

    try {
      // Since we can't easily use the hook in a class, we'll use fetch directly
      const params = new URLSearchParams();
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.badge) params.append('badge', filters.badge);
        if (filters.country) params.append('country', filters.country);
        if (filters.minReputation !== null) params.append('minReputation', String(filters.minReputation));
        if (filters.maxReputation !== null) params.append('maxReputation', String(filters.maxReputation));
      }
      params.append('page', String(page));
      params.append('limit', String(limit));

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          // Auth headers will be added by the baseApi prepareHeaders
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock data due to API error');
      return this.getLeaderboard(filters, page, limit);
    }
  }

  async getLeaderboardStats(): Promise<LeaderboardStats> {
    if (this.useMockData) {
      await this.simulateDelay(300);
      return mockLeaderboardStats;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock stats due to API error');
      return mockLeaderboardStats;
    }
  }

  async getResearcherById(id: string): Promise<Researcher | null> {
    if (this.useMockData) {
      await this.simulateDelay(300);
      return this.mockResearchers.find((r) => r.id === id) || null;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/researcher/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock researcher due to API error');
      return this.mockResearchers.find((r) => r.id === id) || null;
    }
  }

  async searchResearchers(query: string): Promise<Researcher[]> {
    if (this.useMockData) {
      await this.simulateDelay(400);
      const searchLower = query.toLowerCase();
      return this.mockResearchers.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.handle.toLowerCase().includes(searchLower) ||
          r.country?.toLowerCase().includes(searchLower) ||
          r.bio?.toLowerCase().includes(searchLower)
      );
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock search results due to API error');
      const searchLower = query.toLowerCase();
      return this.mockResearchers.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.handle.toLowerCase().includes(searchLower)
      );
    }
  }

  async getTopResearchers(limit: number = 10): Promise<Researcher[]> {
    if (this.useMockData) {
      await this.simulateDelay(300);
      return this.mockResearchers.slice(0, limit);
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/top?limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock top researchers due to API error');
      return this.mockResearchers.slice(0, limit);
    }
  }

  async getResearchersByBadge(badge: string): Promise<Researcher[]> {
    if (this.useMockData) {
      await this.simulateDelay(300);
      return this.mockResearchers.filter((r) => r.badges.includes(badge));
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/badge?badge=${encodeURIComponent(badge)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock badge results due to API error');
      return this.mockResearchers.filter((r) => r.badges.includes(badge));
    }
  }

  async getBadges(): Promise<string[]> {
    if (this.useMockData) {
      await this.simulateDelay(200);
      return mockBadges;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/badges`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock badges due to API error');
      return mockBadges;
    }
  }

  async getCountries(): Promise<string[]> {
    if (this.useMockData) {
      await this.simulateDelay(200);
      return mockCountries;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/leaderboard/countries`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Using mock countries due to API error');
      return mockCountries;
    }
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const leaderboardApi = new LeaderboardApiService();
export default leaderboardApi;