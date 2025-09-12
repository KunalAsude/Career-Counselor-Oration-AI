"use client"

import React, { useState, useCallback } from "react"
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

  // Get specific session with proper caching
  const { data: currentSessionData, isLoading: sessionLoading, error: sessionError, refetch } = trpc.chat.getSession.useQuery(
    { sessionId: sessionId!, limit: 50, offset: 0 },
    {
      enabled: !!sessionId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  // Local state for messages to ensure immediate UI updates
  const [messages, setMessages] = useState<Message[]>(currentSessionData?.messages || [])
  const [isSending, setIsSending] = useState(false)

  // Sync local state with server data when it changes (but not during sending)
  React.useEffect(() => {
    if (currentSessionData?.messages && !isSending) {
      // Only sync if the server has more messages than we do locally
      // This prevents overriding optimistic updates
      if (currentSessionData.messages.length > messages.length) {
        setMessages(currentSessionData.messages)
      }
    }
  }, [currentSessionData?.messages, isSending, messages.length])

  // Use the session data with local messages
  const currentSession = currentSessionData ? {
    ...currentSessionData,
    messages
  } : null

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
      // Update the cache with the new messages, preserving existing ones
      if (result.userMessage && result.aiResponse) {
        queryClient.setQueryData(
          ["chat.getSession", { sessionId: variables.sessionId, limit: 50, offset: 0 }],
          (oldData: any) => {
            if (oldData) {
              // Get existing messages (excluding temp ones)
              const existingMessages = oldData.messages.filter((msg: any) =>
                !msg.id.startsWith('temp-') &&
                msg.id !== result.userMessage.id && // Avoid duplicates
                msg.id !== result.aiResponse?.id
              )

              const newMessages = [
                {
                  id: result.userMessage.id,
                  content: result.userMessage.content,
                  role: result.userMessage.role,
                  status: "sent" as const,
                  createdAt: new Date(result.userMessage.createdAt),
                }
              ]

              if (result.aiResponse) {
                newMessages.push({
                  id: result.aiResponse.id,
                  content: result.aiResponse.content,
                  role: result.aiResponse.role,
                  status: "sent" as const,
                  createdAt: new Date(result.aiResponse.createdAt),
                })
              }

              return {
                ...oldData,
                messages: [
                  ...existingMessages,
                  ...newMessages
                ]
              }
            }
            return oldData
          }
        )
      }

      // Also invalidate sessions list to keep it in sync
      queryClient.invalidateQueries({ queryKey: [["chat", "getSessions"], { type: "query" }] })
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message)
    },
  })

  // Delete session mutation
  const deleteSessionMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: () => {
      // Invalidate all chat-related queries to ensure UI updates immediately
      queryClient.invalidateQueries({ queryKey: [["chat"]], exact: false })
      // Also refetch the sessions query specifically
      queryClient.refetchQueries({ queryKey: [["chat", "getSessions"], { type: "query" }] })
      toast.success("Session deleted!")
    },
    onError: (error, variables) => {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: [["chat", "getSessions"], { type: "query" }] })
      toast.error("Failed to delete session: " + error.message)
    },
  })

  const createNewSession = useCallback(async (name?: string): Promise<ChatSession> => {
    const result = await createSessionMutation.mutateAsync({ name })
    return result as ChatSession
  }, [createSessionMutation])

  // Regular sendMessage with TanStack Query caching
  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!currentSession) return

      setIsSending(true)

      // Optimistically add user message
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        role: "user",
        status: "sending",
        createdAt: new Date(),
      }

      setMessages(prev => [...prev, userMessage])

      try {
        // Send the message to the server
        const result = await sendMessageMutation.mutateAsync({
          sessionId: currentSession.id,
          content,
        })

        // Update with real messages from server
        if (result.userMessage) {
          setMessages(prev => {
            // Remove temp message and add real messages
            const filtered = prev.filter(msg => msg.id !== userMessage.id)
            const newMessages: Message[] = [
              {
                id: result.userMessage.id,
                content: result.userMessage.content,
                role: result.userMessage.role as "user" | "assistant",
                status: "sent" as const,
                createdAt: new Date(result.userMessage.createdAt),
              }
            ]

            if (result.aiResponse) {
              newMessages.push({
                id: result.aiResponse.id,
                content: result.aiResponse.content,
                role: result.aiResponse.role as "user" | "assistant",
                status: "sent" as const,
                createdAt: new Date(result.aiResponse.createdAt),
              })
            }

            return [...filtered, ...newMessages]
          })

          // Also update the TanStack Query cache immediately
          queryClient.setQueryData(
            ["chat.getSession", { sessionId: sessionId!, limit: 50, offset: 0 }],
            (oldData: any) => {
              if (oldData) {
                // Get existing messages (excluding temp and duplicate ones)
                const existingMessages = oldData.messages.filter((msg: any) =>
                  !msg.id.startsWith('temp-') &&
                  msg.id !== result.userMessage.id &&
                  msg.id !== result.aiResponse?.id
                )

                const newMessages = [
                  {
                    id: result.userMessage.id,
                    content: result.userMessage.content,
                    role: result.userMessage.role,
                    status: "sent" as const,
                    createdAt: new Date(result.userMessage.createdAt),
                  }
                ]

                if (result.aiResponse) {
                  newMessages.push({
                    id: result.aiResponse.id,
                    content: result.aiResponse.content,
                    role: result.aiResponse.role,
                    status: "sent" as const,
                    createdAt: new Date(result.aiResponse.createdAt),
                  })
                }

                return {
                  ...oldData,
                  messages: [
                    ...existingMessages,
                    ...newMessages
                  ]
                }
              }
              return oldData
            }
          )
        }

      } catch (error) {
        // Remove the optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
        console.error("Failed to send message:", error)
        throw error
      } finally {
        setIsSending(false)
      }
    },
    [currentSession, sendMessageMutation, queryClient, sessionId]
  )

  // Streaming version of sendMessage
  const sendMessageStreaming = useCallback(
    async (content: string): Promise<void> => {
      if (!currentSession) return

      setIsSending(true)

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content,
        role: "user",
        status: "sent",
        createdAt: new Date(),
      }

      setMessages(prev => [...prev, userMessage])

      try {
        // Create AI message placeholder
        const aiMessageId = `ai-${Date.now()}`
        const aiMessage: Message = {
          id: aiMessageId,
          content: "",
          role: "assistant",
          status: "sending",
          createdAt: new Date(),
        }

        setMessages(prev => [...prev, aiMessage])

        // Simulate streaming (replace with actual streaming API call)
        const result = await sendMessageMutation.mutateAsync({
          sessionId: currentSession.id,
          content,
        })

        if (result.aiResponse) {
          // Simulate word-by-word streaming
          const words = result.aiResponse.content.split(' ')
          let currentContent = ''

          for (let i = 0; i < words.length; i++) {
            currentContent += (i > 0 ? ' ' : '') + words[i]

            setMessages(prev => prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: currentContent, status: i === words.length - 1 ? "sent" : "sending" }
                : msg
            ))

            // Add delay between words for streaming effect
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }

        // Invalidate queries to keep other parts of the app in sync
        queryClient.invalidateQueries({ queryKey: ["chat"], exact: false })

      } catch (error) {
        // Remove messages on error
        setMessages(prev => prev.filter(msg =>
          msg.id !== userMessage.id && msg.id !== `ai-${Date.now()}`
        ))
        console.error("Failed to send message:", error)
        throw error
      } finally {
        setIsSending(false)
      }
    },
    [currentSession, sendMessageMutation, queryClient]
  )

  const deleteSession = useCallback(
    (sessionId: string) => {
      // Optimistically update the sessions list to remove the deleted session immediately
      // TRPC query keys are in the format: [["chat", "getSessions"], { type: "query" }]
      queryClient.setQueryData([["chat", "getSessions"], { type: "query" }], (oldData: any) => {
        if (oldData && Array.isArray(oldData)) {
          return oldData.filter((session: any) => session.id !== sessionId)
        }
        return oldData
      })

      // Also optimistically remove from individual session cache if it exists
      queryClient.removeQueries({ queryKey: [["chat", "getSession"], { type: "query", input: { sessionId, limit: 50, offset: 0 } }] })

      deleteSessionMutation.mutate({ sessionId })
    },
    [deleteSessionMutation, queryClient]
  )

  return {
    currentSession,
    sessions,
    isLoading: sessionsLoading || sessionLoading || isSending,
    isSending,
    sessionLoading,
    sessionError: sessionError || null,
    createNewSession,
    sendMessage,
    sendMessageStreaming,
    deleteSession,
    loadMoreMessages,
    hasMoreMessages: currentSession?.hasMore || false,
  }
}

function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("interview")) {
    return "Great question about interviews! Here are 5 key tips:\n\n• Research the company thoroughly\n• Practice common interview questions\n• Prepare STAR method examples\n• Ask thoughtful questions\n• Follow up with thank-you note\n\nWhat specific aspect would you like to focus on?"
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

  return "That's an interesting point! Career development is a journey. Could you tell me:\n\n• What's your current role/industry?\n• What are your main career goals?\n• What challenges are you facing?\n\nThe more details you share, the better I can help."
}
