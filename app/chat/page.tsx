"use client"

import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession as useNextAuthSession } from "next-auth/react"
import { useSession as useChatSession, type Message } from "@/hooks/use-session"
import { ChatBubble } from "@/components/chat-bubble"
import { ChatBox } from "@/components/chat-box"
import { SessionList } from "@/components/session-list"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MessageCircle, Menu } from "lucide-react"
import { TypingIndicator } from "@/components/typing-indicator"

export default function ChatPage() {
  const router = useRouter()
  const { data: session, status } = useNextAuthSession()
  const { currentSession, sessions, isLoading, isSending, createNewSession, sendMessage, deleteSession, renameSession } = useChatSession()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const creatingSessionRef = useRef(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebar-collapsed')
    if (savedSidebarState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedSidebarState))
    }
  }, [])

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  // Mobile detection - moved to top before any conditional returns
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  // Create a new session if none exists
  useEffect(() => {
    if (!currentSession && !isLoading && session && !creatingSessionRef.current && sessions && sessions.length === 0) {
      creatingSessionRef.current = true
      createNewSession().then((newSession) => {
        router.replace(`/chat/${newSession.id}`)
      }).catch((error) => {
        console.error("Failed to create session:", error)
        creatingSessionRef.current = false // Reset on error
      })
    }
  }, [currentSession, router, isLoading, session, createNewSession, sessions])

  // Auto-scroll to bottom when messages change
  useLayoutEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-slot='scroll-area-viewport']")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [currentSession?.messages])

  // Check if user is at bottom of chat
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector("[data-slot='scroll-area-viewport']")
    if (!scrollContainer) return

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10 // 10px threshold
      setShowScrollToBottom(!isAtBottom)
    }

    // Initial check
    checkScrollPosition()

    // Add scroll listener
    scrollContainer.addEventListener('scroll', checkScrollPosition)
    
    return () => {
      scrollContainer.removeEventListener('scroll', checkScrollPosition)
    }
  }, [currentSession?.messages])

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-slot='scroll-area-viewport']")
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }

  // Don't render anything while checking authentication
  if (status === "loading" || !session) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden dark:from-slate-900 dark:via-purple-900/30 dark:to-purple-950 flex items-center justify-center">
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
  }

  const handleNewChat = async () => {
    try {
      const newSession = await createNewSession()
      router.push(`/chat/${newSession.id}`)
    } catch (error) {
      console.error("Failed to create new session:", error)
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
    
    // If we're deleting the current session, redirect to the first available session or history
    if (currentSession?.id === sessionId) {
      if (sessions && sessions.length > 1) {
        // Find the first session that's not the one being deleted
        const nextSession = sessions.find(s => s.id !== sessionId)
        if (nextSession) {
          router.push(`/chat/${nextSession.id}`)
        } else {
          router.push("/history")
        }
      } else {
        router.push("/history")
      }
    }
  }

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    renameSession(sessionId, newTitle)
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
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden dark:from-slate-900 dark:via-purple-900/30 dark:to-purple-950">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-500/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex h-full">
          {/* Mobile Menu Button - Positioned at top with proper spacing */}
          {isMobile && (
            <div className="absolute top-2 left-2 z-20">
              <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur-md border border-border shadow-lg">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-xl border-border">
                  <div className="h-full">
                    <SessionList
                      sessions={sessions}
                      onNewChat={handleNewChat}
                      onDeleteSession={handleDeleteSession}
                      onRenameSession={handleRenameSession}
                      isCollapsed={false}
                      onToggleCollapse={closeMobileSheet}
                      isMobileSheet={true}
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

          {/* Main Content - Full screen on mobile */}
          <div className={`flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden ${isMobile ? 'pt-12' : ''}`}>
            <div className="text-center text-foreground max-w-md">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-card/50 backdrop-blur-md rounded-full mb-4 md:mb-6">
                <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Creating New Chat</h2>
              <p className="text-sm md:text-base text-muted-foreground">Setting up your personalized career guidance session...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden dark:from-slate-900 dark:via-purple-900/30 dark:to-purple-950">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-500/25 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex h-full">
        {/* Mobile Menu Button - Positioned at top with proper spacing */}
        {isMobile && (
          <div className="absolute top-2 left-2 z-20">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur-md border border-border shadow-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-xl border-border">
                <div className="h-full">
                  <SessionList
                    sessions={sessions}
                    currentSessionId={currentSession.id}
                    onNewChat={handleNewChat}
                    onDeleteSession={handleDeleteSession}
                    isCollapsed={false}
                    onToggleCollapse={closeMobileSheet}
                    isMobileSheet={true}
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
              currentSessionId={currentSession.id}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
              onRenameSession={handleRenameSession}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />
          </div>
        )}

        {/* Main Chat Area - Full screen on mobile */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${isMobile ? 'pt-12' : ''}`}>
          <div className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full scroll-smooth">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {currentSession.messages.length === 0 && isSending ? (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-card/50 backdrop-blur-md rounded-full mb-4">
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      </div>
                      <p className="text-muted-foreground text-sm">Sending message...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {currentSession.messages.map((message: Message, index: number) => (
                      <ChatBubble
                        key={message.id}
                        message={message.content}
                        isUser={message.role === "user"}
                        timestamp={message.createdAt}
                        status={message.status}
                        isLoading={isSending && message.role === "assistant" && index === currentSession.messages.length - 1}
                      />
                    ))}
                    <TypingIndicator isVisible={isSending} />
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollToBottom && (
            <div className="absolute bottom-24 right-6 z-20">
              <Button
                onClick={scrollToBottom}
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-xl backdrop-blur-md border border-primary/20 transition-all duration-200 hover:scale-105"
                aria-label="Scroll to bottom"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </Button>
            </div>
          )}

          {/* Chat Input */}
          <div className="flex-shrink-0 bg-card/80 backdrop-blur-md border-t border-border">
            <ChatBox
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Ask me about your career goals, job search, or professional development..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
