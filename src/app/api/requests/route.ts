/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { VALID_CATEGORIES } from "@/types/categories";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.request.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category, contactInfo } = await request.json();

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { message: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json(
        {
          message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          validCategories: VALID_CATEGORIES
        },
        { status: 400 }
      );
    }

    const helpRequest = await prisma.request.create({
      data: {
        title,
        description,
        category,
        contactInfo: contactInfo || "",
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
    });

    return NextResponse.json(helpRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      {
        message: "Failed to create request",
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
