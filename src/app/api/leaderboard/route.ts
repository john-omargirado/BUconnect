/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "weekly";
    const limit = parseInt(url.searchParams.get("limit") || "100");

    // Calculate date range for the leaderboard
    const now = new Date();
    let startDate: Date;
    const endDate = now;

    if (period === "weekly") {
      // Get current week (Monday to Sunday)
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - daysToMonday);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // All time
      startDate = new Date(0);
    }

    // Get leaderboard data using raw SQL for now (until TypeScript recognizes new fields)
    const leaderboardData: any[] = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.trustScore,
        COALESCE(u.connectTokens, 0) as connectTokens,
        COALESCE(u.weeklyRating, 0) as weeklyRating,
        COALESCE(u.completedServices, 0) as completedServices,
        COALESCE(
          (SELECT AVG(CAST(f.rating AS FLOAT)) 
           FROM feedback f 
           WHERE f.receiverId = u.id 
           AND f.createdAt >= ${startDate.toISOString()}
           AND f.createdAt <= ${endDate.toISOString()}), 0
        ) as avgRating,
        COALESCE(
          (SELECT COUNT(*) 
           FROM matches m 
           WHERE m.userId = u.id 
           AND m.status = 'COMPLETED'
           AND m.updatedAt >= ${startDate.toISOString()}
           AND m.updatedAt <= ${endDate.toISOString()}), 0
        ) as servicesCompleted
      FROM users u
      WHERE u.role = 'STUDENT'
      ORDER BY avgRating DESC, servicesCompleted DESC, connectTokens DESC
      LIMIT ${limit}
    `;

    // Convert BigInt values to numbers and add ranking position
    const rankedData = leaderboardData.map((user, index) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      trustScore: Number(user.trustScore),
      connectTokens: Number(user.connectTokens),
      weeklyRating: Number(user.weeklyRating),
      completedServices: Number(user.completedServices),
      avgRating: Number(user.avgRating),
      servicesCompleted: Number(user.servicesCompleted),
      position: index + 1,
      isTopHundred: index < 100
    }));

    // Find current user's position if not in top results
    const currentUserId = session.user.id;
    let currentUserRank = rankedData.find(user => user.id === currentUserId);

    if (!currentUserRank && period === "weekly") {
      // Get current user's stats for the period
      const userStats: any = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.trustScore,
          COALESCE(u.connectTokens, 0) as connectTokens,
          COALESCE(u.weeklyRating, 0) as weeklyRating,
          COALESCE(u.completedServices, 0) as completedServices,
          COALESCE(
            (SELECT AVG(CAST(f.rating AS FLOAT)) 
             FROM feedback f 
             WHERE f.receiverId = u.id 
             AND f.createdAt >= ${startDate.toISOString()}
             AND f.createdAt <= ${endDate.toISOString()}), 0
          ) as avgRating,
          COALESCE(
            (SELECT COUNT(*) 
             FROM matches m 
             WHERE m.userId = u.id 
             AND m.status = 'COMPLETED'
             AND m.updatedAt >= ${startDate.toISOString()}
             AND m.updatedAt <= ${endDate.toISOString()}), 0
          ) as servicesCompleted
        FROM users u
        WHERE u.id = ${currentUserId}
      `;

      if (userStats.length > 0) {
        const stats = userStats[0];
        currentUserRank = {
          id: stats.id,
          name: stats.name,
          email: stats.email,
          trustScore: Number(stats.trustScore),
          connectTokens: Number(stats.connectTokens),
          weeklyRating: Number(stats.weeklyRating),
          completedServices: Number(stats.completedServices),
          avgRating: Number(stats.avgRating),
          servicesCompleted: Number(stats.servicesCompleted),
          position: 999, // Use a high number to indicate outside top 100
          isTopHundred: false
        };
      }
    }

    return NextResponse.json({
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      leaderboard: rankedData,
      currentUser: currentUserRank,
      totalParticipants: rankedData.length
    });

  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === "calculate_weekly_rewards") {
      // Award tokens to top 100 weekly contributors
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - daysToMonday);
      weekStart.setHours(0, 0, 0, 0);

      // Get top 100 users for the week
      const topUsers: any[] = await prisma.$queryRaw`
        SELECT 
          u.id,
          COALESCE(
            (SELECT AVG(CAST(f.rating AS FLOAT)) 
             FROM feedback f 
             WHERE f.receiverId = u.id 
             AND f.createdAt >= ${weekStart.toISOString()}), 0
          ) as avgRating,
          COALESCE(
            (SELECT COUNT(*) 
             FROM matches m 
             WHERE m.userId = u.id 
             AND m.status = 'COMPLETED'
             AND m.updatedAt >= ${weekStart.toISOString()}), 0
          ) as servicesCompleted
        FROM users u
        WHERE u.role = 'STUDENT'
        AND (
          (SELECT COUNT(*) FROM matches m WHERE m.userId = u.id AND m.status = 'COMPLETED' AND m.updatedAt >= ${weekStart.toISOString()}) > 0
          OR
          (SELECT COUNT(*) FROM feedback f WHERE f.receiverId = u.id AND f.createdAt >= ${weekStart.toISOString()}) > 0
        )
        ORDER BY avgRating DESC, servicesCompleted DESC
        LIMIT 100
      `;

      // Award tokens based on ranking
      for (let i = 0; i < topUsers.length; i++) {
        const user = topUsers[i];
        const position = i + 1;
        let tokensToAward = 0;

        // Award tokens based on position
        if (position <= 10) {
          tokensToAward = 100; // Top 10
        } else if (position <= 25) {
          tokensToAward = 75;  // Top 25
        } else if (position <= 50) {
          tokensToAward = 50;  // Top 50
        } else {
          tokensToAward = 25;  // Top 100
        }

        // Award the tokens
        await prisma.$executeRaw`
          UPDATE users 
          SET connectTokens = connectTokens + ${tokensToAward}
          WHERE id = ${user.id}
        `;

        // Create transaction record
        await prisma.$executeRaw`
          INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
          VALUES (
            lower(hex(randomblob(12))), 
            ${user.id}, 
            ${tokensToAward}, 
            'BONUS', 
            'Weekly leaderboard reward - Position #${position}', 
            datetime('now')
          )
        `;
      }

      return NextResponse.json({
        success: true,
        rewardsDistributed: topUsers.length,
        message: `Weekly rewards distributed to top ${topUsers.length} contributors`
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Failed to process leaderboard action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
