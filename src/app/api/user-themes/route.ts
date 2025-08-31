/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get themes for multiple users
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ userThemes: {} });
    }

    const userThemes: Record<string, any> = {};

    // For each user, get their active rewards from purchases and user preferences
    for (const userId of userIds) {
      try {
        // Get user's basic info including image
        const userInfo: any[] = await prisma.$queryRaw`
          SELECT name, image FROM users WHERE id = ${userId}
        `;

        // Get user's active selections from preferences
        const userPrefs: any[] = await prisma.$queryRaw`
          SELECT preferences FROM users WHERE id = ${userId}
        `;

        let activeSelections = {
          cardTheme: null,
          profileBorder: null,
          title: null
        };

        if (userPrefs[0]?.preferences) {
          try {
            const prefs = JSON.parse(userPrefs[0].preferences);
            activeSelections = {
              cardTheme: prefs.activeCARD_THEME,
              profileBorder: prefs.activePROFILE_BORDER,
              title: prefs.activeTITLE
            };
          } catch (error) {
            console.error("Failed to parse user preferences for user", userId, ":", error);
          }
        }

        const userThemeData: any = {
          name: userInfo[0]?.name || 'Unknown User',
          image: userInfo[0]?.image || null
        };

        // Get active card theme
        if (activeSelections.cardTheme) {
          const cardThemeData: any[] = await prisma.$queryRaw`
            SELECT ri.config
            FROM purchases p
            JOIN reward_items ri ON p.rewardItemId = ri.id
            WHERE p.userId = ${userId} 
              AND p.rewardItemId = ${activeSelections.cardTheme}
              AND ri.type = 'CARD_THEME'
              AND ri.isActive = true
          `;

          if (cardThemeData.length > 0) {
            try {
              userThemeData.cardTheme = JSON.parse(cardThemeData[0].config);
            } catch (error) {
              console.error("Failed to parse card theme config for user", userId, ":", error);
            }
          }
        }

        // Get active profile border
        if (activeSelections.profileBorder) {
          const profileBorderData: any[] = await prisma.$queryRaw`
            SELECT ri.config
            FROM purchases p
            JOIN reward_items ri ON p.rewardItemId = ri.id
            WHERE p.userId = ${userId} 
              AND p.rewardItemId = ${activeSelections.profileBorder}
              AND ri.type = 'PROFILE_BORDER'
              AND ri.isActive = true
          `;

          if (profileBorderData.length > 0) {
            try {
              userThemeData.profileBorder = JSON.parse(profileBorderData[0].config);
            } catch (error) {
              console.error("Failed to parse profile border config for user", userId, ":", error);
            }
          }
        }

        // Get active title
        if (activeSelections.title) {
          const titleData: any[] = await prisma.$queryRaw`
            SELECT ri.config
            FROM purchases p
            JOIN reward_items ri ON p.rewardItemId = ri.id
            WHERE p.userId = ${userId} 
              AND p.rewardItemId = ${activeSelections.title}
              AND ri.type = 'TITLE'
              AND ri.isActive = true
          `;

          if (titleData.length > 0) {
            try {
              userThemeData.title = JSON.parse(titleData[0].config);
            } catch (error) {
              console.error("Failed to parse title config for user", userId, ":", error);
            }
          }
        }

        // Only add to userThemes if we have any data
        if (Object.keys(userThemeData).length > 2) { // More than just name and image
          userThemes[userId] = userThemeData;
        } else if (userThemeData.name || userThemeData.image) {
          // At least add basic user info
          userThemes[userId] = {
            name: userThemeData.name,
            image: userThemeData.image
          };
        }
      } catch (error) {
        console.error(`Error fetching themes for user ${userId}:`, error);
        // Continue processing other users even if one fails
      }
    }

    return NextResponse.json({ userThemes });

  } catch (error) {
    console.error("Failed to fetch user themes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
