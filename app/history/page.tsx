"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession as useNextAuthSession } from "next-auth/react"
import { useSession as useChatSession, type ChatSession, type Message } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Plus, Trash2, Edit, Calendar, MessageSquare, ArrowLeft, Search } from "lucide-react"
import { RenameSessionDialog } from "@/components/rename-session-dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ChatHistoryPage() {
  const router = useRouter()
  const { data: session, status } = useNextAuthSession()
  const { sessions, isLoading, deleteSession, renameSession } = useChatSession()

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([])

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  // Filter sessions based on search query
  useEffect(() => {
    if (!sessions) return

    if (searchQuery.trim() === "") {
      setFilteredSessions(sessions)
    } else {
      const filtered = sessions.filter(session =>
        session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.messages.some(msg =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      setFilteredSessions(filtered)
    }
  }, [sessions, searchQuery])

  const handleRenameClick = (session: ChatSession) => {
    setSessionToRename(session)
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = (newTitle: string) => {
    if (sessionToRename) {
      renameSession(sessionToRename.id, newTitle)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("Are you sure you want to delete this conversation?")) {
      await deleteSession(sessionId)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getMessagePreview = (messages: Message[]) => {
    if (messages.length === 0) return "No messages yet"
    const lastMessage = messages[messages.length - 1]
    return lastMessage.content.length > 100
      ? lastMessage.content.substring(0, 100) + "..."
      : lastMessage.content
  }

  // Don't render anything while checking authentication
  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-card/50 backdrop-blur-md rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/chat")}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Chat History</h1>
              </div>
            </div>
            <Button
              onClick={() => router.push("/chat")}
              className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary/85 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{filteredSessions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredSessions.reduce((total, session) => total + session.messages.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredSessions.length > 0
                      ? formatDate(filteredSessions[0].updatedAt)
                      : "No conversations"}
                  </p>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-card/50 backdrop-blur-md rounded-full mb-4">
                <MessageCircle className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-card/50 backdrop-blur-md rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start your first career counseling conversation"}
            </p>
            <Button
              onClick={() => router.push("/chat")}
              className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary/85 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1 mb-2">
                        {session.name}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.updatedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{session.messages.length} messages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRenameClick(session)
                        }}
                        className="h-8 w-8 cursor-pointer hover:bg-accent"
                        title="Rename conversation"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSession(session.id)
                        }}
                        className="h-8 w-8 cursor-pointer hover:bg-destructive/20 text-destructive"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {getMessagePreview(session.messages)}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {session.messages.length > 0
                        ? session.messages[0].role === "user"
                          ? "Started by you"
                          : "Started by Counselor"
                        : "Empty conversation"}
                    </Badge>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <Link href={`/chat/${session.id}`}>
                        Continue Chat
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <RenameSessionDialog
        isOpen={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        onRename={handleRenameConfirm}
        currentTitle={sessionToRename?.name || ""}
      />
    </div>
  )
}