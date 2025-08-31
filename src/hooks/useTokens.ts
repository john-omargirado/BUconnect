"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';

export interface TokenStats {
  balance: number;
  weeklyRating: number;
  totalRating: number;
  completedServices: number;
  user: {
    id: string;
    name: string;
    email: string;
    trustScore: number;
  };
}

export interface TokenTransaction {
  id: string;
  amount: number;
  type: 'EARNED' | 'SPENT' | 'BONUS' | 'PENALTY';
  description: string;
  createdAt: string;
}

export function useTokens() {
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tokens');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTokenStats(data);
    } catch (err) {
      console.error('Failed to fetch token stats:', err);
      setError('Failed to load token information');
    } finally {
      setIsLoading(false);
    }
  };

  const awardTokens = async (amount: number, description: string) => {
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to award tokens');
      }

      const result = await response.json();

      // Refresh token stats
      await fetchTokenStats();

      return result;
    } catch (err) {
      console.error('Failed to award tokens:', err);
      throw err;
    }
  };

  const completeService = async (matchId: string, rating?: number) => {
    try {
      const response = await fetch('/api/matches/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          status: 'COMPLETED',
          rating
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete service');
      }

      const result = await response.json();

      // Refresh token stats
      await fetchTokenStats();

      return result;
    } catch (err) {
      console.error('Failed to complete service:', err);
      throw err;
    }
  };

  const updateMatchStatus = async (matchId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/matches/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update match status');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Failed to update match status:', err);
      throw err;
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchTokenStats();

    const interval = setInterval(fetchTokenStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    tokenStats,
    transactions,
    isLoading,
    error,
    fetchTokenStats,
    awardTokens,
    completeService,
    updateMatchStatus
  };
}
