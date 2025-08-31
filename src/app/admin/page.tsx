"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Shield,
  Activity,
  Settings,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Gift,
  Coins
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Navigation from "@/components/Navigation";
import { UserDetailModal, UserEditModal } from "@/components/admin/UserModals";
import { SkillDetailModal, SkillEditModal } from "@/components/admin/SkillModals";
import { RequestDetailModal, RequestEditModal } from "@/components/admin/RequestModals";
import RewardsManagement from "@/components/admin/RewardsManagement";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college?: string;
  department?: string;
  trustScore: number;
  createdAt: string;
  _count?: {
    skills: number;
    requests: number;
  };
  skills?: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: string;
  }>;
  requests?: Array<{
    id: string;
    title: string;
    category: string;
    status: string;
    createdAt: string;
  }>;
}

interface Skill {
  id: string;
  title: string;
  description?: string;
  category: string;
  status?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    college?: string;
    department?: string;
    trustScore: number;
  };
}

interface Request {
  id: string;
  title: string;
  description?: string;
  category: string;
  status?: string;
  priority?: string;
  user: {
    id: string;
    name: string;
    email: string;
    college?: string;
    department?: string;
    trustScore: number;
  };
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalSkills: number;
  totalRequests: number;
  totalMatches: number;
  averageTrustScore: string;
  userGrowth: string;
  skillGrowth: string;
  requestGrowth: string;
  trustScoreGrowth: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isSkillDetailOpen, setIsSkillDetailOpen] = useState(false);
  const [isSkillEditOpen, setIsSkillEditOpen] = useState(false);
  const [isRequestDetailOpen, setIsRequestDetailOpen] = useState(false);
  const [isRequestEditOpen, setIsRequestEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/dashboard"); // Redirect non-admins to regular dashboard
      return;
    }
  }, [session, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchData();
    }
  }, [session]);

  // If not authenticated or not admin, show loading
  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats from API
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch users from API
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData || []);
      }

      // Fetch skills from API
      const skillsRes = await fetch('/api/admin/skills');
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData || []);
      }

      // Fetch requests from API
      const requestsRes = await fetch('/api/admin/requests');
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // User management handlers
  const handleViewUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setIsUserDetailOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserEditOpen(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setIsUserEditOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        setIsUserDetailOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Skill management handlers
  const handleViewSkill = async (skillId: string) => {
    try {
      const response = await fetch(`/api/admin/skills/${skillId}`);
      if (response.ok) {
        const skillData = await response.json();
        setSelectedSkill(skillData);
        setIsSkillDetailOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch skill details:", error);
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsSkillEditOpen(true);
  };

  const handleUpdateSkill = async (skillData: any) => {
    if (!selectedSkill) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/skills/${selectedSkill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      });

      if (response.ok) {
        const updatedSkill = await response.json();
        setSkills(skills.map(s => s.id === updatedSkill.id ? updatedSkill : s));
        setIsSkillEditOpen(false);
        setSelectedSkill(null);
      }
    } catch (error) {
      console.error("Failed to update skill:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSkills(skills.filter(s => s.id !== skillId));
        setIsSkillDetailOpen(false);
        setSelectedSkill(null);
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  // Request management handlers
  const handleViewRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`);
      if (response.ok) {
        const requestData = await response.json();
        setSelectedRequest(requestData);
        setIsRequestDetailOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch request details:", error);
    }
  };

  const handleEditRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsRequestEditOpen(true);
  };

  const handleUpdateRequest = async (requestData: any) => {
    if (!selectedRequest) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests(requests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
        setIsRequestEditOpen(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to update request:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRequests(requests.filter(r => r.id !== requestId));
        setIsRequestDetailOpen(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-transparent border-t-primary"
        />
      </div>
    );
  }

  const statsCards = stats ? [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      change: stats.userGrowth
    },
    {
      title: "Active Skills",
      value: stats.totalSkills,
      icon: BookOpen,
      color: "bg-green-500",
      change: stats.skillGrowth
    },
    {
      title: "Open Requests",
      value: stats.totalRequests,
      icon: HelpCircle,
      color: "bg-orange-500",
      change: stats.requestGrowth
    },
    {
      title: "Trust Score Avg",
      value: stats.averageTrustScore,
      icon: Shield,
      color: "bg-purple-500",
      change: stats.trustScoreGrowth
    }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-destructive via-destructive/90 to-orange-500 text-destructive-foreground border-0 shadow-xl mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="mb-6 lg:mb-0">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-4xl font-bold mb-3"
                  >
                    Admin Dashboard 🛡️
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-destructive-foreground/90 mb-6 max-w-2xl"
                  >
                    Monitor, manage, and maintain the BU Connect platform. Keep our community thriving and secure.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  >
                    <Button
                      asChild
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
                    >
                      <Link href="/admin/reports">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Reports
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
                    >
                      <Link href="/admin/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        System Settings
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* System Status Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center"
                >
                  <Activity className="w-8 h-8 text-green-300 mx-auto mb-2" />
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-white/80 flex items-center gap-1 justify-center">
                    <CheckCircle className="w-3 h-3" />
                    All Systems Active
                  </p>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {isLoading ? (
            // Loading skeleton for stats
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="animate-pulse"
              >
                <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            statsCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                        <motion.p
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                          className="text-3xl font-bold text-foreground"
                        >
                          {stat.value}
                        </motion.p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-green-600 dark:text-green-400">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{stat.change}</span>
                      <span className="text-sm text-muted-foreground ml-2">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="border-b border-border/50">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "users", label: "Users", icon: Users },
                  { id: "skills", label: "Skills", icon: BookOpen },
                  { id: "requests", label: "Requests", icon: HelpCircle },
                  { id: "rewards", label: "Rewards", icon: Gift },
                  { id: "reports", label: "Reports", icon: PieChart }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ y: -2 }}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm(""); // Clear search when switching tabs
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id
                        ? "border-destructive text-destructive"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            <CardContent className="p-6">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">Platform Overview</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-500 dark:text-green-400" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">New user registered</span>
                            <span className="text-xs text-muted-foreground">2h ago</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Skill posted</span>
                            <span className="text-xs text-muted-foreground">4h ago</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Help request created</span>
                            <span className="text-xs text-muted-foreground">6h ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                          System Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                            <span className="text-sm text-muted-foreground">All systems operational</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                            <span className="text-sm text-muted-foreground">Scheduled maintenance in 2 days</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">User Management</h3>
                    <Button>
                      <Users className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {users
                      .filter(user =>
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border border-border/50 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 dark:from-primary dark:to-secondary rounded-full flex items-center justify-center shadow-sm">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{user.name}</h4>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
                                        {user.role}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">Trust: {user.trustScore}/5.0</span>
                                      {user._count && (
                                        <>
                                          <span className="text-xs text-muted-foreground">•</span>
                                          <span className="text-xs text-muted-foreground">
                                            {user._count.skills} skills, {user._count.requests} requests
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewUser(user.id)}
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                    title="Edit User"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/80"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    {users.length === 0 && !isLoading && (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                        <p className="text-muted-foreground">Users will appear here as they register</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "skills" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Skills Management</h3>
                    <div className="flex gap-2">
                      <Badge variant="success">{skills.length} Total Skills</Badge>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search skills by title, category, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {skills
                      .filter(skill =>
                        skill.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        skill.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        skill.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 10).map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="border border-border/50 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">{skill.title}</h4>
                                    <p className="text-sm text-muted-foreground">by {skill.user.name} • {skill.user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="primary">
                                        {skill.category}
                                      </Badge>
                                      <Badge
                                        variant={skill.status === "ACTIVE" ? "success" : "warning"}
                                      >
                                        {skill.status}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Created {new Date(skill.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewSkill(skill.id)}
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSkill(skill)}
                                    title="Edit Skill"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    title="Delete Skill"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    {skills.length === 0 && !isLoading && (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No skills found</h3>
                        <p className="text-muted-foreground">Skills will appear here as users post them</p>
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
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Help Requests Management</h3>
                    <div className="flex gap-2">
                      <Badge variant="warning">{requests.length} Open Requests</Badge>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search requests by title, category, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {requests
                      .filter(request =>
                        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        request.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 10).map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="border border-border/50 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">{request.title}</h4>
                                    <p className="text-sm text-muted-foreground">by {request.user.name} • {request.user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary">
                                        {request.category}
                                      </Badge>
                                      <Badge
                                        variant={request.status === "OPEN" ? "warning" : request.status === "RESOLVED" ? "success" : "secondary"}
                                      >
                                        {request.status}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Created {new Date(request.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewRequest(request.id)}
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditRequest(request)}
                                    title="Edit Request"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteRequest(request.id)}
                                    title="Delete Request"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    {requests.length === 0 && !isLoading && (
                      <div className="text-center py-12">
                        <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
                        <p className="text-muted-foreground">Help requests will appear here as users create them</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "rewards" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Token & Rewards Management</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Gift className="w-4 h-4 mr-2" />
                        Add New Reward
                      </Button>
                      <Button size="sm">
                        <Coins className="w-4 h-4 mr-2" />
                        Award Tokens
                      </Button>
                    </div>
                  </div>

                  <RewardsManagement />
                </motion.div>
              )}

              {activeTab === "reports" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Analytics & Reports</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button size="sm">
                        <PieChart className="w-4 h-4 mr-2" />
                        Export Analytics
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Platform Growth Chart */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
                          Platform Growth
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">User registration and activity trends</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">New users this month</span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">+{stats?.userGrowth || '0%'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Skills posted this month</span>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">+{stats?.skillGrowth || '0%'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Requests created this month</span>
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">+{stats?.requestGrowth || '0%'}</span>
                          </div>
                          <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                            Chart placeholder - Growth metrics visualization
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Category Distribution */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                          Category Distribution
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Skills and requests by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {["ACADEMICS", "TECH", "DESIGN", "WRITING", "OTHER"].map((category, index) => (
                            <div key={category} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' :
                                      index === 1 ? 'bg-green-500' :
                                        index === 2 ? 'bg-purple-500' :
                                          index === 3 ? 'bg-orange-500' : 'bg-gray-400'
                                    }`}
                                ></div>
                                <span className="text-sm text-muted-foreground">{category}</span>
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                {Math.floor(Math.random() * 50) + 10}%
                              </span>
                            </div>
                          ))}
                          <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm mt-4">
                            Pie chart placeholder - Category distribution
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* User Engagement */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                          User Engagement
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Activity and interaction metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Daily active users</span>
                            <span className="text-sm font-semibold text-foreground">1,247</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Weekly active users</span>
                            <span className="text-sm font-semibold text-foreground">4,892</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Average session duration</span>
                            <span className="text-sm font-semibold text-foreground">12 min</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Successful connections</span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">89%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* System Health */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-500 dark:text-green-400" />
                          System Health
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Platform performance and security</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                              <span className="text-sm text-muted-foreground">API Response Time</span>
                            </div>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">98ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                              <span className="text-sm text-muted-foreground">Database Health</span>
                            </div>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Optimal</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                              <span className="text-sm text-muted-foreground">Security Status</span>
                            </div>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Secure</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                              <span className="text-sm text-muted-foreground">Last Backup</span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">2h ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Modals */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isUserDetailOpen}
        onClose={() => {
          setIsUserDetailOpen(false);
          setSelectedUser(null);
        }}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      <UserEditModal
        user={selectedUser}
        isOpen={isUserEditOpen}
        onClose={() => {
          setIsUserEditOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
        isLoading={isUpdating}
      />

      {/* Skill Modals */}
      <SkillDetailModal
        skill={selectedSkill}
        isOpen={isSkillDetailOpen}
        onClose={() => {
          setIsSkillDetailOpen(false);
          setSelectedSkill(null);
        }}
        onEdit={handleEditSkill}
        onDelete={handleDeleteSkill}
      />

      <SkillEditModal
        skill={selectedSkill}
        isOpen={isSkillEditOpen}
        onClose={() => {
          setIsSkillEditOpen(false);
          setSelectedSkill(null);
        }}
        onSave={handleUpdateSkill}
        isLoading={isUpdating}
      />

      {/* Request Modals */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={isRequestDetailOpen}
        onClose={() => {
          setIsRequestDetailOpen(false);
          setSelectedRequest(null);
        }}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
      />

      <RequestEditModal
        request={selectedRequest}
        isOpen={isRequestEditOpen}
        onClose={() => {
          setIsRequestEditOpen(false);
          setSelectedRequest(null);
        }}
        onSave={handleUpdateRequest}
        isLoading={isUpdating}
      />
    </div>
  );
}
