import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// const prisma = new PrismaClient();

// Mock data for development
const MOCK_USERS = [
  {
    id: "user_1",
    name: "Alex Chen",
    email: "alex@buconnect.com",
    image: null,
    college: "College of Engineering",
    department: "Computer Science",
    trustScore: 85
  },
  {
    id: "user_2",
    name: "Maria Santos",
    email: "maria@buconnect.com",
    image: null,
    college: "College of Arts and Letters",
    department: "Creative Writing",
    trustScore: 92
  },
  {
    id: "user_3",
    name: "John Rodriguez",
    email: "john@buconnect.com",
    image: null,
    college: "College of Business",
    department: "Marketing",
    trustScore: 78
  },
  {
    id: "user_4",
    name: "Sarah Kim",
    email: "sarah@buconnect.com",
    image: null,
    college: "College of Science",
    department: "Biology",
    trustScore: 88
  }
];

const MOCK_CONVERSATIONS = [
  {
    id: "conv_1",
    contactId: "user_1",
    contactName: "Alex Chen",
    contactImage: null,
    lastMessage: "Hey! I saw your profile and would love to collaborate on some projects. Are you available for a chat?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: 2
  },
  {
    id: "conv_2",
    contactId: "user_2",
    contactName: "Maria Santos",
    contactImage: null,
    lastMessage: "Thanks for the writing tips! I'll definitely implement them in my next article.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unreadCount: 0
  },
  {
    id: "conv_3",
    contactId: "user_3",
    contactName: "John Rodriguez",
    contactImage: null,
    lastMessage: "The marketing strategy document looks great! When can we schedule a meeting to discuss implementation?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unreadCount: 1
  },
  {
    id: "conv_4",
    contactId: "user_4",
    contactName: "Sarah Kim",
    contactImage: null,
    lastMessage: "I'd be happy to help with your biology research project. Let me know what you need!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    unreadCount: 0
  }
];

const generateMockMessages = (contactId: string, currentUserId: string) => {
  const contact = MOCK_USERS.find(u => u.id === contactId);
  if (!contact) return [];

  return [
    {
      id: `msg_${contactId}_1`,
      senderId: contactId,
      receiverId: currentUserId,
      content: `Hi there! I'm ${contact.name} from ${contact.department}. Thanks for connecting with me through BU Connect!`,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: `msg_${contactId}_2`,
      senderId: currentUserId,
      receiverId: contactId,
      content: `Hello ${contact.name}! Great to connect with you. I saw your profile and thought we might have some interesting collaboration opportunities.`,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: `msg_${contactId}_3`,
      senderId: contactId,
      receiverId: currentUserId,
      content: "That sounds fantastic! I'm always open to new collaborations. What kind of project did you have in mind?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: `msg_${contactId}_4`,
      senderId: currentUserId,
      receiverId: contactId,
      content: "I was thinking we could work on something that combines both our expertise. Would you be available for a quick call this week to discuss details?",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    }
  ];
};

// GET /api/messages - Get user's messages and conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contact");
    const userId = session.user.id;

    if (contactId) {
      // Get contact info from mock data
      const contact = MOCK_USERS.find(u => u.id === contactId);

      if (!contact) {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        );
      }

      // Generate mock messages for this conversation
      const messages = generateMockMessages(contactId, userId);

      return NextResponse.json({
        messages,
        contact
      });

    } else {
      // Return mock conversations
      return NextResponse.json({ conversations: MOCK_CONVERSATIONS });
    }

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { receiverId, content } = await request.json();
    const userId = session.user.id;

    if (!receiverId || !content?.trim()) {
      return NextResponse.json(
        { error: "Receiver and message content are required" },
        { status: 400 }
      );
    }

    if (userId === receiverId) {
      return NextResponse.json(
        { error: "Cannot send message to yourself" },
        { status: 400 }
      );
    }

    // Verify receiver exists in mock data
    const receiver = MOCK_USERS.find(u => u.id === receiverId);

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Create mock message response
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      receiverId,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
