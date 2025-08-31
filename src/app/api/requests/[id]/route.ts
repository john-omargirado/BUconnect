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

    const { id: requestId } = await params;

    // Check if the request belongs to the current user
    const helpRequest = await prisma.request.findFirst({
      where: {
        id: requestId,
        userId: session.user.id
      }
    });

    if (!helpRequest) {
      return NextResponse.json(
        { error: "Request not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the request
    await prisma.request.delete({
      where: { id: requestId }
    });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Failed to delete request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
