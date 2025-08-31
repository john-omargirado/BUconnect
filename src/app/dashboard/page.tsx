"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BookOpen,
  HelpCircle,
  Users,
  Star,
  TrendingUp,
  Search,
  Filter,
  Heart,
  Award,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Navigation from "@/components/Navigation";
import RewardEffects from "@/components/RewardEffects";
import { useUserRewards } from "@/hooks/useUserRewards";

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  user: {
    id: string;
    name: string;
    trustScore: number;
    image?: string;
  };
  createdAt: string;
}

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  user: {
    id: string;
    name: string;
    trustScore: number;
    image?: string;
  };
  createdAt: string;
}

const categories = ["ACADEMICS", "DESIGN", "TECH", "WRITING", "TUTORING", "CREATIVE", "RESEARCH", "OTHER"];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("skills");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [userThemes, setUserThemes] = useState<Record<string, any>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Get user rewards for card theming
  const { getActiveReward } = useUserRewards();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSkills();
      fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);

        // Get user themes for all skill owners
        const userIds = [...new Set(data.map((skill: Skill) => skill.user.id))];
        if (userIds.length > 0) {
          await fetchUserThemes(userIds as string[]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);

        // Get user themes for all request owners
        const userIds = [...new Set(data.map((request: Request) => request.user.id))];
        if (userIds.length > 0) {
          await fetchUserThemes(userIds as string[]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
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
        setUserThemes(prev => ({ ...prev, ...data.userThemes }));
      }
    } catch (error) {
      console.error("Error fetching user themes:", error);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const currentData = activeTab === "skills" ? filteredSkills : filteredRequests;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  // Reset pagination when filters or tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, activeTab, itemsPerPage]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-transparent border-t-primary"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Get active card theme reward
  const activeCardTheme = getActiveReward('CARD_THEME');

  const statCards = [
    {
      title: "Available Skills",
      value: skills.length,
      icon: BookOpen,
      color: "bg-blue-500",
      iconColor: "text-white",
      change: "+15%"
    },
    {
      title: "Help Requests",
      value: requests.length,
      icon: HelpCircle,
      color: "bg-orange-500",
      iconColor: "text-white",
      change: "+12%"
    },
    {
      title: "Active Members",
      value: "2,847",
      icon: Users,
      color: "bg-green-500",
      iconColor: "text-white",
      change: "+23%"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground shadow-2xl border-0 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-4xl font-bold mb-3"
                  >
                    Welcome back, {session.user?.name?.split(' ')[0]}! 👋
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-primary-foreground/90 mb-6 max-w-2xl"
                  >
                    Ready to collaborate? Discover new skills, share your expertise, or find help from fellow BU students.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  >
                    <Button
                      asChild
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border-0"
                    >
                      <Link href="/skills/offer">
                        <Plus className="w-4 h-4 mr-2" />
                        Offer Skill
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="bg-primary-foreground/20 hover:bg-primary-foreground/30 backdrop-blur-sm text-primary-foreground border-primary-foreground/20"
                    >
                      <Link href="/requests/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Request Help
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Achievement Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="bg-primary-foreground/20 backdrop-blur-sm rounded-2xl p-6 text-center"
                >
                  <Award className="w-8 h-8 text-yellow-300 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">Rising Star</p>
                  <p className="text-xs text-primary-foreground/80">Level 2 Collaborator</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills and Requests Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="border-b border-border/50">
              <nav className="flex justify-between items-center px-6">
                <div className="flex space-x-8">
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveTab("skills")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "skills"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Available Skills
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveTab("requests")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "requests"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Help Requests
                  </motion.button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Link href="/skills">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Browse Skills
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Link href="/requests">
                      <HelpCircle className="w-4 h-4 mr-1" />
                      View Requests
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>

            {/* Search and Filter */}
            <div className="p-6 border-b border-border/50">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search skills or requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-background text-foreground"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "skills" && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse p-6 bg-muted/50 rounded-lg">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                          <div className="h-8 bg-muted rounded w-20"></div>
                        </div>
                      ))
                    ) : filteredSkills.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No skills found</h3>
                        <p className="text-muted-foreground/70 mb-6">Try adjusting your search or filters</p>
                        <Button asChild>
                          <Link href="/skills/offer">
                            <Plus className="w-4 h-4 mr-2" />
                            Offer the first skill
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      (paginatedData as Skill[]).map((skill, index) => {
                        // Get the card owner's active theme and profile data
                        const ownerTheme = userThemes[skill.user.id]?.cardTheme;
                        const ownerProfile = userThemes[skill.user.id];

                        return (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                          >
                            <RewardEffects
                              rewardType="card"
                              cardTheme={ownerTheme}
                              className="p-6 bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
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
                                      <Image
                                        src={ownerProfile?.image || skill.user.image}
                                        alt={skill.user.name}
                                        width={48}
                                        height={48}
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
                                    <span className="text-xs font-medium">{skill.user.trustScore}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="flex justify-between items-start mb-3">
                                <h3 className={`font-semibold line-clamp-1 ${ownerTheme ? 'text-white' : 'text-foreground'
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
                                  {skill.category}
                                </Badge>
                              </div>
                              <p className={`text-sm mb-4 line-clamp-2 ${ownerTheme ? 'text-white/80' : 'text-muted-foreground'
                                }`}>
                                {skill.description}
                              </p>
                              <div className="flex items-center justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={ownerTheme
                                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white'
                                    : ''
                                  }
                                  onClick={() => router.push(`/connections?userId=${skill.user.id}`)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
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

                {activeTab === "requests" && (
                  <motion.div
                    key="requests"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse p-6 bg-muted/50 rounded-lg">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                          <div className="h-8 bg-muted rounded w-20"></div>
                        </div>
                      ))
                    ) : filteredRequests.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No requests found</h3>
                        <p className="text-muted-foreground/70 mb-6">Try adjusting your search or filters</p>
                        <Button asChild>
                          <Link href="/requests/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Create the first request
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      (paginatedData as Request[]).map((request, index) => {
                        // Get the card owner's active theme and profile data
                        const ownerTheme = userThemes[request.user.id]?.cardTheme;
                        const ownerProfile = userThemes[request.user.id];

                        return (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                          >
                            <RewardEffects
                              rewardType="card"
                              cardTheme={ownerTheme}
                              className="p-6 bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {/* Profile Section */}
                              <div className="flex items-center mb-4">
                                <div className="relative">
                                  <RewardEffects
                                    rewardType="profile"
                                    profileBorder={ownerProfile?.profileBorder}
                                    className="w-12 h-12 rounded-full overflow-hidden"
                                  >
                                    {ownerProfile?.image || request.user.image ? (
                                      <Image
                                        src={ownerProfile?.image || request.user.image}
                                        alt={request.user.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold text-lg">
                                        {request.user.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </RewardEffects>
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className={`font-semibold text-sm ${ownerTheme ? 'text-white' : 'text-foreground'
                                      }`}>
                                      {request.user.name}
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
                                    <span className="text-xs font-medium">{request.user.trustScore}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="flex justify-between items-start mb-3">
                                <h3 className={`font-semibold line-clamp-1 ${ownerTheme ? 'text-white' : 'text-foreground'
                                  }`}>
                                  {request.title}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={`ml-2 ${ownerTheme
                                      ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                      : ''
                                    }`}
                                >
                                  {request.category}
                                </Badge>
                              </div>
                              <p className={`text-sm mb-4 line-clamp-2 ${ownerTheme ? 'text-white/80' : 'text-muted-foreground'
                                }`}>
                                {request.description}
                              </p>
                              <div className="flex items-center justify-end">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={ownerTheme
                                      ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white'
                                      : 'text-muted-foreground hover:text-primary'
                                    }
                                    onClick={() => router.push(`/connections?userId=${request.user.id}`)}
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Connect
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={ownerTheme
                                      ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white hover:border-white/40'
                                      : 'bg-gradient-to-r from-secondary to-secondary/80'
                                    }
                                  >
                                    <Heart className="w-4 h-4 mr-1" />
                                    Help
                                  </Button>
                                </div>
                              </div>
                            </RewardEffects>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination Controls */}
              {currentData.length > 0 && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-border/50 gap-4"
                >
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>
                      Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)} of {currentData.length} {activeTab}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>Show:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1); // Reset to first page when changing items per page
                        }}
                        className="px-3 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-background text-foreground"
                      >
                        <option value={6}>6 per page</option>
                        <option value={12}>12 per page</option>
                        <option value={18}>18 per page</option>
                        <option value={24}>24 per page</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current page
                        const showPage = page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        const showEllipsis = (page === 2 && currentPage > 4) ||
                          (page === totalPages - 1 && currentPage < totalPages - 3);

                        if (showEllipsis) {
                          return <span key={page} className="px-2 text-muted-foreground">...</span>;
                        }

                        if (!showPage) return null;

                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "primary" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[2.5rem]"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
