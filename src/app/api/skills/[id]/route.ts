import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: skillId } = await params;

    // Check if the skill belongs to the current user
    const skill = await prisma.skill.findFirst({
      where: {
        id: skillId,
        userId: session.user.id
      }
    });

    if (!skill) {
      return NextResponse.json(
        { error: "Skill not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the skill
    await prisma.skill.delete({
      where: { id: skillId }
    });

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
