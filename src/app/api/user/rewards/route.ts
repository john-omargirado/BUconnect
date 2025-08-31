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

    // Get user's purchased rewards with reward details
    const purchasedRewards: any[] = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.rewardItemId,
        p.createdAt,
        r.name,
        r.description,
        r.type,
        r.config
      FROM purchases p
      JOIN reward_items r ON p.rewardItemId = r.id
      WHERE p.userId = ${userId}
      ORDER BY p.createdAt DESC
    `;

    // Process and group rewards by type
    const rewardsByType: { [key: string]: any[] } = {
      PROFILE_BORDER: [],
      CARD_THEME: [],
      BADGE: [],
      SPECIAL_EFFECT: [],
      TITLE: []
    };

    const processedRewards = purchasedRewards.map(reward => {
      const config = reward.config ? JSON.parse(reward.config) : {};
      const processedReward = {
        id: reward.rewardItemId,
        name: reward.name,
        description: reward.description,
        type: reward.type,
        config,
        purchasedAt: reward.createdAt
      };

      if (rewardsByType[reward.type]) {
        rewardsByType[reward.type].push(processedReward);
      }

      return processedReward;
    });

    // Get user's active selections from preferences
    const userPrefs: any[] = await prisma.$queryRaw`
      SELECT preferences FROM users WHERE id = ${userId}
    `;

    let activeSelections = {
      profileBorder: null,
      cardTheme: null,
      badge: null,
      specialEffect: null,
      title: null
    };

    try {
      if (userPrefs[0]?.preferences) {
        const prefs = JSON.parse(userPrefs[0].preferences);
        activeSelections = {
          profileBorder: prefs.activePROFILE_BORDER || null,
          cardTheme: prefs.activeCARD_THEME || null,
          badge: prefs.activeBADGE || null,
          specialEffect: prefs.activeSPECIAL_EFFECT || null,
          title: prefs.activeTITLE || null
        };
      }
    } catch (error) {
      console.error("Failed to parse user preferences:", error);
    }

    return NextResponse.json({
      purchasedRewards: processedRewards,
      rewardsByType,
      activeSelections,
      totalPurchases: purchasedRewards.length
    });

  } catch (error) {
    console.error("Failed to fetch user rewards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { action, rewardId, rewardType } = await request.json();
    const userId = session.user.id;

    if (action === "activate") {
      // Check if user owns this reward
      const ownsReward: any[] = await prisma.$queryRaw`
        SELECT p.id FROM purchases p 
        WHERE p.userId = ${userId} AND p.rewardItemId = ${rewardId}
      `;

      if (ownsReward.length === 0) {
        return NextResponse.json(
          { error: "You don't own this reward" },
          { status: 403 }
        );
      }

      // For now, we'll store active selections in user preferences
      // Later we can create a separate table for this
      const fieldName = getActiveFieldName(rewardType);

      if (fieldName) {
        // Update user's active reward selection
        // We'll store this in a JSON field or create a separate table
        await prisma.$executeRaw`
          UPDATE users 
          SET preferences = json_set(
            COALESCE(preferences, '{}'), 
            ${`$.active${rewardType}`}, 
            ${rewardId}
          )
          WHERE id = ${userId}
        `;
      }

      return NextResponse.json({
        success: true,
        message: "Reward activated successfully"
      });

    } else if (action === "deactivate") {
      const fieldName = getActiveFieldName(rewardType);

      if (fieldName) {
        await prisma.$executeRaw`
          UPDATE users 
          SET preferences = json_remove(
            COALESCE(preferences, '{}'), 
            ${`$.active${rewardType}`}
          )
          WHERE id = ${userId}
        `;
      }

      return NextResponse.json({
        success: true,
        message: "Reward deactivated successfully"
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Failed to manage reward activation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getActiveFieldName(rewardType: string): string | null {
  const mapping: { [key: string]: string } = {
    'PROFILE_BORDER': 'ProfileBorder',
    'CARD_THEME': 'CardTheme',
    'BADGE': 'Badge',
    'SPECIAL_EFFECT': 'SpecialEffect',
    'TITLE': 'Title'
  };

  return mapping[rewardType] || null;
}
