/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user's current data including token balance (if the column exists)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // For now, return basic user info - we'll enhance once TypeScript recognizes new fields
    return NextResponse.json({
      balance: (user as any).connectTokens || 0,
      weeklyRating: (user as any).weeklyRating || 0,
      totalRating: (user as any).totalRating || user.trustScore,
      completedServices: (user as any).completedServices || 0,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        trustScore: user.trustScore
      }
    });

  } catch (error) {
    console.error("Failed to fetch token data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// For now, let's create a simple award tokens function
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { amount, description } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid token amount" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Update user tokens using raw SQL for now until TypeScript recognizes the field
    await prisma.$executeRaw`
      UPDATE users 
      SET connectTokens = connectTokens + ${amount}
      WHERE id = ${userId}
    `;

    // Create transaction record
    await prisma.$executeRaw`
      INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
      VALUES (lower(hex(randomblob(12))), ${userId}, ${amount}, 'EARNED', ${description || 'Token reward'}, datetime('now'))
    `;

    // Get updated balance
    const result: any = await prisma.$queryRaw`
      SELECT connectTokens FROM users WHERE id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      newBalance: result[0]?.connectTokens || 0,
      tokensAwarded: amount
    });

  } catch (error) {
    console.error("Failed to award tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
