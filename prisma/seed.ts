import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 12);
  const studentPassword = await bcrypt.hash("student123", 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@buconnect.com" },
    update: {},
    create: {
      email: "admin@buconnect.com",
      password: adminPassword,
      name: "BU Admin",
      role: "ADMIN",
      college: "Administration",
      trustScore: 5.0,
    },
  });

  // Create demo student with tokens
  const student = await prisma.user.upsert({
    where: { email: "student@buconnect.com" },
    update: {},
    create: {
      email: "student@buconnect.com",
      password: studentPassword,
      name: "Juan Dela Cruz",
      role: "STUDENT",
      college: "College of Engineering",
      department: "Computer Science",
      year: 3,
      trustScore: 4.2,
    },
  });

  // Give the demo student some initial tokens using raw SQL
  await prisma.$executeRaw`
    UPDATE users 
    SET connectTokens = 150,
        weeklyRating = 4.5,
        totalRating = 4.2,
        completedServices = 8
    WHERE id = ${student.id}
  `;

  // Create sample skills
  await prisma.skill.createMany({
    data: [
      {
        title: "Calculus Tutoring",
        description: "I can help with Calculus 1, 2, and 3. Available weekends.",
        category: "ACADEMICS",
        userId: student.id,
        contactInfo: "juan.delacruz@bicol-u.edu.ph",
      },
      {
        title: "Logo Design",
        description: "Professional logo design for projects and organizations",
        category: "DESIGN",
        userId: student.id,
        contactInfo: "juan.delacruz@bicol-u.edu.ph",
      },
    ],
  });

  // Create sample requests
  await prisma.request.createMany({
    data: [
      {
        title: "Thesis Formatting Help",
        description: "Need help formatting my thesis according to APA guidelines",
        category: "WRITING",
        userId: student.id,
        contactInfo: "juan.delacruz@bicol-u.edu.ph",
      },
    ],
  });

  // Create reward items
  const rewardItems = [
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

    // Card Themes
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

    // Badges
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

    // Titles
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
    }
  ];

  // Insert reward items
  for (const item of rewardItems) {
    await prisma.rewardItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type as any, // Type assertion for Prisma enum
        price: item.price,
        config: item.config
      },
    });
  }

  // Create sample token transactions
  await prisma.$executeRaw`
    INSERT INTO token_transactions (id, userId, amount, type, description, createdAt)
    VALUES 
      (lower(hex(randomblob(12))), ${student.id}, 50, 'EARNED', 'Calculus tutoring session completed', datetime('now', '-2 days')),
      (lower(hex(randomblob(12))), ${student.id}, 35, 'EARNED', 'Logo design project completed', datetime('now', '-1 day')),
      (lower(hex(randomblob(12))), ${student.id}, 75, 'BONUS', 'Weekly leaderboard reward - Position #3', datetime('now', '-6 hours')),
      (lower(hex(randomblob(12))), ${student.id}, -10, 'SPENT', 'Purchased: Ocean Wave Card Theme', datetime('now', '-3 hours'))
  `;

  // Create sample feedback
  await prisma.$executeRaw`
    INSERT INTO feedback (id, rating, comment, giverId, receiverId, createdAt)
    VALUES 
      (lower(hex(randomblob(12))), 5, 'Excellent tutoring! Very helpful and patient.', ${admin.id}, ${student.id}, datetime('now', '-2 days')),
      (lower(hex(randomblob(12))), 4, 'Great logo design, delivered on time.', ${admin.id}, ${student.id}, datetime('now', '-1 day'))
  `;

  console.log("Database seeded successfully!");
  console.log("Demo accounts created:");
  console.log("Admin: admin@buconnect.com / admin123");
  console.log("Student: student@buconnect.com / student123 (150 tokens)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
