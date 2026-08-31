import { streamText, convertToModelMessages } from "ai";
import { AI_COACH_CONFIG } from "@/lib/ai/coach-config";
import { getActiveLanguageModel } from "@/lib/ai/provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
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

    const { model, info } = getActiveLanguageModel();

    if (model) {
      const modelMessages = await convertToModelMessages(messages);

      const result = streamText({
        model,
        system: AI_COACH_CONFIG.systemPrompt,
        messages: modelMessages,
        temperature: AI_COACH_CONFIG.temperature,
      });

      return result.toUIMessageStreamResponse();
    }

    // Resilient Fallback Stream when no API key is configured yet
    const lastUserMessage = messages[messages.length - 1]?.content || "How do I advance my career?";
    const fallbackText = `### CareerForge AI Advisory (Offline Demonstration Mode)

I received your prompt: **"${lastUserMessage.slice(0, 100)}..."**

---

#### 💡 Strategic Career Recommendations:
1. **Highlight Quantified Engineering Metrics:** On modern tech resumes, replace passive statements like *"built features"* with concrete metrics (e.g. *"Architected real-time streaming pipeline reducing TTFB by 42% for 250k MAUs"*).
2. **Master the STAR Method:** For behavioral & leadership interviews, clearly structure your answer around **Situation**, **Task**, **Action**, and **Result**.
3. **Target High-Leverage Skills:** Deepen your expertise in **AI integration**, **performance optimization (CWV)**, and **accessible design systems (WCAG 2.1 AA)**.

---
> ⚙️ **To enable live real-time LLM streaming:**  
> Add \`GEMINI_API_KEY\` (from Google AI Studio / Gemini Pro) or \`AGENTROUTER_API_KEY\` to your **Vercel Project Settings > Environment Variables** or \`.env.local\`.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(fallbackText)}\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1",
      },
    });
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