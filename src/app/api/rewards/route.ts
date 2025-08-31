/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Predefined reward items
const REWARD_ITEMS = [
  // Profile Borders - Basic Tier
  {
    id: "profile_border_blue",
    name: "Ocean Blue Border",
    description: "A calming blue border for your profile",
    type: "PROFILE_BORDER",
    price: 50,
    config: JSON.stringify({
      borderColor: "#45B6FE",
      borderWidth: "2px",
      borderStyle: "solid",
      glowEffect: false
    })
  },
  {
    id: "profile_border_green",
    name: "Nature Green Border",
    description: "Fresh green border inspired by nature",
    type: "PROFILE_BORDER",
    price: 50,
    config: JSON.stringify({
      borderColor: "#22c55e",
      borderWidth: "2px",
      borderStyle: "solid",
      glowEffect: false
    })
  },
  {
    id: "profile_border_purple",
    name: "Royal Purple Border",
    description: "Elegant purple border for a royal touch",
    type: "PROFILE_BORDER",
    price: 75,
    config: JSON.stringify({
      borderColor: "#8b5cf6",
      borderWidth: "2px",
      borderStyle: "solid",
      glowEffect: true
    })
  },
  // Profile Borders - Premium Tier
  {
    id: "profile_border_gold",
    name: "Golden Profile Border",
    description: "A prestigious golden border for your profile",
    type: "PROFILE_BORDER",
    price: 150,
    config: JSON.stringify({
      borderColor: "#FFD700",
      borderWidth: "3px",
      borderStyle: "solid",
      glowEffect: true
    })
  },
  {
    id: "profile_border_rainbow",
    name: "Rainbow Border",
    description: "Vibrant rainbow border with color cycling",
    type: "PROFILE_BORDER",
    price: 200,
    config: JSON.stringify({
      borderColor: "linear-gradient(45deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
      borderWidth: "3px",
      borderStyle: "solid",
      glowEffect: true,
      animation: "rainbow"
    })
  },
  {
    id: "profile_border_diamond",
    name: "Diamond Profile Border",
    description: "An exclusive diamond-studded profile border",
    type: "PROFILE_BORDER",
    price: 300,
    config: JSON.stringify({
      borderColor: "linear-gradient(45deg, #B8860B, #FFD700, #FFFFFF)",
      borderWidth: "4px",
      borderStyle: "solid",
      glowEffect: true,
      animation: "sparkle"
    })
  },

  // Card Themes - Basic Tier
  {
    id: "card_theme_minimal",
    name: "Minimal Clean Theme",
    description: "Clean and simple design for a professional look",
    type: "CARD_THEME",
    price: 30,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      textColor: "#334155",
      animation: "none",
      pattern: "none"
    })
  },
  {
    id: "card_theme_forest",
    name: "Forest Green Theme",
    description: "Natural forest colors with leaf patterns",
    type: "CARD_THEME",
    price: 75,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #065f46 0%, #059669 100%)",
      textColor: "#ecfdf5",
      animation: "subtle",
      pattern: "leaves"
    })
  },
  {
    id: "card_theme_ocean",
    name: "Ocean Wave Theme",
    description: "Beautiful ocean-themed cards with wave animations",
    type: "CARD_THEME",
    price: 100,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
      textColor: "#e0f2fe",
      animation: "wave",
      pattern: "waves"
    })
  },
  {
    id: "card_theme_sunset",
    name: "Sunset Glow Theme",
    description: "Warm sunset colors with gentle glow effects",
    type: "CARD_THEME",
    price: 100,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #dc2626 100%)",
      textColor: "#fef7cd",
      animation: "glow",
      pattern: "none"
    })
  },
  // Card Themes - Premium Tier
  {
    id: "card_theme_galaxy",
    name: "Galaxy Space Theme",
    description: "Deep space theme with twinkling stars",
    type: "CARD_THEME",
    price: 180,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #581c87 100%)",
      textColor: "#e0e7ff",
      animation: "twinkle",
      pattern: "stars",
      glowColor: "#8b5cf6"
    })
  },
  {
    id: "card_theme_neon",
    name: "Neon Cyber Theme",
    description: "Futuristic neon theme with cyber effects",
    type: "CARD_THEME",
    price: 200,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      textColor: "#00ff41",
      animation: "neon",
      pattern: "circuit",
      glowColor: "#00ff41"
    })
  },
  {
    id: "card_theme_fire",
    name: "Fire Element Theme",
    description: "Blazing fire theme with flame animations",
    type: "CARD_THEME",
    price: 220,
    config: JSON.stringify({
      background: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f59e0b 100%)",
      textColor: "#fef2f2",
      animation: "flame",
      pattern: "fire",
      glowColor: "#f59e0b"
    })
  },

  // Badges - Achievement Tier
  {
    id: "badge_first_helper",
    name: "First Helper Badge",
    description: "Congratulations on your first completed service!",
    type: "BADGE",
    price: 25,
    config: JSON.stringify({
      icon: "star",
      color: "#3b82f6",
      title: "First Helper",
      rarity: "common"
    })
  },
  {
    id: "badge_problem_solver",
    name: "Problem Solver Badge",
    description: "For those who excel at solving complex problems",
    type: "BADGE",
    price: 100,
    config: JSON.stringify({
      icon: "brain",
      color: "#8b5cf6",
      title: "Problem Solver",
      rarity: "rare"
    })
  },
  {
    id: "badge_mentor",
    name: "Mentor Badge",
    description: "Recognized for outstanding mentorship",
    type: "BADGE",
    price: 150,
    config: JSON.stringify({
      icon: "graduation-cap",
      color: "#059669",
      title: "Mentor",
      rarity: "epic"
    })
  },
  {
    id: "badge_top_helper",
    name: "Top Helper Badge",
    description: "Showcase your dedication to helping others",
    type: "BADGE",
    price: 250,
    config: JSON.stringify({
      icon: "trophy",
      color: "#f59e0b",
      title: "Top Helper",
      rarity: "legendary"
    })
  },
  {
    id: "badge_community_hero",
    name: "Community Hero Badge",
    description: "The ultimate recognition for community contribution",
    type: "BADGE",
    price: 500,
    config: JSON.stringify({
      icon: "crown",
      color: "#dc2626",
      title: "Community Hero",
      rarity: "mythic"
    })
  },

  // Special Effects
  {
    id: "effect_particle_trail",
    name: "Particle Trail Effect",
    description: "Leave a trail of particles when you interact",
    type: "SPECIAL_EFFECT",
    price: 120,
    config: JSON.stringify({
      type: "particle_trail",
      color: "#45B6FE",
      intensity: "medium"
    })
  },
  {
    id: "effect_glow_aura",
    name: "Glow Aura Effect",
    description: "Subtle glow effect around your profile elements",
    type: "SPECIAL_EFFECT",
    price: 150,
    config: JSON.stringify({
      type: "glow_aura",
      color: "#fbbf24",
      intensity: "soft"
    })
  },
  {
    id: "effect_floating_icons",
    name: "Floating Icons Effect",
    description: "Animated icons floating around your profile",
    type: "SPECIAL_EFFECT",
    price: 200,
    config: JSON.stringify({
      type: "floating_icons",
      icons: ["star", "heart", "zap"],
      speed: "slow"
    })
  },

  // Title Upgrades
  {
    id: "title_skillmaster",
    name: "SkillMaster Title",
    description: "Display 'SkillMaster' title on your profile",
    type: "TITLE",
    price: 100,
    config: JSON.stringify({
      title: "SkillMaster",
      color: "#8b5cf6",
      style: "bold"
    })
  },
  {
    id: "title_knowledge_seeker",
    name: "Knowledge Seeker Title",
    description: "Show your passion for learning",
    type: "TITLE",
    price: 80,
    config: JSON.stringify({
      title: "Knowledge Seeker",
      color: "#059669",
      style: "italic"
    })
  },
  {
    id: "title_community_champion",
    name: "Community Champion Title",
    description: "The highest honor for community builders",
    type: "TITLE",
    price: 300,
    config: JSON.stringify({
      title: "Community Champion",
      color: "#dc2626",
      style: "gradient"
    })
  }
];

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

    // Get user's token balance
    const userData: any = await prisma.$queryRaw`
      SELECT 
        u.id,
        COALESCE(u.connectTokens, 0) as connectTokens
      FROM users u
      WHERE u.id = ${userId}
    `;

    const userBalance = Number(userData[0]?.connectTokens || 0);

    // Get reward items from database
    const rewardItems: any[] = await prisma.$queryRaw`
      SELECT id, name, description, type, price, config, isActive
      FROM reward_items
      WHERE isActive = true
      ORDER BY price ASC
    `;

    // Get user's purchased items
    const purchasedItems: any[] = await prisma.$queryRaw`
      SELECT p.rewardItemId, p.createdAt
      FROM purchases p
      WHERE p.userId = ${userId}
    `;

    const purchasedItemIds = new Set(purchasedItems.map(p => p.rewardItemId));

    // Return available items with purchase status
    const availableItems = rewardItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: Number(item.price),
      config: item.config,
      owned: purchasedItemIds.has(item.id),
      canAfford: userBalance >= Number(item.price)
    }));

    return NextResponse.json({
      userBalance,
      items: availableItems,
      categories: [
        { id: "PROFILE_BORDER", name: "Profile Borders", description: "Customize your profile appearance" },
        { id: "CARD_THEME", name: "Card Themes", description: "Beautiful themes for your skill and request cards" },
        { id: "BADGE", name: "Badges", description: "Show off your achievements" },
        { id: "SPECIAL_EFFECT", name: "Special Effects", description: "Unique visual enhancements" },
        { id: "TITLE", name: "Profile Titles", description: "Custom titles to display on your profile" }
      ]
    });

  } catch (error) {
    console.error("Failed to fetch rewards:", error);
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

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Find the item in database
    const items: any[] = await prisma.$queryRaw`
      SELECT id, name, description, type, price, config, isActive
      FROM reward_items
      WHERE id = ${itemId} AND isActive = true
    `;

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Item not found or not available" },
        { status: 404 }
      );
    }

    const item = items[0];

    // Check if user already owns this item
    const existingPurchase: any[] = await prisma.$queryRaw`
      SELECT id FROM purchases WHERE userId = ${userId} AND rewardItemId = ${itemId}
    `;

    if (existingPurchase.length > 0) {
      return NextResponse.json(
        { error: "You already own this item" },
        { status: 400 }
      );
    }

    // Check user's balance
    const userData: any = await prisma.$queryRaw`
      SELECT COALESCE(connectTokens, 0) as connectTokens FROM users WHERE id = ${userId}
    `;

    const userBalance = Number(userData[0]?.connectTokens || 0);
    const itemPrice = Number(item.price);

    if (userBalance < itemPrice) {
      return NextResponse.json(
        { error: "Insufficient Connect Tokens" },
        { status: 400 }
      );
    }

    // Process the purchase
    try {
      // Deduct tokens from user
      await prisma.$executeRaw`
        UPDATE users 
        SET connectTokens = connectTokens - ${itemPrice}
        WHERE id = ${userId}
      `;

      // Create purchase record
      await prisma.$executeRaw`
        INSERT INTO purchases (id, userId, rewardItemId, createdAt)
        VALUES (lower(hex(randomblob(12))), ${userId}, ${itemId}, datetime('now'))
      `;

      // Create transaction record
      await prisma.$executeRaw`
        INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
        VALUES (
          lower(hex(randomblob(12))), 
          ${userId}, 
          ${itemPrice}, 
          'SPENT', 
          ${`Purchased: ${item.name}`}, 
          datetime('now')
        )
      `;

      // Get new balance
      const newBalanceData: any = await prisma.$queryRaw`
        SELECT COALESCE(connectTokens, 0) as connectTokens FROM users WHERE id = ${userId}
      `;

      return NextResponse.json({
        success: true,
        item: {
          id: item.id,
          name: item.name,
          type: item.type,
          config: item.config ? JSON.parse(item.config) : null
        },
        newBalance: Number(newBalanceData[0]?.connectTokens || 0),
        message: `Successfully purchased ${item.name}!`
      });

    } catch (purchaseError) {
      console.error("Purchase transaction failed:", purchaseError);
      return NextResponse.json(
        { error: "Purchase failed. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Failed to process purchase:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
