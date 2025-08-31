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

    const requests = await prisma.request.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Add mock status and counts for now
    const requestsWithStatus = requests.map(request => ({
      ...request,
      status: "OPEN" as const,
      responseCount: Math.floor(Math.random() * 8),
      helpersConnected: Math.floor(Math.random() * 3)
    }));

    return NextResponse.json(requestsWithStatus);
  } catch (error) {
    console.error("Failed to fetch user requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
