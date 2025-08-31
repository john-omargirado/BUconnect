"use client";
/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  UserPlus,
  Mail,
  Star,
  Clock,
  CheckCheck,
  Circle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Local storage keys for state persistence
const STORAGE_KEYS = {
  ACTIVE_TAB: 'bu_connect_active_tab',
  SELECTED_CONTACT: 'bu_connect_selected_contact',
  LAST_CONVERSATION: 'bu_connect_last_conversation',
  MESSAGES_CACHE: 'bu_connect_messages_cache'
};

// State persistence helpers
const saveToLocalStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};
import Navigation from "@/components/Navigation";

interface Connection {
  id: string;
  name: string;
  email: string;
  image?: string;
  college?: string;
  department?: string;
  trustScore: number;
  status: string;
  connectedAt: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactImage?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-transparent border-t-primary"
        />
      </div>
    }>
      <ConnectionsContent />
    </Suspense>
  );
}

function ConnectionsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const contactParam = searchParams.get("contact");

  // Initialize state with persistence
  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Connection | null>(() => {
    // Try to restore from URL or localStorage
    if (typeof window !== 'undefined') {
      return loadFromLocalStorage(STORAGE_KEYS.SELECTED_CONTACT);
    }
    return null;
  });
  const [targetUser, setTargetUser] = useState<Connection | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"connections" | "messages">(() => {
    // Restore active tab from localStorage or URL
    if (typeof window !== 'undefined') {
      const savedTab = loadFromLocalStorage(STORAGE_KEYS.ACTIVE_TAB);
      if (contactParam || targetUserId) return "messages";
      return savedTab || "connections";
    }
    return "connections";
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save state to localStorage when values change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SELECTED_CONTACT, selectedContact);
  }, [selectedContact]);

  // Save messages to cache
  useEffect(() => {
    if (selectedContact && messages.length > 0) {
      saveToLocalStorage(`${STORAGE_KEYS.MESSAGES_CACHE}_${selectedContact.id}`, messages);
    }
  }, [messages, selectedContact]);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchConnections();
    fetchConversations();

    // Restore conversation state from URL or localStorage
    const contactParam = searchParams.get("contact");
    if (contactParam && !selectedContact) {
      // Try to find the contact and restore the conversation
      restoreConversationFromParam(contactParam);
    }
  }, [session, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to restore conversation state from URL parameter
  const restoreConversationFromParam = async (contactId: string) => {
    try {
      // First try to find the contact in existing connections
      const response = await fetch("/api/connections");
      if (response.ok) {
        const data = await response.json();
        const contact = data.connections?.find((c: Connection) => c.id === contactId);

        if (contact) {
          setSelectedContact(contact);
          setActiveTab("messages");
          // Load cached messages first, then fetch fresh ones
          const cachedMessages = loadFromLocalStorage(`${STORAGE_KEYS.MESSAGES_CACHE}_${contactId}`);
          if (cachedMessages && cachedMessages.length > 0) {
            setMessages(cachedMessages);
          }
          fetchMessages(contactId);
        } else {
          // If not in connections, try to get user info directly
          const userResponse = await fetch(`/api/users/${contactId}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setSelectedContact(userData);
            setActiveTab("messages");
            fetchMessages(contactId);
          }
        }
      }
    } catch (error) {
      console.error("Error restoring conversation:", error);
    }
  };

  const fetchConnections = async () => {
    try {
      let url = "/api/connections";
      if (targetUserId) {
        url += `?userId=${targetUserId}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        if (targetUserId && data.targetUser) {
          // Handle direct user targeting from Connect button
          setTargetUser(data.targetUser);
          setSelectedContact(data.targetUser);
          setActiveTab("messages");
          fetchMessages(data.targetUser.id);
        }

        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      const response = await fetch(`/api/messages?contact=${contactId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        }
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startConversation = (connection: Connection) => {
    setSelectedContact(connection);
    setActiveTab("messages");

    // Save as last conversation for quick restoration
    saveToLocalStorage(STORAGE_KEYS.LAST_CONVERSATION, connection.id);

    // Update URL to include contact parameter for state persistence
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('contact', connection.id);
      window.history.replaceState({}, '', currentUrl.toString());
    }

    // Load cached messages first for instant display
    const cachedMessages = loadFromLocalStorage(`${STORAGE_KEYS.MESSAGES_CACHE}_${connection.id}`);
    if (cachedMessages && cachedMessages.length > 0) {
      setMessages(cachedMessages);
    }

    fetchMessages(connection.id);
  };

  const goBack = () => {
    setSelectedContact(null);
    setActiveTab("connections");

    // Clean up URL parameters
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('contact');
      currentUrl.searchParams.delete('userId');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  };

  const switchTab = (tab: "connections" | "messages") => {
    setActiveTab(tab);

    // If switching to messages and there's no selected contact, try to restore the last conversation
    if (tab === "messages" && !selectedContact) {
      const lastConversation = loadFromLocalStorage(STORAGE_KEYS.LAST_CONVERSATION);
      if (lastConversation) {
        restoreConversationFromParam(lastConversation);
      }
    }
  };

  // Show all available users (target user first if exists, then connections)
  const displayConnections = targetUser
    ? [targetUser, ...connections.filter(c => c.id !== targetUser.id)]
    : connections;

  const filteredConnections = displayConnections.filter(conn =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPage="/connections" />
        <div className="pt-20 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-transparent border-t-primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="/connections" />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Connections & Messages
                </h1>
                <p className="text-muted-foreground">
                  Connect and communicate with fellow BU students
                </p>
              </div>

              {/* Tab Buttons */}
              <div className="flex bg-muted/50 rounded-lg p-1 w-full lg:w-auto">
                <Button
                  variant={activeTab === "connections" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => switchTab("connections")}
                  className="flex-1 lg:flex-initial text-xs sm:text-sm"
                >
                  <Users className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Connections</span>
                  <span className="xs:hidden">({displayConnections.length})</span>
                  <span className="hidden xs:inline"> ({displayConnections.length})</span>
                </Button>
                <Button
                  variant={activeTab === "messages" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => switchTab("messages")}
                  className="flex-1 lg:flex-initial text-xs sm:text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Messages</span>
                  <span className="xs:hidden">Chat</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          {activeTab === "connections" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Target User Notice */}
              {targetUser && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            {targetUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              Ready to connect with {targetUser.name}!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              You can start messaging them right away.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            onClick={() => startConversation(targetUser)}
                            className="flex-1 sm:flex-initial"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Start Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setTargetUser(null);
                              router.push("/connections");
                            }}
                            className="flex-1 sm:flex-initial"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <Input
                    leftIcon={<Search className="w-4 h-4" />}
                    placeholder="Search connections by name, email, or college..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Connections Grid */}
              {filteredConnections.length === 0 ? (
                <Card>
                  <CardContent className="p-8 sm:p-12 text-center">
                    <Users className="w-12 sm:w-16 h-12 sm:h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                      {searchTerm ? "No matching connections found" : "No connections yet"}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Start connecting with students by offering skills or requesting help"
                      }
                    </p>
                    {!searchTerm && (
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={() => router.push("/skills/offer")}
                          className="bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
                        >
                          Offer Skills
                        </Button>
                        <Button
                          onClick={() => router.push("/requests/create")}
                          variant="secondary"
                          className="w-full sm:w-auto"
                        >
                          Request Help
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConnections.map((connection, index) => (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <Card className={`shadow-sm hover:shadow-md transition-all duration-200 ${connection.id === targetUser?.id ? 'ring-2 ring-primary' : ''
                        }`}>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg flex-shrink-0">
                                {connection.image ? (
                                  <img
                                    src={connection.image}
                                    alt={connection.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  connection.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                                    {connection.name}
                                  </h3>
                                  {connection.id === targetUser?.id && (
                                    <Badge variant="primary" className="ml-0 sm:ml-2 text-xs self-start">
                                      New Connection
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                                  <Star className="w-3 h-3 fill-current mr-1" />
                                  <span className="text-xs sm:text-sm">{connection.trustScore.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="success" className="text-xs self-start sm:self-center">
                              {connection.id === targetUser?.id ? 'Ready' : 'Connected'}
                            </Badge>
                          </div>

                          <div className="space-y-1 sm:space-y-2 mb-4">
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{connection.email}</span>
                            </div>
                            {connection.college && (
                              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                <Circle className="w-3 h-3 mr-2 flex-shrink-0" />
                                <span className="truncate">{connection.college}</span>
                              </div>
                            )}
                            {connection.department && (
                              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                <Circle className="w-3 h-3 mr-2 flex-shrink-0" />
                                <span className="truncate">{connection.department}</span>
                              </div>
                            )}
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="truncate">Connected {formatDate(connection.connectedAt)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => startConversation(connection)}
                              className="flex-1 text-xs sm:text-sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
                              <span className="hidden xs:inline">Message</span>
                              <span className="xs:hidden">Chat</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (typeof window !== 'undefined') {
                                  window.location.href = `mailto:${connection.email}`;
                                }
                              }}
                              className="px-3"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Messages Tab */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-200px)] min-h-[600px]"
            >
              {/* Conversations List - Hidden on mobile when chat is active */}
              <Card className={`lg:col-span-1 ${selectedContact ? 'hidden lg:block' : 'block'}`}>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {conversations.length === 0 && !selectedContact ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-6 text-center"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">No conversations yet</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        Connect with students and start meaningful conversations
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => switchTab("connections")}
                        className="text-xs hover:bg-accent/50"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Browse Connections
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="divide-y divide-border">
                      {selectedContact && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold shadow-md text-sm">
                                {selectedContact.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-background rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm sm:text-base truncate">{selectedContact.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {selectedContact.college} • Online
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {conversations.map((conv, index) => (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-3 sm:p-4 hover:bg-accent/50 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-primary/30 ${selectedContact?.id === conv.contactId ? 'bg-accent border-l-primary' : ''
                            }`}
                          onClick={() => {
                            // Find connection and start conversation
                            const connection = connections.find(c => c.id === conv.contactId);
                            if (connection) {
                              startConversation(connection);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm text-sm">
                                {conv.contactName.charAt(0).toUpperCase()}
                              </div>
                              {conv.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 border-2 border-background rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`font-medium text-xs sm:text-sm truncate ${conv.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                  {conv.contactName}
                                </p>
                                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                  {formatDate(conv.lastMessageAt)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className={`text-xs truncate ${conv.unreadCount > 0
                                    ? 'text-foreground font-medium'
                                    : 'text-muted-foreground'
                                  }`}>
                                  {conv.lastMessage}
                                </p>
                                {conv.unreadCount > 0 && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Area - Full width on mobile when active */}
              <Card className={`lg:col-span-2 ${selectedContact ? 'block' : 'hidden lg:block'}`}>
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b bg-gradient-to-r from-accent/30 to-accent/10 pb-3 sm:pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={goBack}
                            className="lg:hidden hover:bg-accent/50 p-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm">
                                {selectedContact.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse"></div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-base sm:text-lg truncate">{selectedContact.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  Active now • {selectedContact.college}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-accent/50 hidden sm:flex">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent/50 hidden sm:flex">
                            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent/50 p-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-background to-accent/5">
                      <div className="h-[calc(100vh-400px)] min-h-[300px] max-h-[500px] overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
                        {messages.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center h-full"
                          >
                            <div className="text-center max-w-sm px-4">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">{/* Message empty state icon */}
                                <MessageSquare className="w-10 h-10 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                Start the conversation!
                              </h3>
                              <p className="text-muted-foreground">
                                Send a message to {selectedContact.name} to get started. Share ideas, collaborate, or just say hello!
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <>
                            {messages.map((message, index) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                  delay: index * 0.1,
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 25
                                }}
                                className={`flex items-end gap-2 ${message.senderId === session.user.id ? "justify-end" : "justify-start"
                                  }`}
                              >
                                {message.senderId !== session.user.id && (
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mb-1">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm relative group ${message.senderId === session.user.id
                                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md"
                                      : "bg-card text-foreground border border-border/50 rounded-bl-md"
                                    }`}
                                >
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                  <div className={`flex items-center justify-between mt-2 ${message.senderId === session.user.id ? "text-primary-foreground/70" : "text-muted-foreground"
                                    }`}>
                                    <span className="text-xs">
                                      {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </span>
                                    {message.senderId === session.user.id && (
                                      <div className="flex items-center gap-1 ml-2">
                                        <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Message tail */}
                                  <div className={`absolute bottom-0 w-0 h-0 ${message.senderId === session.user.id
                                      ? "right-0 border-l-8 border-l-primary border-t-8 border-t-transparent"
                                      : "left-0 border-r-8 border-r-card border-t-8 border-t-transparent"
                                    }`} />
                                </div>
                                {message.senderId === session.user.id && (
                                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center text-foreground text-sm font-semibold flex-shrink-0 mb-1">
                                    {session.user.name?.charAt(0).toUpperCase() || 'Y'}
                                  </div>
                                )}
                              </motion.div>
                            ))}

                            {/* Typing indicator (only show when there are messages) */}
                            {messages.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.6, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-end gap-2 justify-start"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mb-1 opacity-50">
                                  {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-card text-foreground border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 max-w-[100px]">
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <div className="border-t bg-gradient-to-r from-background to-accent/10 p-3 sm:p-4">
                        <div className="flex items-end gap-2 sm:gap-3">
                          <div className="flex-1">
                            <Input
                              placeholder={`Type a message to ${selectedContact.name}...`}
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                              className="min-h-[40px] sm:min-h-[44px] border-2 focus:border-primary/50 rounded-xl transition-all duration-200 text-sm sm:text-base"
                            />
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-accent/50 hidden xs:flex"
                            >
                              <span className="text-base sm:text-lg">😊</span>
                            </Button>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl transition-all duration-200 ${newMessage.trim()
                                    ? 'bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl'
                                    : 'bg-muted hover:bg-accent'
                                  }`}
                              >
                                <Send className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${newMessage.trim() ? 'text-white translate-x-0.5' : 'text-muted-foreground'
                                  }`} />
                              </Button>
                            </motion.div>
                          </div>
                        </div>

                        {/* Quick actions - Mobile optimized */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-3 pt-2 border-t border-border/30 px-1 sm:px-0">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Circle className="w-2 h-2 fill-current text-green-500" />
                            <span className="hidden xs:inline">{selectedContact.name} is online</span>
                            <span className="xs:hidden">Online</span>
                          </div>
                          <div className="flex-1"></div>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 rounded-lg hidden sm:flex">
                            📎 Attach
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 rounded-lg hidden sm:flex">
                            🎯 Quick Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-1 sm:px-2 rounded-lg sm:hidden">
                            📎
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-full bg-gradient-to-br from-accent/5 to-background">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center max-w-md"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Ready to Connect!
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Select a conversation from the left or start chatting with one of your connections.
                        Build meaningful collaborations with your fellow BU students!
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => switchTab("connections")}
                          className="hover:bg-accent/50"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Connections
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => router.push("/dashboard")}
                          className="bg-gradient-to-r from-primary to-secondary"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Find People
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
