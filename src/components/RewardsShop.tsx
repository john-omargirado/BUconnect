"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Coins,
  Crown,
  Sparkles,
  ShoppingCart,
  Check,
  Lock,
  Palette,
  Award,
  Zap,
  Type
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RewardItem {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  config: string;
  owned: boolean;
  canAfford: boolean;
}

interface RewardCategory {
  id: string;
  name: string;
  description: string;
}

interface RewardsShopProps {
  onPurchase?: (item: RewardItem) => Promise<void>;
}

const categoryIcons = {
  PROFILE_BORDER: Palette,
  CARD_THEME: Sparkles,
  BADGE: Award,
  SPECIAL_EFFECT: Zap,
  TITLE: Type
};

const rarityColors = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
  mythic: "bg-red-500"
};

export default function RewardsShop({ onPurchase }: RewardsShopProps) {
  const [items, setItems] = useState<RewardItem[]>([]);
  const [categories, setCategories] = useState<RewardCategory[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/rewards");
      const data = await response.json();

      if (response.ok) {
        setItems(data.items || []);
        setCategories(data.categories || []);
        setUserBalance(data.userBalance || 0);
      } else {
        console.error("Failed to fetch rewards:", data.error);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item: RewardItem) => {
    if (purchasing || item.owned || !item.canAfford) return;

    try {
      setPurchasing(item.id);

      const response = await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setItems(prev => prev.map(i =>
          i.id === item.id
            ? { ...i, owned: true, canAfford: false }
            : { ...i, canAfford: data.newBalance >= i.price }
        ));
        setUserBalance(data.newBalance);

        // Call parent callback if provided
        if (onPurchase) {
          await onPurchase(item);
        }
      } else {
        console.error("Purchase failed:", data.error);
        alert(data.error || "Purchase failed. Please try again.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  const filteredItems = selectedCategory === "ALL"
    ? items
    : items.filter(item => item.type === selectedCategory);

  const getRarityFromConfig = (config: string) => {
    try {
      const parsed = JSON.parse(config);
      return parsed.rarity || "common";
    } catch {
      return "common";
    }
  };

  const getPreviewStyle = (item: RewardItem) => {
    try {
      const config = JSON.parse(item.config);

      if (item.type === "PROFILE_BORDER") {
        return {
          border: `${config.borderWidth} ${config.borderStyle} ${config.borderColor}`,
          boxShadow: config.glowEffect ? `0 0 10px ${config.borderColor}` : "none"
        };
      } else if (item.type === "CARD_THEME") {
        return {
          background: config.background,
          color: config.textColor
        };
      }

      return {};
    } catch {
      return {};
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Gift className="w-6 h-6 text-blue-500" />
            Rewards Shop
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize your profile with exclusive rewards
          </p>
        </div>
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-lg">{userBalance}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Connect Tokens</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "ALL" ? "primary" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("ALL")}
        >
          All Items
        </Button>
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Gift;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item, index) => {
            const rarity = getRarityFromConfig(item.config);
            const previewStyle = getPreviewStyle(item);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.owned ? "ring-2 ring-green-500" : ""
                  }`}>
                  {item.owned && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="success">
                        <Check className="w-3 h-3 mr-1" />
                        Owned
                      </Badge>
                    </div>
                  )}

                  {item.type === "BADGE" && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-3 h-3 rounded-full ${rarityColors[rarity as keyof typeof rarityColors]}`} />
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    {/* Preview */}
                    <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      {item.type === "PROFILE_BORDER" && (
                        <div
                          className="w-16 h-16 rounded-full mx-auto"
                          style={previewStyle}
                        >
                          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Crown className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                      )}

                      {item.type === "CARD_THEME" && (
                        <div
                          className="w-full h-20 rounded-lg flex items-center justify-center text-sm font-medium"
                          style={previewStyle}
                        >
                          Card Preview
                        </div>
                      )}

                      {item.type === "BADGE" && (
                        <div className="flex items-center justify-center">
                          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${rarityColors[rarity as keyof typeof rarityColors]}`}>
                            <Award className="w-4 h-4 inline mr-1" />
                            {JSON.parse(item.config).title}
                          </div>
                        </div>
                      )}

                      {(item.type === "SPECIAL_EFFECT" || item.type === "TITLE") && (
                        <div className="flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-purple-500" />
                        </div>
                      )}
                    </div>

                    {/* Price and Purchase */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{item.price}</span>
                      </div>

                      <Button
                        size="sm"
                        variant={item.owned ? "outline" : "primary"}
                        disabled={item.owned || !item.canAfford || purchasing === item.id}
                        onClick={() => handlePurchase(item)}
                      >
                        {purchasing === item.id ? (
                          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : item.owned ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Owned
                          </>
                        ) : !item.canAfford ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Insufficient Tokens
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Purchase
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try selecting a different category or check back later for new items.
          </p>
        </div>
      )}
    </div>
  );
}
