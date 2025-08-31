"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Palette,
  Award,
  Sparkles,
  Type,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUserRewards } from "@/hooks/useUserRewards";
import RewardEffects from "@/components/RewardEffects";

const categoryIcons = {
  PROFILE_BORDER: Palette,
  CARD_THEME: Sparkles,
  BADGE: Award,
  SPECIAL_EFFECT: Sparkles,
  TITLE: Type
};

const categoryNames = {
  PROFILE_BORDER: "Profile Borders",
  CARD_THEME: "Card Themes",
  BADGE: "Badges",
  SPECIAL_EFFECT: "Special Effects",
  TITLE: "Profile Titles"
};

export default function MyRewards() {
  const {
    rewardsByType,
    activeSelections,
    loading,
    error,
    totalPurchases,
    activateReward,
    deactivateReward,
    getActiveReward,
    hasRewardType
  } = useUserRewards();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activating, setActivating] = useState<string | null>(null);

  const handleActivateReward = async (rewardId: string, rewardType: string) => {
    try {
      setActivating(rewardId);
      await activateReward(rewardId, rewardType);
    } catch (error) {
      console.error("Failed to activate reward:", error);
      alert("Failed to activate reward. Please try again.");
    } finally {
      setActivating(null);
    }
  };

  const handleDeactivateReward = async (rewardType: string) => {
    try {
      setActivating(`deactivate_${rewardType}`);
      await deactivateReward(rewardType);
    } catch (error) {
      console.error("Failed to deactivate reward:", error);
      alert("Failed to deactivate reward. Please try again.");
    } finally {
      setActivating(null);
    }
  };

  const getFilteredRewards = (): [string, any[]][] => {
    if (selectedCategory === "ALL") {
      return Object.entries(rewardsByType).filter(([_, rewards]) => rewards.length > 0);
    }

    const categoryRewards = rewardsByType[selectedCategory];
    return categoryRewards && categoryRewards.length > 0
      ? [[selectedCategory, categoryRewards]]
      : [];
  };

  const isActive = (rewardId: string, rewardType: string) => {
    const activeReward = getActiveReward(rewardType);
    return activeReward?.id === rewardId;
  };

  const getPreviewStyle = (reward: any) => {
    const config = reward.config || {};

    if (reward.type === "PROFILE_BORDER") {
      // Check if this is a gradient border
      if (config.borderColor?.includes('linear-gradient')) {
        return {
          background: config.borderColor,
          padding: config.borderWidth || "2px",
          borderRadius: "50%",
          boxShadow: config.glowEffect ? "0 0 10px rgba(255, 255, 255, 0.5)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        };
      } else {
        return {
          border: `${config.borderWidth || "2px"} ${config.borderStyle || "solid"} ${config.borderColor || "#ccc"}`,
          boxShadow: config.glowEffect ? `0 0 10px ${config.borderColor || "#ccc"}` : "none"
        };
      }
    } else if (reward.type === "CARD_THEME") {
      return {
        background: config.background || "#f3f4f6",
        color: config.textColor || "#111827"
      };
    }

    return {};
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Error Loading Rewards
        </h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const availableCategories = Object.keys(rewardsByType).filter(type =>
    rewardsByType[type] && rewardsByType[type].length > 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            My Rewards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and activate your purchased customizations
          </p>
        </div>
        <Badge variant="primary">
          {totalPurchases} Reward{totalPurchases !== 1 ? 's' : ''} Owned
        </Badge>
      </div>

      {totalPurchases === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Rewards Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Visit the Rewards Shop to purchase customizations for your profile and cards.
          </p>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "ALL" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("ALL")}
            >
              All Categories
            </Button>
            {availableCategories.map((category) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {categoryNames[category as keyof typeof categoryNames]}
                </Button>
              );
            })}
          </div>

          {/* Rewards by Category */}
          <div className="space-y-8">
            {getFilteredRewards().map(([categoryType, rewards]) => {
              const IconComponent = categoryIcons[categoryType as keyof typeof categoryIcons];
              const categoryName = categoryNames[categoryType as keyof typeof categoryNames];

              return (
                <motion.div
                  key={categoryType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-blue-500" />
                    {categoryName}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rewards.map((reward: any) => {
                      const active = isActive(reward.id, reward.type);
                      const previewStyle = getPreviewStyle(reward);

                      return (
                        <motion.div
                          key={reward.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative"
                        >
                          <Card className={`transition-all duration-300 hover:shadow-lg ${active ? "ring-2 ring-green-500 ring-offset-2 ring-offset-background" : ""
                            }`}>
                            {active && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <Badge variant="success" className="shadow-sm">
                                  <Check className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              </div>
                            )}

                            <CardHeader className="pb-4">
                              <CardTitle className="text-base">{reward.name}</CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {reward.description}
                              </p>
                            </CardHeader>

                            <CardContent>
                              {/* Preview */}
                              <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                {reward.type === "PROFILE_BORDER" && (
                                  (() => {
                                    const config = reward.config || {};
                                    const isGradient = config.borderColor?.includes('linear-gradient');

                                    if (isGradient) {
                                      return (
                                        <div
                                          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                                          style={previewStyle}
                                        >
                                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-gray-500" />
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div
                                          className="w-16 h-16 rounded-full mx-auto"
                                          style={previewStyle}
                                        >
                                          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-gray-500" />
                                          </div>
                                        </div>
                                      );
                                    }
                                  })()
                                )}

                                {reward.type === "CARD_THEME" && (
                                  <RewardEffects
                                    rewardType="card"
                                    cardTheme={reward.config}
                                  >
                                    <div className="w-full h-20 rounded-lg flex items-center justify-center text-sm font-medium p-4">
                                      Card Preview
                                    </div>
                                  </RewardEffects>
                                )}

                                {reward.type === "BADGE" && (
                                  <div className="flex items-center justify-center">
                                    <div
                                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                                      style={{ backgroundColor: reward.config.color || "#6b7280" }}
                                    >
                                      <Award className="w-4 h-4 inline mr-1" />
                                      {reward.config.title || reward.name}
                                    </div>
                                  </div>
                                )}

                                {(reward.type === "SPECIAL_EFFECT" || reward.type === "TITLE") && (
                                  <RewardEffects
                                    rewardType="container"
                                    specialEffect={reward.type === "SPECIAL_EFFECT" ? reward.config : undefined}
                                    title={reward.type === "TITLE" ? reward.config : undefined}
                                  >
                                    <div className="flex items-center justify-center py-4">
                                      <Sparkles className="w-8 h-8 text-purple-500" />
                                    </div>
                                  </RewardEffects>
                                )}
                              </div>

                              {/* Activation Button */}
                              <div className="flex gap-2">
                                {active ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeactivateReward(reward.type)}
                                    disabled={activating === `deactivate_${reward.type}`}
                                    className="flex-1"
                                  >
                                    {activating === `deactivate_${reward.type}` ? (
                                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                      <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Deactivate
                                      </>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleActivateReward(reward.id, reward.type)}
                                    disabled={activating === reward.id}
                                    className="flex-1"
                                  >
                                    {activating === reward.id ? (
                                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
