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

    const requests = await prisma.request.findMany({
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
    const requestsWithStatus = requests.map(request => ({
      ...request,
      status: "OPEN" // You can expand this logic based on your requirements
    }));

    return NextResponse.json(requestsWithStatus);
  } catch (error) {
    console.error("Admin requests fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
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
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    await prisma.request.delete({
      where: { id: requestId }
    });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Admin request delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
