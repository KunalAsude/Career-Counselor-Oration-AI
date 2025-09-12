"use client"

import { ChatBubble } from "@/components/chat-bubble"
import { ChatBox } from "@/components/chat-box"
import { SessionList } from "@/components/session-list"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { useSession as useNextAuthSession } from "next-auth/react"
import { useSession as useChatSession, type Message } from "@/hooks/use-session"
import { useRef, useEffect, useState } from "react"
import { MessageCircle, Sparkles, Menu } from "lucide-react"
import { TypingIndicator } from "@/components/typing-indicator"

export default function ChatSessionPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useNextAuthSession()
  const sessionId = params.sessionId as string
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { currentSession, sessions, isLoading, sessionError, createNewSession, sendMessage, deleteSession } = useChatSession(sessionId)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Redirect if session not found
  useEffect(() => {
    if (sessionError) {
      router.replace("/chat")
    }
  }, [sessionError, router])

  const scrollToBottom = (smooth: boolean = true) => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-slot='scroll-area-viewport']")
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        })
      }
    }
  }

  // Scroll to bottom when messages change (with animation delay)
  useEffect(() => {
    if (currentSession?.messages && currentSession.messages.length > 0) {
      // Longer delay to account for chat bubble animations
      const timeoutId = setTimeout(() => {
        scrollToBottom()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [currentSession?.messages])

  // Scroll to bottom when component mounts (for initial load)
  useEffect(() => {
    if (currentSession && currentSession.messages.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollToBottom(false) // Use instant scroll for initial load
      }, 200)

      return () => clearTimeout(timeoutId)
    }
  }, [currentSession])

  // Also scroll when loading state changes (for new AI responses)
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        scrollToBottom()
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [isLoading])

  // Don't render anything while checking authentication
  if (status === "loading" || !session) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-card/50 backdrop-blur-md rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
    // Scroll to bottom immediately after sending message with a slight delay
    setTimeout(() => scrollToBottom(), 100)
  }

  // Scroll to bottom when user starts typing or focuses on input
  const handleInputFocus = () => {
    setTimeout(() => scrollToBottom(), 50)
  }

  const handleNewChat = async () => {
    try {
      const newSession = await createNewSession()
      router.push(`/chat/${newSession.id}`)
    } catch (error) {
      console.error("Failed to create new session:", error)
    }
  }

  const handleDeleteSession = (sessionIdToDelete: string) => {
    deleteSession(sessionIdToDelete)
    if (sessionIdToDelete === sessionId) {
      router.push("/chat")
    }
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSheetOpen(!isMobileSheetOpen)
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  const closeMobileSheet = () => {
    setIsMobileSheetOpen(false)
  }

  if (!currentSession) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex h-full">
          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="absolute top-4 left-4 z-20">
              <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur-md border border-border">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-xl border-border">
                  <div className="h-full">
                    <SessionList
                      sessions={sessions}
                      onNewChat={handleNewChat}
                      onDeleteSession={handleDeleteSession}
                      isCollapsed={false}
                      onToggleCollapse={closeMobileSheet}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="flex-shrink-0">
              <SessionList
                sessions={sessions}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <div className="text-center text-foreground max-w-md">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-card/50 backdrop-blur-md rounded-full mb-4 md:mb-6">
                <MessageCircle className="h-6 w-6 md:h-10 md:w-10 text-primary" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold mb-4">Session Not Found</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">The chat session you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
              <button
                onClick={handleNewChat}
                className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-primary/20"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                Start New Career Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex h-full">
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="absolute top-4 left-4 z-20">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur-md border border-border">
                  <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-xl border-border">
                  <div className="h-full">
                    <SessionList
                      sessions={sessions}
                      currentSessionId={sessionId}
                      onNewChat={handleNewChat}
                      onDeleteSession={handleDeleteSession}
                      isCollapsed={false}
                      onToggleCollapse={closeMobileSheet}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="flex-shrink-0">
              <SessionList
                sessions={sessions}
                currentSessionId={sessionId}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
              />
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea ref={scrollAreaRef} className="h-full scroll-smooth">
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  {currentSession.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-foreground max-w-md">
                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-card/50 backdrop-blur-md rounded-full mb-4 md:mb-6">
                          <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3">Start Your Career Journey</h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">Ask me anything about your career goals, job search, skill development, or professional growth.</p>
                        <div className="grid gap-3 text-left">
                          <div className="p-3 md:p-4 bg-card/50 backdrop-blur-md rounded-lg border border-border">
                            <p className="text-xs md:text-sm text-muted-foreground">&quot;What career path should I choose based on my skills?&quot;</p>
                          </div>
                          <div className="p-3 md:p-4 bg-card/50 backdrop-blur-md rounded-lg border border-border">
                            <p className="text-xs md:text-sm text-muted-foreground">&quot;How can I improve my resume for tech jobs?&quot;</p>
                          </div>
                          <div className="p-3 md:p-4 bg-card/50 backdrop-blur-md rounded-lg border border-border">
                            <p className="text-xs md:text-sm text-muted-foreground">&quot;What skills should I learn for the future?&quot;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    currentSession.messages.map((message: Message) => (
                      <ChatBubble
                        key={message.id}
                        message={message.content}
                        isUser={message.role === "user"}
                        timestamp={message.createdAt}
                        status={message.status}
                      />
                    ))
                  )}
                  <TypingIndicator isVisible={isLoading} />
                </div>
              </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="flex-shrink-0 bg-card/80 backdrop-blur-md border-t border-border">
              <ChatBox
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                placeholder="Ask me about your career goals, job search, or professional development..."
                onFocus={handleInputFocus}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
