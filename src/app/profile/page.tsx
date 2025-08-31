"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities, react-hooks/exhaustive-deps */

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  HelpCircle,
  Edit,
  Save,
  X,
  Star,
  TrendingUp,
  Users,
  Heart,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_COLORS } from "@/types/categories";
import Navigation from "@/components/Navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  college?: string;
  department?: string;
  phone?: string;
  bio?: string;
  trustScore: number;
  createdAt: string;
  _count?: {
    skills: number;
    requests: number;
    givenMatches: number;
    receivedMatches: number;
  };
}

interface UserSkill {
  id: string;
  title: string;
  category: string;
  description: string;
  createdAt: string;
}

interface UserRequest {
  id: string;
  title: string;
  category: string;
  description: string;
  createdAt: string;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-transparent border-t-primary"
        />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetupMode = searchParams.get("setup") === "true";
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isSetupMode); // Auto-enable edit mode for setup
  const [activeTab, setActiveTab] = useState("overview");
  const [editForm, setEditForm] = useState({
    name: "",
    college: "",
    department: "",
    phone: "",
    bio: ""
  });
  const [setupStep, setSetupStep] = useState(1);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProfile();
  }, [session, router]);

  const fetchProfile = async () => {
    try {
      // For now, use session data and mock additional info
      // In a real app, you'd have a dedicated profile API
      if (session?.user) {
        const mockProfile: UserProfile = {
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          college: "College of Engineering", // Mock data
          department: "Computer Science",
          phone: "+63 912 345 6789",
          bio: "Passionate about technology and helping fellow students succeed.",
          trustScore: 4.5,
          createdAt: "2024-01-15",
          _count: {
            skills: 3,
            requests: 1,
            givenMatches: 5,
            receivedMatches: 8
          }
        };

        setProfile(mockProfile);
        setEditForm({
          name: mockProfile.name,
          college: mockProfile.college || "",
          department: mockProfile.department || "",
          phone: mockProfile.phone || "",
          bio: mockProfile.bio || ""
        });

        // Fetch user's skills and requests
        await fetchUserContent();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserContent = async () => {
    try {
      // Fetch skills
      const skillsRes = await fetch("/api/skills");
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        const userSkillsData = skillsData.filter((skill: any) => skill.userId === session?.user?.id);
        setUserSkills(userSkillsData);
      }

      // Fetch requests
      const requestsRes = await fetch("/api/requests");
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        const userRequestsData = requestsData.filter((request: any) => request.userId === session?.user?.id);
        setUserRequests(userRequestsData);
      }
    } catch (error) {
      console.error("Error fetching user content:", error);
    }
  };

  const handleEditSave = async () => {
    // In a real app, you'd send this to a profile update API
    if (profile) {
      setProfile({
        ...profile,
        name: editForm.name,
        college: editForm.college,
        department: editForm.department,
        phone: editForm.phone,
        bio: editForm.bio
      });
    }
    setIsEditing(false);

    // If this was a setup completion, redirect to dashboard
    if (isSetupMode) {
      router.push("/dashboard");
    }
  };

  const handleSetupComplete = () => {
    handleEditSave();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!session || isLoading) {
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

  if (!profile) {
    return null;
  }

  // Get active reward themes
  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/profile" />

      <div className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {!isSetupMode && (
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="w-fit"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isSetupMode ? "Complete Your Profile" : "My Profile"}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isSetupMode
                    ? "Help us get to know you better to improve your BU Connect experience"
                    : "Manage your BU Connect profile"
                  }
                </p>
              </div>
            </div>

            {isSetupMode ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleSetupComplete}
                  className="bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
                  disabled={!editForm.college || !editForm.department}
                >
                  Complete Setup
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => isEditing ? handleEditSave() : setIsEditing(true)}
                className="bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            )}
          </motion.div>

          {/* Setup Welcome Banner */}
          {isSetupMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 sm:mb-8"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                        🎉 Welcome to BU Connect!
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-3">
                        Complete your profile to help other students find you and connect based on your skills and interests.
                        The more information you provide, the better matches you'll receive!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${editForm.name ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Basic Info
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${editForm.college && editForm.department ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Academic Details
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${editForm.bio ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Personal Bio
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4 sm:pb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                  </div>
                  {isEditing ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-center text-lg sm:text-xl font-bold"
                    />
                  ) : (
                    <CardTitle className="text-lg sm:text-xl">{profile.name}</CardTitle>
                  )}

                  <div className="flex items-center justify-center text-yellow-500 dark:text-yellow-400 mt-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current mr-1" />
                    <span className="text-base sm:text-lg font-semibold">{profile.trustScore.toFixed(1)}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">Trust Score</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{profile.email}</span>
                  </div>

                  {isEditing ? (
                    <>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-muted-foreground flex-shrink-0" />
                        <Input
                          placeholder="College"
                          value={editForm.college}
                          onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                          className="text-xs sm:text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-muted-foreground flex-shrink-0" />
                        <Input
                          placeholder="Department"
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="text-xs sm:text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-muted-foreground flex-shrink-0" />
                        <Input
                          placeholder="Phone number"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="text-xs sm:text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile.college && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{profile.college}</span>
                        </div>
                      )}
                      {profile.department && (
                        <div className="flex items-center text-muted-foreground">
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{profile.department}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{profile.phone}</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Joined {formatDate(profile.createdAt)}</span>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-border">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Tell others about yourself..."
                          rows={3}
                          className="w-full px-2 sm:px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-xs sm:text-sm resize-none bg-background text-foreground"
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-foreground mb-2 text-xs sm:text-sm">About</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {profile.bio || "No bio added yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Card className="text-center p-3 sm:p-4 border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold">{profile._count?.skills || 0}</p>
                  <p className="text-xs sm:text-sm opacity-80">Skills Offered</p>
                </Card>

                <Card className="text-center p-3 sm:p-4 border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold">{profile._count?.requests || 0}</p>
                  <p className="text-xs sm:text-sm opacity-80">Help Requests</p>
                </Card>

                <Card className="text-center p-3 sm:p-4 border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold">{profile._count?.givenMatches || 0}</p>
                  <p className="text-xs sm:text-sm opacity-80">Help Given</p>
                </Card>

                <Card className="text-center p-3 sm:p-4 border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold">{profile._count?.receivedMatches || 0}</p>
                  <p className="text-xs sm:text-sm opacity-80">Help Received</p>
                </Card>
              </div>

              {/* Tabs */}
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                <div className="border-b border-border overflow-x-auto">
                  <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-fit">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${activeTab === "overview"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("skills")}
                      className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${activeTab === "skills"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      My Skills ({userSkills.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${activeTab === "requests"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      My Requests ({userRequests.length})
                    </button>
                  </nav>
                </div>

                <CardContent className="p-4 sm:p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Recent Activity</h3>
                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                            <span className="flex-1 pr-2">Posted "Web Development Tutoring" skill</span>
                            <span className="text-muted-foreground/70 text-xs flex-shrink-0">2 days ago</span>
                          </div>
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                            <span className="flex-1 pr-2">Helped a student with Python programming</span>
                            <span className="text-muted-foreground/70 text-xs flex-shrink-0">1 week ago</span>
                          </div>
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                            <span className="flex-1 pr-2">Received help with Calculus homework</span>
                            <span className="text-muted-foreground/70 text-xs flex-shrink-0">2 weeks ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div className="space-y-3 sm:space-y-4">
                      {userSkills.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-2">No skills offered yet</h3>
                          <p className="text-sm text-muted-foreground/70 mb-3 sm:mb-4">Share your expertise with fellow students</p>
                          <Button
                            onClick={() => router.push("/skills/offer")}
                            className="w-full sm:w-auto"
                          >
                            Offer Your First Skill
                          </Button>
                        </div>
                      ) : (
                        userSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="p-3 sm:p-4 border border-border rounded-lg bg-card/50"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base">{skill.title}</h4>
                              <Badge className={`${CATEGORY_COLORS[skill.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.OTHER} text-xs w-fit`}>
                                {skill.category.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{skill.description}</p>
                            <p className="text-xs text-muted-foreground/70">Posted {formatDate(skill.createdAt)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "requests" && (
                    <div className="space-y-3 sm:space-y-4">
                      {userRequests.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                          <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-2">No help requests yet</h3>
                          <p className="text-sm text-muted-foreground/70 mb-3 sm:mb-4">Don't hesitate to ask for help when you need it</p>
                          <Button
                            onClick={() => router.push("/requests/create")}
                            className="w-full sm:w-auto"
                          >
                            Request Help
                          </Button>
                        </div>
                      ) : (
                        userRequests.map((request) => (
                          <div
                            key={request.id}
                            className="p-3 sm:p-4 border border-border rounded-lg bg-card/50"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base">{request.title}</h4>
                              <Badge className={`${CATEGORY_COLORS[request.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.OTHER} text-xs w-fit`}>
                                {request.category.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{request.description}</p>
                            <p className="text-xs text-muted-foreground/70">Posted {formatDate(request.createdAt)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
