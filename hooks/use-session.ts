"use client"

import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc-client"
import { toast } from "sonner"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  status: "sending" | "sent" | "delivered" | "read"
  createdAt: Date
}

export interface ChatSession {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  totalMessages?: number
  hasMore?: boolean
}

export function useSession(sessionId?: string) {
  const queryClient = useQueryClient()

  // Get all sessions
  const { data: sessions = [], isLoading: sessionsLoading } = trpc.chat.getSessions.useQuery()

  // Get specific session
  const { data: currentSession, isLoading: sessionLoading, error: sessionError, refetch } = trpc.chat.getSession.useQuery(
    { sessionId: sessionId!, limit: 50, offset: 0 },
    { enabled: !!sessionId }
  )

  const loadMoreMessages = useCallback(() => {
    if (currentSession?.hasMore) {
      // For now, we'll refetch with a larger limit
      // In a more complex implementation, you'd use infinite query
      refetch()
    }
  }, [currentSession?.hasMore, refetch])

  // Create new session mutation
  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["chat.getSessions"] })
      toast.success("New chat session created!")
      return newSession
    },
    onError: (error) => {
      toast.error("Failed to create session: " + error.message)
    },
  })

  // Send message mutation
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat.getSession"], exact: false })
      queryClient.invalidateQueries({ queryKey: ["chat.getSessions"] })
      toast.success("Message sent!")
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message)
    },
  })

  // Delete session mutation
  const deleteSessionMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat.getSessions"] })
      toast.success("Session deleted!")
    },
    onError: (error) => {
      toast.error("Failed to delete session: " + error.message)
    },
  })

  const createNewSession = useCallback(async (name?: string): Promise<ChatSession> => {
    const result = await createSessionMutation.mutateAsync({ name })
    return result as ChatSession
  }, [createSessionMutation])

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!currentSession) return

      await sendMessageMutation.mutateAsync({
        sessionId: currentSession.id,
        content,
      })
    },
    [currentSession, sendMessageMutation]
  )

  const deleteSession = useCallback(
    (sessionId: string) => {
      deleteSessionMutation.mutate({ sessionId })
    },
    [deleteSessionMutation]
  )

  return {
    currentSession: currentSession || null,
    sessions,
    isLoading: sessionsLoading || sessionLoading || sendMessageMutation.isPending,
    sessionError: sessionError || null,
    createNewSession,
    sendMessage,
    deleteSession,
    loadMoreMessages,
    hasMoreMessages: currentSession?.hasMore || false,
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
