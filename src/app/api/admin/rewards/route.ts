/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/rewards - Get all reward management data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.email !== "admin@buconnect.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    // Get token transaction statistics
    const tokenStats: any[] = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as totalTransactions,
        SUM(CASE WHEN type = 'EARNED' THEN amount ELSE 0 END) as totalEarned,
        SUM(CASE WHEN type = 'SPENT' THEN amount ELSE 0 END) as totalSpent,
        COUNT(CASE WHEN type = 'EARNED' THEN 1 END) as earnTransactions,
        COUNT(CASE WHEN type = 'SPENT' THEN 1 END) as spendTransactions
      FROM token_transactions
    `;

    // Get purchase statistics
    const purchaseStats: any[] = await prisma.$queryRaw`
      SELECT 
        rewardItemId,
        COUNT(*) as purchaseCount
      FROM purchases
      GROUP BY rewardItemId
      ORDER BY purchaseCount DESC
      LIMIT 20
    `;

    // Get total purchase count for summary
    const totalPurchaseCount: any[] = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as totalPurchases,
        COUNT(DISTINCT userId) as uniqueBuyers
      FROM purchases
    `;

    // Get user token balances (include all users)
    const userBalances: any[] = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(u.connectTokens, 0) as balance,
        COALESCE(transaction_counts.transactionCount, 0) as transactionCount,
        COALESCE(purchase_counts.purchaseCount, 0) as purchaseCount
      FROM users u
      LEFT JOIN (
        SELECT userId, COUNT(*) as transactionCount
        FROM token_transactions
        GROUP BY userId
      ) transaction_counts ON u.id = transaction_counts.userId
      LEFT JOIN (
        SELECT userId, COUNT(*) as purchaseCount
        FROM purchases
        GROUP BY userId
      ) purchase_counts ON u.id = purchase_counts.userId
      ORDER BY u.connectTokens DESC, u.name ASC
      LIMIT 500
    `;

    // Get user balances for active token holders (for statistics display)
    const activeUserBalances: any[] = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(u.connectTokens, 0) as balance,
        COALESCE(transaction_counts.transactionCount, 0) as transactionCount,
        COALESCE(purchase_counts.purchaseCount, 0) as purchaseCount
      FROM users u
      LEFT JOIN (
        SELECT userId, COUNT(*) as transactionCount
        FROM token_transactions
        GROUP BY userId
      ) transaction_counts ON u.id = transaction_counts.userId
      LEFT JOIN (
        SELECT userId, COUNT(*) as purchaseCount
        FROM purchases
        GROUP BY userId
      ) purchase_counts ON u.id = purchase_counts.userId
      WHERE COALESCE(u.connectTokens, 0) > 0 
         OR COALESCE(transaction_counts.transactionCount, 0) > 0 
         OR COALESCE(purchase_counts.purchaseCount, 0) > 0
      ORDER BY u.connectTokens DESC
      LIMIT 100
    `;

    // Get recent transactions
    const recentTransactions: any[] = await prisma.$queryRaw`
      SELECT 
        tt.id,
        tt.amount,
        tt.type,
        tt.description,
        tt.createdAt,
        u.name as userName,
        u.email as userEmail
      FROM token_transactions tt
      JOIN users u ON tt.userId = u.id
      ORDER BY tt.createdAt DESC
      LIMIT 50
    `;

    // Get recent purchases
    const recentPurchases: any[] = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.rewardItemId,
        p.createdAt,
        u.name as userName,
        u.email as userEmail
      FROM purchases p
      JOIN users u ON p.userId = u.id
      ORDER BY p.createdAt DESC
      LIMIT 50
    `;

    return NextResponse.json({
      tokenStats: {
        totalTransactions: Number(tokenStats[0]?.totalTransactions || 0),
        totalEarned: Number(tokenStats[0]?.totalEarned || 0),
        totalSpent: Number(tokenStats[0]?.totalSpent || 0),
        earnTransactions: Number(tokenStats[0]?.earnTransactions || 0),
        spendTransactions: Number(tokenStats[0]?.spendTransactions || 0)
      },
      purchaseStats: {
        totalPurchases: Number(totalPurchaseCount[0]?.totalPurchases || 0),
        uniqueBuyers: Number(totalPurchaseCount[0]?.uniqueBuyers || 0),
        itemStats: purchaseStats.map(stat => ({
          rewardItemId: stat.rewardItemId,
          purchaseCount: Number(stat.purchaseCount)
        }))
      },
      allUsers: userBalances.map(user => ({
        ...user,
        balance: Number(user.balance),
        transactionCount: Number(user.transactionCount),
        purchaseCount: Number(user.purchaseCount)
      })),
      userBalances: activeUserBalances.map(user => ({
        ...user,
        balance: Number(user.balance),
        transactionCount: Number(user.transactionCount),
        purchaseCount: Number(user.purchaseCount)
      })),
      recentTransactions: recentTransactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount)
      })),
      recentPurchases
    });

  } catch (error) {
    console.error("Failed to fetch reward management data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/rewards - Award tokens to users or manage rewards
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.email !== "admin@buconnect.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { action, userId, amount, description } = await request.json();

    if (!action || !userId) {
      return NextResponse.json(
        { error: "Action and userId are required" },
        { status: 400 }
      );
    }

    if (action === "award_tokens") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Award tokens to user
      await prisma.$executeRaw`
        UPDATE users 
        SET connectTokens = COALESCE(connectTokens, 0) + ${amount}
        WHERE id = ${userId}
      `;

      // Create transaction record
      await prisma.$executeRaw`
        INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
        VALUES (
          lower(hex(randomblob(12))), 
          ${userId}, 
          ${amount}, 
          'EARNED', 
          ${description || `Admin awarded: ${amount} tokens`}, 
          datetime('now')
        )
      `;

      return NextResponse.json({
        success: true,
        message: `Successfully awarded ${amount} tokens to user`
      });

    } else if (action === "deduct_tokens") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "Valid amount is required" },
          { status: 400 }
        );
      }

      // Check user's balance first
      const userData: any[] = await prisma.$queryRaw`
        SELECT COALESCE(connectTokens, 0) as balance FROM users WHERE id = ${userId}
      `;

      const currentBalance = Number(userData[0]?.balance || 0);

      if (currentBalance < amount) {
        return NextResponse.json(
          { error: "User doesn't have sufficient tokens" },
          { status: 400 }
        );
      }

      // Deduct tokens from user
      await prisma.$executeRaw`
        UPDATE users 
        SET connectTokens = connectTokens - ${amount}
        WHERE id = ${userId}
      `;

      // Create transaction record
      await prisma.$executeRaw`
        INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
        VALUES (
          lower(hex(randomblob(12))), 
          ${userId}, 
          ${amount}, 
          'SPENT', 
          ${description || `Admin deducted: ${amount} tokens`}, 
          datetime('now')
        )
      `;

      return NextResponse.json({
        success: true,
        message: `Successfully deducted ${amount} tokens from user`
      });

    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Failed to manage rewards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
