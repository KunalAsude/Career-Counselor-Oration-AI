import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

interface TypingIndicatorProps {
  isVisible: boolean
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null

    return (
      <div className="flex gap-6 justify-start items-center py-4">
        <div className="relative ml-2 md:ml-6">
          <Avatar className="h-10 w-10 bg-primary shrink-0 shadow-lg">
            <AvatarFallback className="bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col max-w-[80%] sm:max-w-[70%] items-start">
          <div className="rounded-2xl px-8 py-6 text-sm shadow-xl backdrop-blur-md border bg-card text-card-foreground border-border min-w-[120px]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="dot bg-primary/60 inline-block w-2 h-2 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="dot bg-primary/60 inline-block w-2 h-2 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="dot bg-primary/60 inline-block w-2 h-2 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <span className="text-muted-foreground text-xs">Typing...</span>
            </div>
          </div>
        </div>
      </div>
    )
}