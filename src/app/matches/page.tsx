"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  HelpCircle,
  Calendar,
  CheckCircle,
  X,
  Clock,
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Match {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  skill: {
    id: string;
    title: string;
    description: string;
    category: string;
    user: {
      id: string;
      name: string;
      email: string;
      trustScore: number;
    };
  };
  request: {
    id: string;
    title: string;
    description: string;
    category: string;
    user: {
      id: string;
      name: string;
      email: string;
      trustScore: number;
    };
  };
}

export default function MatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session) {
      fetchMatches();
    }
  }, [session, status, router]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'danger';
      case 'COMPLETED': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <X className="w-4 h-4" />;
      case 'COMPLETED': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (status === "loading" || isLoading) {
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

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/matches" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Matches</h1>
            <p className="text-muted-foreground">
              View and manage your skill matches and connections
            </p>
          </div>

          {matches.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No matches yet</h3>
                <p className="text-muted-foreground mb-6">
                  Matches will appear here when someone connects with your skills or requests
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <a href="/skills">Browse Skills</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/requests">View Requests</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Skill Match
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(match.status) as any}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(match.status)}
                              {match.status}
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Skill Information */}
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{match.skill.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{match.skill.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Offered by {match.skill.user.name}</span>
                              <span>•</span>
                              <span>Trust Score: {match.skill.user.trustScore}/5.0</span>
                              <Badge variant={match.skill.category.toLowerCase() as any}>
                                {match.skill.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Request Information */}
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{match.request.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{match.request.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Requested by {match.request.user.name}</span>
                              <span>•</span>
                              <span>Trust Score: {match.request.user.trustScore}/5.0</span>
                              <Badge variant={match.request.category.toLowerCase() as any}>
                                {match.request.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Match Details */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Matched {new Date(match.createdAt).toLocaleDateString()}
                          </div>
                          {match.status !== 'PENDING' && (
                            <>
                              <span>•</span>
                              <div>Updated {new Date(match.updatedAt).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>

                        {match.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="primary">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                          </div>
                        )}

                        {match.status === 'ACCEPTED' && (
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
