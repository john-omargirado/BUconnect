"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  Users,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Heart,
  Award,
  Target,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Navigation from "@/components/Navigation";

interface UserSkill {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  status: "ACTIVE" | "PAUSED" | "INACTIVE";
  viewCount?: number;
  connectionCount?: number;
}

interface UserRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  responseCount?: number;
  helpersConnected?: number;
}

interface Connection {
  id: string;
  type: "SKILL_OFFER" | "HELP_REQUEST";
  title: string;
  otherUser: {
    name: string;
    email: string;
    trustScore: number;
  };
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  lastActivity?: string;
}

interface UserStats {
  totalSkills: number;
  totalRequests: number;
  totalConnections: number;
  trustScore: number;
  completedHelps: number;
  receivedHelps: number;
}

export default function MyActivityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchUserActivity();
  }, [session, router]);

  const fetchUserActivity = async () => {
    setIsLoading(true);
    try {
      // Fetch user's skills
      const skillsRes = await fetch('/api/user/my-skills');
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData);
      }

      // Fetch user's requests
      const requestsRes = await fetch('/api/user/my-requests');
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData);
      }

      // Fetch user's connections
      const connectionsRes = await fetch('/api/user/my-connections');
      if (connectionsRes.ok) {
        const connectionsData = await connectionsRes.json();
        setConnections(connectionsData);
      }

      // Fetch user stats
      const statsRes = await fetch('/api/user/my-stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch user activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSkills(skills.filter(skill => skill.id !== skillId));
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRequests(requests.filter(request => request.id !== requestId));
      }
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "OPEN":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "IN_PROGRESS":
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "PAUSED":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "COMPLETED":
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "CANCELLED":
      case "CLOSED":
      case "INACTIVE":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPage="/my-activity" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-16 w-16 border-4 border-transparent border-t-primary"
            />
          </div>
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    {
      title: "Skills Offered",
      value: stats.totalSkills,
      icon: BookOpen,
      color: "bg-blue-500",
      borderColor: "border-blue-500/20",
      description: "Active skill offerings"
    },
    {
      title: "Help Requests",
      value: stats.totalRequests,
      icon: HelpCircle,
      color: "bg-orange-500",
      borderColor: "border-orange-500/20",
      description: "Help requests made"
    },
    {
      title: "Connections",
      value: stats.totalConnections,
      icon: Users,
      color: "bg-green-500",
      borderColor: "border-green-500/20",
      description: "Active collaborations"
    },
    {
      title: "Trust Score",
      value: stats.trustScore.toFixed(1),
      icon: Star,
      color: "bg-yellow-500",
      borderColor: "border-yellow-500/20",
      description: "Community rating"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/my-activity" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground shadow-2xl border-0 mb-6 sm:mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
                  >
                    My Activity 📊
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-base sm:text-lg text-primary-foreground/90 mb-4 sm:mb-6 max-w-2xl"
                  >
                    Track your skills, requests, and connections. Monitor your progress and collaboration impact.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                  >
                    <Button
                      asChild
                      className="bg-primary-foreground/20 hover:bg-primary-foreground/30 backdrop-blur-sm text-primary-foreground border-primary-foreground/20 text-sm sm:text-base"
                    >
                      <Link href="/skills/offer">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Offer New Skill
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="bg-primary-foreground/20 hover:bg-primary-foreground/30 backdrop-blur-sm text-primary-foreground border-primary-foreground/20 text-sm sm:text-base"
                    >
                      <Link href="/requests/create">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Request Help
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Profile Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="bg-primary-foreground/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center"
                >
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium">Trust Level</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats?.trustScore.toFixed(1) || '0.0'}</p>
                  <p className="text-xs text-primary-foreground/80">out of 5.0</p>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl ${stat.color} ${stat.borderColor} border`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="border-b border-border/50">
              <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
                {[
                  { id: "overview", label: "Overview", icon: Activity },
                  { id: "skills", label: "My Skills", icon: BookOpen },
                  { id: "requests", label: "My Requests", icon: HelpCircle },
                  { id: "connections", label: "Connections", icon: Users }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            <CardContent className="p-4 sm:p-6">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Recent Activity */}
                    <Card className="border border-border/50">
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          {skills.slice(0, 2).map((skill) => (
                            <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground truncate">{skill.title}</p>
                                  <p className="text-xs text-muted-foreground">Skill offered</p>
                                </div>
                              </div>
                              <Badge variant={skill.status === "ACTIVE" ? "success" : "secondary"} className="text-xs">
                                {skill.status}
                              </Badge>
                            </div>
                          ))}
                          {requests.slice(0, 2).map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <HelpCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground truncate">{request.title}</p>
                                  <p className="text-xs text-muted-foreground">Help requested</p>
                                </div>
                              </div>
                              <Badge variant={request.status === "OPEN" ? "warning" : "secondary"} className="text-xs">
                                {request.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border border-border/50">
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400" />
                          Impact Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">People helped</span>
                            <span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                              {stats?.completedHelps || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Times helped</span>
                            <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                              {stats?.receivedHelps || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Active connections</span>
                            <span className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                              {connections.filter(c => c.status === "ACCEPTED").length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-muted-foreground">Response rate</span>
                            <span className="text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400">
                              {requests.length > 0 ? Math.round((requests.filter(r => r.responseCount && r.responseCount > 0).length / requests.length) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "skills" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-semibold text-foreground">My Skill Offerings</h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Badge variant="primary" className="text-xs">{skills.length} Skills</Badge>
                      <Button asChild size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <Link href="/skills/offer">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="hidden xs:inline">Add New Skill</span>
                          <span className="xs:hidden">Add Skill</span>
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                      >
                        <Card className="border border-border/50 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{skill.title}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{skill.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="primary" className="text-xs">{skill.category}</Badge>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(skill.status)}
                                    <Badge variant={skill.status === "ACTIVE" ? "success" : skill.status === "PAUSED" ? "warning" : "secondary"} className="text-xs">
                                      {skill.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-muted-foreground mb-3 gap-2">
                              <span>Created {new Date(skill.createdAt).toLocaleDateString()}</span>
                              <div className="flex gap-3 sm:gap-4">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {skill.viewCount || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {skill.connectionCount || 0}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" title="View Details" className="p-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit" className="p-2">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 p-2"
                                title="Delete"
                                onClick={() => handleDeleteSkill(skill.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {skills.length === 0 && (
                      <div className="col-span-full text-center py-8 sm:py-12">
                        <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No skills offered yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Share your expertise with the BU community</p>
                        <Button asChild>
                          <Link href="/skills/offer">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Offer Your First Skill
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "requests" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-semibold text-foreground">My Help Requests</h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Badge variant="secondary" className="text-xs">{requests.length} Requests</Badge>
                      <Button asChild size="sm" className="bg-gradient-to-r from-secondary to-secondary/80 flex-1 sm:flex-none text-xs sm:text-sm">
                        <Link href="/requests/create">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          <span className="hidden xs:inline">New Request</span>
                          <span className="xs:hidden">New</span>
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {requests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                      >
                        <Card className="border border-border/50 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{request.title}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{request.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">{request.category}</Badge>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(request.status)}
                                    <Badge variant={request.status === "OPEN" ? "warning" : request.status === "RESOLVED" ? "success" : "secondary"} className="text-xs">
                                      {request.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-muted-foreground mb-3 gap-2">
                              <span>Created {new Date(request.createdAt).toLocaleDateString()}</span>
                              <div className="flex gap-3 sm:gap-4">
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {request.responseCount || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {request.helpersConnected || 0}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" title="View Details" className="p-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit" className="p-2">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 p-2"
                                title="Delete"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {requests.length === 0 && (
                      <div className="col-span-full text-center py-8 sm:py-12">
                        <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No requests made yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Ask for help from fellow students</p>
                        <Button asChild className="bg-gradient-to-r from-secondary to-secondary/80">
                          <Link href="/requests/create">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Create Your First Request
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "connections" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-semibold text-foreground">My Connections</h3>
                    <Badge variant="primary" className="text-xs">{connections.length} Total</Badge>
                  </div>

                  <div className="space-y-3">
                    {connections.map((connection, index) => (
                      <motion.div
                        key={connection.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border border-border/50 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${connection.type === "SKILL_OFFER" ? "bg-blue-500/10" : "bg-orange-500/10"
                                  }`}>
                                  {connection.type === "SKILL_OFFER" ?
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" /> :
                                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{connection.title}</h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    with {connection.otherUser.name}
                                    <span className="mx-1">•</span>
                                    <Star className="w-3 h-3 inline fill-current text-yellow-500" />
                                    {connection.otherUser.trustScore}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant={
                                      connection.type === "SKILL_OFFER" ? "primary" : "secondary"
                                    } className="text-xs">
                                      {connection.type === "SKILL_OFFER" ? "Teaching" : "Learning"}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(connection.status)}
                                      <Badge variant={
                                        connection.status === "ACCEPTED" ? "success" :
                                          connection.status === "PENDING" ? "warning" :
                                            connection.status === "COMPLETED" ? "primary" : "secondary"
                                      } className="text-xs">
                                        {connection.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col text-left sm:text-right text-xs text-muted-foreground w-full sm:w-auto">
                                <span>Started {new Date(connection.createdAt).toLocaleDateString()}</span>
                                {connection.lastActivity && (
                                  <span className="truncate">Last activity {new Date(connection.lastActivity).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {connections.length === 0 && (
                      <div className="text-center py-8 sm:py-12">
                        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No connections yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start collaborating by offering skills or requesting help</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                          <Button asChild className="w-full sm:w-auto">
                            <Link href="/skills">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Browse Skills
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link href="/requests">
                              <HelpCircle className="w-4 h-4 mr-2" />
                              View Requests
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
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
