import { streamText, convertToModelMessages } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  AI_COACH_CONFIG,
  getCoachModelName,
} from "@/lib/ai/coach-config";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const rawApiKey = process.env.AGENTROUTER_API_KEY;
    const apiKey = rawApiKey?.trim();

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "AgentRouter API key is not configured. Please add AGENTROUTER_API_KEY to your .env.local file.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const agentrouter = createOpenAICompatible({
      name: "agentrouter",
      apiKey: apiKey,
      baseURL: process.env.AGENTROUTER_BASE_URL || "https://co.agentrouter.org/v1",
    });

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid request payload: messages array is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const modelName = getCoachModelName();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: agentrouter(modelName),
      system: AI_COACH_CONFIG.systemPrompt,
      messages: modelMessages,
      temperature: AI_COACH_CONFIG.temperature,
      maxTokens: AI_COACH_CONFIG.maxTokens,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("AI Coach Error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during chat processing.";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}