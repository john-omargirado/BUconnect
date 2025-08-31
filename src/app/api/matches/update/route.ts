import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { matchId, status, rating } = await request.json();

    if (!matchId || !status) {
      return NextResponse.json(
        { error: "Match ID and status are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get the match details first
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        skill: {
          include: {
            user: true
          }
        },
        request: {
          include: {
            user: true
          }
        }
      }
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    // Verify user has permission to update this match
    const hasPermission = 
      match.skill.userId === userId || // Skill owner
      match.request.userId === userId || // Request owner
      match.userId === userId; // Match creator

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized to update this match" },
        { status: 403 }
      );
    }

    let tokensToAward = 0;

    // Calculate token rewards for completed services
    if (status === 'COMPLETED') {
      // Base tokens for completion
      tokensToAward = 25;

      // Bonus tokens based on rating (if provided)
      if (rating && rating >= 1 && rating <= 5) {
        const ratingBonus = Math.floor((rating - 1) * 12.5); // 0-50 bonus tokens
        tokensToAward += ratingBonus;
      }

      // Update match with tokens awarded
      await prisma.$executeRaw`
        UPDATE matches 
        SET status = ${status}, 
            tokensAwarded = ${tokensToAward},
            updatedAt = datetime('now')
        WHERE id = ${matchId}
      `;

      // Award tokens to the skill provider (the person who helped)
      const skillProviderId = match.skill.userId;
      
      await prisma.$executeRaw`
        UPDATE users 
        SET connectTokens = connectTokens + ${tokensToAward},
            completedServices = completedServices + 1,
            totalRating = totalRating + ${rating || 0}
        WHERE id = ${skillProviderId}
      `;

      // Create token transaction record
      await prisma.$executeRaw`
        INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
        VALUES (
          lower(hex(randomblob(12))), 
          ${skillProviderId}, 
          ${tokensToAward}, 
          'EARNED', 
          'Service completed: ${match.skill.title}', 
          datetime('now')
        )
      `;

      // If rating was provided, create feedback record
      if (rating && rating >= 1 && rating <= 5) {
        const feedbackGiverId = userId; // Person marking as complete
        const feedbackReceiverId = skillProviderId; // Person who provided the skill

        await prisma.$executeRaw`
          INSERT INTO feedback (id, rating, giverId, receiverId, matchId, createdAt)
          VALUES (
            lower(hex(randomblob(12))),
            ${rating},
            ${feedbackGiverId},
            ${feedbackReceiverId},
            ${matchId},
            datetime('now')
          )
        `;

        // Update weekly rating (simplified - in production you'd calculate this properly)
        await prisma.$executeRaw`
          UPDATE users 
          SET weeklyRating = (
            SELECT AVG(CAST(f.rating AS FLOAT)) 
            FROM feedback f 
            WHERE f.receiverId = ${feedbackReceiverId}
            AND f.createdAt >= date('now', '-7 days')
          )
          WHERE id = ${feedbackReceiverId}
        `;
      }

      return NextResponse.json({
        success: true,
        match: {
          id: matchId,
          status,
          tokensAwarded: tokensToAward
        },
        tokensAwarded: tokensToAward,
        message: `Service completed! ${tokensToAward} tokens awarded.`
      });

    } else {
      // For other status updates (ACCEPTED, REJECTED)
      await prisma.$executeRaw`
        UPDATE matches 
        SET status = ${status},
            updatedAt = datetime('now')
        WHERE id = ${matchId}
      `;

      return NextResponse.json({
        success: true,
        match: {
          id: matchId,
          status
        },
        message: `Match status updated to ${status.toLowerCase()}.`
      });
    }

  } catch (error) {
    console.error("Failed to update match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
