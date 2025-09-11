"use client"

import { useState, useEffect, useCallback } from "react"
import { sessionManager, type ChatSession, type Message } from "@/lib/session-manager"

export function useSession(sessionId?: string) {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load sessions on mount
  useEffect(() => {
    setSessions(sessionManager.getAllSessions())
  }, [])

  // Load specific session
  useEffect(() => {
    if (sessionId) {
      const session = sessionManager.getSession(sessionId)
      setCurrentSession(session || null)
    } else {
      setCurrentSession(null)
    }
  }, [sessionId])

  const createNewSession = useCallback(() => {
    const newSession = sessionManager.createSession()
    setSessions(sessionManager.getAllSessions())
    setCurrentSession(newSession)
    return newSession
  }, [])

  const addMessage = useCallback(
    (message: Message) => {
      if (!currentSession) return

      sessionManager.addMessage(currentSession.id, message)

      // Update local state
      const updatedSession = sessionManager.getSession(currentSession.id)
      if (updatedSession) {
        setCurrentSession(updatedSession)
        setSessions(sessionManager.getAllSessions())
      }
    },
    [currentSession],
  )

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!currentSession) return

      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
      }

      addMessage(userMessage)
      setIsLoading(true)

      // Simulate AI response
      return new Promise((resolve) => {
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: generateAIResponse(content),
            isUser: false,
            timestamp: new Date(),
          }

          addMessage(aiResponse)
          setIsLoading(false)
          resolve()
        }, 1500)
      })
    },
    [currentSession, addMessage],
  )

  const deleteSession = useCallback(
    (sessionId: string) => {
      sessionManager.deleteSession(sessionId)
      setSessions(sessionManager.getAllSessions())

      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
      }
    },
    [currentSession],
  )

  return {
    currentSession,
    sessions,
    isLoading,
    createNewSession,
    sendMessage,
    deleteSession,
  }
}

function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("interview")) {
    return "Great question about interviews! Here are some key tips:\n\n1. Research the company thoroughly\n2. Practice common interview questions\n3. Prepare specific examples using the STAR method\n4. Ask thoughtful questions about the role\n5. Follow up with a thank-you note\n\nWhat specific aspect of interview preparation would you like to focus on?"
  }

  if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
    return "I'd be happy to help with your resume! Here are some best practices:\n\n• Keep it concise (1-2 pages)\n• Use action verbs and quantify achievements\n• Tailor it to each job application\n• Include relevant keywords from the job description\n• Ensure consistent formatting\n\nWould you like me to review a specific section or help with a particular industry?"
  }

  if (lowerMessage.includes("career change") || lowerMessage.includes("transition")) {
    return "Career transitions can be exciting opportunities! Let's explore this together:\n\n1. What's motivating your desire for change?\n2. What skills from your current role are transferable?\n3. What industries or roles interest you?\n4. Do you need additional training or certifications?\n\nTell me more about what kind of career change you're considering."
  }

  if (lowerMessage.includes("salary") || lowerMessage.includes("negotiat")) {
    return "Salary negotiation is an important skill! Here's my approach:\n\n**Before negotiating:**\n• Research market rates for your role\n• Document your achievements and value\n• Consider the full compensation package\n\n**During negotiation:**\n• Be confident but respectful\n• Focus on value, not personal needs\n• Be prepared to discuss alternatives\n\nWhat's your current situation with salary discussions?"
  }

  return "That's an interesting point! Career development is a journey, and I'm here to help guide you. Could you tell me more about your specific situation? For example:\n\n• What's your current role or industry?\n• What are your main career goals?\n• What challenges are you facing?\n\nThe more details you share, the better I can tailor my advice to your needs."
}
