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
        "bg-card/50 backdrop-blur-md border-r border-border flex flex-col h-full transition-all duration-500 ease-in-out overflow-hidden",
        isCollapsed ? "w-24" : "w-80",
      )}
    >
      <div className={cn(
        "flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-md flex items-center transition-all duration-500 ease-in-out",
        isCollapsed ? "p-4 justify-center flex-col-reverse space-y-5 space-y-reverse" : "p-4 justify-between"
      )}>
        {!isCollapsed ? (
          <Button
            onClick={onNewChat}
            className="flex-1 justify-start bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary/85 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 mr-3 border border-primary/20 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98]"
            size="sm"
          >
            <div className="flex items-center justify-center w-5 h-5 mr-2 bg-white/20 rounded-full">
              <Plus className="h-3 w-3" />
            </div>
            New Career Chat
          </Button>
        ) : (
          <Button
            onClick={onNewChat}
            className="w-12 h-12 p-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary/85 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full border border-primary/20 hover:scale-105 active:scale-95"
            size="sm"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}

        {onToggleCollapse && !isMobileSheet && (
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="icon"
            className={cn(
              "hover:bg-accent text-foreground flex-shrink-0 border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 rounded-lg",
              isCollapsed ? "h-8 w-8" : "h-8 w-8 ml-2"
            )}
          >
            <div className="transition-transform duration-300 ease-in-out">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </div>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className={cn(
            "transition-all duration-500",
            isCollapsed ? "p-4 pr-5 space-y-4" : "p-3 space-y-3"
          )}>
          {sessions.length === 0 ? (
            <div className={cn(
              "text-center text-muted-foreground transition-all duration-500",
              isCollapsed ? "py-6" : "py-8"
            )}>
              <div className={cn(
                "inline-flex items-center justify-center bg-card/50 backdrop-blur-md rounded-full mb-4 transition-all duration-500",
                isCollapsed ? "w-10 h-10" : "w-12 h-12"
              )}>
                <Sparkles className={cn("opacity-50 transition-all duration-500", isCollapsed ? "h-5 w-5" : "h-6 w-6")} />
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
                      isCollapsed ? "p-4" : "p-4",
                    )}
                  >
                    {isCollapsed ? (
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105",
                            currentSessionId === session.id 
                              ? "bg-primary text-primary-foreground shadow-lg" 
                              : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                          )}>
                            <MessageCircle className="h-5 w-5" />
                          </div>
                          {session.messages && session.messages.length > 0 && !isCollapsed && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                              {session.messages.length > 9 ? '9+' : session.messages.length}
                            </div>
                          )}
                        </div>
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
