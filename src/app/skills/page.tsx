"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  BookOpen,
  Star,
  Clock,
  User,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Navigation from "@/components/Navigation";
import RewardEffects from "@/components/RewardEffects";
import { useUserRewards } from "@/hooks/useUserRewards";

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  contactInfo?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
    trustScore: number;
  };
}

const CATEGORIES = [
  "All Categories",
  "ACADEMICS",
  "TECH",
  "CREATIVE",
  "SPORTS",
  "LANGUAGE",
  "MUSIC",
  "OTHER"
];

const CATEGORY_COLORS = {
  ACADEMICS: "academics",
  TECH: "tech",
  CREATIVE: "creative",
  SPORTS: "success",
  LANGUAGE: "warning",
  MUSIC: "design",
  OTHER: "default"
};

export default function SkillsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);
  const [userThemes, setUserThemes] = useState<Record<string, any>>({});

  // Get user rewards for card theming
  const { getActiveReward } = useUserRewards();

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchSkills();
  }, [session, router]);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);

        // Fetch themes for all skill owners
        const userIds = [...new Set(data.map((skill: Skill) => skill.user.id))];
        await fetchUserThemes(userIds as string[]);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserThemes = async (userIds: string[]) => {
    try {
      const response = await fetch("/api/user-themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserThemes(data.userThemes || {});
      }
    } catch (error) {
      console.error("Error fetching user themes:", error);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All Categories" ||
      skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!session) {
    return null;
  }

  // Get active card theme reward
  const activeCardTheme = getActiveReward('CARD_THEME');

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/skills" />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Skills Marketplace
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover skills offered by fellow BU students
            </p>

            <Button
              onClick={() => router.push("/skills/offer")}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="w-5 h-5 mr-2" />
              Offer Your Skills
            </Button>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="shadow-md border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      leftIcon={<Search className="w-4 h-4" />}
                      placeholder="Search skills, tutors, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-background border border-input rounded-lg px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      >
                        {CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="animate-pulse"
                >
                  <Card className="h-64">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded w-20 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSkills.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No skills found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    onClick={() => router.push("/skills/offer")}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Be the first to offer a skill
                  </Button>
                </div>
              ) : (
                filteredSkills.map((skill, index) => {
                  // Get the card owner's active theme and profile data
                  const ownerTheme = userThemes[skill.user.id]?.cardTheme;
                  const ownerProfile = userThemes[skill.user.id];

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <RewardEffects
                        rewardType="card"
                        cardTheme={ownerTheme}
                        className="h-full p-6 bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {/* Profile Section */}
                        <div className="flex items-center mb-4">
                          <div className="relative">
                            <RewardEffects
                              rewardType="profile"
                              profileBorder={ownerProfile?.profileBorder}
                              className="w-12 h-12 rounded-full overflow-hidden"
                            >
                              {ownerProfile?.image || skill.user.image ? (
                                <img
                                  src={ownerProfile?.image || skill.user.image}
                                  alt={skill.user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
                                  {skill.user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </RewardEffects>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-semibold text-sm ${ownerTheme ? 'text-white' : 'text-foreground'
                                }`}>
                                {skill.user.name}
                              </h4>
                              {ownerProfile?.title && (
                                <span
                                  className="text-xs px-2 py-1 rounded-full font-medium"
                                  style={{
                                    color: ownerProfile.title.color || (ownerTheme ? '#fbbf24' : '#6b7280'),
                                    backgroundColor: ownerTheme ? 'rgba(255,255,255,0.1)' : 'rgba(107,114,128,0.1)',
                                    fontStyle: ownerProfile.title.style === 'italic' ? 'italic' : 'normal',
                                    fontWeight: ownerProfile.title.style === 'bold' ? 'bold' : 'normal'
                                  }}
                                >
                                  {ownerProfile.title.title}
                                </span>
                              )}
                            </div>
                            <div className={`flex items-center ${ownerTheme ? 'text-yellow-200' : 'text-yellow-500 dark:text-yellow-400'
                              }`}>
                              <Star className="w-3 h-3 fill-current mr-1" />
                              <span className="text-xs font-medium">{skill.user.trustScore.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className={`text-lg font-bold line-clamp-2 ${ownerTheme ? 'text-white' : 'text-foreground'
                            }`}>
                            {skill.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`ml-2 ${ownerTheme
                                ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                : ''
                              }`}
                          >
                            {skill.category.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className={`text-sm line-clamp-3 mb-4 ${ownerTheme ? 'text-white/80' : 'text-muted-foreground'
                          }`}>
                          {skill.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className={`flex items-center text-sm ${ownerTheme ? 'text-white/70' : 'text-muted-foreground'
                            }`}>
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatDate(skill.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`flex-1 ${ownerTheme
                              ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white'
                              : ''
                              }`}
                            onClick={() => router.push(`/connections?userId=${skill.user.id}`)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`flex-1 ${ownerTheme
                              ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white'
                              : ''
                              }`}
                            onClick={() => {
                              if (skill.contactInfo && typeof window !== 'undefined') {
                                if (skill.contactInfo.includes("@")) {
                                  window.location.href = `mailto:${skill.contactInfo}`;
                                } else {
                                  window.location.href = `tel:${skill.contactInfo}`;
                                }
                              }
                            }}
                          >
                            {skill.contactInfo?.includes("@") ? (
                              <Mail className="w-4 h-4 mr-1" />
                            ) : (
                              <Phone className="w-4 h-4 mr-1" />
                            )}
                            Connect
                          </Button>
                        </div>
                      </RewardEffects>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
