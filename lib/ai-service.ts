import OpenAI from "openai"

export class AiService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = process.env.BASE_URL;

    if (!apiKey) {
      throw new Error('AI_API_KEY environment variable not set');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });
  }

  async generateChatCompletion(params: OpenAI.Chat.Completions.ChatCompletionCreateParams): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    try {
      const response = await this.client.chat.completions.create(params);
      return response as OpenAI.Chat.Completions.ChatCompletion;
    } catch (error) {
      console.error('Error generating chat completion:', error);
      throw error;
    }
  }

  async generateCareerAdvice(messages: Array<{ role: "user" | "assistant"; content: string }>): Promise<string> {
    try {
      const completion = await this.generateChatCompletion({
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional career counselor AI. Provide complete, well-structured career advice that fully answers the user's question. Use clear sections with headers, bullet points for key information, and brief explanations. Keep responses focused and actionable but ensure they are complete - don't cut off important information. Aim for comprehensive but concise responses that provide real value."
          },
          ...messages
        ],
        max_tokens: 600,
        temperature: 0.7,
        stream: false, // Ensure we get a non-streaming response
      });

      // Since we're using stream: false, we can directly access the completion
      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response right now.";
    } catch (error: unknown) {
      console.error("AI Service error:", error);

      // Handle specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const errorWithStatus = error as { status: number };
        
        if (errorWithStatus.status === 429) {
          throw new Error("AI service is currently rate limited. Please try again in a few minutes, or consider upgrading your API plan for higher limits.");
        }

        if (errorWithStatus.status === 401) {
          throw new Error("AI service authentication failed. Please check your API key configuration.");
        }

        if (errorWithStatus.status === 403) {
          throw new Error("AI service access forbidden. Please check your account permissions.");
        }
      }

      if (error && typeof error === 'object' && 'code' in error) {
        const errorWithCode = error as { code: string };
        if (errorWithCode.code === 'rate_limit_exceeded') {
          throw new Error("AI service rate limit exceeded. Please wait before trying again, or switch to a different AI provider.");
        }
      }

      throw new Error("Failed to generate AI response. Please try again later.");
    }
  }
}

// Export singleton instance
export const aiService = new AiService();