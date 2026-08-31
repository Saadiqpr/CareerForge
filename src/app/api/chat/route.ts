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
      try {
        let modelMessages;
        try {
          modelMessages = await convertToModelMessages(messages);
        } catch {
          modelMessages = messages.map((m: any) => ({
            role: m.role || "user",
            content:
              typeof m.content === "string"
                ? m.content
                : m.parts?.map((p: any) => p.text || "").join("") || m.text || "",
          }));
        }

        const result = streamText({
          model,
          system: AI_COACH_CONFIG.systemPrompt,
          messages: modelMessages,
          temperature: AI_COACH_CONFIG.temperature,
        });

        return result.toUIMessageStreamResponse();
      } catch (streamErr) {
        console.error("Live LLM stream error, providing resilient coaching response:", streamErr);
      }
    }

    // Resilient Fallback Stream when no API key is configured or provider errors
    const lastMsg = messages[messages.length - 1];
    const lastUserMessage =
      typeof lastMsg?.content === "string"
        ? lastMsg.content
        : lastMsg?.parts?.map((p: any) => p.text || "").join("") ||
          lastMsg?.text ||
          "How do I prepare for my upcoming engineering interviews?";

    const fallbackText = `### Career Coaching Strategy & Recommendations

I analyzed your goal: **"${lastUserMessage.slice(0, 120)}"**

---

#### 🎯 Actionable Coaching Framework:
1. **Highlight Quantified Technical Impact:** Replace passive statements (*"built frontend components"*) with high-impact metrics:
   > *"Architected real-time streaming pipeline reducing TTFB by 42% and latency by 180ms across 250k MAUs."*
2. **Behavioral STAR Methodology:** 
   - **Situation:** Context and technical constraints.
   - **Task:** Your specific engineering responsibility.
   - **Action:** Architectural decisions, trade-offs, and implementation details.
   - **Result:** Measurable outcome (speed, reliability, adoption).
3. **Core Engineering Focus Areas:**
   - **AI/LLM Integration:** Streaming patterns, token management, error boundaries.
   - **Performance:** Sub-100ms INP, Core Web Vitals, dynamic bundling.
   - **Accessibility:** WCAG 2.1 AA keyboard navigation, ARIA live regions.

---
> 💡 **Tip to connect live Google Gemini Pro / Flash:**  
> Add \`GEMINI_API_KEY\` to your \`.env.local\` file or Vercel Environment Variables to unlock unrestricted live real-time conversations!`;

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