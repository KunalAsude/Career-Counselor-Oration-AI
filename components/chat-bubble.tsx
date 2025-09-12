import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, CheckCheck, Clock, Eye } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatBubbleProps {
  message: string
  isUser: boolean
  timestamp?: Date
  isLoading?: boolean
  status?: "sending" | "sent" | "delivered" | "read"
}

export function ChatBubble({ message, isUser, timestamp, isLoading, status }: ChatBubbleProps) {

  const getStatusIcon = () => {
    if (!isUser || !status) return null

    switch (status) {
      case "sending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "sent":
        return <Eye className="h-4 w-4 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "flex gap-4 animate-in slide-in-from-bottom-2 duration-500",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="relative">
          <Avatar className="h-10 w-10 bg-primary shrink-0 shadow-lg">
            <AvatarFallback className="bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className={cn("flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-6 py-4 text-sm shadow-xl backdrop-blur-md border",
            isUser
              ? "bg-primary text-primary-foreground border-primary/20"
              : "bg-card text-card-foreground border-border",
          )}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 py-2">
              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="text-muted-foreground text-xs">Thinking...</span>
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 px-2">
          {timestamp && (
            <span className="text-xs text-slate-400">
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {getStatusIcon()}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-r from-slate-600 to-slate-700 shrink-0 shadow-lg">
          <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700">
            <User className="h-5 w-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
