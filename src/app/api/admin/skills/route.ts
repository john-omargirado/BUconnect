import { NextRequest, NextResponse } from "next/server";
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

    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            trustScore: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Add a status field for admin management
    const skillsWithStatus = skills.map(skill => ({
      ...skill,
      status: "ACTIVE" // You can expand this logic based on your requirements
    }));

    return NextResponse.json(skillsWithStatus);
  } catch (error) {
    console.error("Admin skills fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get("id");

    if (!skillId) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

    await prisma.skill.delete({
      where: { id: skillId }
    });

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Admin skill delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
