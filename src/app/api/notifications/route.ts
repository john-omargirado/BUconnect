import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Notification {
  id: string;
  type: 'skill_match' | 'new_request' | 'new_skill' | 'match_accepted' | 'match_rejected' | 'feedback_received' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const notifications: Notification[] = [];

    // 1. Recent matches for user's requests (last 7 days)
    const recentMatches = await prisma.match.findMany({
      where: {
        request: {
          userId: userId
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        skill: {
          include: {
            user: true
          }
        },
        request: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    recentMatches.forEach(match => {
      notifications.push({
        id: `match_${match.id}`,
        type: 'skill_match',
        title: 'New Skill Match!',
        message: `${match.skill.user.name} can help with your "${match.request.title}" request`,
        time: getRelativeTime(match.createdAt),
        read: false,
        actionUrl: `/matches/${match.id}`,
        relatedId: match.id
      });
    });

    // 2. Match status updates (accepted/rejected)
    const matchUpdates = await prisma.match.findMany({
      where: {
        OR: [
          {
            skill: {
              userId: userId
            }
          },
          {
            request: {
              userId: userId
            }
          }
        ],
        status: {
          in: ['ACCEPTED', 'REJECTED', 'COMPLETED']
        },
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        skill: {
          include: {
            user: true
          }
        },
        request: {
          include: {
            user: true
          }
        },
        user: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });

    matchUpdates.forEach(match => {
      if (match.status === 'ACCEPTED') {
        notifications.push({
          id: `match_accepted_${match.id}`,
          type: 'match_accepted',
          title: 'Match Accepted!',
          message: `${match.user.name} accepted your ${match.skill.userId === userId ? 'skill offer' : 'help request'}`,
          time: getRelativeTime(match.updatedAt),
          read: false,
          actionUrl: `/matches/${match.id}`,
          relatedId: match.id
        });
      } else if (match.status === 'REJECTED') {
        notifications.push({
          id: `match_rejected_${match.id}`,
          type: 'match_rejected',
          title: 'Match Update',
          message: `A match for "${match.skill.userId === userId ? match.skill.title : match.request.title}" was not suitable`,
          time: getRelativeTime(match.updatedAt),
          read: false,
          actionUrl: `/dashboard`,
          relatedId: match.id
        });
      }
    });

    // 3. New requests in categories user has skills in (last 3 days)
    const userSkills = await prisma.skill.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      select: {
        category: true
      }
    });

    const userCategories = [...new Set(userSkills.map(skill => skill.category))];

    if (userCategories.length > 0) {
      const newRequests = await prisma.request.findMany({
        where: {
          category: {
            in: userCategories
          },
          userId: {
            not: userId // Don't include user's own requests
          },
          createdAt: {
            gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
          }
        },
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3
      });

      newRequests.forEach(request => {
        notifications.push({
          id: `new_request_${request.id}`,
          type: 'new_request',
          title: 'New Help Request',
          message: `Someone needs help with ${request.title} in ${request.category}`,
          time: getRelativeTime(request.createdAt),
          read: false,
          actionUrl: `/requests/${request.id}`,
          relatedId: request.id
        });
      });
    }

    // 4. New skills in categories user has requested help with (last 3 days)
    const userRequests = await prisma.request.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      select: {
        category: true
      }
    });

    const requestCategories = [...new Set(userRequests.map(req => req.category))];

    if (requestCategories.length > 0) {
      const newSkills = await prisma.skill.findMany({
        where: {
          category: {
            in: requestCategories
          },
          userId: {
            not: userId // Don't include user's own skills
          },
          createdAt: {
            gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
          }
        },
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3
      });

      newSkills.forEach(skill => {
        notifications.push({
          id: `new_skill_${skill.id}`,
          type: 'new_skill',
          title: 'New Skill Available',
          message: `${skill.user.name} is offering help with ${skill.title}`,
          time: getRelativeTime(skill.createdAt),
          read: false,
          actionUrl: `/skills/${skill.id}`,
          relatedId: skill.id
        });
      });
    }

    // 5. Recent feedback received (last 7 days)
    const recentFeedback = await prisma.feedback.findMany({
      where: {
        receiverId: userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        giver: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    recentFeedback.forEach(feedback => {
      notifications.push({
        id: `feedback_${feedback.id}`,
        type: 'feedback_received',
        title: 'New Feedback Received',
        message: `${feedback.giver.name} left you a ${feedback.rating}-star review`,
        time: getRelativeTime(feedback.createdAt),
        read: false,
        actionUrl: `/profile?tab=feedback`,
        relatedId: feedback.id
      });
    });

    // 6. System notifications (trust score updates)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { trustScore: true, updatedAt: true }
    });

    if (user && user.trustScore > 0) {
      // Check if trust score was recently updated (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (user.updatedAt > oneDayAgo) {
        notifications.push({
          id: `trust_score_${user.updatedAt.getTime()}`,
          type: 'system',
          title: 'Trust Score Updated',
          message: `Your trust score is now ${user.trustScore.toFixed(1)}/5.0`,
          time: getRelativeTime(user.updatedAt),
          read: false,
          actionUrl: `/profile`
        });
      }
    }

    // Sort all notifications by time (most recent first)
    notifications.sort((a, b) => {
      const timeA = parseRelativeTime(a.time);
      const timeB = parseRelativeTime(b.time);
      return timeA - timeB;
    });

    // Limit to 20 most recent notifications
    const limitedNotifications = notifications.slice(0, 20);

    return NextResponse.json(limitedNotifications);

  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to convert Date to relative time string
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Helper function to parse relative time for sorting
function parseRelativeTime(timeStr: string): number {
  if (timeStr === 'just now') return 0;

  const match = timeStr.match(/(\d+)\s+(minute|hour|day)s?\s+ago/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'minute': return value;
      case 'hour': return value * 60;
      case 'day': return value * 60 * 24;
    }
  }

  // If it's a date string, treat as old
  return 999999;
}
