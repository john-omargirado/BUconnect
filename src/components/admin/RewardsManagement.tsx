"use client";

import { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  Users,
  Gift,
  Plus,
  Minus,
  ShoppingCart,
  Award,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TokenStats {
  totalTransactions: number;
  totalEarned: number;
  totalSpent: number;
  earnTransactions: number;
  spendTransactions: number;
}

interface PurchaseStats {
  totalPurchases: number;
  uniqueBuyers: number;
  itemStats: {
    rewardItemId: string;
    purchaseCount: number;
  }[];
}

interface UserBalance {
  id: string;
  name: string;
  email: string;
  balance: number;
  transactionCount: number;
  purchaseCount: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  userName: string;
  userEmail: string;
}

interface Purchase {
  id: string;
  rewardItemId: string;
  createdAt: string;
  userName: string;
  userEmail: string;
}

interface RewardManagementData {
  tokenStats: TokenStats;
  purchaseStats: PurchaseStats;
  allUsers: UserBalance[];
  userBalances: UserBalance[];
  recentTransactions: Transaction[];
  recentPurchases: Purchase[];
}

export default function RewardsManagement() {
  const [data, setData] = useState<RewardManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userSearch, setUserSearch] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [tokenDescription, setTokenDescription] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/rewards");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched reward data:", result);
      setData(result);

    } catch (error) {
      console.error("Error fetching reward data:", error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const handleTokenAction = async (action: "award_tokens" | "deduct_tokens") => {
    if (!selectedUser || !tokenAmount || processing) return;

    const amount = parseInt(tokenAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid token amount");
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch("/api/admin/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          userId: selectedUser,
          amount,
          description: tokenDescription || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setTokenAmount("");
        setTokenDescription("");
        setSelectedUser("");
        setUserSearch("");
        await fetchData(); // Refresh data
      } else {
        alert(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error processing token action:", error);
      alert("Operation failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Filter users based on search
  const filteredUsers = data?.allUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Failed to load reward data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.tokenStats.totalEarned.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {data.tokenStats.earnTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {data.tokenStats.totalSpent.toLocaleString()}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {data.tokenStats.spendTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Flow</p>
                <p className={`text-2xl font-bold ${(data.tokenStats.totalEarned - data.tokenStats.totalSpent) >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                  }`}>
                  {(data.tokenStats.totalEarned - data.tokenStats.totalSpent).toLocaleString()}
                </p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {data.tokenStats.totalTransactions} total transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.userBalances.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              With token activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Token Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            Token Management
          </CardTitle>
          <CardDescription>Award or deduct tokens from users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Users</label>
              <Input
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select user...</option>
                {filteredUsers.slice(0, 50).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.balance} tokens)
                  </option>
                ))}
                {filteredUsers.length > 50 && (
                  <option disabled>... and {filteredUsers.length - 50} more (refine search)</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <Input
                type="number"
                placeholder="0"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                min="1"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
              <Input
                placeholder="Reason for token adjustment..."
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleTokenAction("award_tokens")}
                disabled={!selectedUser || !tokenAmount || processing}
              >
                <Plus className="w-4 h-4 mr-1" />
                Award
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTokenAction("deduct_tokens")}
                disabled={!selectedUser || !tokenAmount || processing}
              >
                <Minus className="w-4 h-4 mr-1" />
                Deduct
              </Button>
            </div>
          </div>

          {/* Show selected user info */}
          {selectedUser && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              {(() => {
                const selectedUserInfo = data.allUsers.find(u => u.id === selectedUser);
                return selectedUserInfo ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {selectedUserInfo.name} ({selectedUserInfo.email})
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Current balance: {selectedUserInfo.balance} tokens •
                        {selectedUserInfo.transactionCount} transactions •
                        {selectedUserInfo.purchaseCount} purchases
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Balances and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top User Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Top Token Holders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.userBalances.slice(0, 10).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${index === 0 ? "bg-yellow-500" :
                        index === 1 ? "bg-gray-400" :
                          index === 2 ? "bg-orange-500" : "bg-blue-500"
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {user.balance.toLocaleString()} tokens
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.transactionCount} transactions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {transaction.userName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={transaction.type === "EARNED" ? "success" : "secondary"}>
                      {transaction.type === "EARNED" ? "+" : "-"}{transaction.amount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Statistics */}
      {data.purchaseStats.itemStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Popular Rewards
            </CardTitle>
            <CardDescription>
              {data.purchaseStats.totalPurchases} total purchases by {data.purchaseStats.uniqueBuyers} unique buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.purchaseStats.itemStats.slice(0, 6).map((stat) => (
                <div key={stat.rewardItemId} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {stat.rewardItemId.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Purchases</span>
                    <Badge variant="primary">{stat.purchaseCount}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
