# Career Counselor AI

A modern, responsive career counseling platform built with Next.js and TypeScript, featuring secure user authentication and a professional user interface.

## 🚀 Live Demo

**View the application:** [Career Counselor AI](https://career-counselor-oration-ai.vercel.app) *(Deployed on Vercel)*

## ✨ Key Features

### 🔐 **Authentication System**
- **Email & Password Registration**: Secure user account creation with password hashing
- **GitHub OAuth Integration**: One-click login with GitHub accounts
- **JWT Session Management**: Secure, persistent user sessions
- **Protected Routes**: Authentication-based access control

### 🎨 **Modern User Interface**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glassmorphism Effects**: Modern UI with backdrop blur and transparency
- **Gradient Backgrounds**: Professional purple-to-pink color scheme
- **Smooth Animations**: Polished transitions and hover effects

### 👤 **User Management**
- **Profile Pages**: User dashboard with account information
- **Session Persistence**: Stay logged in across browser sessions
- **Account Security**: Protected user data and secure authentication

### 📱 **Professional Design**
- **Landing Page**: Hero section with feature highlights
- **Navigation**: Intuitive user flow and page transitions
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Authentication**: NextAuth.js with JWT Strategy
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **Deployment**: Vercel
- **Database Hosting**: Supabase

## 🏗️ Architecture

```
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth.js API routes
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile page
│   ├── chat/              # Chat interface (UI ready)
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN/UI components
│   └── providers/        # Context providers
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
└── prisma/               # Database schema
    └── schema.prisma     # Prisma data models
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KunalAsude/Career-Counselor-Oration-AI.git
   cd Career-Counselor-Oration-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # GitHub OAuth (Optional)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  password      String?   // Hashed password for credentials auth
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  chatSessions  ChatSession[]
}
```

### Authentication Models
```prisma
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🔐 Authentication Setup

### GitHub OAuth (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Add the Client ID and Client Secret to your `.env.local`

### Features
- **Secure Registration**: Password hashing with bcrypt
- **OAuth Integration**: GitHub social login
- **Session Security**: JWT-based authentication
- **Route Protection**: Automatic redirects for unauthenticated users

## 🎨 UI Components

The application uses ShadCN/UI components with custom styling:

- **Button**: Primary and secondary action buttons
- **Card**: Content containers with glassmorphism effects
- **Input**: Form inputs with validation
- **Avatar**: User profile images
- **Badge**: Status indicators
- **Tabs**: Navigation between sign-in and sign-up

## 📱 Responsive Design

- **Desktop**: Full-width layout with sidebar-ready design
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Single-column layout with collapsible navigation
- **Accessibility**: WCAG compliant color contrast and keyboard navigation

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Configure production environment variables
3. **Database**: Set up production PostgreSQL database (Supabase recommended)
4. **Build Settings**: Next.js 15+ with Node.js 18+

### Production Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="production-secret-key"
GITHUB_CLIENT_ID="production-client-id"
GITHUB_CLIENT_SECRET="production-client-secret"
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check database URL in .env.local
# Ensure PostgreSQL is running
npx prisma db push
```

**Authentication Issues**
```bash
# Verify NEXTAUTH_SECRET is set
# Check GitHub OAuth credentials
# Clear browser cookies and try again
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📊 Performance

- **Fast Loading**: Optimized with Next.js App Router
- **Efficient Bundling**: Tree-shaking and code splitting
- **Database Optimization**: Indexed queries with Prisma
- **Image Optimization**: Next.js automatic image optimization

## 🤝 Contributing

This project demonstrates modern full-stack development practices with:
- TypeScript for type safety
- Component-based architecture
- Secure authentication patterns
- Responsive design principles
- Database optimization techniques

## 📄 License

This project is part of an assignment submission for Oration AI Software Engineer position.

## 📞 Support

For questions about this application, please refer to the codebase and documentation.

## 📋 Development Roadmap

For detailed project status, architecture decisions, and implementation roadmap, see [DEVELOPMENT.md](DEVELOPMENT.md).

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

*Last updated: September 11, 2025*
