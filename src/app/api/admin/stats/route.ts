import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Fetch basic counts
    const [totalUsers, totalSkills, totalRequests, totalMatches] = await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.request.count(),
      prisma.match.count()
    ]);

    // Calculate average trust score
    const trustScoreAgg = await prisma.user.aggregate({
      _avg: {
        trustScore: true
      }
    });

    // Get user growth (users created in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get skills growth (skills created in the last 30 days)
    const recentSkills = await prisma.skill.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get requests growth (requests created in the last 30 days)
    const recentRequests = await prisma.request.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Calculate growth percentages (mock calculation for demo)
    const userGrowth = totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0;
    const skillGrowth = totalSkills > 0 ? Math.round((recentSkills / totalSkills) * 100) : 0;
    const requestGrowth = totalRequests > 0 ? Math.round((recentRequests / totalRequests) * 100) : 0;

    const stats = {
      totalUsers,
      totalSkills,
      totalRequests,
      totalMatches,
      averageTrustScore: trustScoreAgg._avg.trustScore?.toFixed(1) || "0.0",
      userGrowth: `+${userGrowth}%`,
      skillGrowth: `+${skillGrowth}%`,
      requestGrowth: `+${requestGrowth}%`,
      trustScoreGrowth: "+2%" // Mock value
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
