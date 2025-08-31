# BU Connect - Where BUeños Collaborate and Grow

A student skill-swap and collaboration hub built specifically for **Bicol University (BU)** students. BU Connect encourages entrepreneurial and collaborative mindsets by allowing students to offer skills, request help, and match with peers on academic or creative projects.

## 🎉 Project Status - FULLY FUNCTIONAL ✨

- ✅ **Production-Ready Build**: All TypeScript/ESLint errors resolved
- ✅ **Enhanced UI/UX**: Modern animations and professional design
- ✅ **Complete Authentication System**: NextAuth.js with profile management  
- ✅ **Real-time Notification System**: Database-driven with professional UI
- ✅ **Advanced Admin Management**: Full CRUD operations with security
- ✅ **Comprehensive Token & Rewards System**: Gamification and engagement
- ✅ **Dark Mode Implementation**: Complete theme system
- ✅ **Mobile-Responsive Design**: Optimized for all devices
- ✅ **Database Integration**: Prisma with PostgreSQL and demo data
- ✅ **Development Server**: Running successfully at `http://localhost:3000`

## 🌟 Features

### For Students

- **Skill Sharing**: Post skills you can offer to fellow students
- **Help Requests**: Request assistance with academic or creative projects  
- **Smart Matching**: Automatically match skills with requests based on categories
- **Trust System**: Build reputation through peer feedback and ratings
- **Real-time Notifications**: Professional notification system with database integration
- **Token & Rewards System**: Earn BU Tokens and unlock exclusive rewards
- **Enhanced Profile Setup**: Guided onboarding with progress indicators
- **Match Management**: View and manage all your skill connections
- **Category Filtering**: Find skills/requests by academics, design, tech, writing, and more
- **Dark Mode Support**: Complete theme system with user preference storage
- **Mobile-First Design**: Responsive experience across all devices
- **Connection System**: Real-time messaging and collaboration tools

### For Administrators

- **User Management**: Complete CRUD operations with professional modal interface
- **Content Moderation**: Advanced management of skills and requests with bulk operations  
- **Real-time Analytics**: Monitor platform usage, user growth, and engagement metrics
- **Notification System**: Centralized notification management and monitoring
- **Trust Score Management**: Oversee user reputation and platform integrity
- **Rewards & Token Management**: Control token distribution and reward catalog
- **Security Features**: Role-based access control with input validation
- **Database Operations**: Direct admin panel for platform management

## 🎨 Design System

### Brand Identity

- **Name**: BU Connect
- **Tagline**: "Where BUeños Collaborate and Grow"
- **Logo**: Interlocking hands forming a "B" shape

### Color Palette

- **Primary**: Picton Blue (#45B6FE)
- **Secondary**: Sandy Brown (#F4A460)
- **Background**: White (#FFFFFF)
- **Surface**: Soft Gray (#F5F5F5)

### Typography

- **Headings**: Inter, Poppins (Bold Sans Serif)
- **Body**: Roboto (Clean Sans Serif)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- NPM or Yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bu-connect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL Database**

   **Install PostgreSQL** (see [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) for detailed instructions):
   - Install PostgreSQL locally or use Docker
   - Create database: `buconnect_db`
   - Update DATABASE_URL in `.env` file

   **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. **Configure environment variables**

   Copy `.env.example` to `.env` and update:

   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/buconnect_db?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

For testing purposes, you can use these pre-seeded accounts:

### Administrator Account

- **Email**: admin@buconnect.com
- **Password**: admin123
- **Access**: Full admin dashboard and user management

### Student Account

- **Email**: student@buconnect.com
- **Password**: student123
- **Access**: Standard student features and dashboard

## 🏗️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router (Production Build Ready)
- **Language**: TypeScript (Strict Mode, Zero Errors)
- **Styling**: TailwindCSS with custom theme and complete dark mode
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Icons**: Lucide React
- **UI Components**: Custom component library with class-variance-authority
- **State Management**: React hooks with custom notification system
- **Fonts**: Inter & Roboto (Google Fonts)

### Backend

- **API**: Next.js API Routes with comprehensive error handling
- **Authentication**: NextAuth.js with Credentials Provider and enhanced profile flow
- **Database**: PostgreSQL with Prisma ORM (Production-ready schema)
- **Real-time Features**: Dynamic notification system with database integration
- **Security**: bcryptjs password hashing with role-based access control
- **Token System**: Custom BU Tokens and rewards management

### Development Tools

- **Build Tool**: Next.js with Turbopack (Optimized Production Build)
- **Linting**: ESLint with Next.js config (Zero Warnings)
- **Type Checking**: TypeScript strict mode (Fully Type-Safe)
- **Component System**: Radix UI primitives with custom styling
- **Database Tools**: Prisma Studio for database management

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/                # NextAuth.js authentication
│   │   ├── skills/              # Skill management endpoints
│   │   ├── requests/            # Help request endpoints  
│   │   ├── notifications/       # Real-time notification system
│   │   ├── matches/             # Match management endpoints
│   │   ├── tokens/              # BU Token system
│   │   ├── rewards/             # Rewards and shop system
│   │   ├── leaderboard/         # User rankings
│   │   ├── connections/         # Real-time messaging
│   │   ├── messages/            # Chat system
│   │   ├── admin/               # Complete admin management
│   │   │   ├── users/           # User CRUD operations
│   │   │   ├── skills/          # Skill moderation
│   │   │   ├── requests/        # Request management
│   │   │   ├── stats/           # Analytics endpoints
│   │   │   └── rewards/         # Admin rewards control
│   │   └── user/
│   │       ├── profile-status/  # Profile completion checking
│   │       ├── my-connections/  # User's connections
│   │       ├── my-skills/       # User's skills
│   │       ├── my-requests/     # User's requests
│   │       ├── my-stats/        # User analytics
│   │       └── rewards/         # User rewards
│   ├── auth/
│   │   ├── signin/              # Enhanced sign-in with profile flow
│   │   └── signup/              # Auto-signin with profile redirect
│   ├── dashboard/               # Main user dashboard
│   ├── profile/                 # Enhanced profile with setup mode
│   ├── matches/                 # Match management page
│   ├── connections/             # Real-time messaging interface
│   ├── tokens/                  # Token dashboard and shop
│   ├── my-activity/             # User activity tracking
│   └── admin/                   # Complete admin management system
├── components/
│   ├── ui/                      # Custom component library
│   │   ├── Button.tsx           # Multi-variant button with loading states
│   │   ├── Input.tsx            # Enhanced input with icons and validation
│   │   ├── Card.tsx             # Flexible card system
│   │   └── Badge.tsx            # Color-coded status badges
│   ├── admin/                   # Admin-specific components
│   │   ├── UserModals.tsx       # User management modals
│   │   ├── SkillModals.tsx      # Skill management modals
│   │   ├── RequestModals.tsx    # Request management modals
│   │   └── RewardsManagement.tsx # Rewards control panel
│   ├── Navigation.tsx           # Professional notification dropdown
│   ├── TokenDashboard.tsx       # Token system interface
│   ├── RewardsShop.tsx          # Rewards marketplace
│   ├── RewardEffects.tsx        # Visual reward effects
│   ├── MyRewards.tsx            # User rewards display
│   └── theme-toggle.tsx         # Dark mode toggle
├── hooks/
│   ├── useNotifications.ts      # Custom notification management
│   ├── useTokens.ts             # Token system hook
│   ├── useUserRewards.ts        # User rewards hook
│   └── useRealTimeNotifications.ts # Real-time updates
├── lib/
├── types/
└── prisma/
    ├── schema.prisma            # Complete database schema
    └── seed.ts                  # Demo data seeding
```

## 🗄️ Database Schema

### Core Models

- **User**: Student and admin profiles with trust scores and token balances
- **Skill**: Skills offered by students with categories and ratings
- **Request**: Help requests from students with priority levels
- **Match**: Connections between skills and requests with status tracking
- **Feedback**: Peer reviews and trust building system
- **Token**: BU Token transactions and balance tracking
- **Reward**: Available rewards in the shop with pricing
- **UserReward**: User's purchased/earned rewards inventory
- **Notification**: Real-time notification system
- **Connection**: User relationships and networking
- **Message**: Real-time chat and messaging system
- **Session/Account**: NextAuth.js authentication

### Key Relationships

- Users can have multiple Skills, Requests, Tokens, and Rewards
- Skills and Requests can have multiple Matches with different statuses
- Users give/receive Feedback to build trust scores and earn tokens
- Tokens can be spent on Rewards to unlock platform benefits
- Real-time Notifications track all platform activities
- Connections enable direct messaging between users

## 🎯 Usage Examples

### New User Onboarding

1. **Sign Up**: Create account with email and password
2. **Auto Sign-in**: System automatically signs you in after registration  
3. **Profile Setup**: Guided profile completion with academic details and progress tracking
4. **Dashboard Access**: Full platform access with welcome tokens after profile completion

### Enhanced Sign-in Flow

1. **Existing Users**: Direct access to dashboard with notification updates
2. **New Users**: Automatic redirect to profile setup if incomplete
3. **Demo Access**: Quick demo buttons for testing admin/student features
4. **Profile Status**: Real-time checking of profile completion status

### Real-time Notifications & Token System

1. **Skill Matches**: Get notified when someone needs your skills (+10 tokens)
2. **New Requests**: Alert when help requests match your expertise
3. **Match Updates**: Track acceptance/rejection of your connections (+25 tokens for successful matches)
4. **Trust Updates**: Monitor feedback and reputation changes (+5-15 tokens)
5. **Rewards**: Purchase theme unlocks, priority badges, and exclusive features

### Token Economy

- **Welcome Bonus**: 100 tokens for completing profile setup
- **Daily Login**: 5 tokens per day for platform engagement
- **Skill Posting**: 10 tokens for each skill you offer
- **Help Completion**: 25 tokens for successful help sessions
- **Positive Feedback**: 15 tokens for 5-star ratings received
- **Referral Bonus**: 50 tokens for each friend who joins

### Offering a Skill

1. Sign in to your account
2. Click "Offer a Skill" from the dashboard
3. Fill in skill details (title, description, category)
4. Add contact information
5. Post and wait for interested students

### Requesting Help

1. Navigate to "Request Help"
2. Describe what you need assistance with
3. Select appropriate category
4. Provide contact details
5. Submit and browse matching skills

### Building Trust

- Complete successful collaborations
- Receive positive feedback from peers
- Maintain professional communication
- Honor commitments and deadlines

## 🚀 Recent Enhancements

### Complete Token & Rewards System 🪙

- **BU Token Economy**: Comprehensive token system with earning opportunities and spending mechanics
- **Rewards Shop**: Unlock themes, badges, priority features, and exclusive content
- **Token Dashboard**: Real-time balance tracking with transaction history
- **Gamification**: Leaderboards, achievements, and engagement rewards
- **Admin Controls**: Complete token distribution and reward management for administrators

### Real-time Notification System 🔔

- **Smart Notifications**: Database-driven notifications for all platform activities
- **Professional UI**: Modern dropdown with loading states, error handling, and mobile optimization
- **Custom Hook**: `useNotifications` and `useRealTimeNotifications` for seamless state management
- **Match Management**: Dedicated page for viewing and managing skill connections
- **Notification Types**: Skills, requests, matches, feedback, tokens, and system updates

### Enhanced Authentication & Profile System 🔐

- **Intelligent Onboarding**: New users automatically redirected to profile completion
- **Profile Status API**: Dynamic checking of user profile completeness with real-time updates
- **Setup Mode**: Guided profile completion with progress indicators and validation
- **Seamless Experience**: Auto-signin after registration with proper user routing
- **Profile Analytics**: Track your platform engagement and success metrics

### Advanced Admin Management System 🛡️

- **Complete CRUD Operations**: Full user, skill, request, and reward management
- **Professional Modals**: Detailed view/edit interfaces with comprehensive validation
- **Bulk Operations**: Efficient management of multiple records with batch processing
- **Security Features**: Role-based access control with input sanitization and audit logs
- **Analytics Dashboard**: Real-time platform statistics and user engagement metrics
- **Rewards Control**: Full control over token distribution and reward catalog

### Connection & Messaging System 💬

- **Real-time Chat**: Live messaging between connected users
- **Connection Management**: Track and organize your professional network
- **Message History**: Persistent chat history with search capabilities
- **Status Indicators**: Online/offline status and message read receipts
- **Mobile Optimized**: Responsive messaging interface for all devices

### UI/UX Improvements ✨

- **Modern Components**: Custom button, input, card, and badge components
- **Loading States**: Elegant spinners and skeleton loading
- **Dark Mode**: Complete theme system with user preference storage
- **Animations**: Framer Motion transitions and micro-interactions
- **Mobile Responsive**: Optimized experience across all device sizes

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

### Database Operations

- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply migrations (PostgreSQL)
- `npx prisma migrate reset` - Reset database and apply migrations
- `npx prisma db push` - Push schema changes without migrations
- `npx prisma studio` - Open Prisma Studio GUI
- `npx prisma db seed` - Seed database with demo data

### Component Development

```tsx
// Example: Using the enhanced Button component
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>

// Example: Enhanced Input with validation
<Input
  label="Email"
  type="email"
  leftIcon={<Mail className="w-4 h-4" />}
  error="Invalid email"
  required
/>

// Example: Using the notification hook
const { notifications, isLoading, markAsRead } = useNotifications();
```

## 🚀 Deployment

### ✅ Production Build Status

- **Build Success**: All TypeScript and ESLint errors resolved
- **Static Generation**: 41/41 pages successfully generated
- **Bundle Size**: Optimized with Next.js production build
- **Type Safety**: 100% TypeScript coverage with strict mode
- **Code Quality**: Zero linting warnings or errors

### Current Build Stats

```
Route (app)                                 Size     First Load JS    
┌ ○ /                                    8.46 kB         170 kB
├ ○ /dashboard                           12.5 kB         182 kB
├ ○ /admin                               13.5 kB         183 kB
├ ○ /connections                         8.79 kB         178 kB
├ ○ /tokens                              8.69 kB         178 kB
└ + 36 more routes...

+ First Load JS shared by all             102 kB
ƒ Middleware                             61.5 kB
```

### Vercel Deployment (Recommended)

1. **Repository Setup**: Push code to GitHub repository
2. **Vercel Import**: Import project in Vercel dashboard
3. **Environment Variables**: Configure production environment variables
4. **Automatic Deployment**: Deploy with zero configuration needed
5. **Custom Domain**: Optional custom domain setup

### Manual Deployment

1. **Production Build**: `npm run build` (✅ Verified Working)
2. **Static Export**: All pages pre-rendered for optimal performance
3. **Upload Files**: Deploy `.next` folder and dependencies to hosting provider
4. **Environment Setup**: Configure production environment variables
5. **Start Server**: `npm run start` for production server

### Environment Configuration

```env
# Database
DATABASE_URL="your-production-database-url"

# Authentication
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

## 🤝 Contributing

We welcome contributions from BU students and developers!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Contribution Guidelines

- Follow TypeScript best practices
- Maintain consistent code formatting
- Write clear commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

## 🙏 Acknowledgments

- **Bicol University** - For inspiring this collaboration platform and fostering innovation
- **BUeños Community** - For their continued support, feedback, and collaborative spirit
- **Next.js Team** - For the incredible framework that powers this platform
- **TypeScript Community** - For type safety and developer experience improvements
- **Prisma Team** - For the excellent database toolkit and ORM
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations and delightful user interactions
- **Open Source Community** - For the amazing tools, libraries, and contributions
- **GitHub Copilot** - For development assistance and code optimization

### Project Milestones 🎯

- **✅ MVP Completed** - Core skill-sharing and request functionality
- **✅ UI/UX Enhanced** - Modern design with animations and dark mode
- **✅ Authentication System** - Complete user management with profile setup
- **✅ Admin Panel** - Full administrative control and analytics
- **✅ Token Economy** - Gamification and rewards system
- **✅ Real-time Features** - Notifications, messaging, and live updates
- **✅ Production Ready** - Zero build errors, type-safe, and optimized
- **✅ Mobile Responsive** - Optimized for all devices and screen sizes

---

**Ready for Production** • **Zero Build Errors** • **Type-Safe** • **Mobile-First** • **Dark Mode** • **Real-time** • **Gamified**

Made with ❤️ for the BUeños community at Bicol University.
