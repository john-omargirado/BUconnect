import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For now, return mock connections data
    // In a real app, you'd have a connections/matches table
    const mockConnections = [
      {
        id: "1",
        type: "SKILL_OFFER",
        title: "JavaScript Tutoring",
        otherUser: {
          name: "Maria Santos",
          email: "maria@bu.edu",
          trustScore: 4.2
        },
        status: "ACCEPTED",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        type: "HELP_REQUEST",
        title: "Calculus Help Needed",
        otherUser: {
          name: "John Doe",
          email: "john@bu.edu",
          trustScore: 4.8
        },
        status: "PENDING",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        type: "SKILL_OFFER",
        title: "Web Development",
        otherUser: {
          name: "Lisa Chen",
          email: "lisa@bu.edu",
          trustScore: 4.5
        },
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json(mockConnections);
  } catch (error) {
    console.error("Failed to fetch user connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}
