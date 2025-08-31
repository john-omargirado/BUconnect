"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  Trophy,
  Star,
  TrendingUp,
  Award,
  Gift,
  Users,
  Crown,
  Zap,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import RewardsShop from "@/components/RewardsShop";
import MyRewards from "@/components/MyRewards";

interface TokenStats {
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

interface LeaderboardUser {
  id: string;
  name: string;
  position: number;
  avgRating: number;
  servicesCompleted: number;
  connectTokens: number;
  isTopHundred: boolean;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  currentUser?: LeaderboardUser;
  totalParticipants: number;
  period: string;
}

export default function TokenDashboard() {
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchTokenStats();
    fetchLeaderboard();
  }, []);

  const fetchTokenStats = async () => {
    try {
      const response = await fetch("/api/tokens");
      const data = await response.json();
      setTokenStats(data);
    } catch (error) {
      console.error("Failed to fetch token stats:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard?period=weekly&limit=10");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadgeColor = (position: number) => {
    if (position <= 3) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (position <= 10) return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    if (position <= 25) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    if (position <= 50) return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    return "bg-gradient-to-r from-green-400 to-green-600 text-white";
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return <Crown className="w-4 h-4" />;
    if (position <= 3) return <Trophy className="w-4 h-4" />;
    if (position <= 10) return <Award className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Connect Tokens & Rewards
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Earn tokens by helping others, climb the leaderboard, and unlock exclusive rewards!
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Connect Tokens</p>
                <p className="text-3xl font-bold">{tokenStats?.balance || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                <Coins className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Weekly Rating</p>
                <p className="text-3xl font-bold">{tokenStats?.weeklyRating?.toFixed(1) || "0.0"}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Services Completed</p>
                <p className="text-3xl font-bold">{tokenStats?.completedServices || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Trust Score</p>
                <p className="text-3xl font-bold">{tokenStats?.user?.trustScore?.toFixed(1) || "0.0"}</p>
              </div>
              <div className="h-12 w-12 bg-purple-400/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        <Button
          variant={activeTab === "overview" ? "primary" : "outline"}
          onClick={() => setActiveTab("overview")}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === "leaderboard" ? "primary" : "outline"}
          onClick={() => setActiveTab("leaderboard")}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Weekly Leaderboard
        </Button>
        <Button
          variant={activeTab === "rewards" ? "primary" : "outline"}
          onClick={() => setActiveTab("rewards")}
        >
          <Gift className="w-4 h-4 mr-2" />
          Rewards Shop
        </Button>
        <Button
          variant={activeTab === "my-rewards" ? "primary" : "outline"}
          onClick={() => setActiveTab("my-rewards")}
        >
          <Award className="w-4 h-4 mr-2" />
          My Rewards
        </Button>
      </motion.div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <motion.div
          key="overview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8"
        >
          {/* Current Rank Card */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-500" />
                Your Current Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard?.currentUser ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRankBadgeColor(leaderboard.currentUser.position as number)}>
                        {getRankIcon(leaderboard.currentUser.position as number)}
                        <span className="ml-1">#{leaderboard.currentUser.position}</span>
                      </Badge>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {leaderboard.currentUser.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {leaderboard.currentUser.position > 100
                            ? "Keep helping to climb the leaderboard!"
                            : leaderboard.currentUser.isTopHundred
                              ? "Top 100 Contributor!"
                              : "Keep helping to climb!"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ⭐ {leaderboard.currentUser.avgRating.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {leaderboard.currentUser.servicesCompleted} services
                      </p>
                    </div>
                  </div>
                  {leaderboard.currentUser.isTopHundred && (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Congratulations! You're eligible for weekly token rewards!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete some services to join the leaderboard!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Earning Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Earning Token Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Star className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Provide Quality Help</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earn 10-50 tokens for each completed service based on ratings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Weekly Leaderboard</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Top 100 contributors get bonus tokens every week (25-100 tokens)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Consistent Activity</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Regular participation and high ratings boost your weekly position
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "leaderboard" && (
        <motion.div
          key="leaderboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Weekly Top Contributors
                </span>
                <Badge variant="primary">
                  {leaderboard?.totalParticipants || 0} Active Contributors
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard?.leaderboard?.slice(0, 10).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${user.position <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700"
                        : "bg-gray-50 dark:bg-gray-800/50"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={getRankBadgeColor(user.position)}>
                        {getRankIcon(user.position)}
                        <span className="ml-1">#{user.position}</span>
                      </Badge>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {user.avgRating.toFixed(1)} avg
                          </span>
                          <span>{user.servicesCompleted} services</span>
                          <span className="flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            {user.connectTokens} tokens
                          </span>
                        </div>
                      </div>
                    </div>
                    {user.position <= 3 && (
                      <div className="text-right">
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          🏆 Top Performer
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {leaderboard && leaderboard.leaderboard.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Contributors This Week
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Be the first to help others and claim the top spot!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "rewards" && (
        <motion.div
          key="rewards"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <RewardsShop onPurchase={async () => {
            // Refresh token stats after purchase
            await fetchTokenStats();
          }} />
        </motion.div>
      )}

      {activeTab === "my-rewards" && (
        <motion.div
          key="my-rewards"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <MyRewards />
        </motion.div>
      )}
    </div>
  );
}
