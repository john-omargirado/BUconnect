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

    const skills = await prisma.skill.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        createdAt: true,
        // Add view count and connection count later with proper schema
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Add mock status and counts for now
    const skillsWithStatus = skills.map(skill => ({
      ...skill,
      status: "ACTIVE" as const,
      viewCount: Math.floor(Math.random() * 50) + 1,
      connectionCount: Math.floor(Math.random() * 10)
    }));

    return NextResponse.json(skillsWithStatus);
  } catch (error) {
    console.error("Failed to fetch user skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
