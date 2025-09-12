"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { MessageCircle, Plus, Trash2, MoreVertical, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ChatSession } from "@/hooks/use-session"

interface SessionListProps {
  sessions: ChatSession[]
  currentSessionId?: string
  onNewChat: () => void
  onDeleteSession?: (sessionId: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileSheet?: boolean
}

export function SessionList({
  sessions,
  currentSessionId,
  onNewChat,
  onDeleteSession,
  isCollapsed = false,
  onToggleCollapse,
  isMobileSheet = false,
}: SessionListProps) {
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-md border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-20" : "w-80",
      )}
    >
      <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between">
        {!isCollapsed ? (
          <Button
            onClick={onNewChat}
            className="flex-1 justify-start bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 mr-2 border border-primary/20"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Career Chat
          </Button>
        ) : (
          <Button
            onClick={onNewChat}
            className="w-8 h-8 p-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg mr-2 border border-primary/20"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {onToggleCollapse && !isMobileSheet && (
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-accent text-foreground flex-shrink-0 border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-card/50 backdrop-blur-md rounded-full mb-4">
                <Sparkles className={cn("opacity-50", isCollapsed ? "h-5 w-5" : "h-6 w-6")} />
              </div>
              {!isCollapsed && (
                <>
                  <p className="text-sm font-medium mb-1">No conversations yet</p>
                  <p className="text-xs text-muted-foreground">Start your career journey!</p>
                </>
              )}
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="relative group">
                <Link href={`/chat/${session.id}`}>
                  <Card
                    className={cn(
                      "cursor-pointer hover:bg-accent transition-all duration-200 hover:shadow-lg backdrop-blur-md border-border",
                      currentSessionId === session.id && "bg-primary/10 border-primary/30 shadow-lg",
                      isCollapsed ? "p-3" : "p-4",
                    )}
                  >
                    {isCollapsed ? (
                      <div className="flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2 pr-8">
                        <h4 className="text-sm font-medium line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                          New Career Chat
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {session.messages.length > 0 ? session.messages[0].content : "Start your career journey..."}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{session.updatedAt.toLocaleDateString()}</p>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {session.messages.length}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                </Link>

                {onDeleteSession && !isCollapsed && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/20 text-foreground">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault()
                            onDeleteSession(session.id)
                          }}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        </ScrollArea>
      </div>
    </div>
  )
}
