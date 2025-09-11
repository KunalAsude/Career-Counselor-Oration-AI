"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles } from "lucide-react"

interface ChatBoxProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  onFocus?: () => void
}

export function ChatBox({
  onSendMessage,
  disabled = false,
  placeholder = "Ask me about your career goals, job search, or professional development...",
  onFocus,
}: ChatBoxProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-[88px] resize-none bg-input backdrop-blur-md border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all duration-200 rounded-lg px-3 py-2 text-sm"
            rows={1}
          />
          {message.trim() && (
            <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
              Press Enter to send
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-[44px] w-[44px] shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 rounded-lg border border-primary/20"
        >
          {disabled ? (
            <Sparkles className="h-4 w-4 animate-pulse" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}
