# Career Counselor Oration AI

A comprehensive, full-stack career counseling platform built with Next.js 15, TypeScript, and modern web technologies. This application provides intelligent AI-powered career guidance with secure authentication, real-time chat functionality, and professional user experience.

## 🚀 Live Demo

**View the application:** [Career Counselor AI](https://career-counselor-oration-ai.vercel.app) *(Deployed on Vercel)*

## ✨ Key Features

### 🤖 **AI Career Counseling**
- **Intelligent AI Assistant**: Powered by OpenAI GPT models for professional career guidance
- **Context-Aware Conversations**: Maintains conversation history and context across sessions
- **Comprehensive Career Advice**: Covers resume review, interview prep, career transitions, salary negotiation, and more
- **Smart Session Naming**: Automatically generates meaningful session titles based on conversation content

### 🔐 **Complete Authentication System**
- **Email & Password Registration**: Secure user account creation with bcrypt password hashing
- **GitHub OAuth Integration**: One-click login with GitHub accounts
- **JWT Session Management**: Secure, persistent user sessions with NextAuth.js
- **Protected Routes**: Authentication-based access control throughout the application

### 💬 **Advanced Chat System**
- **Real-time Messaging**: Instant message delivery with status indicators
- **Message Persistence**: All conversations automatically saved to PostgreSQL database
- **Chat Session Management**: Create, view, rename, and delete multiple conversation sessions
- **Message History**: Complete conversation history with pagination for large chats
- **Typing Indicators**: Visual feedback during AI response generation

### 🎨 **Modern User Interface**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glassmorphism Effects**: Modern UI with backdrop blur and transparency
- **Smooth Animations**: Polished transitions and hover effects
- **Mobile-First Design**: Collapsible sidebar and mobile-optimized chat interface

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: ShadCN/UI with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state

### **Backend & API**
- **API Layer**: tRPC for type-safe APIs
- **Authentication**: NextAuth.js with JWT Strategy
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI API with configurable models
- **Data Validation**: Zod schemas for runtime type safety

### **Deployment & Infrastructure**
- **Hosting**: Vercel (Serverless deployment)
- **Database Hosting**: Supabase (Managed PostgreSQL)
- **Environment**: Node.js 18+ with TypeScript compilation

## 🏗️ Project Structure

```
├── app/                           # Next.js App Router
│   ├── api/                      # API Routes (NextAuth, tRPC)
│   ├── auth/                     # Authentication pages
│   ├── chat/                     # Chat interface
│   ├── history/                  # Chat history page
│   └── profile/                  # User profile page
├── components/                    # Reusable UI components
│   ├── ui/                      # ShadCN/UI components
│   ├── chat-bubble.tsx          # Message display component
│   ├── chat-box.tsx             # Message input component
│   └── session-list.tsx         # Chat session management
├── lib/                          # Core libraries
│   ├── routers/                 # tRPC routers
│   ├── ai-service.ts            # OpenAI integration
│   ├── auth.ts                  # NextAuth configuration
│   └── prisma.ts                # Database client
├── prisma/                       # Database schema
│   └── schema.prisma            # Prisma data models
└── hooks/                        # Custom React hooks
    └── use-session.ts           # Chat session management
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18 or higher
- **Database**: PostgreSQL (local or cloud-hosted)
- **AI API Key**: OpenAI API key for AI functionality

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
   Create a `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # AI Configuration
   AI_API_KEY="your-openai-api-key-here"
   AI_MODEL="gpt-3.5-turbo"
   
   # GitHub OAuth (Optional)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npx prisma studio       # Open Prisma Studio
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
```

## 🗄️ Database Schema

The application uses a well-designed PostgreSQL schema with proper relationships and indexing.

### Core Models
- **User**: User accounts with authentication data
- **ChatSession**: Individual chat conversations
- **Message**: Individual messages within chat sessions
- **Account/Session**: NextAuth.js authentication models

### Key Features
- **UUID Primary Keys**: Better security and scalability
- **Proper Indexing**: Optimized queries with strategic database indexes
- **Cascade Deletion**: Automatic cleanup when users or sessions are deleted
- **Type Safety**: Enums for message roles and status tracking

## 🚀 Deployment

### **Vercel Deployment**

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Configure production environment variables
3. **Database Setup**: Use Supabase, Neon, or any PostgreSQL provider
4. **Deploy**: Automatic deployment on push to main branch

### **Production Environment Variables**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="production-secret-key"
AI_API_KEY="your-openai-api-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 📈 Assignment Requirements

### **✅ Completed Features**
- [x] Next.js application with TypeScript (strict mode)
- [x] Complete authentication system (NextAuth.js)
- [x] AI Career Counselor Chat with OpenAI integration
- [x] Message persistence with database storage
- [x] Chat history and session management
- [x] Responsive design for mobile and desktop
- [x] tRPC and TanStack Query implementation
- [x] Vercel deployment with live URL
- [x] Comprehensive documentation

## 📋 Additional Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)**: Detailed development documentation and implementation status
- **[API Documentation](lib/routers/)**: tRPC API endpoint documentation
- **[Database Schema](prisma/schema.prisma)**: Complete database schema

## 📄 License

---

**Built using Next.js 15, TypeScript, tRPC, Prisma, and modern web technologies**

*Last updated: September 2025*