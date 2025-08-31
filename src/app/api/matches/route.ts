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
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all matches where user is involved (either through their skills or requests)
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          {
            skill: {
              userId: userId
            }
          },
          {
            request: {
              userId: userId
            }
          },
          {
            userId: userId // Matches the user initiated
          }
        ]
      },
      include: {
        skill: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                trustScore: true
              }
            }
          }
        },
        request: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                trustScore: true
              }
            }
          }
        },
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
        createdAt: 'desc'
      }
    });

    return NextResponse.json(matches);

  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
