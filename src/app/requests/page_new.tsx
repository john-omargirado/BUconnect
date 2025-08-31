"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  HelpCircle,
  Star,
  Clock,
  User,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Navigation from "@/components/Navigation";

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  contactInfo?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
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

export default function RequestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchRequests();
  }, [session, router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All Categories" ||
      request.category === selectedCategory;

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/requests" />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Help Requests
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find students who need your help or expertise
            </p>

            <Button
              onClick={() => router.push("/requests/create")}
              size="lg"
              variant="secondary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Request Help
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
                      placeholder="Search help requests, students, or topics..."
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

          {/* Requests Grid */}
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
              {filteredRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No help requests found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    onClick={() => router.push("/requests/create")}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Be the first to request help
                  </Button>
                </div>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={CATEGORY_COLORS[request.category as keyof typeof CATEGORY_COLORS] as any || "default"}>
                            {request.category.replace("_", " ")}
                          </Badge>
                          <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            <span className="text-sm font-medium">
                              {request.user.trustScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-foreground line-clamp-2">
                          {request.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {request.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">{request.user.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => {
                              if (request.contactInfo && typeof window !== 'undefined') {
                                if (request.contactInfo.includes("@")) {
                                  window.location.href = `mailto:${request.contactInfo}`;
                                } else {
                                  window.location.href = `tel:${request.contactInfo}`;
                                }
                              }
                            }}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Offer Help
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement messaging system
                              alert("Messaging feature coming soon!");
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
