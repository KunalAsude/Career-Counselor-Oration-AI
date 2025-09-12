import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Sparkles, Check, CheckCheck, Clock } from "lucide-react"

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
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
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
        <Avatar className="h-10 w-10 bg-primary shrink-0 shadow-lg">
          <AvatarFallback className="bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[80%] sm:max-w-[70%]", isUser ? "items-end" : "items-start")}>
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
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
              </div>
              <span className="text-muted-foreground text-xs">AI is thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
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
