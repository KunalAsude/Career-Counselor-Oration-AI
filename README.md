# Career Counselor AI - Oration AI Assignment

A comprehensive AI-powered career counseling chat application built with Next.js, tRPC, and modern web technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.2 with TypeScript
- **Authentication**: NextAuth.js with Google/GitHub OAuth
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe APIs
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI (to be added)
- **AI Integration**: OpenAI GPT / Together.ai (to be configured)

## 📋 Project Status

### ✅ Completed
- [x] Next.js project setup with TypeScript
- [x] Prisma schema design (User, ChatSession, Message, Auth tables)
- [x] NextAuth.js configuration with Google/GitHub providers
- [x] Database schema with proper relationships
- [x] Dependencies installation (tRPC, TanStack Query)

### 🔄 In Progress
- [ ] tRPC router setup and API implementation
- [ ] TanStack Query provider configuration
- [ ] Basic UI components (login, chat interface)
- [ ] AI integration for career counseling

### 📝 Todo
- [ ] Chat functionality implementation
- [ ] Message persistence and real-time updates
- [ ] Chat session management
- [ ] Responsive design and UX improvements
- [ ] Vercel deployment
- [ ] Environment setup for production

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm/yarn
- PostgreSQL database
- Google/GitHub OAuth applications

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/Career-Counselor-Oration-AI.git
   cd Career-Counselor-Oration-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables with your actual values.

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Setup

The application uses NextAuth.js with the following providers:
- Google OAuth
- GitHub OAuth

### OAuth Setup Instructions:
1. **Google OAuth**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. **GitHub OAuth**: Create an app at [GitHub Developer Settings](https://github.com/settings/developers)

## 🗄️ Database Schema

```prisma
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  name         String?
  image        String?
  accounts     Account[]
  sessions     Session[]
  chatSessions ChatSession[]
}

model ChatSession {
  id       String    @id @default(uuid())
  name     String
  userId   String
  user     User      @relation(fields: [userId], references: [id])
  messages Message[]
}

model Message {
  id            String      @id @default(uuid())
  content       String
  role          String      // 'user' or 'assistant'
  chatSessionId String
  chatSession   ChatSession @relation(fields: [chatSessionId], references: [id])
}
```

## 🎨 V0.dev UI Generation Prompt

```
Create a modern career counseling chat application UI with the following requirements:

**Layout & Design:**
- Clean, professional design with a sidebar for chat history
- Main chat area with message bubbles (user: right-aligned blue, AI: left-aligned gray)
- Header with user profile dropdown and new chat button
- Responsive design for mobile and desktop
- Dark/light theme toggle

**Components needed:**
1. **Sidebar**: List of previous chat sessions with names and timestamps
2. **Chat Interface**: Message history with typing indicator and input field
3. **Login Page**: OAuth buttons for Google/GitHub with professional branding
4. **Header**: User avatar, settings, and theme toggle
5. **Message Components**: Different styles for user vs AI messages with timestamps

**Styling:**
- Use Tailwind CSS
- Modern glassmorphism/neumorphism effects
- Smooth animations and transitions
- Professional color scheme (blues, grays, whites)
- ShadCN/UI components preferred

**Features to include:**
- Loading states for messages
- Empty states for new users
- Message status indicators
- Typing indicator animation
- Mobile-responsive hamburger menu for sidebar

**AI Branding:**
- Oration AI color scheme and professional feel
- Career counseling theme with appropriate icons
- Trust-building design elements
```

## 🔧 Development Workflow

### When to use tRPC vs TanStack Query:

**tRPC Usage:**
- API route definitions (after auth setup)
- Server-side procedures for:
  - Creating chat sessions
  - Sending/receiving messages
  - Fetching chat history
  - User management

**TanStack Query Usage:**
- Client-side data fetching and caching
- Optimistic updates for messages
- Real-time synchronization
- Background data refetching

### Next Implementation Steps:
1. Set up tRPC routers and procedures
2. Configure TanStack Query provider
3. Create basic UI components
4. Implement AI integration
5. Add chat functionality

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query)

## 🚀 Deployment

This application will be deployed on Vercel with:
- PostgreSQL database (Supabase/Neon)
- Environment variables configuration
- OAuth provider setup for production URLs

---

**Note**: This is an assignment project for Oration AI Software Engineer position. The application demonstrates modern full-stack development practices with AI integration.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
