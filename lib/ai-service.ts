import OpenAI from "openai"

export interface AIProvider {
  name: string
  generateResponse: (messages: Array<{ role: "user" | "assistant"; content: string }>) => Promise<string>
}

class OpenAIProvider implements AIProvider {
  name = "openai"
  private client: OpenAI

  constructor(apiKey: string, baseURL?: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL,
    })
  }

  async generateResponse(messages: Array<{ role: "user" | "assistant"; content: string }>): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional career counselor AI. Provide helpful, empathetic, and practical career advice. Focus on being supportive, actionable, and professional in your responses."
          },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response right now."
    } catch (error) {
      console.error("OpenAI API error:", error)
      throw new Error("Failed to generate AI response")
    }
  }
}

class TogetherAIProvider implements AIProvider {
  name = "together"
  private apiKey: string
  private baseURL: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseURL = "https://api.together.xyz/v1"
  }

  async generateResponse(messages: Array<{ role: "user" | "assistant"; content: string }>): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "meta-llama/Llama-2-70b-chat-hf",
          messages: [
            {
              role: "system",
              content: "You are a professional career counselor AI. Provide helpful, empathetic, and practical career advice. Focus on being supportive, actionable, and professional in your responses."
            },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response right now."
    } catch (error) {
      console.error("Together AI API error:", error)
      throw new Error("Failed to generate AI response")
    }
  }
}

class AIService {
  private provider: AIProvider

  constructor() {
    const providerType = process.env.AI_PROVIDER?.toLowerCase() || "openai"

    switch (providerType) {
      case "openai":
        if (!process.env.AI_API_KEY) {
          throw new Error("AI_API_KEY environment variable is required for OpenAI provider")
        }
        this.provider = new OpenAIProvider(
          process.env.AI_API_KEY,
          process.env.OPENAI_BASE_URL
        )
        break

      case "together":
        if (!process.env.AI_API_KEY) {
          throw new Error("AI_API_KEY environment variable is required for Together AI provider")
        }
        this.provider = new TogetherAIProvider(process.env.AI_API_KEY)
        break

      default:
        throw new Error(`Unsupported AI provider: ${providerType}. Supported providers: openai, together`)
    }

    console.log(`AI Service initialized with provider: ${this.provider.name}`)
  }

  async generateCareerAdvice(messages: Array<{ role: "user" | "assistant"; content: string }>): Promise<string> {
    return this.provider.generateResponse(messages)
  }
}

// Export singleton instance
export const aiService = new AIService()