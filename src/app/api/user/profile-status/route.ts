import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user profile information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        department: true,
        year: true,
        trustScore: true,
        createdAt: true,
        _count: {
          select: {
            skills: true,
            requests: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user needs to complete profile setup
    // Consider a user as needing setup if:
    // 1. They have no college or department info
    // 2. They have a trust score of 0 (indicating new user)
    // 3. They haven't posted any skills or requests
    // 4. Account is very new (created within last hour)

    const isVeryNew = new Date().getTime() - new Date(user.createdAt).getTime() < 60 * 60 * 1000; // 1 hour
    const hasBasicInfo = user.college && user.department;
    const hasActivity = (user._count.skills + user._count.requests) > 0;

    const needsSetup = !hasBasicInfo || (user.trustScore === 0 && !hasActivity && isVeryNew);

    return NextResponse.json({
      needsSetup,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        trustScore: user.trustScore,
        skillsCount: user._count.skills,
        requestsCount: user._count.requests,
        isVeryNew
      }
    });

  } catch (error) {
    console.error("Failed to check profile status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
