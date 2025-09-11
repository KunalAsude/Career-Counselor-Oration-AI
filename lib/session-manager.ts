export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

class SessionManager {
  private sessions: Map<string, ChatSession> = new Map()
  private storageKey = "career-ai-sessions"

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const data = JSON.parse(stored)
        this.sessions = new Map(
          data.map((session: ChatSession) => [
            session.id,
            {
              ...session,
              createdAt: new Date(session.createdAt),
              updatedAt: new Date(session.updatedAt),
              messages: session.messages.map((msg: Message) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            },
          ]),
        )
      }
    } catch (error) {
      console.error("Failed to load sessions from storage:", error)
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return

    try {
      const data = Array.from(this.sessions.values())
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save sessions to storage:", error)
    }
  }

  createSession(): ChatSession {
    const id = Date.now().toString()
    const now = new Date()

    const welcomeMessage: Message = {
      id: "welcome-" + id,
      content:
        "Hello! I'm your AI Career Counselor. I'm here to help you with career guidance, job search strategies, interview preparation, and professional development. What would you like to discuss today?",
      isUser: false,
      timestamp: now,
    }

    const session: ChatSession = {
      id,
      title: "New Career Chat",
      lastMessage: welcomeMessage.content,
      createdAt: now,
      updatedAt: now,
      messages: [welcomeMessage],
    }

    this.sessions.set(id, session)
    this.saveToStorage()
    return session
  }

  getSession(id: string): ChatSession | undefined {
    return this.sessions.get(id)
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId)
    if (!session) return

    session.messages.push(message)
    session.lastMessage = message.content
    session.updatedAt = new Date()

    // Auto-generate title from first user message
    if (session.title === "New Career Chat" && message.isUser) {
      session.title = this.generateTitle(message.content)
    }

    this.saveToStorage()
  }

  updateSession(sessionId: string, updates: Partial<ChatSession>): void {
    const session = this.sessions.get(sessionId)
    if (!session) return

    Object.assign(session, updates, { updatedAt: new Date() })
    this.saveToStorage()
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId)
    this.saveToStorage()
  }

  private generateTitle(firstMessage: string): string {
    const message = firstMessage.toLowerCase()

    if (message.includes("interview")) return "Interview Preparation"
    if (message.includes("resume") || message.includes("cv")) return "Resume Review"
    if (message.includes("career change") || message.includes("transition")) return "Career Transition"
    if (message.includes("salary") || message.includes("negotiat")) return "Salary Negotiation"
    if (message.includes("job search") || message.includes("looking for")) return "Job Search Strategy"
    if (message.includes("skill") || message.includes("learn")) return "Skill Development"
    if (message.includes("network")) return "Professional Networking"
    if (message.includes("promotion") || message.includes("advance")) return "Career Advancement"

    // Fallback: use first few words
    const words = firstMessage.split(" ").slice(0, 4).join(" ")
    return words.length > 30 ? words.substring(0, 30) + "..." : words
  }
}

export const sessionManager = new SessionManager()
