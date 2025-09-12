import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

interface TypingIndicatorProps {
  isVisible: boolean
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-500 justify-start">
      <Avatar className="h-10 w-10 bg-primary shrink-0 shadow-lg">
        <AvatarFallback className="bg-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col max-w-[80%] sm:max-w-[70%] items-start">
        <div className="rounded-2xl px-6 py-4 text-sm shadow-xl backdrop-blur-md border bg-card text-card-foreground border-border">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
            </div>
            <span className="text-muted-foreground text-xs">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  )
}