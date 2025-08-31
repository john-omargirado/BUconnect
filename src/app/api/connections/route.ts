import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// const prisma = new PrismaClient();

// Mock connections data
const MOCK_CONNECTIONS = [
  {
    id: "user_1",
    name: "Alex Chen",
    email: "alex@buconnect.com",
    image: null,
    college: "College of Engineering",
    department: "Computer Science",
    year: 3,
    trustScore: 85,
    skills: ["React", "Node.js", "Python", "Web Development"],
    interests: ["AI", "Machine Learning", "Full-Stack Development"],
    bio: "CS student passionate about building innovative web applications. Love collaborating on open-source projects and learning new technologies.",
    connectTokens: 120,
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isOnline: true
  },
  {
    id: "user_2",
    name: "Maria Santos",
    email: "maria@buconnect.com",
    image: null,
    college: "College of Arts and Letters",
    department: "Creative Writing",
    year: 2,
    trustScore: 92,
    skills: ["Creative Writing", "Content Creation", "Copywriting", "Editing"],
    interests: ["Literature", "Digital Marketing", "Storytelling"],
    bio: "Creative writing major with a passion for compelling storytelling. I help businesses and individuals craft engaging content.",
    connectTokens: 85,
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isOnline: true
  },
  {
    id: "user_3",
    name: "John Rodriguez",
    email: "john@buconnect.com",
    image: null,
    college: "College of Business",
    department: "Marketing",
    year: 4,
    trustScore: 78,
    skills: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
    interests: ["Entrepreneurship", "E-commerce", "Brand Strategy"],
    bio: "Senior marketing student with hands-on experience in digital marketing campaigns. Always looking for collaboration opportunities.",
    connectTokens: 95,
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    isOnline: false
  },
  {
    id: "user_4",
    name: "Sarah Kim",
    email: "sarah@buconnect.com",
    image: null,
    college: "College of Science",
    department: "Biology",
    year: 3,
    trustScore: 88,
    skills: ["Research", "Data Analysis", "Laboratory Techniques", "Scientific Writing"],
    interests: ["Biotechnology", "Environmental Science", "Research"],
    bio: "Biology student focusing on environmental research. Experienced in data collection and analysis for scientific studies.",
    connectTokens: 110,
    lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isOnline: false
  },
  {
    id: "user_5",
    name: "David Reyes",
    email: "david@buconnect.com",
    image: null,
    college: "College of Engineering",
    department: "Mechanical Engineering",
    year: 4,
    trustScore: 82,
    skills: ["CAD Design", "3D Modeling", "Project Management", "Manufacturing"],
    interests: ["Robotics", "Automation", "Product Design"],
    bio: "Mechanical engineering senior with experience in product design and manufacturing processes. Open to engineering collaborations.",
    connectTokens: 75,
    lastActive: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    isOnline: false
  },
  {
    id: "user_6",
    name: "Lisa Wong",
    email: "lisa@buconnect.com",
    image: null,
    college: "College of Arts and Letters",
    department: "Graphic Design",
    year: 2,
    trustScore: 90,
    skills: ["UI/UX Design", "Adobe Creative Suite", "Branding", "Web Design"],
    interests: ["Visual Design", "User Experience", "Digital Art"],
    bio: "Graphic design student specializing in UI/UX design. I create beautiful and functional digital experiences.",
    connectTokens: 135,
    lastActive: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    isOnline: true
  }
];

// GET /api/connections - Get user's connections
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
    const targetUserId = searchParams.get("userId");

    if (targetUserId) {
      // Get specific user info for direct connection
      const targetUser = MOCK_CONNECTIONS.find(user => user.id === targetUserId);

      if (!targetUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        targetUser,
        connections: MOCK_CONNECTIONS.filter(user => user.id !== targetUserId)
      });
    }

    // Return all mock connections
    return NextResponse.json({
      success: true,
      connections: MOCK_CONNECTIONS,
      totalConnections: MOCK_CONNECTIONS.length
    });

  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/connections - Create a new connection or send connection request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { targetUserId, message } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    // Check if target user exists in mock data
    const targetUser = MOCK_CONNECTIONS.find(user => user.id === targetUserId);

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Mock successful connection
    return NextResponse.json({
      success: true,
      message: "Connection request sent successfully",
      connection: {
        id: `conn_${Date.now()}`,
        userId: session.user.id,
        targetUserId,
        status: "pending",
        createdAt: new Date().toISOString(),
        message: message || null
      }
    });

  } catch (error) {
    console.error("Error creating connection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
