"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";

interface RewardConfig {
  [key: string]: any;
}

interface UserReward {
  id: string;
  name: string;
  description: string;
  type: string;
  config: RewardConfig;
  purchasedAt: string;
}

interface RewardsByType {
  [key: string]: UserReward[];
}

interface ActiveSelections {
  profileBorder: string | null;
  cardTheme: string | null;
  badge: string | null;
  specialEffect: string | null;
  title: string | null;
}

interface UseUserRewardsReturn {
  purchasedRewards: UserReward[];
  rewardsByType: RewardsByType;
  activeSelections: ActiveSelections;
  loading: boolean;
  error: string | null;
  totalPurchases: number;
  activateReward: (rewardId: string, rewardType: string) => Promise<void>;
  deactivateReward: (rewardType: string) => Promise<void>;
  refreshRewards: () => Promise<void>;
  getActiveReward: (type: string) => UserReward | null;
  hasRewardType: (type: string) => boolean;
}

export const useUserRewards = (): UseUserRewardsReturn => {
  const [purchasedRewards, setPurchasedRewards] = useState<UserReward[]>([]);
  const [rewardsByType, setRewardsByType] = useState<RewardsByType>({});
  const [activeSelections, setActiveSelections] = useState<ActiveSelections>({
    profileBorder: null,
    cardTheme: null,
    badge: null,
    specialEffect: null,
    title: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/rewards");
      const data = await response.json();

      if (response.ok) {
        setPurchasedRewards(data.purchasedRewards || []);
        setRewardsByType(data.rewardsByType || {});
        setActiveSelections(data.activeSelections || {
          profileBorder: null,
          cardTheme: null,
          badge: null,
          specialEffect: null,
          title: null
        });
        setTotalPurchases(data.totalPurchases || 0);
      } else {
        setError(data.error || "Failed to fetch rewards");
      }
    } catch (err) {
      console.error("Error fetching user rewards:", err);
      setError("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const activateReward = async (rewardId: string, rewardType: string) => {
    try {
      const response = await fetch("/api/user/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "activate",
          rewardId,
          rewardType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        const typeKey = getTypeKey(rewardType);
        if (typeKey) {
          setActiveSelections(prev => ({
            ...prev,
            [typeKey]: rewardId
          }));
        }
      } else {
        throw new Error(data.error || "Failed to activate reward");
      }
    } catch (err) {
      console.error("Error activating reward:", err);
      throw err;
    }
  };

  const deactivateReward = async (rewardType: string) => {
    try {
      const response = await fetch("/api/user/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deactivate",
          rewardType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        const typeKey = getTypeKey(rewardType);
        if (typeKey) {
          setActiveSelections(prev => ({
            ...prev,
            [typeKey]: null
          }));
        }
      } else {
        throw new Error(data.error || "Failed to deactivate reward");
      }
    } catch (err) {
      console.error("Error deactivating reward:", err);
      throw err;
    }
  };

  const getActiveReward = (type: string): UserReward | null => {
    const typeKey = getTypeKey(type);
    if (!typeKey || !activeSelections[typeKey as keyof ActiveSelections]) {
      return null;
    }

    const activeId = activeSelections[typeKey as keyof ActiveSelections];
    const typeRewards = rewardsByType[type] || [];

    return typeRewards.find(reward => reward.id === activeId) || null;
  };

  const hasRewardType = (type: string): boolean => {
    return (rewardsByType[type] || []).length > 0;
  };

  const refreshRewards = fetchRewards;

  return {
    purchasedRewards,
    rewardsByType,
    activeSelections,
    loading,
    error,
    totalPurchases,
    activateReward,
    deactivateReward,
    refreshRewards,
    getActiveReward,
    hasRewardType,
  };
}

// Helper function to map reward types to state keys
function getTypeKey(rewardType: string): keyof ActiveSelections | null {
  const mapping: { [key: string]: keyof ActiveSelections } = {
    'PROFILE_BORDER': 'profileBorder',
    'CARD_THEME': 'cardTheme',
    'BADGE': 'badge',
    'SPECIAL_EFFECT': 'specialEffect',
    'TITLE': 'title'
  };

  return mapping[rewardType] || null;
}
