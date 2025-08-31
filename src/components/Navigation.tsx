"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  HelpCircle,
  User,
  LogOut,
  Bell,
  Settings,
  Menu,
  X,
  Shield,
  Activity,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  Users,
  AlertCircle,
  Star,
  Coins
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useRef, useEffect } from "react";
import { useUserRewards } from "@/hooks/useUserRewards";
import RewardEffects from "@/components/RewardEffects";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Use the real notifications hook
  // Real-time notifications system
  const {
    notifications,
    unreadCount,
    isLoading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useRealTimeNotifications();

  // Get user rewards for effects
  const { getActiveReward } = useUserRewards();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!session) {
    return null;
  }

  // Different navigation items based on user role
  const navigationItems = session.user.role === "ADMIN"
    ? [
      { href: "/admin", label: "Admin Dashboard", icon: Shield },
    ]
    : [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/skills", label: "Skills", icon: BookOpen },
      { href: "/requests", label: "Requests", icon: HelpCircle },
      { href: "/connections", label: "Connections", icon: MessageSquare },
      { href: "/tokens", label: "Tokens & Rewards", icon: Coins },
      { href: "/my-activity", label: "My Activity", icon: Activity },
    ];

  const isActive = (href: string) => {
    return currentPage === href || (currentPage?.startsWith(href) && href !== "/");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'skill_match':
      case 'match':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'new_request':
        return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case 'new_skill':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'match_accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'match_rejected':
        return <X className="w-4 h-4 text-red-500" />;
      case 'feedback_received':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'connection':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/90 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
            className="flex items-center"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-primary dark:to-primary/80 rounded-lg flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white font-bold text-sm">BU</span>
            </div>
            <span className="text-xl font-bold text-foreground">Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {/* Enhanced Notification Button */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="outline"
                size="sm"
                className="relative hover:bg-accent transition-colors"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-medium shadow-lg z-10"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full opacity-75"
                    />
                  </>
                )}
              </Button>

              {/* Enhanced Notification Dropdown */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 px-4 py-3 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                          {unreadCount > 0 && (
                            <Badge variant="danger" className="text-xs">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Mark all read
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            We&apos;ll notify you about new matches and messages
                          </p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`relative p-4 hover:bg-accent/50 transition-colors border-l-4 cursor-pointer group ${!notification.isRead
                                  ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                                  : 'border-l-transparent'
                                }`}
                              onClick={() => {
                                markAsRead(notification.id);
                                // For now, just close the notification panel
                                setIsNotificationOpen(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-foreground mb-1">
                                        {notification.title}
                                      </p>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="w-3 h-3" />
                                          {new Date(notification.createdAt).toLocaleString()}
                                        </div>
                                        {!notification.isRead && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Remove notification from list
                                        if (removeNotification) {
                                          removeNotification(notification.id);
                                        }
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="border-t border-border bg-muted/30 px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-center text-sm"
                          onClick={() => {
                            setIsNotificationOpen(false);
                            // In a real app, navigate to notifications page
                          }}
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <RewardEffects
                  rewardType="profile"
                  profileBorder={getActiveReward("PROFILE_BORDER")?.config}
                  specialEffect={getActiveReward("SPECIAL_EFFECT")?.config}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-primary dark:to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </RewardEffects>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-foreground">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.role === "ADMIN" ? "Administrator" : "Student"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link href="/profile">
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />

            {/* Mobile Notification Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-medium shadow-sm"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-4"
          >
            <div className="space-y-2">
              {/* Mobile Notifications Section */}
              {unreadCount > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Notifications
                      </span>
                      <Badge variant="danger" className="text-xs">
                        {unreadCount}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsNotificationOpen(!isNotificationOpen);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400"
                    >
                      {isNotificationOpen ? 'Hide' : 'View'}
                    </Button>
                  </div>

                  {/* Mobile Notification List */}
                  <AnimatePresence>
                    {isNotificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 max-h-60 overflow-y-auto"
                      >
                        {notifications.slice(0, 3).map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-2 rounded-lg text-xs ${!notification.isRead
                                ? 'bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800'
                                : 'bg-blue-25 dark:bg-blue-950/10'
                              }`}
                            onClick={() => {
                              markAsRead(notification.id);
                              // For now, just close the notification
                              setIsMobileMenuOpen(false);
                              setIsNotificationOpen(false);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{notification.title}</p>
                                <p className="text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-muted-foreground mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-blue-600 dark:text-blue-400"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsNotificationOpen(false);
                          }}
                        >
                          View all notifications
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex items-center px-3 py-2 mb-2">
                  <RewardEffects
                    rewardType="profile"
                    profileBorder={getActiveReward("PROFILE_BORDER")?.config}
                    specialEffect={getActiveReward("SPECIAL_EFFECT")?.config}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-primary dark:to-primary/80 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </RewardEffects>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.role === "ADMIN" ? "Administrator" : "Student"}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </Link>

                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
