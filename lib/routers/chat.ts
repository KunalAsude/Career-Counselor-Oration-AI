import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/lib/trpc";
import { aiService } from "@/lib/ai-service";

// Define message status constants since Prisma enums aren't being generated
const MessageStatus = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
} as const;

type MessageStatusType = typeof MessageStatus[keyof typeof MessageStatus];

export const chatRouter = createTRPCRouter({
  // Get all chat sessions for the current user
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    // Ensure user exists in our custom User table
    const existingUser = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id }
    });

    if (!existingUser && ctx.session.user.email) {
      // Create user if they don't exist
      await ctx.prisma.user.create({
        data: {
          id: ctx.session.user.id,
          email: ctx.session.user.email,
          name: ctx.session.user.name,
          image: ctx.session.user.image,
        }
      });
    }

    const sessions = await ctx.prisma.chatSession.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return sessions.map((session) => ({
      id: session.id,
      name: session.name,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messages: session.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        status: msg.status as MessageStatusType,
        createdAt: msg.createdAt,
      })),
    }));
  }),

  // Get a specific chat session with pagination
  getSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.findFirst({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
        include: {
          _count: {
            select: { messages: true }
          }
        },
      });

      if (!session) {
        throw new Error("Session not found");
      }

      const messages = await ctx.prisma.message.findMany({
        where: { chatSessionId: input.sessionId },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
        select: {
          id: true,
          content: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      // Reverse to get chronological order
      messages.reverse();

      return {
        id: session.id,
        name: session.name,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messages: messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          status: msg.status as MessageStatusType,
          createdAt: msg.createdAt,
        })),
        totalMessages: session._count.messages,
        hasMore: session._count.messages > input.offset + input.limit,
      };
    }),

  // Create a new chat session
  createSession: protectedProcedure
    .input(z.object({ name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure user exists in our custom User table
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id }
      });

      if (!existingUser && ctx.session.user.email) {
        // Create user if they don't exist
        await ctx.prisma.user.create({
          data: {
            id: ctx.session.user.id,
            email: ctx.session.user.email,
            name: ctx.session.user.name,
            image: ctx.session.user.image,
          }
        });
      }

      const session = await ctx.prisma.chatSession.create({
        data: {
          name: input.name || "New Chat Session",
          userId: ctx.session.user.id,
        },
      });

      return {
        id: session.id,
        name: session.name,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messages: [],
      };
    }),

  // Send a message and get AI response
  sendMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First, add the user message with sending status
      const userMessage = await ctx.prisma.message.create({
        data: {
          content: input.content,
          role: "user",
          status: MessageStatus.SENDING,
          chatSessionId: input.sessionId,
        },
      });

      // Update status to sent after creation
      await ctx.prisma.message.update({
        where: { id: userMessage.id },
        data: { status: MessageStatus.SENT },
      });

      // Update session updatedAt
      await ctx.prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { updatedAt: new Date() },
      });

      // Get conversation history for context
      const messages = await ctx.prisma.message.findMany({
        where: { chatSessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
      });

      // Convert to AI service format
      const conversationHistory = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Generate AI response
      let aiResponse = null;
      try {
        const aiResponseContent = await aiService.generateCareerAdvice(conversationHistory);

        // Save AI response
        aiResponse = await ctx.prisma.message.create({
          data: {
            content: aiResponseContent,
            role: "assistant",
            status: MessageStatus.SENT,
            chatSessionId: input.sessionId,
          },
        });
      } catch (error) {
        console.error("AI generation failed:", error);
        // Continue without AI response
      }

      return {
        userMessage: {
          id: userMessage.id,
          content: userMessage.content,
          role: userMessage.role,
          createdAt: userMessage.createdAt,
        },
        aiResponse: aiResponse ? {
          id: aiResponse.id,
          content: aiResponse.content,
          role: aiResponse.role,
          createdAt: aiResponse.createdAt,
        } : null,
      };
    }),

  // Delete a chat session
  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Allow deletion without ownership check
      await ctx.prisma.chatSession.deleteMany({
        where: { id: input.sessionId },
      });

      return { success: true };
    }),
});