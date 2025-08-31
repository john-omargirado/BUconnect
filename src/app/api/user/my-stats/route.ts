import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's skills count
    const totalSkills = await prisma.skill.count({
      where: { userId: session.user.id }
    });

    // Get user's requests count
    const totalRequests = await prisma.request.count({
      where: { userId: session.user.id }
    });

    // Get user's trust score
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { trustScore: true }
    });

    // Mock data for connections and help stats
    const stats = {
      totalSkills,
      totalRequests,
      totalConnections: 3, // Mock value - would come from matches table
      trustScore: user?.trustScore || 0,
      completedHelps: Math.floor(Math.random() * 10) + 1,
      receivedHelps: Math.floor(Math.random() * 8) + 1,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
